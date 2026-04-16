const vscode = require('vscode')


function firebaseViewItem(context) {
    return {
        label: 'Firebase',
        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/firebase_yellow_icon.svg')),
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        contextValue: 'categorySimplerFlutterCommands',
        children: [
            {
                label: '1) Dart pub global activate flutterfire_cli',
                command: 'flutterCmd.executeCmd',
                argument: "dart pub global activate flutterfire_cli",
                description: '',
                contextValue: 'child'
            },
            {
                label: `2) export PATH="$PATH":"$HOME/.pub-cache/bin"`,
                command: 'flutterCmd.executeCmd',
                argument: `export PATH="$PATH":"$HOME/.pub-cache/bin"`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '3) Flutterfire Configure',
                command: 'flutterCmd.executeCmd',
                argument: "flutterfire configure",
                description: '',
                contextValue: 'child'
            },
            {
                label: '4) Firebase projects: List',
                command: 'flutterCmd.executeCmd',
                argument: "firebase projects:list",
                description: '',
                contextValue: 'child'
            },
            {
                label: '5) Flutterfire --version',
                command: 'flutterCmd.executeCmd',
                argument: " flutterfire --version",
                description: '',
                contextValue: 'child'
            },
        ],
    }
}

module.exports = {
    firebaseViewItem
}