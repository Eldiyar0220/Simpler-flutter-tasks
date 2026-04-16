const vscode = require('vscode')
const { executeFlutterCommand } = require('../open_terminal');
const { MyTreeDataProvider } = require('./items/item_of_commands');
const { MyTreeDataProviderFolder } = require('./items/item_of_data_provider');
const { showInformationWithProgressAndTimeout } = require('../loading');
const { isExtensionInstalled } = require('../check_installed_extension');
const { Uri } = require('vscode');

let plusCopyText = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('treeViewCopyText');
async function mainExplorer(context) {
	let currentCustomCommandList;
	const treeDataProvider = new MyTreeDataProvider(context);
	const treeDataProviderData = new MyTreeDataProviderFolder(context);

	const treeView = vscode.window.createTreeView('flutter-Commands', {
		treeDataProvider: treeDataProvider,
		showCollapseAll: true,
	});

	// view on editors Project ---------------------------------------------------------------------------------
	const registerDataProvider = vscode.window.registerTreeDataProvider('flutterView', treeDataProviderData)
	const refreshSubscription = vscode.commands.registerCommand('flutter-tasks.refreshEntry', () => {
		try {
			treeDataProvider.refresh();
			showInformationWithProgressAndTimeout(`Refreshed ✅`, 10);
		} catch (error) {
			showInformationWithProgressAndTimeout(`Refresh Error ${error}❌`, 10);

		}
	});
	// view on editors Project ----------------------------------------------------------------------------------
	const disposable = treeView.onDidChangeSelection(async (event) => {

		const selection = event.selection[0];
		if (selection) {
			const selectedCommand = selection.argument;
			if (selectedCommand && plusCopyText) {
				// * ---> Copy 
				await vscode.env.clipboard.writeText(selectedCommand);
				showInformationWithProgressAndTimeout(`Copied: ${selectedCommand} ✅`, 10);
			}

		}
	});

	vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('SimplerFlutterTasks.flutterCleanIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.flutterPubGetIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.buildApkIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.iosIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.ipaIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.buildRunnerIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.installIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.openApkIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.gitPullIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.openIosIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.openIpaIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.smallApkIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.spiderBuildIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationsIcon') ||
			event.affectsConfiguration('SimplerFlutterTasks.treeViewCopyText') ||
			event.affectsConfiguration('SimplerFlutterSnippets.WrapperOnMenu') ||
			event.affectsConfiguration('SimplerFlutterGenerator.createStateWidget') ||
			event.affectsConfiguration('bloc.newBlocTemplate.type') ||
			event.affectsConfiguration('bloc.newCubitTemplate.type') ||
			event.affectsConfiguration('SimplerFlutterGenerator.stateWidget') ||
			event.affectsConfiguration('SimplerFlutterSnippets.Wrappers') ||
			event.affectsConfiguration('SimplerFlutterSnippets.ValueListenableBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.FutureBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.StateFullBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.TweenBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.StreamBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.SingleChildScrollViewBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.AnimatedBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.WrapperStack') ||
			event.affectsConfiguration('SimplerFlutterSnippets.CubitBuilder') ||
			event.affectsConfiguration('SimplerFlutterSnippets.CubitConsumer') ||
			event.affectsConfiguration('SimplerFlutterSnippets.removeThisWidget') ||
			event.affectsConfiguration('SimplerFlutterTasks.createNewTerminal') ||
			event.affectsConfiguration('SimplerFlutterTasks.colorized') ||
			event.affectsConfiguration('SimplerFlutterTasks.buildRunnerCategoryExpandable') ||
			event.affectsConfiguration('SimplerFlutterTasks.flutterCategoryExpandable') ||
			event.affectsConfiguration('SimplerFlutterTasks.androidCategoryExpandable') ||
			event.affectsConfiguration('SimplerFlutterTasks.iosCategoryExpandable') ||
			event.affectsConfiguration('SimplerFlutterTasks.gitCategoryExpandable') ||
			event.affectsConfiguration('SimplerFlutterTasks.flutterFlavor') ||
			event.affectsConfiguration('SimplerFlutterTasks.customCommandsList')
		) {
			plusCopyText = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('treeViewCopyText');
			treeDataProvider.refresh()
		}

	});
	vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationFirst') ||
			event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationSecond')
		) {
			vscode.commands.executeCommand('flutter-tasks.refreshEntry');
		}
	});

	const editLocaleSubscription = vscode.commands.registerCommand('flutter-tasks.editLocale', async (item) => {
		const newStartCommand = await vscode.window.showInputBox({
			placeHolder: 'Edit Start Command',
			value: item.argument,
		});
		if (newStartCommand !== undefined) {
			treeDataProvider.refresh();
			item.settingsConfig.update(item.config, newStartCommand, vscode.ConfigurationTarget.Global);
			vscode.commands.executeCommand('flutter-tasks.refreshEntry');
		}
	});

	treeView.onDidChangeCheckboxState(async event => {
		const checkInstalled = event.items[0][0].checkInstalled;
		try {
			if (checkInstalled) {
				if (!isExtensionInstalled(checkInstalled)) {
					const options = {
						modal: true,
					};
					const selectedButton = await vscode.window.showInformationMessage(`Install ${checkName(checkInstalled)} ✅?`, options, 'Install');
					if (selectedButton === 'Install') {
						await vscode.commands.executeCommand('workbench.extensions.installExtension', checkInstalled);
					}
				}
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}


		try {
			//* const eventString = JSON.stringify(event);
			const checkboxState = event.items[0][1];
			const label = event.items[0][0].config;
			const blocTypeUse = event.items[0][0].blocTypeUse ?? undefined;
			const settingsConfig = event.items[0][0].settingsConfig ?? vscode.workspace.getConfiguration('SimplerFlutterTasks');
			const checkBool = event.items[0][0].bool ?? false;
			const customCommands = event.items[0][0].customCommands ?? undefined;
			const shouldUndefined = customCommands === undefined && blocTypeUse === undefined


			if (label && checkBool && shouldUndefined) {
				if (checkboxState === 1) {
					settingsConfig.update(label, true, vscode.ConfigurationTarget.Global);
				} else if (checkboxState === 0) {
					settingsConfig.update(label, false, vscode.ConfigurationTarget.Global);
				} else {
					showInformationWithProgressAndTimeout(`Checkbox is in another state`, 20);
				}
			} else if (label === undefined) {
				showInformationWithProgressAndTimeout(`Error: something wrong ❌`, 20);
			}
			if (label && !checkBool && shouldUndefined) {
				if (checkboxState === 1) {
					settingsConfig.update(label, 'show', vscode.ConfigurationTarget.Global);
				} else if (checkboxState === 0) {
					settingsConfig.update(label, 'hide', vscode.ConfigurationTarget.Global);
				} else {
					showInformationWithProgressAndTimeout(`Checkbox is in another state`, 20);
				}
			} else if (label === undefined) {
				showInformationWithProgressAndTimeout(`Error: something wrong ❌`, 20);
			}
			if (label && checkBool && blocTypeUse) {
				if (checkboxState === 1) {
					settingsConfig.update(label, blocTypeUse, vscode.ConfigurationTarget.Global);
				} else if (checkboxState === 0) {
					settingsConfig.update(label, blocTypeUse, vscode.ConfigurationTarget.Global);
				} else {
					showInformationWithProgressAndTimeout(`Checkbox is in another state`, 20);
				}
			} else if (label === undefined) {
				showInformationWithProgressAndTimeout(`Error: something wrong ❌`, 20);
			}
			//* Custom Commands
			if (customCommands) {
				const getCurrentList = currentCustomCommandList !== undefined && currentCustomCommandList.length !== 0 ? currentCustomCommandList : defaultCustomCommandsList
				if (checkboxState === 1) {
					currentCustomCommandList = undefined
					await vscode.commands.executeCommand('workbench.action.openSettingsJson');
					settingsConfig.update(label, getCurrentList, vscode.ConfigurationTarget.Global);
				} else if (checkboxState === 0) {
					const config = vscode.workspace.getConfiguration('SimplerFlutterTasks');
					const customCommandsLists = config.get('customCommandsList');
					currentCustomCommandList = customCommandsLists
					settingsConfig.update(label, [], vscode.ConfigurationTarget.Global);
				} else {
					showInformationWithProgressAndTimeout(`Checkbox is in another state`, 20);
				}
			}
		} catch (error) {
			showInformationWithProgressAndTimeout(`Checkbox is unchecked ${error} ❌`, 20);
		}
	});

	//* Custom Commands SimplerFlutterTasks
	const customCommandsSubscription = vscode.commands.registerCommand('flutter-tasks.activateCustomCommands', async () => {
		try {
			await vscode.commands.executeCommand('workbench.action.openSettingsJson');
			const config = vscode.workspace.getConfiguration('SimplerFlutterTasks');
			const customCommandsList = config.get('customCommandsList');

			if (customCommandsList.length === 0 || currentCustomCommandList !== undefined && currentCustomCommandList.length !== 0) {
				const getCurrentList = currentCustomCommandList !== undefined && currentCustomCommandList.length !== 0 ? currentCustomCommandList : defaultCustomCommandsList
				await config.update('customCommandsList', getCurrentList, vscode.ConfigurationTarget.Global);
			} else {
				vscode.window.showInformationMessage('You are already using Custom Commands ✅')
			}
		} catch (error) {
			vscode.window.showErrorMessage(error)
		}
	});


	//* explorer menu
	const copyTheCommandSubscription = vscode.commands.registerCommand('flutter-tasks.copyTheCommand', async (context) => {
		if (context.argument !== undefined) {
			const command = context.argument;
			await vscode.env.clipboard.writeText(command);
			showInformationWithProgressAndTimeout(`Copied ✅`, 10);
		}
	});

	//* explorer menu
	const runCommandsSubscription = vscode.commands.registerCommand('flutter-tasks.runTheCommand', (context) => {
		if (context.argument !== undefined) {
			const command = context.argument;
			executeFlutterCommand(command)
			showInformationWithProgressAndTimeout(`Running: ${command} ✅`, 40);
		}
	});

	//* flutter screenShot
	const screenShotSubscription = vscode.commands.registerCommand('flutter-tasks.screenShot', (context) => {
		if (context.argument !== undefined) {
			const command = context.argument;
			executeFlutterCommand(command)
			showInformationWithProgressAndTimeout(`Running: ${command} ✅`, 40);
		}
	});

	//* flutter doctor
	const doctorSubscription = vscode.commands.registerCommand('flutter-tasks.doctor', (context) => {
		if (context.argument !== undefined) {
			const command = context.argument;
			executeFlutterCommand(command)
			showInformationWithProgressAndTimeout(`Running: ${command} ✅`, 40);
		}
	});

	//* new Idea
	const newIdeaSubscription = vscode.commands.registerCommand('flutter-tasks.newIdea', (context) => {
		vscode.env.openExternal(Uri.parse("https://www.instagram.com/bolotov_0220/"));
	});


	//* subscriptions
	context.subscriptions.push(treeView);
	context.subscriptions.push(disposable);
	context.subscriptions.push(registerDataProvider);
	context.subscriptions.push(refreshSubscription);
	context.subscriptions.push(editLocaleSubscription);
	context.subscriptions.push(customCommandsSubscription);
	context.subscriptions.push(copyTheCommandSubscription);
	context.subscriptions.push(runCommandsSubscription);
	context.subscriptions.push(screenShotSubscription);
	context.subscriptions.push(doctorSubscription);
	context.subscriptions.push(newIdeaSubscription);
}

//* Array.isArray(customCommandsList)
const defaultCustomCommandsList = [
	// Нou can create a lot of Custom Commands until it fits 
	{
		"label": "----> (pub get)",          // Change label 
		"command": "flutter pub get",       // write your any Commands
		"enabled": true,                   // Change visibility
		"color": "#00ff15",               // Change Color
		"position": "left",				 // Change position
		"warningDialog": false,			// show confirm start the command
		"askerForCommand": false	   // asking alert from user

	},
	{
		"label": "(build apk) to change open Your Settings.json <-----",
		"command": "flutter build apk",
		"enabled": true,
		"color": "#00ff15",
		"position": "left",
		"warningDialog": false,
		"askerForCommand": false
	},
];



module.exports = {
	mainExplorer
}



function checkName(name) {
	if (name === 'Eldiyar-Dev.simpler-flutter-snippets') {
		return 'Simpler Flutter Snippets'
	} else {
		return 'Simpler FLutter Generator'
	}

}