
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('./loading');
const { executeFlutterCommand } = require('./open_terminal');

async function buildAppBundleAndOpenFolder() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;
    if (workspaceFolder) {
        let apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'bundle', 'release', 'app-release.aab');
        if (fs.existsSync(apkPath)) {
            let openCommand;
            if (process.platform === 'darwin') {
                openCommand = 'open';
                apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'bundle', 'release', 'app-release.aab');
            } else if (process.platform === 'win32') {
                openCommand = 'explorer';
                apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'bundle', 'release');
            } else {
                openCommand = 'xdg-open';
                apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'bundle', 'release');
            }


            const openProcess = spawn(openCommand ?? 'open', [process.platform === 'darwin' ? ['-R'] : '', apkPath]);
            openProcess.stdout.on('data', (data) => {
                console.log(`stdout here: ${data}`);
            });

            openProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('Opening', 10)
                } else {
                    showInformationWithProgressAndTimeout('Can not Find bundle', 40)
                    openOutPutsBundle()
                }
            });
        } else {
            vscode.window.showInformationMessage('App Bundle not found !!')
            openOutPutsBundle()
        }
    }
}


function openOutPutsBundle() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;

    if (workspaceFolder) {
        const outPuts = path.join(workspaceFolder, 'build', 'app', 'outputs', 'bundle', 'release');
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
                    showInformationWithProgressAndTimeout('Opening Release Outputs', 10)
                } else {
                    showInformationWithProgressAndTimeout('Does not exists', 40)

                }
            });
        } else {
            const options = {
                modal: false,
            };
            vscode.window.showInformationMessage('Bundle does not exists !!!!!!', options, 'Build Release')
                .then((selectedButton) => {
                    if (selectedButton === 'Build Release') {
                        executeFlutterCommand('flutter build appbundle')
                    }
                });

        }
    }
}



module.exports = {
    buildAppBundleAndOpenFolder
}