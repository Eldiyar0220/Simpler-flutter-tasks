const vscode = require('vscode');
const { icon, command } = require('./helpers');

function firebaseItems(context) {
    return {
        label: 'Firebase',
        iconPath: icon(context, 'firebase_yellow_icon.svg'),
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        contextValue: 'categorySimplerFlutterCommands',
        children: [
            command('1) Dart pub global activate flutterfire_cli', 'dart pub global activate flutterfire_cli'),
            command('2) export PATH="$PATH":"$HOME/.pub-cache/bin"', 'export PATH="$PATH":"$HOME/.pub-cache/bin"'),
            command('3) Flutterfire Configure', 'flutterfire configure'),
            command('4) Firebase projects: List', 'firebase projects:list'),
            command('5) Flutterfire --version', 'flutterfire --version'),
        ],
    };
}

module.exports = {
    firebaseItems,
};
