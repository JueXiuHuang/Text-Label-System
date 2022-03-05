from codecs import decode
from email.mime import base
from lib2to3.pytree import Base
import os
import uvicorn
import json
import pandas as pd
from urllib.parse import unquote

from fastapi import FastAPI, File, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

file_folder_dir = './file/'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Args(BaseModel):
    Arg_type:str
    Text:str
    Start:str
    End:str

class SingleAnnotation(BaseModel):
    colorNodeID:int
    Arguments:List[Args] = []

class AnnotationJson(BaseModel):
    Doc_name:str
    Mentions:List[SingleAnnotation] = []

class DownloadTextJson(BaseModel):
    Text:str
    FileName:str

@app.post('/Download')
def save_text(res:DownloadTextJson):
    data = jsonable_encoder(res)
    file_name = data['FileName']
    text = data['Text']
    
    os.makedirs('Download', exist_ok=True)
    p = 'Download/'+file_name
    with open(p, 'w', encoding='utf-8') as fp:
        fp.write(text)

@app.post('/Save')
def save_result(res:AnnotationJson):
    data = jsonable_encoder(res)
    file_name = data['Doc_name'].replace('.txt', '.json')
    to_write = data['Mentions']
    
    path = 'history/' + file_name
    with open(path, 'w', encoding='utf-8') as fp:
        json.dump(to_write, fp)

    statistic(file_name)

@app.get('/FileList')
def get_file_list():
    ret_list = []
    objs = os.listdir(file_folder_dir)
    objs = sorted(objs)
    for obj in objs:
        if (os.path.isfile(file_folder_dir+obj) == True):
            file_name = obj
            
            with open(file_folder_dir+obj, 'r', encoding='utf-8') as f:
                file_content = f.read()
                
            ret_list.append({'file_name':file_name, 'file_content':file_content})
    
    return ret_list

@app.get('/PreviousRecord/{f_name}')
def get_previous_record(f_name:str):
    f_name = unquote(f_name)
    f_name = f_name.replace('.txt', '.json')
    f_path = 'history/' + f_name
    labels = []
    if os.path.exists(f_path):
        with open(f_path, 'r') as f:
            labels = json.load(f)

    return labels

@app.get('/LabelRule')
def get_label_rule():
    label_rule_path = './data/Label Rule/'
    fn = os.listdir(label_rule_path)[0]
    with open(label_rule_path+fn, 'r') as f:
        rules = f.read()

    return rules
    
@app.get('/TokenizeRule')
def get_tokenize_rule():
    tokenize_rule_path = './data/Tokenize Rule/'
    fn = os.listdir(tokenize_rule_path)[0]
    with open(tokenize_rule_path+fn, 'r', encoding='utf-8') as f:
        rules = f.read()
    
    return rules

def statistic(fn):
    path = './history/' + fn
    with open(path, 'r') as f:
        labels = json.load(f)
    
    # key is text, value is appreance count
    record = {}

    for label in labels:
        for arg in label['Arguments']:
            text = arg['Text'].lower()
            type_ = arg['Arg_type']
            if record.get((text, type_)) == None:
                record[(text, type_)] = 1
            else:
                record[(text, type_)] += 1

    text_list = []
    type_list = []
    count_list = []
    for k in record.keys():
        text, type_ = k
        count = record[k]
        text_list.append(text)
        type_list.append(type_)
        count_list.append(count)

    df_dict = {'Text':text_list, 'Label':type_list, 'Count':count_list}
    df = pd.DataFrame(df_dict)
    save_path = './statistic/'
    if not os.path.exists(save_path):
        os.makedirs(save_path)
    save_path = save_path + fn.replace('.json', '.xlsx')
    df.to_excel(save_path, encoding='utf8', index=False)

    return

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
    
# Run server with command:
# uvicorn --host 127.0.0.1 --reload server:app