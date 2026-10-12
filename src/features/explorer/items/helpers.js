const vscode = require('vscode');
const path = require('path');
const { getSetting } = require('../../../utils/config');

/**
 * `contextValue` of tree items. They are referenced from the "view/item/context"
 * menus in package.json, so keep both in sync.
 */
const CONTEXT = {
    command: 'child',
    doctor: 'doctor',
    screenshot: 'screenShot',
    copyOnly: 'copyOnly',
    openBuild: 'openBuild',
    setting: 'settings',
    easyLocale: 'easyLocale',
    customCommands: 'customCommands',
};

function icon(context, fileName) {
    return vscode.Uri.file(context.asAbsolutePath(path.join('assets', 'icons', fileName)));
}

/** A runnable item: `argument` is the shell command that is run or copied. */
function command(label, argument, extra = {}) {
    return { label, argument, contextValue: CONTEXT.command, ...extra };
}

/** An item that can only be copied, not run (commands with placeholders, dangerous commands). */
function copyOnly(label, argument, extra = {}) {
    return { label, argument, contextValue: CONTEXT.copyOnly, ...extra };
}

/** A non-interactive divider line. */
function header(label) {
    return { label, contextValue: CONTEXT.copyOnly };
}

/** Finds built APK / AAB (android) or IPA / .app (ios) and reveals it. Runs on click. */
function openBuild(platform, description) {
    return {
        label: '📦 Open Build',
        description,
        platform,
        contextValue: CONTEXT.openBuild,
        clickCommand: 'flutter-tasks.openBuild',
    };
}

/** Collapsed state of a category, controlled by a "<name>CategoryExpandable" setting. */
function categoryState(settingKey, forceExpanded = false) {
    return forceExpanded || getSetting(settingKey)
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.Collapsed;
}

module.exports = {
    CONTEXT,
    icon,
    command,
    copyOnly,
    header,
    openBuild,
    categoryState,
};
