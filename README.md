<div align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks">
    <img src="images/vscode.png"/>
  </a>

  <h1>Task for Visual Studio Code</h1>
</div>


![simpler-flutter-tasks-commands](images/simpler-flutter-tasks-commands_new.gif)
![simpler-flutter-tasks-commands](images/open_apk_folder.gif)
____________----------------____________----------------__________
![simpler-flutter-tasks-commands](images/ezgif.com-video-to-gif.gif)

## -
A set of helpful Flutter and Dart commands for day to day Flutter development.
<img width="1237" alt="Снимок экрана 2023-10-03 в 23 35 48" src="https://github.com/Eldiyar0220/simpler-flutter-tasks/assets/84560520/28dd11d3-442f-4a9d-ab78-91111a669042">

## Installation

- Name of Package - Simpler Flutter tasks -
- [Visual Studio Code | Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-tasks)

## Features

Simply Flutter / Dart commands

I'm working hard to select all the day to day widgets, so wait for more commands!.

### Flutter / Dart related Commands

| Flutter quick commands   |    Visibility icons   |
| -------------------------|-----------------------|
| `Flutter clean`          |    Always   -  show   |
| `Flutter pub get`        |    Always   -  show   |
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


in Feature -> planning

|  Commands by Folder         |    Visibility icons   |    Visibility icons   |
| ----------------------------|-----------------------|-----------------------|
| `Build APk`                 |    default  -  hide   |    default  -  hide   |
|  -`flutter build apk`       |    default  -  hide   |    default  -  hide   |
|  -`flutter build appbundle` |    default  -  hide   |    default  -  hide   |
|  -`build apk and open apk`  |    default  -  hide   |    default  -  hide   |
| `ios`                       |    default  -  hide   |    default  -  hide   |
|  -`build ios`               |    default  -  hide   |    default  -  hide   |
|  -`build ipa`               |    default  -  hide   |    default  -  hide   |
|  -`open Ios folder`         |    default  -  hide   |    default  -  hide   |
|  -`open Ipa folder`         |    default  -  hide   |    default  -  hide   |


## Release Notes

### 0.2.1
  - New Commands
    - Small Apk:
    - Spider Build:
    - Easy Localizations(default value)
      - dart run easy_localization:generate -S assets/langs -O lib/langs
      - dart run easy_localization:generate -S assets/langs -f keys -o locale_keys.g.dart
        - You can change in extension's settings

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
  
  - change Visibility icons in Extension's Settings |Simpler Flutter Tasks|

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
