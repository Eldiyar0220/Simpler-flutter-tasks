
// const vscode = require('vscode');

// const { executeFlutterCommand } = require('../open_terminal');
// const { showInformationWithProgressAndTimeout } = require('../loading');

// function customCommands() {
//     const statusBarItems = {};
//     const registeredCommands = [];

//     function createOrUpdateStatusBarItem(commandConfig) {
//         const commandId = `flutter-tasks.${commandConfig.command}`;
//         const statusBarAlignment = commandConfig.position === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
//         let statusBar = statusBarItems[commandId];

//         if (!statusBar) {
//             statusBar = vscode.window.createStatusBarItem(statusBarAlignment);
//             statusBarItems[commandId] = statusBar;
//         } else if (statusBar.position !== statusBarAlignment) {
//             statusBar.dispose();
//             statusBar = vscode.window.createStatusBarItem(statusBarAlignment);
//             statusBarItems[commandId] = statusBar;
//         }

//         statusBar.text = commandConfig.label;
//         statusBar.command = commandId;
//         statusBar.tooltip = commandConfig.command;
//         statusBar.color = commandConfig.color;

//         if (commandConfig.enabled) {
//             statusBar.show();
//         } else {
//             statusBar.hide();
//         }

//         if (registeredCommands.indexOf(commandId) === -1) {
//             vscode.commands.registerCommand(commandId, () => {
//                 console.log(`check ${commandConfig.warningDialog}`)
//                 console.log(`check ${commandConfig.warningDialog}`)
//                 executeFlutterCommand(commandConfig.command, commandConfig.warningDialog);
//             });
//             registeredCommands.push(commandId);
//         }
//     }

//     const updateStatusBarItems = () => {
//         const customListCommands = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('customCommandsList');

//         for (const commandId in statusBarItems) {
//             const existsInUpdatedConfig = customListCommands.some(cmd => `flutter-tasks.${cmd.command}` === commandId);

//             if (!existsInUpdatedConfig) {
//                 statusBarItems[commandId].dispose();
//                 delete statusBarItems[commandId];
//             }
//         }
//         customListCommands.forEach(updatedCommandConfig => {
//             createOrUpdateStatusBarItem(updatedCommandConfig);
//         });
//     };


//     vscode.workspace.onDidChangeConfiguration(e => {
//         if (e.affectsConfiguration('SimplerFlutterTasks.customCommandsList')) {
//             updateStatusBarItems();
//             showInformationWithProgressAndTimeout(`Updating Custom Commands ✅`, 10)
//         }
//     });

//     // Initial setup
//     updateStatusBarItems();
// }




// module.exports = {
//     customCommands
// }

//----------------------------------------------------------------------------------------------------------------
/// NEW CODE

const vscode = require('vscode');
const path = require('path');
const { exec } = require('child_process');
const { executeFlutterCommand } = require('../open_terminal');
const { showInformationWithProgressAndTimeout } = require('../loading');

function customCommands() {
    const statusBarItems = {};
    const registeredCommands = new Map(); // Map to track registered commands

    function createOrUpdateStatusBarItem(commandConfig) {
        const commandId = `flutter-tasks.${commandConfig.command}`;
        const statusBarAlignment = commandConfig.position === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
        let statusBar = statusBarItems[commandId];

        // Create or update status bar item
        if (!statusBar) {
            statusBar = vscode.window.createStatusBarItem(statusBarAlignment);
            statusBarItems[commandId] = statusBar;
        } else if (statusBar.position !== statusBarAlignment) {
            statusBar.dispose();
            statusBar = vscode.window.createStatusBarItem(statusBarAlignment);
            statusBarItems[commandId] = statusBar;
        }

        statusBar.text = commandConfig.label;
        statusBar.command = commandId;
        statusBar.tooltip = commandConfig.command;
        statusBar.color = commandConfig.color;

        if (commandConfig.enabled) {
            statusBar.show();
        } else {
            statusBar.hide();
        }

        // Re-register the command to ensure updated properties
        if (registeredCommands.has(commandId)) {
            registeredCommands.get(commandId).dispose();
        }

        const disposable = vscode.commands.registerCommand(commandId, async () => {
            // let commandFromConfig = commandConfig.command;
            let commandNew = commandConfig.command;
            const branchName = await getGitBranch();
            let isGitPush = commandNew.includes('--set-upstream origin') && branchName
            let isGitCommit = commandNew.includes('git commit -m') && branchName
            if (isGitPush) {
                commandNew = `${commandNew} ${branchName}`
            }
            if (isGitCommit) {
                commandNew = `${commandNew} ''`
                const result = await vscode.window.showInputBox({
                    value: `${commandNew} `,
                    valueSelection: [commandNew.length - 1, commandNew.length - 1],
                    placeHolder: 'For example: feature/new_service',
                    validateInput: text => {
                        return text === '' ? 'Write...' : null;
                    }
                });
                ;
                if (result !== undefined) {
                    executeFlutterCommand(result, commandConfig.warningDialog);
                }
            } else {
                if (commandConfig.askerForCommand) {
                    const result = await vscode.window.showInputBox({
                        value: `${commandNew} `,
                        valueSelection: isGitPush ? [commandConfig.command.length + 1, commandNew.length] : [commandNew.length + 1, commandNew.length + 1], //auto select
                        placeHolder: 'For example: feature/new_service',
                        // prompt: 'test',
                        validateInput: text => {
                            return text === '' ? 'Write...' : null;
                        }
                    });
                    ;
                    if (result !== undefined) {
                        executeFlutterCommand(result, commandConfig.warningDialog);
                    }
                } else {
                    executeFlutterCommand(commandNew, commandConfig.warningDialog);
                }
            }
        });

        registeredCommands.set(commandId, disposable);
    }

    const updateStatusBarItems = () => {
        const customListCommands = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('customCommandsList');

        // Dispose and remove old status bar items
        for (const commandId in statusBarItems) {
            const existsInUpdatedConfig = customListCommands.some(cmd => `flutter-tasks.${cmd.command}` === commandId);

            if (!existsInUpdatedConfig) {
                statusBarItems[commandId].dispose();
                delete statusBarItems[commandId];

                if (registeredCommands.has(commandId)) {
                    registeredCommands.get(commandId).dispose();
                    registeredCommands.delete(commandId);
                }
            }
        }

        // Update or create new status bar items
        customListCommands.forEach(updatedCommandConfig => {
            createOrUpdateStatusBarItem(updatedCommandConfig);
        });
    };

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('SimplerFlutterTasks.customCommandsList')) {
            updateStatusBarItems();
            showInformationWithProgressAndTimeout(`Updating Custom Commands ✅`, 10);
        }
    });

    // Initial setup
    updateStatusBarItems();
}

function getGitBranch() {
    return new Promise((resolve, reject) => {
        exec('git rev-parse --abbrev-ref HEAD', { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Git command:', error);
                vscode.window.showErrorMessage('Failed to get Git branch name');
                reject(error);
                return;
            }
            resolve(stdout.trim()); // Trim the output to get the branch name
        });
    });
}


module.exports = {
    customCommands
};
