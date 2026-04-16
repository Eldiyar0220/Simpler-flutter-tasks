const vscode = require('vscode');

const { flutterViewItem } = require('./view_item/flutter_view');
const { settingsViewItem } = require('./view_item/settings_view');
const { buildRunnerViewItem } = require('./view_item/build_runner_view_item');
const { iosViewItem } = require('./view_item/ios_view_item');
const { androidViewItem } = require('./view_item/android_view_item');
const { gitViewItem } = require('./view_item/git_view_item');
const { firebaseViewItem } = require('./view_item/firebase_view_item');
const { newIdea } = require('./view_item/new_idea');

class MyTreeDataProvider {
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
                description: element.description,
            };
        } else {
            return {
                label: element.label,
                tooltip: element.argument, // Add tooltip for child items
                checkboxState: element.checkboxState,
                contextValue: element.contextValue,
                description: element.description,
                iconPath: element.iconPath,
                children: {
                    contextValue: element.contextValue,
                    command: element.command,
                    title: element.label,
                    checkboxState: element.checkboxState,
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
        return itemsOfCommands(this.context);
    }
}

function itemsOfCommands(context) {
    return [
        // -- Build runner View
        buildRunnerViewItem(context),

        // -- Flutter View
        flutterViewItem(context),

        // -- Flutter View
        androidViewItem(context),

        // -- IOS View
        iosViewItem(context),

        // -- GIT View
        gitViewItem(context),

        // -- Settings View
        settingsViewItem(context),

        // Other Extension -- ???
        firebaseViewItem(context),

        //* new idea
        // newIdea(context)
    ];
}


module.exports = {
    itemsOfCommands, MyTreeDataProvider
};
