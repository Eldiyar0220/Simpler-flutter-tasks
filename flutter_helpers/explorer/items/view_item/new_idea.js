const vscode = require('vscode')


function newIdea(context) {
    return {
        label: 'Give Ideas',
        // iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/firebase_yellow_icon.svg')),
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        contextValue: 'categorySimplerFlutterCommands',
        children: [
            {
                label: 'To suggest an idea',
                command: 'flutterCmd.executeCmd',
                description: 'Предложить идею',
                contextValue: 'newIdea'
            }
        ],
    }
}
//vscode.env.openExternal(Uri.parse("https://www.stackoverflow.com/"));

module.exports = {
    newIdea
}