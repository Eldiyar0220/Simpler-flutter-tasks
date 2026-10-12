const vscode = require('vscode');

function getWorkspaceRoot() {
    const folders = vscode.workspace.workspaceFolders;
    return folders && folders.length > 0 ? folders[0].uri.fsPath : undefined;
}

/** Builds a shell command that runs `command` inside `<workspace>/<subdir>` and returns back. */
function inProjectDir(subdir, command) {
    const root = getWorkspaceRoot();
    const cdRoot = root ? `cd "${root}" && ` : '';
    return `${cdRoot}cd ${subdir} && ${command} && cd ..`;
}

module.exports = {
    getWorkspaceRoot,
    inProjectDir,
};
