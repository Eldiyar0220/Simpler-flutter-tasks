// const vscode = require('vscode');
// const { showInformationWithProgressAndTimeout } = require('../loading');
// const { executeFlutterCommand } = require('../open_terminal');
// const { openApkFlavor } = require('./open_apk_flavor');
// const { openAppBundleFlavor } = require('./open_app_bundle');

// function flavorFunc(context) {
//     vscode.commands.registerTextEditorCommand('flutter-tasks.activateFlavor', () => {
//         vscode.commands.executeCommand('flutter-tasks.flavor');
//     });

//     vscode.commands.registerCommand('flutter-tasks.flavor', async () => {
//         const configHere = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('Flavors');
//         let flutterFlavors = configHere.flavors || [];
//         const path = configHere.path || 'lib/main';

//         const envs = flutterFlavors.map(flavor => flavor.title);
//         const packages = flutterFlavors.map(flavor => flavor.package);

//         if (flutterFlavors.length > 0) {
//             const options = { detail: 'Выберите команду', modal: true };

//             vscode.window.showQuickPick(envs, options).then(async (selectedEnv) => {
//                 if (selectedEnv) {
//                     const selectedIndex = envs.indexOf(selectedEnv);
//                     const selectedPackage = packages[selectedIndex];
//                     selectedENV(selectedEnv, options, context, selectedPackage, path);
//                 }
//             });
//         } else {
//             vscode.commands.executeCommand('workbench.action.openSettingsJson');
//             config.update('Flavors', defaultFlavors, vscode.ConfigurationTarget.Global);
//         }
//     });
// }

// const defaultFlavors = {
//     path: 'lib/main',
//     flavors: [
//         { title: "prod", package: "com_packages_of_your_app" },
//         { title: "staging", package: "com_packages_of_your_app" },
//         { title: "dev", package: "com_packages_of_your_app" }
//     ],
// };

// function selectedENV(flavor, options, context, selectedPackage, path) {
//     const flavorCommands = generateFlutterCommands(flavor, context, selectedPackage, path);

//     const items = flavorCommands.map(model => {
//         if (model.kind) return model; // separator
//         return {
//             label: model.label,
//             command: model.command,
//             description: model.command
//         };
//     });

//     const onlyInstall = generateFlutterCommandsOnlyInstall(flavor, context, selectedPackage, path);

//     const onlyInstallCommand = onlyInstall.map(model => {
//         if (model.kind) return model;
//         return {
//             label: model.label,
//             command: model.command,
//             description: model.command
//         };
//     });

//     const optionsA = {
//         detail: 'Выберите команду',
//         modal: true,
//         placeHolder: flavor.toUpperCase()
//     };

//     function showQuickPick(onlyInstallMode) {
//         vscode.window.showQuickPick(
//             onlyInstallMode ? onlyInstallCommand : items,
//             optionsA
//         ).then((selectedItem) => {
//             if (selectedItem) {

//                 if (selectedItem.label === 'Open APK ->') {
//                     openApkFlavor(selectedItem.command);

//                 } else if (selectedItem.label === 'Open bundle ->') {
//                     openAppBundleFlavor(selectedItem.command);

//                 } else if (selectedItem.label === 'Delete Apk') {
//                     executeFlutterCommand(selectedItem.command);
//                     setTimeout(() => showQuickPick(true), 100);

//                 } else {
//                     executeFlutterCommand(selectedItem.command);
//                 }

//                 showInformationWithProgressAndTimeout(`Starting ${selectedItem.label} ✅`, 15);
//             }
//         });
//     }

//     showQuickPick(false);
// }

// function generateFlutterCommands(flavor, context, selectedPackage, path) {
//     const { QuickPickItemKind } = require('vscode');

//     let commands = [

//         // 🤖 Android
//         { label: 'Android', kind: QuickPickItemKind.Separator },

//         { label: 'Build APK ->', command: `flutter build apk --flavor ${flavor} -t ${path}_${flavor}.dart` },

//         // 🍎 iOS
//         { label: 'iOS', kind: QuickPickItemKind.Separator },

//         { label: 'Build IOS ->', command: `flutter build ios --flavor ${flavor}` },
//         { label: 'Build IPA ->', command: `flutter build ipa --flavor ${flavor}` },
//         { label: '', kind: QuickPickItemKind.Separator },

//     ];

//     if (
//         flavor === 'prod' ||
//         flavor === 'Prod' ||
//         flavor === 'production' ||
//         flavor === 'Production'
//     ) {
//         commands.push(
//             { label: 'Build bundle ->', command: `flutter build appbundle --flavor ${flavor} -t ${path}_${flavor}.dart` },
//             { label: 'Open bundle ->', command: flavor.toUpperCase() },
//         );
//     }

//     commands.push(
//         { label: 'Open APK ->', command: flavor.toUpperCase() },
//         { label: 'Flutter Run ->', command: `flutter run --release --flavor ${flavor} -t ${path}_${flavor}.dart` },
//         { label: 'Flutter Install $(star-full) ->', command: `adb install build/app/outputs/flutter-apk/app-${flavor}-release.apk` },
//         { label: 'Delete Apk', command: `adb uninstall ${selectedPackage}` },
//     );

//     return commands;
// }

// function generateFlutterCommandsOnlyInstall(flavor, context, selectedPackage, path) {
//     const { QuickPickItemKind } = require('vscode');

//     let commands = [
//         // 🤖 Android (install only)
//         { label: 'Android', kind: QuickPickItemKind.Separator },

//         { label: 'Flutter Install $(star-full) ->', command: `adb install build/app/outputs/flutter-apk/app-${flavor}-release.apk` },
//         { label: 'Build APK ->', command: `flutter build apk --flavor ${flavor} -t ${path}_${flavor}.dart` },
//     ];

//     if (
//         flavor === 'prod' ||
//         flavor === 'Prod' ||
//         flavor === 'production' ||
//         flavor === 'Production'
//     ) {
//         commands.push(
//             { label: 'Build bundle ->', command: `flutter build appbundle --flavor ${flavor} -t ${path}_${flavor}.dart` },
//             { label: 'Open bundle ->', command: flavor.toUpperCase() },
//         );
//     }

//     commands.push(
//         { label: 'Open APK ->', command: flavor.toUpperCase() },
//     );

//     return commands;
// }

// module.exports = {
//     flavorFunc
// };