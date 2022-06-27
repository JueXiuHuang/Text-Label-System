# Text Label System Readme

Contact `joshua87719@gmail.com` if you have other question.

We highly recommend you read this document in browser, or view this document online at [github](https://github.com/JueXiuHuang/Text-Label-System.git)

## Contents
* [How to use this tool](#how-to-use-this-tool)
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
![螢幕擷取畫面 2022-06-27 164133](https://user-images.githubusercontent.com/32955131/175899406-bbac423c-dc68-4b9a-8d1e-da8304a017ac.png)
Go to release and download zip file according to your operating system.

Unzip the file, your folder will contain these files:
![image](https://user-images.githubusercontent.com/32955131/175899778-04abe376-6b69-4bec-b30e-b9eafd904725.png)

Go to Server folder, and execute server.exe to open local server.
![exe](https://user-images.githubusercontent.com/32955131/175900103-149dc7b1-4e17-48bd-964d-bf094703ca69.png)

Back to the root folder, and go to Web folder, open webpage.html with browser, and you can use this label system.
![html](https://user-images.githubusercontent.com/32955131/175900623-c5e5399c-423b-4d54-8a88-775fe5a71f20.png)


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
