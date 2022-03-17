var file_selector = document.getElementById('file_selector');
var args_display = document.getElementById('args_display');
var tag_display = document.getElementById('label_result_panel');

var files_json;
var selection_id_list = [];

var label_rule = '';
var tok_list;
var tokenization_rule = '';
var args = [];
var taggings = [];
var temp_tag = [];

var NodeID2RGB = {}
var NodePath2RGB = {}

function Node(id, value, level) {
    this.node_id = id;
    this.value = value;
    this.level = level;
    this.parent = null;
    this.children = [];
}

class Label_tree {
    constructor() {
        let rootNode = new Node(-1, 'root', 0);
        this.root = rootNode;
    }
    add(child, parent) {
        parent.children.push(child);
        child.parent = parent;
    }
}

var label_tree = new Label_tree()

function get_abs_path(current_node) {
    abs_path = current_node.value
    while (current_node.level > 0) {
        parent = current_node.parent
        abs_path = parent.value + '_' + abs_path
        current_node = parent
    }

    return abs_path
}

// construct Node2RGB with abs path
function construct_label_tree(label_rule_text) {
    labels = label_rule_text.split('\n')
    let current_node = label_tree.root;

    for (let i = 0; i < labels.length; i++) {
        has_star = false
        let val = labels[i].replace(/\t+/g, '')
        let level = (labels[i].match(/\t/g) || []).length + 1
        if (val.charAt(0) == '*') {
            has_star = true;
            val = val.substring(1);
        }
        // if (val.charAt(0) == '*') {
        //     val = val.substring(1);
        //     let { r, g, b } = rgb_generator();

        //     NodeID2RGB[i] = { 'R': r, 'G': g, 'B': b }
        // }

        let node = new Node(i, val, level)
        if (node.level > current_node.level) {
            label_tree.add(node, current_node);
            current_node = node;
        } else {
            while (node.level <= current_node.level) {
                current_node = current_node.parent;
            }
            label_tree.add(node, current_node);
            current_node = node;
        }

        if (has_star) {
            let { r, g, b } = rgb_generator();
            ancestor_str = get_abs_path(node)
            NodePath2RGB[ancestor_str] = { 'R': r, 'G': g, 'B': b }
        }
    }
}

// old version construct Node2RGB with unique id
function construct_label_tree_old(label_rule_text) {
    labels = label_rule_text.split('\n')
    let current_node = label_tree.root;
    for (let i = 0; i < labels.length; i++) {
        let val = labels[i].replace(/\t+/g, '')
        let level = (labels[i].match(/\t/g) || []).length + 1
        if (val.charAt(0) == '*') {
            val = val.substring(1);
            let { r, g, b } = rgb_generator();

            NodeID2RGB[i] = { 'R': r, 'G': g, 'B': b }
        }

        let node = new Node(i, val, level)
        if (node.level > current_node.level) {
            label_tree.add(node, current_node);
            current_node = node;
        } else {
            while (node.level <= current_node.level) {
                current_node = current_node.parent;
            }
            label_tree.add(node, current_node);
            current_node = node;
        }
    }
}

// print the tree to check tree correction
function print_tree(node) {
    console.log('+'.repeat(node.level), node.value)
    for (let i = 0; i < node.children.length; i++) {
        print_tree(node.children[i]);
    }
}

var deepest_level = 0;
// traverse the tree and record deepest level
function tree_dfs(node) {
    if (node.level > deepest_level) {
        deepest_level = node.level;
    }
    for (let i = 0; i < node.children.length; i++) {
        tree_dfs(node.children[i])
    }
}

// event listerer when click download button
function click_download() {
    let cp_tokList = Array.from(tok_list)
    for (let i = 0; i < taggings.length; i++) {
        for (let j = 0; j < taggings[i]['args'].length; j++) {
            let start = taggings[i]['args'][j]['Start']
            let end = taggings[i]['args'][j]['End']
            let tag_name = taggings[i]['args'][j]['Arg_type']

            cp_tokList[start] = '[' + cp_tokList[start]
            cp_tokList[end - 1] = cp_tokList[end - 1] + ']' + tag_name
        }
    }

    upload_str = ''
    for (let i = 0; i < cp_tokList.length; i++) {
        upload_str += cp_tokList[i]
    }

    let url = 'http://127.0.0.1:8000/Download'
    let data = {
        'Text': upload_str,
        'FileName': files_json[file_selector.value].file_name
    };
    post_result_to_server(url, data)
}

function post_result_to_server(url, data) {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response))
        .then(response => alert("Success!"));
}

// event listerer when click save button
function click_save() {
    let url = 'http://127.0.0.1:8000/Save'

    mentions = [];
    for (let i = 0; i < taggings.length; i++) {
        // i indicate i-th tag
        tag_args = []
        for (let j = 0; j < taggings[i]['args'].length; j++) {
            // j indicate j-th parameter
            let arg = {
                'Arg_type': taggings[i]['args'][j]['Arg_type'],
                'Text': taggings[i]['args'][j]['Text'],
                'Start': taggings[i]['args'][j]['Start'],
                'End': taggings[i]['args'][j]['End']
            }
            tag_args.push(arg)
        }
        let single_tag = {
            'Abs_path': taggings[i]['abs_path'],
            'Arguments': tag_args
        }
        mentions.push(single_tag)
    }
    let data = {
        "Doc_name": files_json[file_selector.value].file_name,
        "Mentions": mentions
    }

    post_result_to_server(url, data)
}

// event listener when click done button
function click_Done() {
    let rgb;
    if (args.length == 0) {
        return;
    }
    let historyOptions = []
    for (let i = 0; i < selection_id_list.length; i++) {
        let selection = document.getElementById(selection_id_list[i]).value
        historyOptions.push(selection)
    }

    // follow the tree and option history, find the color
    let root = label_tree.root;
    let abs_path = root.value

    for (let i = 0; i < historyOptions.length; i++) {
        abs_path = abs_path + '_' + historyOptions[i]
        if (abs_path in NodePath2RGB) {
            rgb = NodePath2RGB[abs_path]
            break
        }
    }

    let dict;
    dict = {
        'args': args,
        'color': rgb,
        'abs_path': abs_path
    }

    taggings.push(dict);
    args = [];

    refresh_tag_display();
    reset_args_display();
}

// event listener when click CreateArg button
function click_CreateArg() {
    selectedTexts = window.getSelection();
    let text = window.getSelection().toString();
    let anchor_node = window.getSelection().anchorNode.parentNode;
    let focus_node = window.getSelection().focusNode.parentNode;
    let start = anchor_node.dataset.value;
    let end = focus_node.dataset.value;

    if (parseInt(start, 10) < parseInt(end, 10)) {
        end = (parseInt(end, 10) + 1).toString();
    } else {
        let temp = start;
        start = end;
        end = (parseInt(temp, 10) + 1).toString();
    }

    let selected_options = []
    for (let i = 0; i < selection_id_list.length; i++) {
        let selection = document.getElementById(selection_id_list[i])
        if (selection.value.length == 0) {
            break
        }
        selected_options.push(selection.value)
    }
    arg_type = selected_options.at(-1)
    arg_path = ''

    for (let i = 0; i < selected_options.length; i++) {
        arg_path += selected_options[i] + '||'
    }

    let arg = create_arg(arg_type, text, start, end);
    args.push(arg);

    refresh_args_display();
}

// event listener when click tag
function click_tag(wrapper) {
    let num = wrapper.dataset.value;
    let abs_path = taggings[num]['abs_path']
    args = taggings[num]['args'];

    hist_opt = abs_path.split('_')
    // remove 'root'
    hist_opt.splice(0, 1)

    for (let i = 0; i < hist_opt.length; i++) {
        let selection = document.getElementById(selection_id_list[i])
        selection.value = hist_opt[i]
        selection_changed(selection)
    }

    taggings.splice(num, 1);

    refresh_tag_display();
    refresh_args_display();
}

// event listener when click tag delete button
function del_tag(btn) {
    let num = btn.dataset.value;
    taggings.splice(num, 1);

    refresh_tag_display();
}

// event listener when click arg delete button
function del_arg(btn) {
    let num = btn.dataset.value;
    args.splice(num, 1);

    refresh_args_display();
}

// event listener when mouse moves into the tag area
function over_tag(wrapper) {
    let style = getComputedStyle(wrapper)
    wrapper.style.backgroundColor = style.backgroundColor.replace(unselected_opacity, selected_opacity);

    let content = document.getElementById('card_content');
    let children = content.children;
    let num = wrapper.dataset.value;

    for (let i = 0; i < taggings[num]['args'].length; i++) {
        for (let j = 0; j < taggings[num]['args'].length; j++) {
            for (let k = parseInt(taggings[num]['args'][j]['Start']); k < parseInt(taggings[num]['args'][j]['End']); k++) {
                let child_style = getComputedStyle(children[k]);
                children[k].style.backgroundColor = child_style.backgroundColor.replace(unselected_opacity, selected_opacity);
            }
        }
    }
}

// event listener when mouse moves out the tag area
function leave_tag(wrapper) {
    let style = getComputedStyle(wrapper)
    wrapper.style.backgroundColor = style.backgroundColor.replace(selected_opacity, unselected_opacity);

    let content = document.getElementById('card_content');
    let children = content.children;
    let num = wrapper.dataset.value;

    for (let i = 0; i < taggings[num]['args'].length; i++) {
        for (let j = 0; j < taggings[num]['args'].length; j++) {
            for (let k = parseInt(taggings[num]['args'][j]['Start']); k < parseInt(taggings[num]['args'][j]['End']); k++) {
                let child_style = getComputedStyle(children[k]);
                children[k].style.backgroundColor = child_style.backgroundColor.replace(selected_opacity, unselected_opacity);
            }
        }
    }
}

function create_arg(arg_type, text, start, end) {
    let arg = {
        'Arg_type': arg_type,
        'Text': text,
        'Start': start,
        'End': end
    }

    return arg;
}

// reset the args display area
function reset_args_display() {
    while (args_display.firstChild) {
        args_display.removeChild(args_display.firstChild);
    }
}

// reset the tags display area
function reset_tag_display() {
    while (tag_display.firstChild) {
        tag_display.removeChild(tag_display.firstChild);
    }
}

// set the story background to white
function reset_story_color() {
    let content = document.getElementById('card_content');
    let children = content.children;

    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
}

// refresh the args display area
function refresh_args_display() {
    // reset the args list first
    reset_args_display();

    // generate args according to args list
    for (let i = 0; i < args.length; i++) {
        let wrapper = document.createElement('div');
        let del_btn = get_delBtn(i, 'arg');
        let arg_type = document.createElement('span');
        arg_type.innerHTML = args[i]['Arg_type'];
        let text = document.createElement('span');
        text.innerHTML = args[i]['Text'];
        wrapper.appendChild(del_btn);
        wrapper.appendChild(arg_type);
        wrapper.appendChild(text);
        args_display.appendChild(wrapper);
    }
}

// refresh the tags display area
function refresh_tag_display() {
    reset_tag_display();

    for (let i = 0; i < taggings.length; i++) {
        let wrapper;
        wrapper = tag_displayer(i);

        tag_display.appendChild(wrapper);
    }

    refresh_story();
}

// refresh the story display area
function refresh_story() {
    reset_story_color();

    let content = document.getElementById('card_content');
    let children = content.children;
    for (let i = 0; i < taggings.length; i++) {
        for (let j = 0; j < taggings[i]['args'].length; j++) {
            // k 用來指定文章中字的範圍
            for (let k = parseInt(taggings[i]['args'][j]['Start']); k < parseInt(taggings[i]['args'][j]['End']); k++) {
                let filter = taggings[i]['tab'];
                children[k].style.backgroundColor = 'rgba(' + taggings[i]['color']["R"] + ',' + taggings[i]['color']["G"] + ',' +
                    taggings[i]['color']["B"] + ',' + unselected_opacity + ')';
            }
        }
    }
}

function tag_displayer(i) {
    let wrapper = document.createElement('div')
    wrapper.setAttribute('class', 'row');
    let del_btn = get_delBtn(i, 'tag');
    let r = taggings[i]['color']['R']
    let g = taggings[i]['color']['G']
    let b = taggings[i]['color']['B']
    let tag_wrapper = get_tagWrapper(i, r, g, b);

    for (let j = 0; j < taggings[i]['args'].length; j++) {
        let arg_wrapper = document.createElement('div');
        arg_wrapper.style.width = 'fit-content';
        let arg = document.createElement('span');
        arg.innerHTML = taggings[i]['args'][j]['Arg_type'];
        let text = document.createElement('span');
        text.innerHTML = taggings[i]['args'][j]['Text'];

        arg_wrapper.appendChild(arg);
        arg_wrapper.appendChild(text);
        tag_wrapper.appendChild(arg_wrapper);
    }

    wrapper.appendChild(del_btn);
    wrapper.appendChild(tag_wrapper);

    return wrapper;
}

function get_tagWrapper(i, r, g, b) {
    let tag_wrapper = document.createElement('div');
    tag_wrapper.setAttribute('onmouseenter', 'over_tag(this)');
    tag_wrapper.setAttribute('onmouseleave', 'leave_tag(this)');
    tag_wrapper.setAttribute('onclick', 'click_tag(this)');
    tag_wrapper.setAttribute('data-value', i);
    tag_wrapper.style.backgroundColor = 'rgba(' + r + ',' +
        g + ',' + b + ',' + unselected_opacity + ')';
    tag_wrapper.style.border = '2px solid black';
    tag_wrapper.style.width = 'fit-content';

    return tag_wrapper;
}

function get_delBtn(i, type) {
    let del_btn = document.createElement('button');
    del_btn.setAttribute('type', 'button');
    del_btn.setAttribute('class', 'btn-close');
    del_btn.setAttribute('aria-label', 'Close');
    del_btn.setAttribute('data-value', i);
    if (type == 'tag') {
        del_btn.setAttribute('onclick', 'del_tag(this)');
    } else if (type == 'arg') {
        del_btn.setAttribute('onclick', 'del_arg(this)');
    }

    return del_btn;
}

function file_selected() {
    let val = file_selector.value;
    let search_bar = document.getElementById("exampleDataList");
    search_bar.value = ""
    args = [];
    taggings = [];
    temp_tag = [];
    refresh_tag_display();
    refresh_args_display();
    display_story(files_json[val].file_name, files_json[val].file_content);
    get_tagged_tags(encodeURI(files_json[val].file_name));
}

function file_searched(search_bar) {
    for (let i = 0; i < files_json.length; i++) {
        if (files_json[i].file_name == search_bar.value) {
            file_selector.value = i;
            args = [];
            taggings = [];
            temp_tag = [];
            refresh_tag_display();
            refresh_args_display();
            display_story(files_json[i].file_name, files_json[i].file_content);
            get_tagged_tags(encodeURI(files_json[i].file_name));
        }
    }
}

function generate_selection_entity(sel_id) {
    let sel_panel = document.getElementById("selection_panel")
    let sel = document.createElement('select')
    sel.setAttribute('class', 'form-select')
    sel.setAttribute('aria-label', 'Default select example')
    sel.setAttribute('id', sel_id)
    sel.setAttribute('onchange', 'selection_changed(this)')
    sel_panel.appendChild(sel);
}

function generate_selection_list() {
    tree_dfs(label_tree.root);
    for (let i = 0; i < deepest_level; i++) {
        let sel_id = 'selection_' + (i + 1).toString(10)
        selection_id_list.push(sel_id)
        generate_selection_entity(sel_id);
    }
}

function selection_changed(selection) {
    let history_opt = []
    id_ = parseInt(selection.id.replace('selection_', ''), 10)

    // get what option user has choose
    for (let i = 0; i < id_; i++) {
        let selection = document.getElementById(selection_id_list[i])
        history_opt.push(selection.value)
    }

    // follow the tree and option history, find the node that was choosen
    let startNode = label_tree.root;
    for (let i = 0; i < history_opt.length; i++) {
        for (let j = 0; j < startNode.children.length; j++) {
            if (startNode.children[j].value == history_opt[i]) {
                startNode = startNode.children[j];
                break;
            }
        }
    }

    // then we update the option list after the selected option
    for (let i = id_; i < selection_id_list.length; i++) {
        let selection = document.getElementById(selection_id_list[i])
        // it options is the children of startNode
        // remove old options
        while (selection.firstChild) {
            selection.removeChild(selection.firstChild);
        }

        // we skip add options process if there is no children anymore
        if (startNode.children.length == 0) {
            continue;
        }
        // add new options
        for (let j = 0; j < startNode.children.length; j++) {
            let option = document.createElement('option');
            option.text = startNode.children[j].value;
            option.value = startNode.children[j].value;
            selection.appendChild(option);
        }

        // children[0] will be next selection default node
        startNode = startNode.children[0]
    }
}

function selection_init() {
    let sel_id = selection_id_list[0];
    let selection = document.getElementById(sel_id)

    for (let i = 0; i < label_tree.root.children.length; i++) {
        let option = document.createElement('option');
        option.text = label_tree.root.children[i].value;
        option.value = label_tree.root.children[i].value;
        selection.appendChild(option);
    }

    selection_changed(selection);
}


function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

// get the file list and content from server
function get_file_data() {
    let url = 'http://127.0.0.1:8000/FileList';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            files_json = myJson.sort(GetSortOrder("file_name"));
            generate_file_list();
        });
}

function get_tokenization_rule() {
    let url = 'http://127.0.0.1:8000/TokenizeRule';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (mytext) {
            tokenization_rule = mytext;
            // construct_label_tree(label_rule);
            // generate_selection_list();
            // selection_init();
        });
}

function get_label_rule() {
    let url = 'http://127.0.0.1:8000/LabelRule';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (mytext) {
            label_rule = mytext;
            construct_label_tree(label_rule);
            generate_selection_list();
            selection_init();
        });
}

function load_previous_tag(tags) {
    for (let i = 0; i < tags.length; i++) {
        let abs_path = tags[i]['Abs_path']
        let color = NodePath2RGB[abs_path]

        for (let j = 0; j < tags[i]["Arguments"].length; j++) {
            let arg_type = tags[i]["Arguments"][j]["Arg_type"];
            let text = tags[i]["Arguments"][j]["Text"];
            let start = tags[i]["Arguments"][j]["Start"];
            let end = tags[i]["Arguments"][j]["End"];

            let arg = create_arg(arg_type, text, start, end);
            args.push(arg);
        }

        dict = {
            'abs_path': abs_path,
            'color': color,
            'args': args
        };

        taggings.push(dict);
        args = [];
    }
    refresh_tag_display();
}

function get_tagged_tags(file_name) {
    let url = 'http://127.0.0.1:8000/PreviousRecord/'
    url = url + file_name;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            load_previous_tag(myJson);
        });
}

// generate options (file list) to file selector
function generate_file_list() {
    var datalistOptions = document.getElementById('datalistOptions');
    for (let i = 0; i < files_json.length; i++) {
        let option = document.createElement('option');
        option.text = files_json[i].file_name;
        option.value = i;
        file_selector.appendChild(option);

        let datalistopt = document.createElement('option');
        datalistopt.value = files_json[i].file_name;
        datalistOptions.appendChild(datalistopt);
    }
}

// display story content at story display area
function display_story(f_title, f_cont) {
    let title = document.getElementById('card_title');
    let content = document.getElementById('card_content');

    title.textContent = f_title;
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    tok_list = tokenization(f_cont);
    for (let i = 0; i < tok_list.length; i++) {
        let spam = document.createElement('spam');
        spam.innerHTML = tok_list[i];
        spam.dataset.value = i;
        content.appendChild(spam);
    }
}

// split the story content
function tokenization(string) {
    let exp = new RegExp(tokenization_rule);
    let ret_list = [];
    let splited = string.split(exp);
    for (let tok = 0; tok < splited.length; tok++) {
        // if (splited[tok].trim().length > 0) {
        if (splited[tok].length > 0) {
            //ret_list.push(splited[tok].trim());
            ret_list.push(splited[tok]);
        }
    }

    return ret_list;
}

function rgb_generator() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return { r, g, b }
}

get_file_data();
get_label_rule();
get_tokenization_rule();

var selected_opacity = 0.8;
var unselected_opacity = 0.3;