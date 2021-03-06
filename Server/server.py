from codecs import decode
from email.mime import base
from lib2to3.pytree import Base
import os
import sys
import uvicorn
import json
import pandas as pd
import requests
from urllib.parse import unquote

from fastapi import FastAPI, File, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

server_root = os.path.sep.join(sys.argv[0].split(os.path.sep)[:-1])
# Execute as exe
if getattr(sys, 'frozen', False):
    server_root = os.path.sep.join(sys.argv[0].split(os.path.sep)[:-1])
# or a script file (e.g. `.py` / `.pyw`)
elif __file__:
    server_root = os.getcwd()

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
    Abs_path:str
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
    
    download_dir = os.path.join(server_root, 'Download')
    os.makedirs(download_dir, exist_ok=True)
    p = os.path.join(download_dir, file_name)
    with open(p, 'w', encoding='utf-8') as fp:
        fp.write(text)

@app.post('/Save')
def save_result(res:AnnotationJson):
    data = jsonable_encoder(res)
    file_name = data['Doc_name'].replace('.txt', '.json')
    to_write = data['Mentions']
    
    path = os.path.join(server_root, 'history', file_name)
    with open(path, 'w', encoding='utf-8') as fp:
        json.dump(to_write, fp)

    statistic(file_name)

@app.get('/FileList')
def get_file_list():
    ret_list = []
    file_dir = os.path.join(server_root, 'file')
    objs = os.listdir(file_dir)
    objs = sorted(objs)
    for obj in objs:
        if (os.path.isfile(os.path.join(file_dir, obj)) == True):
            file_name = obj
            
            with open(os.path.join(file_dir, obj), 'r', encoding='utf-8') as f:
                file_content = f.read()
                
            ret_list.append({'file_name':file_name, 'file_content':file_content})
    
    return ret_list

@app.get('/PreviousRecord/{f_name}')
def get_previous_record(f_name:str):
    f_name = unquote(f_name)
    f_name = f_name.replace('.txt', '.json')
    f_path = os.path.join(server_root, 'history', f_name)
    labels = []
    if os.path.exists(f_path):
        with open(f_path, 'r') as f:
            labels = json.load(f)

    return labels

@app.get('/LabelRule')
def get_label_rule():
    label_rule_path = os.path.join(server_root, 'data', 'Label Rule')
    fn = os.listdir(label_rule_path)[0]
    with open(os.path.join(label_rule_path, fn), 'r') as f:
        rules = f.read()

    return rules
    
@app.get('/TokenizeRule/{f_name}')
def get_tokenize_rule(f_name:str):
    fn = f_name + '.txt'
    tokenize_rule_path = os.path.join(server_root, 'data', 'Tokenize Rule')
    with open(os.path.join(tokenize_rule_path, fn), 'r', encoding='utf-8') as f:
        rules = f.read()
    
    return rules

@app.get('/LanguageList')
def get_language():
    tokenize_rule_path = os.path.join(server_root, 'data', 'Tokenize Rule')
    langs = os.listdir(tokenize_rule_path)
    langs = [lang.replace('.txt', '') for lang in langs]

    return langs

@app.get('/VersionCheck')
def version_check():
    updateMdUrl = 'https://raw.githubusercontent.com/JueXiuHuang/Text-Label-System/master/Update.md'

    r = requests.get(updateMdUrl)
    if r.status_code == requests.codes.ok:
        latest_v = r.text.split('\n')[0].replace('##', '')
        Update_p = server_root.replace('Server', 'Update.md')
        with open(Update_p, 'r') as f:
            current_v = f.readline().replace('##', '').replace('\n', '')
        if current_v == latest_v:
            return True
        else:
            return False
    else:
        return True


def statistic(fn):
    print('Statistic...')
    path = os.path.join(server_root, 'history', fn)
    with open(path, 'r') as f:
        labels = json.load(f)
    
    # key is text, value is appreance count
    record = {}

    for label in labels:
        abs_path = label['Abs_path']
        for arg in label['Arguments']:
            text = arg['Text'].lower()
            type_ = arg['Arg_type']
            type_ = abs_path + '_' + type_
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
    save_path = os.path.join(server_root, 'statistic')
    if not os.path.exists(save_path):
        os.makedirs(save_path)
    save_path = os.path.join(save_path, fn.replace('.json', '.xlsx'))
    df.to_excel(save_path, encoding='utf8', index=False)

    return

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
    
# Run server with command:
# uvicorn --host 127.0.0.1 --reload server:app