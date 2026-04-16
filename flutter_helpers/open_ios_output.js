
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('./loading');
const { executeFlutterCommand } = require('./open_terminal');

function openIosOutPuts() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;
    if (workspaceFolder) {
        const outPuts = path.join(workspaceFolder, 'build', 'ios');
        if (fs.existsSync(outPuts)) {
            let openCommand;
            if (process.platform === 'darwin') {
                openCommand = 'open';
            } else if (process.platform === 'win32') {
                openCommand = 'explorer';
            } else {
                openCommand = 'xdg-open';
            }

            const openProcess = spawn(openCommand, [process.platform === 'darwin' ? ['-R'] : '', outPuts]);
            openProcess.stdout.on('data', (data) => {
                console.log(`stdout here: ${data}`);
            });

            openProcess.stderr.on('data', (data) => {
                showInformationWithProgressAndTimeout('Does not exists', 40)
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('Opening IOS Outputs', 10)
                } else {
                    showInformationWithProgressAndTimeout('Does not exists', 40)

                }
            });
        } else {
            const options = {
                modal: false,
            };
            vscode.window.showInformationMessage('IOS/IPA Folder does not exists !!!!!!', options, 'Build IOS', 'Build IPA')
                .then((selectedButton) => {
                    if (selectedButton === 'Build IOS') {
                        executeFlutterCommand('flutter build ios')
                    } else if (selectedButton === 'Build IPA') {
                        executeFlutterCommand('flutter build ipa')
                    }
                });

        }
    }
}


module.exports = {
    openIosOutPuts
};