const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Shows a file or folder in the OS file manager.
 * macOS reveals (selects) the item in Finder; Windows and Linux open its folder.
 * Resolves to `true` when the file manager exited successfully.
 */
function revealInFileManager(targetPath) {
    let command;
    let args;
    if (process.platform === 'darwin') {
        command = 'open';
        args = ['-R', targetPath];
    } else {
        const folder = fs.statSync(targetPath).isDirectory() ? targetPath : path.dirname(targetPath);
        command = process.platform === 'win32' ? 'explorer' : 'xdg-open';
        args = [folder];
    }

    return new Promise(resolve => {
        const child = spawn(command, args);
        child.on('error', () => resolve(false));
        child.on('close', code => resolve(code === 0));
    });
}

module.exports = {
    revealInFileManager,
};
