# Text Label System Readme

Contact `joshua87719@gmail.com` if you have other question.

We highly recommend you read this document in browser, or view this document online at https://hackmd.io/@joshua87719/SkXG0UBpK

## Install
### Python
We need python3, please access [website](https://www.python.org/downloads/) to install python first.

#### Check your python
Open Terminal (Windows OS)
![](https://i.imgur.com/GgFsk5v.png)

After opening terminal, type `python --version` in the terminal, if you install python successfully, you can get installed python version.
![](https://i.imgur.com/p9aCSpp.png)

### Install require packages
Access to `Text-Label-System` folder and run `Install requirements.bat` file.
![](https://i.imgur.com/VzUssRg.png)


## File Description
Below is the folder tee of this project

![](https://i.imgur.com/7uSPfXx.png)

### Label Rule Folder
`Label Rule` folder is under `Server/data` folder. This folder contains the label tree text file, which describe your label architecture.
Once you have define your own label tree, put the file into this folder.
**Mention! Label Rule Folder can only have ONE label tree text file.** If you want to use new label rule tree, please remove old one.

### Tokenize Rule Folder
`Tokenize Rule` folder is under `Server/data` folder. This folder contains the tokenization rule file, whick describe your tokenization method in Regular Expression. Currently we provide English and Chinese tokenization and named the tokenization rule files as `English tokenize rule.txt` and `Chinese tokenize rule.txt` respectively.
**Mention! Tokenize Rule Folder can only have ONE tokenization rule file.** If you want to use new tokenization rule, please remove old one.

### File Folder
`file` folder is under `Server` folder. This folder contains the documents that you want to label. If you have a new document, just put it into this folder.

## Label Tree
![](https://i.imgur.com/7LZE61p.png)

Label Tree is a tree like text file which describe your label architecture.
For each label, you should put a * icon infront of it, and system will give this label a specific color to help you identify it.
For each label, you can define its sub-labels.
You can also sort these labels into several category to help you find them.

## Label System browser
Below is the overview of Label System browser.
![](https://i.imgur.com/PMcqGSe.png)

You can use the selection bar at top right corner to choose document.
![](https://i.imgur.com/Zvz7lqZ.png)

Highlight the words you want to label, and choose the corresponding label.
When your mouse is over the label, corresponding label and it text will highlight.
![](https://i.imgur.com/0M5tsHN.gif)




## Run Text Label System
### Start local server
Access to `Test-Label-System\Server` folder and run `Run Server.bat`
![](https://i.imgur.com/tWzXu74.png)


### Open Label-System browser
Access to `Test-Label-System\Web` and open `webpage.html` (usually it will open with browser automatically)
![](https://i.imgur.com/oRBc7pJ.png)
