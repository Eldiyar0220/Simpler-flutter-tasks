const EXTENSION_ID = 'Eldiyar-Dev.simpler-flutter-tasks';
const SNIPPETS_EXTENSION_ID = 'Eldiyar-Dev.simpler-flutter-snippets';
const GENERATOR_EXTENSION_ID = 'Eldiyar-Dev.simpler-flutter-generator';

const COMPANION_EXTENSIONS = {
    [SNIPPETS_EXTENSION_ID]: 'Simpler Flutter Snippets',
    [GENERATOR_EXTENSION_ID]: 'Simpler Flutter Generator',
};

const CONFIG_SECTION = 'SimplerFlutterTasks';
const SNIPPETS_CONFIG_SECTION = 'SimplerFlutterSnippets';
const GENERATOR_CONFIG_SECTION = 'SimplerFlutterGenerator';
const BLOC_CONFIG_SECTION = 'bloc';

const MARKETPLACE_URL = `https://marketplace.visualstudio.com/items?itemName=${EXTENSION_ID}`;
const CHANGELOG_URL = `https://marketplace.visualstudio.com/items/${EXTENSION_ID}/changelog`;

module.exports = {
    EXTENSION_ID,
    SNIPPETS_EXTENSION_ID,
    GENERATOR_EXTENSION_ID,
    COMPANION_EXTENSIONS,
    CONFIG_SECTION,
    SNIPPETS_CONFIG_SECTION,
    GENERATOR_CONFIG_SECTION,
    BLOC_CONFIG_SECTION,
    MARKETPLACE_URL,
    CHANGELOG_URL,
};
