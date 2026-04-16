
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const { openIosOutPuts } = require('./open_ios_output');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('./loading');

async function buildIOSAndOpenFolder(folderIpa) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;
    if (workspaceFolder) {
        let iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'iphoneos');
        let ipaOripaPath = path.join(workspaceFolder, 'build', 'ios', 'ipa');
        if (fs.existsSync(iosOripaPath) || fs.existsSync(ipaOripaPath)) {
            let openCommand;
            if (folderIpa) {
                if (process.platform === 'darwin') {
                    openCommand = 'open';
                    iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'ipa');
                } else if (process.platform === 'win32') {
                    openCommand = 'explorer';
                    iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'ipa');
                } else {
                    openCommand = 'xdg-open';
                    iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'ipa');
                }
            } else {
                if (process.platform === 'darwin') {
                    openCommand = 'open';
                    iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'iphoneos');
                } else if (process.platform === 'win32') {
                    openCommand = 'explorer';
                    iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'iphoneos');
                } else {
                    openCommand = 'xdg-open';
                    iosOripaPath = path.join(workspaceFolder, 'build', 'ios', 'iphoneos');
                }
            }
            const openProcess = spawn(openCommand ?? 'open', [process.platform === 'darwin' ? ['-R'] : '', iosOripaPath]);
            openProcess.stdout.on('data', (data) => {
                console.log(`stdout here: ${data}`);
            });

            openProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('Opening ✅', 10)
                } else {
                    showInformationWithProgressAndTimeout('Can not Find IOS / IPA ❌', 40)
                    openIosOutPuts()
                }
            });
        } else {
            vscode.window.showInformationMessage('IOS OR IPA not found !! ❌')
            openIosOutPuts()
        }
    }
}

module.exports = {
    buildIOSAndOpenFolder
};
