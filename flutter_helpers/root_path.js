

const vscode = require("vscode");
const path = require('path');

module.exports = {
    join: process.platform === 'win32' ? path.win32.join : path.posix.join,
    normalize: process.platform === 'win32' ? path.win32.normalize : path.posix.normalize,
    parse: process.platform === 'win32' ? path.win32.parse : path.posix.parse,
    resolve: process.platform === 'win32' ? path.win32.resolve : path.posix.resolve,
    extname: process.platform === 'win32' ? path.win32.extname : path.posix.extname,
    sep: process.platform === 'win32' ? path.win32.sep : path.posix.sep,
    rootPath: vscode.workspace.workspaceFolders[0].uri.fsPath,
};
