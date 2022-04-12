# Text Label System Readme

Contact `joshua87719@gmail.com` if you have other question.

We highly recommend you read this document in browser, or view this document online at [github](https://github.com/JueXiuHuang/Text-Label-System.git)

## Contents
* [How to use this tool](#how-to-use-this-tool)
* Install
  * [Windows guide](#windows-guide)
  * [Mac guide](#mac-guide)
* File Description
  * [Label Rule Folder](#label-rule-folder)
  * [Tokenize Rule Folder](#tokenize-rule-folder)
  * [File Folder](#file-folder)
* [Label Tree](#label-tree)
* [Label System browser](#label-system-browser)
* Run Text Label System
  * [Start local server (Windows)](#start-local-server-windows)
  * [Start local server (Mac)](#start-local-server-mac)
  * [Open Label System browser](#open-label-system-browser)



## How to use this tool
Step 1, install python if you haven't install it before. Refer to [Windows guide](#windows-guide) or [Mac guide](#mac-guide) for more details.

Step 2, put the text file into folder `Text-Label-System/Server/file/`.

Step 3, change the label rule file in `Text-Label-System/Server/data/Label Rule/`. Refer to [Label Rule Folder](#label-rule-folder) for more details.

Step 4, change the tokenize rule file according to your text file language with regular expression in `Text-Label-System/Server/data/Tokenize Rule/`. Refer to [Label Tree](#label-tree) for more details.

Step 5, open server. Refer to [Start local server (Windows)](#start-local-server-windows) or [Start local server (Mac)](#start-local-server-mac) for more detail.

Step 6, open web and start tagging! Refer to [Label System browser](#label-system-browser) and [Open Label System browser](#open-label-system-browser) for more details.


## Install

### Windows guide

We need python3, please access [website](https://www.python.org/downloads/) to install python first.

#### Check your python
Open Terminal (Windows OS)
![](https://i.imgur.com/GgFsk5v.png)

After opening terminal, type `python --version` in the terminal, if you install python successfully, you can get installed python version.
![](https://i.imgur.com/p9aCSpp.png)

#### Install require packages
Access to `Text-Label-System` folder and run `Install requirements.bat` file (just double click).
![](https://i.imgur.com/VzUssRg.png)


### Mac guide
We need python3, please access [website](https://www.dataquest.io/blog/installing-python-on-mac/) to install python first.

#### Check your python
Open Terminal (Search 'Terminal' on spotilight)

After opening terminal, type `python --version` in the terminal, if you install python successfully, you can get installed python version.
![](https://i.imgur.com/p9aCSpp.png)

#### Install require packages
Open your terminal again, navigate to the Text-Label-System folder, it usually in your download folder.
To navigate to certain folder, type `cd folder_name` in your termianl, and use `ls` to check what folder or files in your current directory.
<img width="462" alt="截圖 2022-04-06 下午9 09 35" src="https://user-images.githubusercontent.com/32955131/161982281-3747e1c7-f6f3-4ae6-b0e4-d24743d2d229.png">

After arrive Text-Label-System folder, type `bash Install_requirement.sh` to insall require packages.



## File Description
Below is the folder tree of this project

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
### Start local server (Windows)
Access to `Test-Label-System\Server` folder and run `Run Server.bat`
**Do not close terminal when you are running server!!**

![](https://i.imgur.com/tWzXu74.png)

### Start local server (Mac)
Open Terminal and navigate to folder `Text-Label-System\Server` and type `bash Run_Server.sh`
**Do not close terminal when you are running server!!**

<img width="568" alt="截圖 2022-04-06 下午9 16 05" src="https://user-images.githubusercontent.com/32955131/161983421-5e196888-c697-414d-8d97-b4ffce385b8c.png">

### Open Label System browser
Access to `Test-Label-System\Web` and open `webpage.html` (usually it will open with browser automatically)

![](https://i.imgur.com/oRBc7pJ.png)
