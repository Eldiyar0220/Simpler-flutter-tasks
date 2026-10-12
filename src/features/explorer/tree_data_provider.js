const vscode = require('vscode');

/**
 * Tree data provider for plain item objects:
 * `{ label, children?, argument?, contextValue?, description?, iconPath?, checkboxState?, collapsibleState? }`.
 * `getRootItems` is called on every refresh, so items always reflect current settings.
 */
class CommandsTreeDataProvider {
    constructor(getRootItems) {
        this.getRootItems = getRootItems;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        const isCategory = Boolean(element.children);
        return {
            label: element.label,
            description: element.description,
            tooltip: isCategory ? element.tooltip : element.argument,
            iconPath: element.iconPath,
            checkboxState: element.checkboxState,
            contextValue: element.contextValue,
            command: element.clickCommand
                ? { command: element.clickCommand, title: element.label, arguments: [element] }
                : undefined,
            collapsibleState: isCategory
                ? element.collapsibleState ?? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None,
        };
    }

    getChildren(element) {
        try {
            const items = element ? element.children || [] : this.getRootItems();
            // Item builders use `condition && item`, so drop the falsy entries.
            return items.filter(Boolean);
        } catch (error) {
            console.error('Simpler Flutter Tasks: tree', error);
            return [{ label: `Error: ${error.message || error}` }];
        }
    }
}

module.exports = {
    CommandsTreeDataProvider,
};
