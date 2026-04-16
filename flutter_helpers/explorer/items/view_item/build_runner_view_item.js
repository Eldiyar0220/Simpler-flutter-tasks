const vscode = require('vscode')

let buildRunnerCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerCategoryExpandable');

vscode.workspace.onDidChangeConfiguration((event) => {
    // -- Flutter Comands
    if (event.affectsConfiguration('SimplerFlutterTasks.buildRunnerCategoryExpandable')) {
        buildRunnerCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerCategoryExpandable');
    }
})
 
function buildRunnerViewItem(context) {
    return {
        label: 'Build Runner',
        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/build_runner_new.svg')),
        collapsibleState: buildRunnerCategoryExpandable ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
        children: [
            {
                label: '1) Build runner build',
                command: 'flutterCmd.build',
                argument: "dart run build_runner build",
                description: '',
                contextValue: 'child'
            },
            {
                label: '2) Build Runner with Delete Outputs',
                command: 'flutterCmd.executeCmd',
                argument: "dart run build_runner build --delete-conflicting-outputs",
                description: '',
                contextValue: 'child'
            },
            {
                label: '3) Build Runner with Delete Outputs - V',
                command: 'flutterCmd.executeCmd',
                argument: "dart run build_runner build --delete-conflicting-outputs -v",
                description: '',
                contextValue: 'child'
            },
            {
                label: '4) Build Runner With Filter',
                command: 'flutterCmd.executeCmd',
                argument: "dart run build_runner build --delete-conflicting-outputs --build-filter 'path/*.dart",
                copyText: false,
                description: '',
                contextValue: 'gitHubContext'
            },
        ],
    }
}

module.exports = {
    buildRunnerViewItem
}