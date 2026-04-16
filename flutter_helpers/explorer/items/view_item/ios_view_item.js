const vscode = require('vscode')
const customPath = require('../../../root_path')

let iosCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosCategoryExpandable');

vscode.workspace.onDidChangeConfiguration((event) => {
    // -- Flutter Comands
    if (event.affectsConfiguration('SimplerFlutterTasks.iosCategoryExpandable')) {
        iosCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosCategoryExpandable');
    }
})

function iosViewItem(context, collapsed) {
    return {
        label: 'iOS',
        iconPath: vscode.Uri.file(context.asAbsolutePath('./flutter_helpers/explorer/assets/ios_assets.svg')),
        collapsibleState: collapsed ?? iosCategoryExpandable ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
        children: [
            {
                label: '1) Build Ios',
                command: 'flutterCmd.executeCmd',
                argument: "flutter build ios",
                description: '',
                contextValue: 'child'
            },
            {
                label: '2) Build Ipa',
                command: 'flutterCmd.executeCmd',
                argument: "flutter build ipa",
                description: '',
                contextValue: 'child'
            },
            {
                label: '3) Pod Install',
                command: 'flutterCmd.executeCmd',
                argument: `cd ${customPath.rootPath} && cd ios && pod install && cd ..`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '4) Pod update',
                command: 'flutterCmd.executeCmd',
                argument: `cd ${customPath.rootPath} && cd ios && pod update && cd ..`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '5) Pod Repo Update',
                command: 'flutterCmd.executeCmd',
                argument: "pod repo update",
                description: '',
                contextValue: 'child'
            },
            {
                label: '6) Pod cache clean --all ❌',
                command: 'flutterCmd.executeCmd',
                argument: `cd ${customPath.rootPath} && cd ios && pod cache clean --all && cd ..`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '7) Pod setup',
                command: 'flutterCmd.executeCmd',
                argument: `pod setup`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '8) Pod Init',
                command: 'flutterCmd.executeCmd',
                argument: `cd ${customPath.rootPath} && cd ios && pod init && cd ..`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '9) Flutter create -i swift .',
                command: 'flutterCmd.executeCmd',
                argument: `flutter create -i swift .`,
                description: '',
                contextValue: 'child'
            },
            {
                label: '10) Pod --version',
                command: 'flutterCmd.executeCmd',
                argument: `pod --version`,
                description: '',
                contextValue: 'child'
            },
            {
                label: 'Deleting',
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                children: [
                    {
                        label: '1) Delete .symlinks ',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd ios && rm -Rf .symlinks && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: '2) Delete Pods ',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd ios && rm -Rf Pods && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: '3) Delete Podfile.lock',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd ios && rm -Rf Podfile.lock && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: '4) Pod deintegrate',
                        command: 'flutterCmd.executeCmd',
                        argument: `cd ${customPath.rootPath} && cd ios && pod deintegrate && cd ..`,
                        description: '',
                        contextValue: 'child'
                    },
                ],
            },
            {
                label: 'CocoPods',
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                children: [
                    {
                        label: 'sudo gem install cocoapods',
                        command: 'flutterCmd.executeCmd',
                        argument: `sudo gem install cocoapods`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: 'brew install cocoapods',
                        command: 'flutterCmd.executeCmd',
                        argument: `brew install cocoapods`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: 'brew upgrade cocoapods',
                        command: 'flutterCmd.executeCmd',
                        argument: `brew upgrade cocoapods`,
                        description: '',
                        contextValue: 'child'
                    },
                    {
                        label: 'brew link --overwrite cocoapods',
                        command: 'flutterCmd.executeCmd',
                        argument: `brew link --overwrite cocoapods`,
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
                label: '1) Open IOS Folder ✅',
                command: 'flutterCmd.executeCmd',
                argument: ` Open ios `,
                description: '',
                ios: false,
                contextValue: 'OpenIos'
            },
            {
                label: '2) Open IPA Folder ✅',
                command: 'flutterCmd.executeCmd',
                argument: ` Open ipa `,
                ios: true,
                description: '',
                contextValue: 'OpenIos'
            },
        ],
    }
}


module.exports = {
    iosViewItem
}