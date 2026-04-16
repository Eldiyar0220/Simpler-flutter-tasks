
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('./loading');
const { executeFlutterCommand } = require('./open_terminal');
const { openOutPuts } = require('./open_outputs');

function flutterApk() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;

    if (workspaceFolder) {
        const outPuts = path.join(workspaceFolder, 'build', 'app', 'outputs', 'flutter-apk');
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
                console.error(`stderrsss : ${data}`);
                showInformationWithProgressAndTimeout('Does not exists', 40)
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('Opening Outputs', 10)
                } else {
                    showInformationWithProgressAndTimeout('Does not exists', 40)

                }
            });
        } else {
            openOutPuts()

        }
    }
}


module.exports = {
    flutterApk
};