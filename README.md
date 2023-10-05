<div align="center">
  <h1>Task for Visual Studio Code</h1>
</div>


![simpler-flutter-tasks-commands](images/simpler-flutter-tasks-commands_new.gif)

<div align="center">
  <h1>Open Apk Folder</h1>
</div>

![simpler-flutter-tasks-commands](images/open_apk_folder.gif)

<div align="center">
  <h1>Hide / Show Icon</h1>
</div>

![simpler-flutter-tasks-commands](images/hide_show_icon.gif)

<div align="center">
  <h1>You can add custom Commands</h1>
</div>

![simpler-flutter-tasks-commands](images/custom_commands_v1.gif)

`Create your Custom Commands`  
`copy this json and add to your settings.json` 

```json
"SimplerFlutterTasks.customCommandsList": [
        {
            "label": "Custom Commands $(pulse)-$(notebook-delete-cell)",
            "command": "flutter install",
            "enabled": true,
            "color": "yellow"
        },
        {
            "label": "Pub get $(smiley)",
            "command": "flutter pub get",
            "enabled": true,
            "color": "red"
        }
    ],
```


### -
A set of helpful Flutter and Dart commands for day to day Flutter development.

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



## Release Notes

### 0.2.2
  - New Фича
  - Custom Commands
    - Create your own commands

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


Enjoy !!!! 😉 
