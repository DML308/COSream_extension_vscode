'use strict';

// imports
const vscode = require('vscode')


const stream_outin = ['output', 'input'];
const keyword = ['sliding', 'tumbling', 'roundrobin', 'duplicate',
'abstract','continue','for','new','switch','assert','goto',
'do','if','private','this','break','protected','throw','else',
'public','enum','return','catch','try','interface','static',
'class','finally','const','super','while','true','false',
'boolean','double','byte','int','short','char','void','long','float'];

function getSuggestions(cmdlist, insertText) {
    let commands = cmdlist;
    if (commands.length > 0) {
        let suggestions = commands.map(function (command_name) {
            var item = new vscode.CompletionItem(command_name);
            if (insertText == null || insertText == '') {
                item.insertText = command_name;
            } else {
                let snippet = new vscode.SnippetString(insertText(command_name));
                item.insertText = snippet;
            }
            return item;
        })
        return suggestions;

    }
    return [];
}

function insertInputOut(word) {
    return word + ' stream<> streamName';
}

function insertKeyword(word) {
    return word;
}

function wordContains(word, pattern) {
    return word.indexOf(pattern) > -1;
}

function provideCompletionItems(document, position, token, context) {

    const composteCompletion = new vscode.CompletionItem('composite');
    composteCompletion.insertText = `composite compositeName(){
            
}`;
    const streamCompletion = new vscode.CompletionItem('stream');
    streamCompletion.insertText = new vscode.SnippetString('stream<>');

    const initCompletion = new vscode.CompletionItem('init');
    initCompletion.insertText = new vscode.SnippetString(`init{

}`);
    const workCompletion = new vscode.CompletionItem('work');
    workCompletion.insertText = new vscode.SnippetString(`work{

}`);
    const windowCompletion = new vscode.CompletionItem('window');
    windowCompletion.insertText = new vscode.SnippetString(`window{

}`);

    const splitjoinCompletion = new vscode.CompletionItem('splitjoin');
    splitjoinCompletion.insertText = new vscode.SnippetString(`splitjoin(In){
    split \${1|roundrobin,duplicate|\}();

    join roundrobin();
}`);

    const pipelineCompetion = new vscode.CompletionItem('pipeline');
    pipelineCompetion.insertText = new vscode.SnippetString(`pipeline(In){

}`);

    const inoutSuggestions = getSuggestions(stream_outin, insertInputOut);

    const keywordSuggestions = getSuggestions(keyword, insertKeyword);
    // return all completion items as array
    return [
        composteCompletion,
        streamCompletion,
        workCompletion,
        initCompletion,
        windowCompletion,
        splitjoinCompletion,
        pipelineCompetion,
        ...inoutSuggestions,
        ...keywordSuggestions
    ];
}



function activate(ctx) {

    ctx.subscriptions.push(
        vscode.languages.registerCompletionItemProvider({
            scheme: 'file',
            language: 'costream'
        }, {
            provideCompletionItems: provideCompletionItems
        }))
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;