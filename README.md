
<div align="center">
  <h1>Task for Visual Studio Code</h1>
</div>

![simpler-flutter-tasks-commands](images/simpler-flutter-tasks-commands_new.gif)

## Open APk Folder

![simpler-flutter-tasks-commands](images/open_apk_folder.gif)

## Hide / Show Icon

![simpler-flutter-tasks-commands](images/hide_show_icon.gif)

`Copy this json and add to your VsCode settings.json` 

```json
  "SimplerFlutterTasks.flutterCleanIcon": "show",
  "SimplerFlutterTasks.flutterPubGetIcon": "show",
  "SimplerFlutterTasks.buildApkIcon": "show",
  "SimplerFlutterTasks.iosIcon": "show",
  "SimplerFlutterTasks.ipaIcon": "show",
  "SimplerFlutterTasks.buildRunnerIcon": "show",
  "SimplerFlutterTasks.installIcon": "show",
  "SimplerFlutterTasks.openApkIcon": "show",
  "SimplerFlutterTasks.gitPullIcon": "hide",
  "SimplerFlutterTasks.smallApkIcon": "hide",
  "SimplerFlutterTasks.spiderBuildIcon": "hide",
  "SimplerFlutterTasks.easyLocalizationsIcon": "hide",
```

<div align="center">
  <h1>You can add custom Commands</h1>
</div>

![simpler-flutter-tasks-commands](images/custom_commands_v1.gif)

`Create your Custom Commands`  
`copy this json and add to your VsCode settings.json` 
create more commands


- [Icons for Simpler Flutter Tasks](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks)
- [click](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing)

```json
"SimplerFlutterTasks.customCommandsList": [
      {
          "label": "Custom Command 1 (pub get)",
          "command": "flutter pub get",
          "enabled": true,
          "color": "#00ff33"
      },
      {
          "label": "Custom Command 2 (build apk)",
          "command": "flutter build apk",
          "enabled": true,
          "color": "#09eeb5"
      }
    ],
```


### Table of Contents
A set of helpful Flutter and Dart commands for day to day Flutter development.

- [Installation](#installation)
- [Features](#Features)
- [Commands](#Commands)
- [Requirements](#Requirements)
- [Reference](#Reference)

## Installation

- Name of Package - Simpler Flutter tasks -
- [Visual Studio Code | Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks)

## Features

Simply Flutter / Dart commands

I'm working hard to select all the day to day commands, so wait for more commands!.

## Commands

`Flutter related Commands`  

| Flutter quick commands   |    Visibility icons   |
| -------------------------|-----------------------|
| `Flutter clean`          |    default  -  show   |
| `Flutter pub get`        |    default  -  show   |
| `Flutter build apk`      |    default  -  show   |
| `Flutter build ios`      |    default  -  show   |
| `Flutter build ipa`      |    default  -  show   |
| `flutter install`        |    default  -  show   |
| `Build runner`           |    default  -  show   |
| `Open Apk Folder`        |    default  -  show   |
| `Git pull`               |    default  -  hide   |
| `Small Apk`              |    default  -  hide   |
| `Spider Build`           |    default  -  hide   |
| `Easy Localizations`     |    default  -  hide   |


## Release Notes

### 0.2.6
  - Fixed Custom Commands
  - The Command `flutter clean` now work with `flutter pub get`
### 0.2.5
  - Added feature
    - hide / show icon
      - Flutter Clean
      - Flutter Pub get

### 0.2.3-4
  - Custom Commands auto updating, now you don't have to reload the VisualStudio Code

### 0.2.2
  - Новая Фича [new feature]
  - Custom Commands
    - Create your own commands

### 0.2.1
  - New Commands
    - Small Apk:
    - Spider Build:
    - Easy Localizations
      - default value 
        - dart run easy_localization:generate -S assets/langs -O lib/langs
        - dart run easy_localization:generate -S assets/langs -f keys -o locale_keys.g.dart 
        
  - Added Hide / Show Icon
    - flutter clean:
    - flutter pub get:
    - flutter build apk:
    - flutter build ios:
    - flutter build ipa:
    - flutter install:
    - Build runner:
    - Open Apk Folder:
    - Small Apk:
    - Spider Build:
    - Easy Localizations:
  
  - Change Visibility icons in Extension's Settings |Simpler Flutter Tasks|

### 0.2.0

  - Git pull
    - Just Git Pulling
    - adding Beta testing hide or show icon " git pull icon by default is hide "
    - open settings vs code -> search simpler flutter tasks -> there the set hide or show git pull icon
   
### 0.1.9

- Optimized
  - starting commands

### 0.1.8

- Flutter Install
  - installing

### 0.1.6-7

- Fixed bugs with terminal

### 0.1.5

- Build runner:
  - dart run build_runner build --delete-conflicting-outputs
- Open Apk Folder:
  - opening apk folder, if not exists "app-release.apk" -> open |build/outputs|

### 0.1.0

- flutter clean:
  - just cleaning project.
- flutter pub get:
  - get all dependencies 
- flutter build apk:
  - Build for android
- flutter build ios:
  - Build for ios
- flutter build ipa:
  - Build for ipa


### 0.0.1

Initial release


## Requirements

Vscode: ^1.82.0

## Reference

[Simpler Flutter Snippet](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-snippets)

Enjoy !!!! 😉 
