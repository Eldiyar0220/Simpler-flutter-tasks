const vscode = require('vscode');
const crypto = require('crypto');
const { CONFIG_SECTION } = require('../../constants');
const { getSetting, updateGlobalSetting, userSettingsUri } = require('../../utils/config');
const { DEFAULT_CUSTOM_COMMANDS, DEFAULT_GIT_HELPS, isGitCommand } = require('../status_bar/custom_commands');
const { STATUS_BAR_ITEMS } = require('../status_bar/status_bar_items');
const { buildPanelState, findControl, toStoredValue, panelSettingKeys } = require('./settings_schema');
const { revealUserSettingsJson } = require('../settings_json');
const { sanitizeFlavorConfig } = require('../flavor');

const EXPORT_KIND = 1;
const EXTRA_EXPORT_KEYS = ['customCommandsList', 'customCommandGroups', 'statusBarColors', 'Flavors'];

const OPEN_COMMAND = 'flutter-tasks.openSettingsPanel';
const VIEW_TYPE = 'simplerFlutterTasks.settings';
const CUSTOM_COMMAND_FIELDS = ['label', 'command', 'enabled', 'archived', 'color', 'position', 'warningDialog', 'askerForCommand', 'group'];
const BOOLEAN_FIELDS = new Set(['enabled', 'archived', 'warningDialog', 'askerForCommand']);

let currentPanel;
let pendingFocusSection;
function registerSettingsPanel(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand(OPEN_COMMAND, item => openSettingsPanel(context, item)),
    );
}

function openSettingsPanel(context, item) {
    const section = item && item.section;
    if (currentPanel) {
        currentPanel.reveal();
        if (section) {
            currentPanel.webview.postMessage({ type: 'focusSection', id: section });
        }
        return;
    }

    const mediaRoot = vscode.Uri.joinPath(context.extensionUri, 'media', 'settings_panel');
    const imagesRoot = vscode.Uri.joinPath(context.extensionUri, 'images');
    const iconsRoot = vscode.Uri.joinPath(context.extensionUri, 'assets', 'icons');
    const panel = vscode.window.createWebviewPanel(VIEW_TYPE, 'Flutter Tasks Settings', vscode.ViewColumn.Active, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [mediaRoot, imagesRoot, iconsRoot],
    });
    currentPanel = panel;
    pendingFocusSection = section;
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'icons', 'main_settings_icon.gif');

    const webview = panel.webview;
    webview.html = renderHtml(webview, mediaRoot, imagesRoot, iconsRoot);

    const postState = () => webview.postMessage({ type: 'state', state: buildPanelState() });

    const disposables = [
        webview.onDidReceiveMessage(message => handleMessage(message, postState, webview)),
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(CONFIG_SECTION)) {
                postState();
            }
        }),
    ];

    panel.onDidDispose(() => {
        currentPanel = undefined;
        pendingFocusSection = undefined;
        disposables.forEach(disposable => disposable.dispose());
    }, null, context.subscriptions);
}

async function handleMessage(message, postState, webview) {
    try {
        switch (message.type) {
            case 'ready':
                await ensureGitHelps();
                postState();
                if (pendingFocusSection) {
                    webview.postMessage({ type: 'focusSection', id: pendingFocusSection });
                    pendingFocusSection = undefined;
                }
                break;
            case 'set':
                await setControlValue(message.key, message.value);
                break;
            case 'setStatusBarColor':
                await setStatusBarColor(message.setting, message.color);
                break;
            case 'customCommands':
                await updateGlobalSetting('customCommandsList', sanitizeCustomCommands(message.list));
                if (message.groups) {
                    await updateGlobalSetting('customCommandGroups', sanitizeGroups(message.groups));
                }
                break;
            case 'defaultCustomCommands':
                await updateGlobalSetting('customCommandsList', DEFAULT_CUSTOM_COMMANDS);
                break;
            case 'openSettingsJson':
                setTimeout(() => { void revealUserSettingsJson(); }, 0);
                break;
            case 'exportSettings':
                await exportPanelSettings();
                break;
            // TODO: EXPORT ALL JSON SETTINGS — show hero buttons when ready
            case 'exportSettingsJson':
                await exportUserSettingsJson();
                break;
            case 'importSettingsJson':
                await importUserSettingsJson();
                postState();
                break;
            case 'importSettings':
                await importPanelSettings();
                postState();
                break;
            case 'flavors':
                await updateGlobalSetting('Flavors', sanitizeFlavorConfig(message.value));
                break;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Settings: ${error.message || error}`);
        postState();
    }
}

async function setStatusBarColor(setting, color) {
    const known = STATUS_BAR_ITEMS.some(item => item.setting === setting);
    if (!known || !/^#[0-9a-fA-F]{6}$/.test(color || '')) {
        return;
    }
    const colors = { ...(getSetting('statusBarColors') || {}), [setting]: color };
    if (colors[setting] !== (getSetting('statusBarColors') || {})[setting]) {
        await updateGlobalSetting('statusBarColors', colors);
    }
}

async function setControlValue(key, value) {
    const control = findControl(key);
    const stored = control && toStoredValue(control, value);
    if (stored !== undefined && stored !== getSetting(key)) {
        await updateGlobalSetting(key, stored);
    }
    if (key === 'customGitMenuIcon' && stored === 'show') {
        await ensureGitHelps();
    }
}

function isArchived(item) {
    return item.archived === true || item.archived === 'true';
}

/** If GIT Helps is on and there are no live git commands, add the default Git menu. */
async function ensureGitHelps() {
    if (getSetting('customGitMenuIcon') === 'hide') {
        return;
    }
    const list = getSetting('customCommandsList') || [];
    if (list.some(item => isGitCommand(item) && !isArchived(item))) {
        return;
    }
    const restored = list.some(item => isGitCommand(item) && isArchived(item))
        ? list.map(item => (isGitCommand(item) && isArchived(item) ? { ...item, archived: false, enabled: true } : item))
        : [...list, ...DEFAULT_GIT_HELPS];
    await updateGlobalSetting('customCommandsList', restored);
}

/** Keeps only known fields, so the webview cannot write anything else into settings.json. */
function sanitizeCustomCommands(list) {
    if (!Array.isArray(list)) {
        return getSetting('customCommandsList') || [];
    }
    return list.map(item => {
        const clean = {};
        for (const field of CUSTOM_COMMAND_FIELDS) {
            if (item[field] !== undefined) {
                clean[field] = BOOLEAN_FIELDS.has(field)
                    ? item[field] === true || item[field] === 'true'
                    : String(item[field]);
            }
        }
        if (Array.isArray(item.then)) {
            clean.then = item.then.map(value => String(value));
        }
        if (STATUS_BAR_ITEMS.some(definition => definition.command === item.vscodeCommand)) {
            clean.vscodeCommand = item.vscodeCommand;
        }
        return clean;
    });
}

function exportKeys() {
    return [...panelSettingKeys(), ...EXTRA_EXPORT_KEYS];
}

function buildExport() {
    const settings = {};
    for (const key of exportKeys()) {
        const value = getSetting(key);
        if (value !== undefined) {
            settings[key] = value;
        }
    }
    return {
        simplerFlutterTasks: EXPORT_KIND,
        settings,
    };
}

function parseExport(payload) {
    if (Array.isArray(payload)) {
        return { customCommandsList: payload };
    }
    if (payload && payload.settings && typeof payload.settings === 'object') {
        return payload.settings;
    }
    if (payload && (Array.isArray(payload.customCommandsList) || Array.isArray(payload.customCommandGroups))) {
        return payload;
    }
    throw new Error('Not a Simpler Flutter Tasks export');
}

function sanitizeColors(value) {
    if (!value || typeof value !== 'object') {
        return {};
    }
    const known = new Set(STATUS_BAR_ITEMS.map(item => item.setting));
    const colors = {};
    for (const [key, color] of Object.entries(value)) {
        if (known.has(key) && /^#[0-9a-fA-F]{6}$/.test(color || '')) {
            colors[key] = color;
        }
    }
    return colors;
}

function sanitizeImportedValue(key, value) {
    if (key === 'customCommandsList') {
        return sanitizeCustomCommands(value);
    }
    if (key === 'customCommandGroups') {
        return sanitizeGroups(value);
    }
    if (key === 'statusBarColors') {
        return sanitizeColors(value);
    }
    if (key === 'Flavors') {
        return sanitizeFlavorConfig(value);
    }
    const control = findControl(key);
    if (!control) {
        return undefined;
    }
    if (control.kind === 'visibility') {
        return value === 'hide' || value === false ? 'hide' : 'show';
    }
    return toStoredValue(control, value);
}

async function exportPanelSettings() {
    const folder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
    const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.joinPath(folder ? folder.uri : vscode.Uri.file(require('os').homedir()), 'simpler-flutter-tasks.settings.json'),
        filters: { JSON: ['json'] },
        saveLabel: 'Export',
        title: 'Export Simpler Flutter Tasks settings',
    });
    if (!uri) {
        return;
    }
    const json = `${JSON.stringify(buildExport(), null, 2)}\n`;
    await vscode.workspace.fs.writeFile(uri, Buffer.from(json, 'utf8'));
    vscode.window.showInformationMessage('Settings exported ✓');
}

// TODO: EXPORT ALL JSON SETTINGS
async function exportUserSettingsJson() {
    const source = userSettingsUri();
    let bytes;
    try {
        bytes = await vscode.workspace.fs.readFile(source);
    } catch {
        throw new Error('Could not read settings.json');
    }
    const folder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
    const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.joinPath(folder ? folder.uri : vscode.Uri.file(require('os').homedir()), 'settings.json'),
        filters: { JSON: ['json'] },
        saveLabel: 'Export',
        title: 'Export settings.json',
    });
    if (!uri) {
        return;
    }
    await vscode.workspace.fs.writeFile(uri, bytes);
    vscode.window.showInformationMessage('settings.json exported ✓');
}

async function importUserSettingsJson() {
    const picked = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { JSON: ['json'] },
        openLabel: 'Import',
        title: 'Import settings.json',
    });
    if (!picked || !picked[0]) {
        return;
    }
    const bytes = await vscode.workspace.fs.readFile(picked[0]);
    const text = Buffer.from(bytes).toString('utf8').trim();
    if (!text.startsWith('{')) {
        throw new Error('File is not a settings.json object');
    }
    const ok = await vscode.window.showWarningMessage(
        'Replace your entire settings.json with this file?\nЗаменить весь settings.json этим файлом?',
        { modal: true },
        'Import / Импорт',
    );
    if (ok !== 'Import / Импорт') {
        return;
    }
    await vscode.workspace.fs.writeFile(userSettingsUri(), bytes);
    vscode.window.showInformationMessage('settings.json imported ✓');
}

async function importPanelSettings() {
    const picked = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { JSON: ['json'] },
        openLabel: 'Import',
        title: 'Import Simpler Flutter Tasks settings',
    });
    if (!picked || !picked[0]) {
        return;
    }
    const raw = Buffer.from(await vscode.workspace.fs.readFile(picked[0])).toString('utf8');
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error('Not a JSON file');
    }
    const settings = parseExport(parsed);
    const ok = await vscode.window.showWarningMessage(
        'Replace current panel settings with this file?\nЗаменить текущие настройки панели этим файлом?',
        { modal: true },
        'Import / Импорт',
    );
    if (ok !== 'Import / Импорт') {
        return;
    }
    const allowed = new Set(exportKeys());
    for (const [key, value] of Object.entries(settings)) {
        if (!allowed.has(key)) {
            continue;
        }
        const stored = sanitizeImportedValue(key, value);
        if (stored !== undefined) {
            await updateGlobalSetting(key, stored);
        }
    }
    vscode.window.showInformationMessage('Settings imported ✓');
}

function sanitizeGroups(list) {
    if (!Array.isArray(list)) {
        return getSetting('customCommandGroups') || [];
    }
    return list.map(item => ({
        id: String(item.id || '').replace(/[^a-zA-Z0-9_-]/g, ''),
        label: String(item.label || 'Menu').slice(0, 40),
        color: /^#[0-9a-fA-F]{6}$/.test(item.color || '') ? item.color : '#02b5ff',
        position: item.position === 'right' ? 'right' : 'left',
        enabled: item.enabled !== false,
    })).filter(item => item.id);
}

function renderHtml(webview, mediaRoot, imagesRoot, iconsRoot) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const asset = (root, file) => webview.asWebviewUri(vscode.Uri.joinPath(root, file));
    const lessonGifs = ['position', 'confirm', 'edit', 'then', 'archive']
        .map(id => `"${id}":"${asset(mediaRoot, `lessons/${id}.gif`)}"`)
        .join(',');
    const sectionIcons = [
        `general:"${asset(iconsRoot, 'main_settings_icon.gif')}"`,
        `statusBar:"${asset(iconsRoot, 'status_bar_icons.gif')}"`,
        `customCommands:"${asset(iconsRoot, 'settings_hover.gif')}"`,
        `other:"${asset(iconsRoot, 'other_settings.gif')}"`,
        `flavor:"${asset(iconsRoot, 'sub_set.gif')}"`,
    ].join(',');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${asset(mediaRoot, 'panel.css')}">
    <title>Flutter Tasks Settings</title>
    <style nonce="${nonce}">
        body.is-booting .hero, body.is-booting .layout { visibility: hidden; }
        .boot { position: fixed; inset: 0; z-index: 20; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: var(--vscode-editor-background, #1e1e1e); color: var(--vscode-foreground, #ccc); font-family: var(--vscode-font-family, sans-serif); }
        body.is-booting .boot { display: flex; }
        .boot__spin { width: 28px; height: 28px; border: 3px solid rgba(19,185,253,0.25); border-top-color: #13b9fd; border-radius: 50%; animation: boot-spin 0.7s linear infinite; }
        @keyframes boot-spin { to { transform: rotate(360deg); } }
        .boot p { margin: 0; font-size: 13px; opacity: 0.85; }
    </style>
</head>
<body class="is-booting">
    <div class="boot" id="boot">
        <span class="boot__spin" aria-hidden="true"></span>
        <p>Loading Settings…</p>
    </div>
    <header class="hero">
        <div class="hero__logo-wrap">
            <img class="hero__logo" src="${asset(imagesRoot, 'eldiyar_profile_icon.png')}" alt="">
        </div>
        <div class="hero__text">
            <h1 class="hero__title" data-type="Simpler Flutter Tasks" aria-label="Simpler Flutter Tasks"></h1>
            <p>Settings are saved to your user settings.json and applied instantly.</p>
        </div>
        <div class="hero__actions">
            <button class="button button--ghost" data-action="exportSettings" title="Save panel settings as JSON">Export</button>
            <button class="button button--ghost" data-action="importSettings" title="Load panel settings from JSON">Import</button>
            <!-- TODO: EXPORT ALL JSON SETTINGS
            <button class="button button--ghost button--small" data-action="exportSettingsJson" title="Save the full settings.json">Export settings.json</button>
            <button class="button button--ghost button--small" data-action="importSettingsJson" title="Replace the full settings.json">Import settings.json</button>
            -->
            <button class="button button--ghost" data-action="openSettingsJson">{ } settings.json</button>
        </div>
    </header>
    <div class="layout">
        <nav class="nav" id="nav"></nav>
        <main class="content">
            <input class="search" id="search" type="search" placeholder="Search settings…" autocomplete="off">
            <div id="sections"></div>
            <p class="empty-search" id="emptySearch" hidden>Nothing found 🤷</p>
        </main>
    </div>
    <div class="toast" id="toast">Saved ✓</div>
    <script nonce="${nonce}">window.LESSON_GIFS={${lessonGifs}};window.SECTION_ICONS={${sectionIcons}};</script>
    <script nonce="${nonce}" src="${asset(mediaRoot, 'panel.js')}"></script>
</body>
</html>`;
}

module.exports = {
    registerSettingsPanel,
    OPEN_COMMAND,
};
