/** Demo GIFs are loaded from the generator repository so they do not bloat this extension. */
const GENERATOR_IMAGES_URL = 'https://raw.githubusercontent.com/Eldiyar0220/Simpler-flutter-generator/main/images';

/** Card of the companion Simpler Flutter Generator extension; drawn by media/settings_panel/generator. */
const GENERATOR_SECTION = {
    id: 'generator',
    title: 'Simpler Flutter Generator',
    icon: '🧩',
    external: true,
    description: 'Interactive settings of the companion extension: Bloc / Cubit, State Widget, folders and assets.',
    links: [
        { page: 'menu', label: 'Simpler Flutter', hint: 'Home screen of the generator with all its tools' },
        { page: 'studio', label: 'Architecture Studio', hint: 'Bloc / Cubit, State Widget and folder structure' },
    ],
    features: [
        {
            text: 'Clean Architecture folders (data / domain / presentation) from a YAML file',
            demo: {
                scene: 'genArchitecture',
                gif: `${GENERATOR_IMAGES_URL}/generator_folders.gif`,
                en: 'Generate Architecture — describe folders and files in simpler_generator_folders.yaml, type a name, and the whole feature (data / domain / presentation) is created.',
                ru: 'Генерация архитектуры — опишите папки и файлы в simpler_generator_folders.yaml, введите имя, и вся фича (data / domain / presentation) создастся сама.',
            },
        },
        { text: 'Bloc / Cubit templates: simple, equatable, freezed' },
        {
            text: 'Assets class generation and unused assets check',
            demo: {
                scene: 'genAssets',
                gif: `${GENERATOR_IMAGES_URL}/generator_image_gii.gif`,
                en: 'Generate Assets — one command collects images, svg, rive and json from your folders into a Dart class with ready paths.',
                ru: 'Генерация ассетов — одна команда собирает картинки, svg, rive и json из папок в Dart-класс с готовыми путями.',
                guide: {
                    title: 'Generate Assets · Мини-урок',
                    steps: [
                        {
                            scene: 'guidePubspec',
                            title: '1. pubspec.yaml',
                            en: 'Add your assets folders to pubspec.yaml so Flutter bundles the files.',
                            ru: 'Добавьте папки с ассетами в pubspec.yaml, чтобы Flutter включил файлы в сборку.',
                        },
                        {
                            scene: 'guideCreateYaml',
                            title: '2. Create simpler_generator_images.yaml',
                            en: 'Right-click any folder → “2) Generate Assets”. There is no config yet, so press “Create File” — it appears in the project root.',
                            ru: 'Правый клик по любой папке → «2) Generate Assets». Конфига ещё нет — нажмите «Create File», файл появится в корне проекта.',
                        },
                        {
                            scene: 'guideConfigure',
                            title: '3. Configure the yaml',
                            en: 'Set path to your folder, class_name, the file types and outputPath — where the Dart class will be written.',
                            ru: 'Укажите path к папке, class_name, нужные types и outputPath — куда записать Dart-класс.',
                        },
                        {
                            scene: 'guidePaths',
                            title: '4. One folder or several / Один путь или несколько',
                            en: 'path can be one folder or a list of folders — all of them go into one class. groups can hold several groups at once, each one becomes its own file: AppSvg → app_svg.dart, AppImages → app_images.dart.',
                            ru: 'path — это одна папка или список папок, все они попадут в один класс. В groups можно держать несколько групп сразу, каждая станет своим файлом: AppSvg → app_svg.dart, AppImages → app_images.dart.',
                        },
                        {
                            scene: 'guideGroups',
                            title: '5. Several groups → pick one / Несколько групп → выбор',
                            en: 'With generateAll: false the dialog shows a button for every class_name in groups — only the one you pick is generated. Set generateAll: true to build all groups at once without asking.',
                            ru: 'При generateAll: false в диалоге появляется кнопка на каждый class_name из groups — генерируется только выбранный. Поставьте generateAll: true, чтобы собрать все группы сразу без вопроса.',
                        },
                        {
                            scene: 'guideGenerate',
                            title: '6. Generate',
                            en: 'Right-click a folder → “2) Generate Assets” again, pick a class — the Dart file appears in outputPath.',
                            ru: 'Снова правый клик → «2) Generate Assets», выберите класс — Dart-файл появится в outputPath.',
                        },
                        {
                            scene: 'guideUse',
                            title: '7. Use it in code',
                            en: 'Use the constants instead of string paths — a typo becomes a compile error, not a crash.',
                            ru: 'Пишите константы вместо строк с путями — опечатка станет ошибкой компиляции, а не падением приложения.',
                        },
                    ],
                },
                options: [
                    {
                        scene: 'genAssetsMultiple',
                        title: 'path: [ … ] — multiple paths',
                        en: 'Several folders in one class: each path gets its own block of constants.',
                        ru: 'Несколько папок в одном классе: у каждого пути свой блок констант.',
                    },
                    {
                        scene: 'genWarnings',
                        title: 'warnings: true',
                        en: 'Marks file names with a space and tells you when no file matches the types.',
                        ru: 'Помечает файлы с пробелом в имени и пишет, если нет ни одного файла нужных типов.',
                    },
                    {
                        note: {
                            en: 'Do not set both options below to true — analyzing the project will take very long!',
                            ru: 'Не включайте обе настройки ниже сразу — анализ проекта займёт очень много времени!',
                        },
                    },
                    {
                        scene: 'genUnusedVariables',
                        title: 'checkUnusedVariables: true',
                        en: 'Searches lib/ for every constant of the class and comments the ones nobody uses.',
                        ru: 'Ищет каждую константу класса в lib/ и помечает комментарием те, что нигде не используются.',
                    },
                    {
                        scene: 'genUnusedAssets',
                        title: 'checkUnusedAssets: true',
                        en: 'Finds files in assets/ that no .dart file mentions and lists them in UNUSED_ASSETS.dart.',
                        ru: 'Находит файлы в assets/, которые не упоминаются ни в одном .dart, и складывает список в UNUSED_ASSETS.dart.',
                    },
                ],
            },
        },
        { text: 'Build Runner with a filter for one folder or file' },
        { text: 'PackageLens: versions of packages right in pubspec.yaml' },
    ],
    controls: [],
};

module.exports = {
    GENERATOR_SECTION,
};
