const vscode = require('vscode')

let flutterCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCategoryExpandable');

vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('SimplerFlutterTasks.flutterCategoryExpandable')) {
        flutterCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCategoryExpandable');
    }
})

function flutterViewItem(context) {
    return {
        label: 'Flutter',
        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/flutter_assets_white.svg')),
        collapsibleState: flutterCategoryExpandable ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
        children: [
            {
                label: '1) Flutter Version',
                command: 'flutterCmd.executeCmd',
                argument: "flutter --version",
                description: '',
                contextValue: 'child'
            },
            {
                label: '2) Flutter Doctor 🏥',
                command: 'flutterCmd.executeCmd',
                argument: "flutter doctor",
                description: 'more info -> flutter doctor -v',
                contextValue: 'doctor'
            },
            {
                label: '3) Flutter outdated packages🗂️',
                command: 'flutterCmd.executeCmd',
                argument: "flutter pub outdated",
                description: '',
                contextValue: 'child'
            },
            {
                label: '4) Flutter upgrade 🛠️',
                command: 'flutterCmd.executeCmd',
                argument: "flutter upgrade",
                description: '',
                contextValue: 'child'
            },
            {
                label: '5) Flutter upgrade Force 🛠️',
                command: 'flutterCmd.executeCmd',
                argument: "flutter upgrade --force",
                description: '',
                contextValue: 'child'
            },
            {
                label: '6) Flutter pub get 🛠️',
                command: 'flutterCmd.executeCmd',
                argument: "flutter pub get",
                description: 'more info -> flutter pub get --verbose',
                contextValue: 'child'
            },
            {
                label: '7) Flutter pub upgrade 🛠️',
                command: 'flutterCmd.executeCmd',
                argument: "flutter pub upgrade",
                description: '',
                contextValue: 'child'
            },
            {
                label: '8) Flutter screenshot 📸',
                command: 'flutterCmd.executeCmd',
                argument: "flutter screenshot",
                description: '',
                contextValue: 'screenShot'
            },
            {
                label: '8) Flutter Log ---> 🔎⤵️',
                command: 'flutterCmd.executeCmd',
                argument: "flutter logs",
                description: '',
                contextValue: 'child'
            },
            {
                label: '9) Connected Devices 📲',
                command: 'flutterCmd.executeCmd',
                argument: "flutter devices",
                description: '',
                contextValue: 'child'
            },
            {
                label: '10) Analyze Project 💉',
                command: 'flutterCmd.executeCmd',
                argument: "flutter analyze",
                description: '',
                contextValue: 'child'
            },
            {
                label: '11) Dart Fix All Files - 🧰',
                command: 'flutterCmd.executeCmd',
                argument: "dart fix --apply",
                description: '',
                contextValue: 'child'
            },
            {
                label: '12) Dart Format All Files - 🧰',
                command: 'flutterCmd.executeCmd',
                argument: "dart format .",
                description: '',
                contextValue: 'child'
            },
            {
                label: '13) Clean The Project ❌',
                command: 'flutterCmd.executeCmd',
                argument: "flutter clean",
                description: '',
                contextValue: 'child'
            },
            {
                label: '14) Pub cache clean ❌',
                command: 'flutterCmd.executeCmd',
                argument: "flutter pub cache clean",
                description: 'more -> flutter pub cache repair',
                contextValue: 'child'
            },
            {
                label: '15) Change Flutter Version',
                command: 'flutterCmd.executeCmd',
                argument: "flutter downgrade YOUR_FLUTTER_VERSION",
                description: 'example: flutter downgrade v3.0.0',
                contextValue: 'child'
            },
            {
                label: '16) Kill The Terminal',
                command: 'flutterCmd.executeCmd',
                argument: "killall -9 dart",
                copyText: false,
                description: '',
                contextValue: 'gitHubContext'
            },
            {
                label: '17) Flutter HELP',
                command: 'flutterCmd.executeCmd',
                argument: "flutter --help --verbose",
                description: '',
                contextValue: 'child'
            },
        ],
    }
}

module.exports = {
    flutterViewItem
}