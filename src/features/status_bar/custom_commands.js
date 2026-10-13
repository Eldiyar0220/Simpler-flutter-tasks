const vscode = require('vscode');
const { exec } = require('child_process');
const { CONFIG_SECTION } = require('../../constants');
const { getSetting, updateGlobalSetting } = require('../../utils/config');
const { showTimedNotification } = require('../../utils/notifications');
const { runInTerminal } = require('../../utils/terminal');
const { getWorkspaceRoot } = require('../../utils/workspace');

const GIT_PUSH_MARKER = '--set-upstream origin';
const GIT_COMMIT_MARKER = 'git commit -m';
const GIT_GROUP = 'git';

/** Git menu filled when GIT Helps is turned on. */
const DEFAULT_GIT_HELPS = [
    {
        label: '1 New Branch',
        command: 'git checkout -b',
        enabled: true,
        color: '#FFFF00',
        position: 'left',
        warningDialog: false,
        askerForCommand: true,
    },
    {
        label: '2 Commit',
        command: 'git add . && git commit -m ',
        enabled: true,
        color: '#FFFF00',
        position: 'left',
        warningDialog: false,
        askerForCommand: false,
    },
    {
        label: '3 Rebase [Слияния]',
        command: 'git pull --rebase origin fix/some_branch',
        enabled: true,
        color: '#00fff7',
        position: 'left',
        warningDialog: true,
        askerForCommand: false,
    },
    {
        label: '3 Rebase',
        command: 'git pull --rebase origin DEV',
        enabled: true,
        color: '#FFFF00',
        position: 'left',
        warningDialog: true,
        askerForCommand: false,
    },
    {
        label: '4 Push',
        command: 'git push --set-upstream origin',
        enabled: true,
        color: '#FFFF00',
        position: 'left',
        warningDialog: true,
        askerForCommand: false,
    },
    {
        label: '5 Go to DEV',
        command: 'git checkout DEV && git pull',
        enabled: true,
        color: '#FFFF00',
        position: 'left',
        warningDialog: true,
        askerForCommand: false,
    },
].map(command => ({ ...command, group: GIT_GROUP }));

const DEFAULT_GIT_COMMANDS = new Set(DEFAULT_GIT_HELPS.map(command => command.command.trim()));

/** Default list written to settings.json when the user enables custom commands. */
const DEFAULT_CUSTOM_COMMANDS = [
    {
        label: '----> (pub get)',
        command: 'flutter pub get',
        enabled: true,
        color: '#00ff15',
        position: 'left',
        warningDialog: false,
        askerForCommand: false,
    },
    {
        label: '(build apk) to change open Your Settings.json <-----',
        command: 'flutter build apk',
        enabled: true,
        color: '#00ff15',
        position: 'left',
        warningDialog: false,
        askerForCommand: false,
    },
];

const GIT_MENU_COMMAND = 'flutter-tasks.customGitMenu';
const GROUP_MENU_PREFIX = 'flutter-tasks.customGroup.';
const MENU_ITEM_COMMAND = 'flutter-tasks.runCustomMenuItem';

function escapeMarkdown(text) {
    return String(text).replace(/[\\`*_{}[\]()#+\-.!|<>$]/g, '\\$&');
}

/** Hover of a menu button: every command is a link that runs it right away. */
function menuTooltip(title, members, configs) {
    const markdown = new vscode.MarkdownString(undefined, true);
    markdown.supportHtml = true;
    markdown.isTrusted = { enabledCommands: [MENU_ITEM_COMMAND] };
    markdown.appendMarkdown(`$(folder-opened) **${escapeMarkdown(title)}**\n\n---\n\n`);
    for (const config of members) {
        const args = encodeURIComponent(JSON.stringify([configs.indexOf(config)]));
        const icon = isLinked(config) ? 'link' : isFlagOn(config.warningDialog) ? 'warning' : 'play';
        const hint = describeCommand(config).replace(/\$\([^)]*\)\s*/g, '').replace(/"/g, '\'');
        // VS Code keeps a span style only in this exact order: color; background-color; border-radius.
        const button = '<span style="color:var(--vscode-button-secondaryForeground);background-color:var(--vscode-button-secondaryBackground);border-radius:6px;">'
            + `&nbsp;<span class="codicon codicon-${icon}"></span>&nbsp;${escapeMarkdown(config.label || config.command)}&nbsp;&nbsp;</span>`;
        markdown.appendMarkdown(`[${button}](command:${MENU_ITEM_COMMAND}?${args} "${hint}")\n\n`);
    }
    return markdown;
}

/** Linked to a Status Bar Icon: runs that VS Code command instead of a shell command. */
function isLinked(config) {
    return typeof config.vscodeCommand === 'string' && config.vscodeCommand.startsWith('flutter-tasks.');
}

function customCommandId(config) {
    return isLinked(config) ? config.vscodeCommand : `flutter-tasks.${config.command}`;
}

function isDefaultGitCommand(config) {
    return DEFAULT_GIT_COMMANDS.has(String(config.command || '').trim());
}

/** Member of the GIT Helps menu: group "git", or a default git command saved before groups existed. */
function isGitCommand(config) {
    if (config.group === undefined) {
        return isDefaultGitCommand(config);
    }
    return groupIdOf(config) === GIT_GROUP;
}

/** One-time: older versions put git commands in GIT Helps by their text, so mark the default ones explicitly. */
async function migrateGitGroup(context) {
    const key = `${CONFIG_SECTION}:git-group-migrated`;
    if (context.globalState.get(key)) {
        return;
    }
    const list = getSetting('customCommandsList') || [];
    if (list.some(item => !item.group && isDefaultGitCommand(item))) {
        await updateGlobalSetting('customCommandsList',
            list.map(item => (!item.group && isDefaultGitCommand(item) ? { ...item, group: GIT_GROUP } : item)));
    }
    await context.globalState.update(key, true);
}

function isFlagOn(value) {
    return value === true || value === 'true';
}

function isActiveCustomCommand(config) {
    return isFlagOn(config.enabled) && !isFlagOn(config.archived);
}

function groupIdOf(config) {
    return config.group && String(config.group).trim();
}

/** Custom commands: git → one Git menu, `group` → a category menu, others → own status bar button. */
function registerCustomCommands(context) {
    let disposables = [];
    let configs = [];

    context.subscriptions.push(vscode.commands.registerCommand(MENU_ITEM_COMMAND, index => {
        const config = configs[index];
        if (config) {
            runCustomCommand(config);
        }
    }));

    function createStatusBarItem({ text, command, tooltip, color, position }) {
        const alignment = position === 'right' ? vscode.StatusBarAlignment.Right : vscode.StatusBarAlignment.Left;
        const item = vscode.window.createStatusBarItem(alignment);
        Object.assign(item, { text, command, tooltip, color: getSetting('colorizedCustomCommands') ? color : undefined });
        item.show();
        disposables.push(item);
    }

    function refresh() {
        disposables.forEach(disposable => disposable.dispose());
        disposables = [];

        configs = getSetting('customCommandsList') || [];
        const groups = getSetting('customCommandGroups') || [];
        const knownGroups = new Set(groups.map(group => group.id));
        const gitConfigs = [];
        const grouped = new Map();
        const registered = new Set();

        for (const config of configs) {
            const commandId = customCommandId(config);
            if (!isLinked(config) && !registered.has(commandId)) {
                registered.add(commandId);
                try {
                    disposables.push(vscode.commands.registerCommand(commandId, () => runCustomCommand(config)));
                } catch {
                    // Same id as a built-in command; keep the built-in handler.
                }
            }
            if (!isActiveCustomCommand(config)) {
                continue;
            }
            if (isGitCommand(config)) {
                gitConfigs.push(config);
                continue;
            }
            const groupId = groupIdOf(config);
            if (groupId && knownGroups.has(groupId)) {
                const members = grouped.get(groupId) || [];
                members.push(config);
                grouped.set(groupId, members);
                continue;
            }
            createStatusBarItem({ text: config.label, command: commandId, tooltip: describeCommand(config), color: config.color, position: config.position });
        }

        if (gitConfigs.length > 0 && getSetting('customGitMenuIcon') !== 'hide') {
            try {
                disposables.push(vscode.commands.registerCommand(GIT_MENU_COMMAND, () => showPickMenu('GIT Helps — choose a command', gitConfigs)));
            } catch {
                // Already registered from a previous refresh that did not dispose in time.
            }
            createStatusBarItem({
                text: '$(git-branch) GIT Helps',
                command: GIT_MENU_COMMAND,
                tooltip: menuTooltip('GIT Helps', gitConfigs, configs),
                color: gitConfigs[0].color,
                position: gitConfigs[0].position,
            });
        }

        for (const group of groups) {
            const members = grouped.get(group.id) || [];
            if (members.length === 0 || group.enabled === false) {
                continue;
            }
            const commandId = `${GROUP_MENU_PREFIX}${group.id}`;
            try {
                disposables.push(vscode.commands.registerCommand(commandId, () => showPickMenu(group.label || 'Menu', members)));
            } catch {
                // Already registered from a previous refresh that did not dispose in time.
            }
            createStatusBarItem({
                text: `$(folder) ${group.label || 'Menu'}`,
                command: commandId,
                tooltip: menuTooltip(group.label || 'Menu', members, configs),
                color: group.color,
                position: group.position,
            });
        }
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(`${CONFIG_SECTION}.customCommandsList`)
                || event.affectsConfiguration(`${CONFIG_SECTION}.customCommandGroups`)
                || event.affectsConfiguration(`${CONFIG_SECTION}.customGitMenuIcon`)) {
                refresh();
                showTimedNotification('Updating Custom Commands ✅', 10);
            } else if (event.affectsConfiguration(`${CONFIG_SECTION}.colorizedCustomCommands`)) {
                refresh();
            }
        }),
        { dispose: () => disposables.forEach(disposable => disposable.dispose()) },
    );

    refresh();
    migrateGitGroup(context).catch(error => console.error('Simpler Flutter Tasks: git group migration', error));
}

async function showPickMenu(placeHolder, configs) {
    const items = configs.map(config => ({
        label: config.warningDialog ? `${config.label} $(warning)` : config.label,
        description: describeCommand(config),
        config,
    }));
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder,
        matchOnDescription: true,
    });
    if (selected) {
        runCustomCommand(selected.config);
    }
}

function followUps(config) {
    return (config.then || []).map(value => String(value).trim()).filter(Boolean);
}

/** Main command plus `then` commands, joined so the shell runs them in order. */
function chainedCommand(config, main = config.command) {
    const extra = followUps(config);
    return extra.length > 0 ? `${main} && ${extra.join(' && ')}` : main;
}

function describeCommand(config) {
    return isLinked(config) ? `$(link) ${config.command || config.vscodeCommand}` : chainedCommand(config);
}

async function runCustomCommand(config) {
    if (isLinked(config)) {
        await vscode.commands.executeCommand(config.vscodeCommand);
        return;
    }
    let command = config.command;
    const isGitPush = command.includes(GIT_PUSH_MARKER);
    const isGitCommit = command.includes(GIT_COMMIT_MARKER);
    const editFirst = isFlagOn(config.askerForCommand);
    const confirm = isFlagOn(config.warningDialog);
    const branchName = isGitPush ? await getGitBranch() : undefined;

    if (isGitPush && branchName) {
        command = `${command} ${branchName}`;
    }

    if (editFirst) {
        const prepared = isGitCommit ? `${command} ''` : command;
        const selection = isGitCommit
            ? [prepared.length - 1, prepared.length - 1]
            : isGitPush && branchName
                ? [config.command.length + 1, command.length]
                : [prepared.length + 1, prepared.length + 1];
        const result = await askForCommand(prepared, selection);
        if (result !== undefined) {
            runInTerminal(chainedCommand(config, result), confirm);
        }
        return;
    }

    runInTerminal(chainedCommand(config, command), confirm);
}

function askForCommand(command, valueSelection) {
    return vscode.window.showInputBox({
        value: `${command} `,
        valueSelection,
        placeHolder: 'For example: feature/new_service',
        validateInput: text => (text === '' ? 'Write...' : null),
    });
}

function getGitBranch() {
    return new Promise(resolve => {
        exec('git rev-parse --abbrev-ref HEAD', { cwd: getWorkspaceRoot() }, (error, stdout) => {
            if (error) {
                vscode.window.showErrorMessage('Failed to get Git branch name');
                resolve(undefined);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

module.exports = {
    registerCustomCommands,
    customCommandId,
    isGitCommand,
    isActiveCustomCommand,
    DEFAULT_CUSTOM_COMMANDS,
    DEFAULT_GIT_HELPS,
    GIT_GROUP,
};
