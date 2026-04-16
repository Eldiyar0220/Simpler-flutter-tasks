const vscode = require('vscode');

const { flutterViewItem } = require('./view_item/flutter_view');
const { buildRunnerViewItem } = require('./view_item/build_runner_view_item');
const { iosViewItem } = require('./view_item/ios_view_item');
const { androidViewItem } = require('./view_item/android_view_item');
const { gitViewItem } = require('./view_item/git_view_item');

class MyTreeDataProviderFolder {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        if (element.children) {
            return {
                iconPath: element.iconPath,
                label: element.label,
                collapsibleState: element.collapsibleState ?? vscode.TreeItemCollapsibleState.Collapsed,
                tooltip: element.tooltip,
                checkboxState: element.checkboxState,
                contextValue: element.contextValue,
            };
        } else {
            return {
                label: element.label,
                tooltip: element.argument, // Add tooltip for child items
                checkboxState: element.checkboxState,
                contextValue: element.contextValue,
                // description: 'asdfasdf',
                children: {
                    contextValue: element.contextValue,
                    command: element.command,
                    title: element.label,
                    checkboxState: element.checkboxState,
                    // description: 'asdfasdf',
                    arguments: element.arguments,
                    tooltip: element.argument, // Add tooltip for child items
                },
            };
        }
    }

    getChildren(element) {
        if (element) {
            return element.children || [];
        }
        return itemsOfCommandsData(this.context);
    }
}

function itemsOfCommandsData(context) {
    return [
        // -- Build runner View
        buildRunnerViewItem(context),

        // -- Flutter View
        flutterViewItem(context),

        // -- Flutter View
        androidViewItem(context, vscode.TreeItemCollapsibleState.Expanded),

        // -- IOS View
        iosViewItem(context, vscode.TreeItemCollapsibleState.Expanded),

        // -- GIT View
        gitViewItem(context),
    ];
}


module.exports = {
    itemsOfCommandsData, MyTreeDataProviderFolder
};
