const vscode = require('vscode')
const customPath = require('../../../root_path')

let androidCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('androidCategoryExpandable');

vscode.workspace.onDidChangeConfiguration((event) => {
    // -- Flutter Comands
    if (event.affectsConfiguration('SimplerFlutterTasks.androidCategoryExpandable')) {
        androidCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('androidCategoryExpandable');
    }
})

function androidViewItem(context, collapsed) {
    return {
        label: 'Android',
        iconPath: vscode.Uri.file(context.asAbsolutePath('./flutter_helpers/explorer/assets/android_assets.svg')),
        collapsibleState: collapsed ?? androidCategoryExpandable ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
        children: [
            {
                label: '1) Build APK',
                command: 'flutterCmd.executeCmd',
                argument: "flutter build apk",
                description: '',
                contextValue: 'child'
            },
            {
                label: '2) Build App Bundle',
                command: 'flutterCmd.executeCmd',
                argument: "flutter build appbundle",
                description: '- Release -',
                contextValue: 'child'
            },
            {
                label: '3) Build Small apk',
                command: 'flutterCmd.executeCmd',
                argument: "flutter build apk --split-per-abi",
                description: '',
                contextValue: 'child'
            },
            {
                label: 'GRADLE',
                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/gradle_white.svg')),
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                children: [
                    {
                        label: '1) Gradle Dependencies',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd android && ./gradlew app:dependencies && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: '2) Gradle SigningReport',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd android && ./gradlew signingReport && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: '2) Gradle build',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd android && ./gradlew build && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: '6) Gradle Clean ❌',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd android && ./gradlew clean && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                ],
            },
            {
                label: ' ----------------Open Folders----------------- ',
                command: 'flutterCmd.executeCmd',
                copyText: false,
                description: '',
                contextValue: 'gitHubContext'
            },
            {
                label: 'Open Apk      ✅',
                command: 'flutterCmd.executeCmd',
                argument: "open apk folder",
                description: '',
                contextValue: 'android'
            },
            {
                label: 'Open Bundle ✅',
                command: 'flutterCmd.executeCmd',
                argument: "open app bundle folder",
                description: '- Release -',
                contextValue: 'bundle'
            },
        ],
    }
}


module.exports = {
    androidViewItem
}