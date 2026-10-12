const { androidItems } = require('./android');
const { buildRunnerItems } = require('./build_runner');
const { firebaseItems } = require('./firebase');
const { flutterItems } = require('./flutter');
const { gitItems } = require('./git');
const { iosItems } = require('./ios');
const { openSettingsPanelItem, settingsItems } = require('./settings');

/** Root items of the "Simpler Flutter Tasks" activity bar view. */
function commandsViewItems(context) {
    return [
        openSettingsPanelItem(context),
        buildRunnerItems(context),
        flutterItems(context),
        androidItems(context),
        iosItems(context),
        gitItems(context),
        settingsItems(context),
        firebaseItems(context),
    ];
}

/** Root items of the smaller view inside the Explorer sidebar. */
function explorerViewItems(context) {
    return [
        buildRunnerItems(context),
        flutterItems(context),
        androidItems(context, true),
        iosItems(context, true),
        gitItems(context),
    ];
}

module.exports = {
    commandsViewItems,
    explorerViewItems,
};
