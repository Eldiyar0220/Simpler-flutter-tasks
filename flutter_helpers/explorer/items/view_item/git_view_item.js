const vscode = require('vscode')

let gitCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitCategoryExpandable');

vscode.workspace.onDidChangeConfiguration((event) => {
    // -- Flutter Comands
    if (event.affectsConfiguration('SimplerFlutterTasks.gitCategoryExpandable')) {
        gitCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitCategoryExpandable');
    }
})

function gitViewItem(context) {
    return {
        label: 'Git Hub',
        iconPath: vscode.Uri.file(context.asAbsolutePath('./flutter_helpers/explorer/assets/github_assets.svg')),
        collapsibleState: gitCategoryExpandable ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
        children: [
            {
                label: 'Init Repository',
                iconPath: vscode.Uri.file(context.asAbsolutePath('./flutter_helpers/explorer/assets/git_init.gif')),
                // iconPath: new vscode.ThemeIcon('git-branch-create'),
                children: [
                    {
                        label: '1) git init',
                        command: 'flutterCmd.executeCmd',
                        argument: "git init",
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '2) git add .',
                        command: 'flutterCmd.executeCmd',
                        argument: "git add .",
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '3) git commit -m "first commit"',
                        command: 'flutterCmd.executeCmd',
                        argument: "git commit -m 'first commit'",
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '4) git branch -M main',
                        command: 'flutterCmd.executeCmd',
                        argument: "git branch -M main",
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '5) git remote add origin  YOUR_GIT_URL',
                        command: 'flutterCmd.executeCmd',
                        argument: "git remote add origin  YOUR_GIT_URL",
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '6) git push -u origin main',
                        command: 'flutterCmd.executeCmd',
                        argument: "git push -u origin main",
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: ' ----------------Git Repo----------------- ',
                        command: 'flutterCmd.executeCmd',
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '1) git branch -m NEW_NAME',
                        command: 'flutterCmd.executeCmd',
                        argument: "git branch -m NEW_NAME",
                        copyText: true,
                        description: "Change The Branch's name",
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '2) git branch',
                        command: 'flutterCmd.executeCmd',
                        argument: "git branch",
                        copyText: true,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '3) git checkout -b YOUR_NEW_BRANCH',
                        command: 'flutterCmd.executeCmd',
                        argument: "git checkout -b NEW_BRANCH",
                        copyText: true,
                        description: 'Create The Branch and switch',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '4) git push --set-upstream origin YOUR_BRANCH',
                        command: 'flutterCmd.executeCmd',
                        argument: "git push --set-upstream origin yourBranch",
                        copyText: true,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '5) git push -f origin YOUR_BRANCH',
                        command: 'flutterCmd.executeCmd',
                        argument: "git push -f origin YOUR_BRANCH",
                        copyText: true,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                ],
            },
            {
                label: 'Git Cancelers',
                iconPath: vscode.Uri.file(context.asAbsolutePath('./flutter_helpers/explorer/assets/thunder.gif')),
                children: [
                    {
                        label: '1) git reset --soft HEAD~',
                        command: 'flutterCmd.executeCmd',
                        argument: "git reset --soft HEAD~",
                        copyText: true,
                        description: 'Cancel last Commit',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '2) git rebase --abort',
                        command: 'flutterCmd.executeCmd',
                        argument: "git rebase --abort",
                        copyText: true,
                        description: 'Cancel last rebase',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '3) git merge --abort',
                        command: 'flutterCmd.executeCmd',
                        argument: "git merge --abort",
                        copyText: true,
                        description: 'Cancel last Merge',
                        contextValue: 'gitHubContext'
                    },
                    // {
                    //     label: '3) git cancel init',
                    //     command: 'flutterCmd.executeCmd',
                    //     argument: "git merge --abort",
                    //     copyText: true,
                    //     description: 'Small',
                    //     contextValue: 'gitHubContext'
                    // },
                ],
            },
            {
                label: 'Git Repo',
                iconPath: vscode.Uri.file(context.asAbsolutePath('./flutter_helpers/explorer/assets/git_repo.gif')),
                children: [
                    {
                        label: '1) git pull --rebase origin YOUR_MAIN_BRANCH',
                        command: 'flutterCmd.executeCmd',
                        argument: "git pull --rebase origin YOUR_MAIN_BRANCH",
                        copyText: true,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '2) git merge YOUR_BRANCH',
                        command: 'flutterCmd.executeCmd',
                        argument: "git merge YOUR_MAIN_BRANCH",
                        copyText: true,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: '3) git config --global http.postBuffer 157286400',
                        command: 'flutterCmd.executeCmd',
                        argument: "git config --global http.postBuffer 157286400",
                        copyText: true,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                ],
            },
        ],
    }
}


module.exports = {
    gitViewItem
}