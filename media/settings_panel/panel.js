(function () {
    // eslint-disable-next-line no-undef
    const vscode = acquireVsCodeApi();
    const SAVE_DELAY_MS = 500;
    const RENDER_DELAY_MS = 220;
    const ASK_FLAVOR = /\s*--flavor\s*$/;
    const TRAILING_FLAVOR = /\s*--flavor(?:[\s=]+[^\s-]\S*)?\s*$/;

    const sectionsRoot = document.getElementById('sections');
    const navRoot = document.getElementById('nav');
    const searchInput = document.getElementById('search');
    const emptySearch = document.getElementById('emptySearch');
    const toast = document.getElementById('toast');

    let state;
    let pendingState;
    let customCommands = [];
    let commandGroups = [];
    let flavorConfig = { path: 'lib/main', flavors: [], commands: [] };
    let saveTimer;
    let flavorTimer;
    let draggingIndex;
    const MOTION_MS = 380;
    const commandKeys = new WeakMap();
    let commandKeyCounter = 0;
    let motionUntil = 0;
    let colorTimer;
    let renderTimer;
    let toastTimer;
    let expectSaved = false;
    let pendingFocusId;
    const uiState = vscode.getState() || {};
    const collapsed = new Set(uiState.collapsed || ['customCommands', 'other']);
    const collapsedCats = new Set(uiState.collapsedCats || []);
    const GIT_CAT = 'git';
    /** Only commands marked with group "git" live in GIT Helps; other "git …" commands are normal buttons. */
    const isGitItem = command => Boolean(command) && command.group === GIT_CAT;

    /** Tiny DOM builder: h('div', { class: 'x', onclick }, child, 'text'). */
    function h(tag, attrs, ...children) {
        const element = document.createElement(tag);
        for (const [name, value] of Object.entries(attrs || {})) {
            if (value === undefined || value === null || value === false) {
                continue;
            }
            if (name.startsWith('on')) {
                element.addEventListener(name.slice(2), value);
            } else if (name === 'style') {
                Object.assign(element.style, value);
            } else if (name in element && typeof value !== 'string') {
                element[name] = value;
            } else {
                element.setAttribute(name, value === true ? '' : value);
            }
        }
        for (const child of children.flat()) {
            if (child !== undefined && child !== null && child !== false) {
                element.append(child instanceof Node ? child : String(child));
            }
        }
        return element;
    }

    function post(message) {
        expectSaved = true;
        vscode.postMessage(message);
    }

    function showToast(text, action) {
        if (!action && toast.querySelector('.toast__action') && toast.classList.contains('toast--visible')) {
            return;
        }
        clearTimeout(toastTimer);
        toast.replaceChildren(text);
        if (action) {
            toast.append(h('button', { class: 'toast__action', onclick: () => { action.run(); hideToast(); } }, action.label));
        }
        toast.classList.add('toast--visible');
        toastTimer = setTimeout(hideToast, action ? 5000 : 1400);
    }

    function hideToast() {
        toast.classList.remove('toast--visible');
    }

    // ---------- controls ----------

    function switchControl(checked, onChange, label) {
        return h('label', { class: 'switch', title: label },
            h('input', { type: 'checkbox', checked, 'aria-label': label, onchange: event => onChange(event.target.checked) }),
            h('span', { class: 'switch__track' }, h('span', { class: 'switch__thumb' })));
    }

    function segmented(options, value, onChange) {
        const group = h('div', { class: 'segmented', role: 'radiogroup' });
        const select = selected => group.querySelectorAll('.segmented__option').forEach((button, index) => {
            const active = options[index].value === selected;
            button.classList.toggle('segmented__option--active', active);
            button.setAttribute('aria-checked', String(active));
        });
        group.append(...options.map(option => h('button', {
            class: 'segmented__option',
            role: 'radio',
            onclick: () => {
                select(option.value);
                onChange(option.value);
            },
        }, option.label)));
        select(value);
        return group;
    }

    function setControl(control, value) {
        post({ type: 'set', key: control.key, value });
    }

    function renderControl(control) {
        const text = h('div', { class: 'row__text' },
            h('div', { class: 'row__label' },
                control.color && h('span', { class: 'dot', style: paint('background', control.color) }),
                control.label),
            control.hint && h('div', { class: 'row__hint' }, control.hint));

        let input;
        let children;
        if (control.kind === 'boolean' || control.kind === 'visibility') {
            const toggle = switchControl(Boolean(control.value), value => {
                control.value = value;
                setControl(control, value);
                if (children) {
                    children.classList.toggle('group__children--open', value);
                }
            }, control.label);
            input = control.colorPicker && state.colorized
                ? h('div', { class: 'row__end' }, colorInput(control), toggle)
                : toggle;
        } else if (control.kind === 'text') {
            input = h('input', {
                class: 'text-input',
                type: 'text',
                value: control.value || '',
                onchange: event => setControl(control, event.target.value),
                onkeydown: event => event.key === 'Enter' && event.target.blur(),
            });
        }

        const row = h('div', {
            class: `row${control.kind === 'text' ? ' row--stacked' : ''}`,
            'data-search': `${control.label} ${control.hint || ''} ${control.key}`.toLowerCase(),
        }, text, input);
        const barId = control.kind === 'visibility' ? control.key : undefined;

        if (control.flavorAware) {
            return withBarHover(h('div', {}, row, flavorOptions(control, input)), barId);
        }
        if (control.flavorEditor) {
            const open = Boolean(control.value);
            children = h('div', { class: `group__children${open ? ' group__children--open' : ''}` },
                h('div', { class: 'group__inner' }, renderFlavorEditor()));
            return withBarHover(h('div', { class: 'group' }, row, children), barId);
        }
        if (!control.children) {
            return withBarHover(row, barId);
        }
        const open = Boolean(control.value);
        children = h('div', { class: `group__children${open ? ' group__children--open' : ''}` },
            h('div', { class: 'group__inner' }, control.children.map(renderControl)));
        return withBarHover(h('div', { class: 'group' }, row, children), barId);
    }

    /**
     * Extra section under an editable command: a command ending with "--flavor"
     * asks for a flavor on click, the list shows what will be offered.
     */
    function flavorOptions(control, input) {
        const asks = () => ASK_FLAVOR.test(input.value);
        const base = () => input.value.replace(TRAILING_FLAVOR, '').trimEnd();
        const list = h('div', { class: 'flavor-list' });
        const listWrap = h('div', { class: 'group__children' }, h('div', { class: 'group__inner' }, list));

        const flavorGif = typeof SECTION_ICONS !== 'undefined' && SECTION_ICONS.flavor;
        const chip = flagChip(h('span', { class: 'flag__text' },
            flavorGif ? h('img', { class: 'section-icon', src: flavorGif, alt: '' }) : '🎯',
            'Ask for flavor on click'), {
            en: 'Adds "--flavor" with no value. On click a menu asks which flavor to use, plus Default without a flavor.',
            ru: 'Добавляет «--flavor» без значения. По клику откроется меню: prod / staging / dev и Default без flavor.',
        }, asks(), checked => {
            input.value = checked ? `${base()} --flavor` : base();
            setControl(control, input.value);
            sync();
        });

        function sync() {
            const on = asks();
            chip.classList.toggle('flag--on', on);
            chip.querySelector('input').checked = on;
            listWrap.classList.toggle('group__children--open', on);
            const flavorItems = state.flavors.map(flavor => [`${base()} --flavor ${flavor}`, flavor]);
            flavorItems.push([base(), 'Default']);
            list.replaceChildren(...flavorItems.map(([command, name]) => h('div', { class: 'flavor-list__item' },
                h('code', {}, command),
                h('span', { class: 'flavor-list__name' }, name))));
        }

        input.addEventListener('input', sync);
        sync();
        return h('div', { class: 'flavor-options' }, chip, listWrap);
    }

    function saveFlavors(immediate) {
        clearTimeout(flavorTimer);
        const send = () => {
            flavorTimer = undefined;
            post({ type: 'flavors', value: flavorConfig });
        };
        if (immediate) {
            send();
        } else {
            flavorTimer = setTimeout(send, SAVE_DELAY_MS);
        }
    }

    function flavorField(value, placeholder, key, extra) {
        return h('input', {
            class: extra && extra.class || 'text-input',
            type: 'text',
            value: value || '',
            placeholder,
            'data-focus': key,
            oninput: event => extra && extra.oninput(event.target.value),
            onchange: () => saveFlavors(true),
            onkeydown: event => event.key === 'Enter' && event.target.blur(),
        });
    }

    function renderFlavorEditor() {
        const flavors = flavorConfig.flavors || [];
        const commands = flavorConfig.commands || [];
        return h('div', { class: 'flavor-editor', 'data-search': 'flavor flavors prod staging dev package apk install' },
            h('p', { class: 'flavor-editor__hint' },
                'Placeholders: ',
                h('code', {}, '${flavor}'), ' ',
                h('code', {}, '${package}'), ' ',
                h('code', {}, '${path}')),
            h('div', { class: 'row row--stacked' },
                h('div', { class: 'row__text' },
                    h('div', { class: 'row__label' }, 'Main path'),
                    h('div', { class: 'row__hint' }, 'Used as ${path} — e.g. lib/main_prod.dart')),
                flavorField(flavorConfig.path, 'lib/main', 'flavor-path', {
                    oninput: value => {
                        flavorConfig.path = value;
                        saveFlavors(false);
                    },
                })),
            h('div', { class: 'flavor-editor__title' }, 'Flavors'),
            ...flavors.map((flavor, index) => h('div', {
                class: 'flavor-row',
                'data-search': `${flavor.title} ${flavor.package} flavor`,
            },
                flavorField(flavor.title, 'prod', `flavor-title-${index}`, {
                    oninput: value => {
                        flavorConfig.flavors[index] = { ...flavorConfig.flavors[index], title: value };
                        saveFlavors(false);
                    },
                }),
                flavorField(flavor.package, 'com_packages_of_your_app', `flavor-package-${index}`, {
                    class: 'text-input text-input--mono',
                    oninput: value => {
                        flavorConfig.flavors[index] = { ...flavorConfig.flavors[index], package: value };
                        saveFlavors(false);
                    },
                }),
                h('button', {
                    class: 'icon-button icon-button--trash',
                    title: 'Remove flavor',
                    onclick: () => {
                        flavorConfig.flavors.splice(index, 1);
                        saveFlavors(true);
                        rerender();
                    },
                }, '🗑️'))),
            h('button', {
                class: 'button button--dashed',
                onclick: () => {
                    flavorConfig.flavors.push({ title: '', package: '' });
                    rerender();
                    const input = sectionsRoot.querySelector(`[data-focus="flavor-title-${flavorConfig.flavors.length - 1}"]`);
                    if (input) {
                        input.focus();
                    }
                },
            }, '+ Add flavor'),
            h('div', { class: 'flavor-editor__title' }, 'Menu commands'),
            ...commands.map((command, index) => renderFlavorCommand(command, index)),
            h('button', {
                class: 'button button--dashed',
                onclick: () => {
                    flavorConfig.commands.push({ label: '', command: '', action: 'run' });
                    rerender();
                    const input = sectionsRoot.querySelector(`[data-focus="flavor-cmd-label-${flavorConfig.commands.length - 1}"]`);
                    if (input) {
                        input.focus();
                    }
                },
            }, '+ Add command'));
    }

    function renderFlavorCommand(command, index) {
        const last = index === flavorConfig.commands.length - 1;
        const isLine = command.action === 'separator';
        return h('div', {
            class: `flavor-cmd${isLine ? ' flavor-cmd--line' : ''}`,
            'data-search': `${command.label} ${command.command} flavor`,
        },
            h('div', { class: 'flavor-cmd__top' },
                flavorField(command.label, isLine ? 'Android' : 'Flutter Install ->', `flavor-cmd-label-${index}`, {
                    class: 'text-input command__label',
                    oninput: value => {
                        flavorConfig.commands[index] = { ...flavorConfig.commands[index], label: value };
                        saveFlavors(false);
                    },
                }),
                h('select', {
                    class: 'text-input flavor-cmd__action',
                    value: command.action || 'run',
                    'aria-label': 'Action',
                    onchange: event => {
                        flavorConfig.commands[index] = { ...flavorConfig.commands[index], action: event.target.value };
                        saveFlavors(true);
                        rerender();
                    },
                },
                    [['run', 'Run'], ['openApk', 'Open APK'], ['openBundle', 'Open bundle'], ['deleteApk', 'Delete APK'], ['separator', 'Heading']]
                        .map(([value, label]) => h('option', { value, selected: (command.action || 'run') === value }, label))),
                h('button', { class: 'icon-button', title: 'Move up', disabled: index === 0, onclick: () => moveFlavorCommand(index, -1) }, '↑'),
                h('button', { class: 'icon-button', title: 'Move down', disabled: last, onclick: () => moveFlavorCommand(index, 1) }, '↓'),
                h('button', {
                    class: 'icon-button icon-button--trash',
                    title: 'Remove',
                    onclick: () => {
                        flavorConfig.commands.splice(index, 1);
                        saveFlavors(true);
                        rerender();
                    },
                }, '🗑️')),
            !isLine && flavorField(command.command, 'adb install … ${flavor}', `flavor-cmd-${index}`, {
                class: 'text-input text-input--mono',
                oninput: value => {
                    flavorConfig.commands[index] = { ...flavorConfig.commands[index], command: value };
                    saveFlavors(false);
                },
            }),
            !isLine && h('div', { class: 'flavor-cmd__flags' },
                flagChip('Prod only', {
                    en: 'Shown only for prod / production flavors.',
                    ru: 'Только для prod / production.',
                }, Boolean(command.prodOnly), value => {
                    flavorConfig.commands[index] = { ...flavorConfig.commands[index], prodOnly: value };
                    saveFlavors(true);
                    rerender();
                }),
                flagChip('After delete', {
                    en: 'Stays in the short menu after Delete Apk.',
                    ru: 'Остаётся в коротком меню после Delete Apk.',
                }, Boolean(command.afterDelete), value => {
                    flavorConfig.commands[index] = { ...flavorConfig.commands[index], afterDelete: value };
                    saveFlavors(true);
                    rerender();
                })));
    }

    function moveFlavorCommand(index, delta) {
        const swapWith = index + delta;
        if (swapWith < 0 || swapWith >= flavorConfig.commands.length) {
            return;
        }
        const current = flavorConfig.commands[index];
        flavorConfig.commands[index] = flavorConfig.commands[swapWith];
        flavorConfig.commands[swapWith] = current;
        saveFlavors(true);
        rerender();
    }

    // ---------- status bar preview ----------

    /** Button colors follow the "Colorized commands" setting, like the real status bar. */
    function paint(property, color, on = state.colorized) {
        return on && color ? { [property]: color } : {};
    }

    function highlightBar(id, on) {
        document.querySelectorAll(`[data-bar="${id}"]`).forEach(element => {
            element.classList.toggle('is-bar-hot', on);
        });
    }

    function withBarHover(element, id) {
        if (!id || !element) {
            return element;
        }
        element.setAttribute('data-bar', id);
        element.addEventListener('mouseenter', () => highlightBar(id, true));
        element.addEventListener('mouseleave', () => highlightBar(id, false));
        return element;
    }

    function scrollToBar(id) {
        const target = [...sectionsRoot.querySelectorAll(`[data-bar="${id}"]`)].find(element => !element.classList.contains('chip'));
        if (!target) {
            return;
        }
        const card = target.closest('.card');
        const sectionId = card && card.getAttribute('data-section');
        const sectionCollapsed = sectionId && collapsed.has(sectionId);
        if (sectionCollapsed) {
            setCollapsed(sectionId, false);
        }
        const category = target.parentElement && target.parentElement.closest('[data-category]');
        const categoryId = category && category.getAttribute('data-category');
        const categoryCollapsed = categoryId && collapsedCats.has(categoryId);
        if (categoryCollapsed) {
            setCategoryCollapsed(categoryId, false);
        }
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const toggle = target.querySelector('.switch input');
            if (toggle) {
                toggle.focus({ preventScroll: true });
            }
            target.classList.remove('is-bar-flash');
            void target.offsetWidth;
            target.classList.add('is-bar-flash');
            setTimeout(() => target.classList.remove('is-bar-flash'), 1400);
        }, sectionCollapsed || categoryCollapsed ? 320 : 0);
    }

    function barChip(id, style, label) {
        return withBarHover(h('span', { class: 'chip', style, onclick: () => scrollToBar(id) }, label), id);
    }

    function statusBarPreview(section) {
        const chips = section.controls
            .filter(control => control.value && control.preview)
            .map(control => barChip(control.key, paint('color', control.color), control.preview));
        const custom = customCommands.filter(command => command.enabled && !command.archived);
        const git = custom.filter(isGitItem);
        const knownGroups = new Set(commandGroups.map(group => group.id));
        custom.filter(command => !isGitItem(command) && !(command.group && knownGroups.has(command.group)))
            .forEach(command => {
                const index = customCommands.indexOf(command);
                chips.push(barChip(`custom:${index}`, paint('color', command.color, state.colorizedCustom), command.label));
            });
        if (git.length > 0 && state.gitMenuIcon !== false) {
            chips.push(barChip('customGitMenuIcon', paint('color', git[0].color, state.colorizedCustom), `⎇ GIT Helps (${git.length})`));
        }
        commandGroups.forEach(group => {
            if (group.enabled === false) {
                return;
            }
            const count = custom.filter(command => command.group === group.id).length;
            if (count > 0) {
                chips.push(barChip(`group:${group.id}`, paint('color', group.color, state.colorizedCustom), `📂 ${group.label || 'Menu'} (${count})`));
            }
        });
        return h('div', { class: 'statusbar', title: 'Preview of your status bar' },
            h('span', { class: 'statusbar__branch' }, '⎇ main'),
            chips.length > 0 ? chips : h('span', { class: 'chip chip--muted' }, 'No buttons'));
    }

    // ---------- custom commands ----------

    function colorInput(control) {
        const apply = (color, immediate) => {
            control.color = color;
            const dot = picker.closest('.row') && picker.closest('.row').querySelector('.dot');
            if (dot && state.colorized) {
                dot.style.background = color;
            }
            clearTimeout(colorTimer);
            const send = () => post({ type: 'setStatusBarColor', setting: control.key, color });
            if (immediate) {
                send();
            } else {
                colorTimer = setTimeout(send, SAVE_DELAY_MS);
            }
        };
        const picker = h('input', {
            class: 'color',
            type: 'color',
            value: normalizeColor(control.color),
            title: 'Button color',
            oninput: event => apply(event.target.value, false),
            onchange: event => apply(event.target.value, true),
        });
        return picker;
    }

    function normalizeColor(color) {
        if (/^#[0-9a-f]{6}$/i.test(color || '')) {
            return color;
        }
        const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color || '');
        return short ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}` : '#ffffff';
    }

    function saveCustomCommands(immediate) {
        clearTimeout(saveTimer);
        const send = () => {
            saveTimer = undefined;
            post({ type: 'customCommands', list: customCommands, groups: commandGroups });
        };
        if (immediate) {
            send();
        } else {
            saveTimer = setTimeout(send, SAVE_DELAY_MS);
        }
    }

    /** Text fields are saved with a delay while typing and right away on blur. */
    function updateCommand(index, patch, immediate = true) {
        customCommands[index] = withKey(customCommands[index], { ...customCommands[index], ...patch });
        saveCustomCommands(immediate);
    }

    /** Stable id of a command card across re-renders, so a moved card can glide to its new place. */
    function commandKey(command) {
        if (!commandKeys.has(command)) {
            commandKeys.set(command, `c${commandKeyCounter++}`);
        }
        return commandKeys.get(command);
    }

    function withKey(from, to) {
        commandKeys.set(to, commandKey(from));
        return to;
    }

    /** FLIP: remembers where cards were, applies the change, then animates them from the old place to the new one. */
    function animateLayout(change, landedKey) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            change();
            return;
        }
        const before = new Map();
        const heights = new Map();
        sectionsRoot.querySelectorAll('[data-flip]').forEach(element => before.set(element.dataset.flip, element.getBoundingClientRect()));
        sectionsRoot.querySelectorAll('[data-flip-size]').forEach(element => heights.set(element.dataset.flipSize, element.offsetHeight));
        change();
        motionUntil = Date.now() + MOTION_MS + 80;
        const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
        sectionsRoot.querySelectorAll('[data-flip-size]').forEach(element => {
            const old = heights.get(element.dataset.flipSize);
            const now = element.offsetHeight;
            if (old !== undefined && old > 0 && now > 0 && Math.abs(old - now) >= 1) {
                element.animate([{ height: `${old}px` }, { height: `${now}px` }], { duration: MOTION_MS, easing });
            }
        });
        sectionsRoot.querySelectorAll('[data-flip]').forEach(element => {
            const now = element.getBoundingClientRect();
            if (now.width === 0 && now.height === 0) {
                return;
            }
            const old = before.get(element.dataset.flip);
            if (!old || (old.width === 0 && old.height === 0)) {
                element.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: MOTION_MS, easing });
                return;
            }
            const dx = old.left - now.left;
            const dy = old.top - now.top;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                return;
            }
            element.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: MOTION_MS, easing });
        });
        const landed = landedKey && sectionsRoot.querySelector(`[data-flip="${landedKey}"]`);
        if (landed) {
            landed.classList.add('command--landed');
            setTimeout(() => landed.classList.remove('command--landed'), 1000);
        }
    }

    function lessonButton(id) {
        return h('button', {
            class: 'tip__more',
            type: 'button',
            onmousedown: event => {
                event.preventDefault();
                event.stopPropagation();
            },
            onclick: event => {
                event.preventDefault();
                event.stopPropagation();
                openLesson(id);
            },
        }, 'Подробнее · More');
    }

    function tipBody(en, ru, lessonId) {
        return h('span', { class: 'tip', role: 'tooltip' },
            h('strong', {}, en),
            h('span', {}, ru),
            lessonId && lessonButton(lessonId));
    }

    function withTip(element, en, ru, lessonId) {
        element.classList.add('has-tip');
        element.append(tipBody(en, ru, lessonId));
        return element;
    }

    function flagChip(label, tip, checked, onChange, lessonId) {
        const chip = h('label', { class: `flag${checked ? ' flag--on' : ''}` },
            h('input', {
                type: 'checkbox',
                checked,
                onchange: event => {
                    chip.classList.toggle('flag--on', event.target.checked);
                    onChange(event.target.checked);
                },
            }),
            label,
            tip && tipBody(tip.en, tip.ru, lessonId));
        return chip;
    }

    const LESSONS = {
        position: {
            en: 'Left / Right — where the button sits on the status bar.',
            ru: 'Left / Right — с какой стороны status bar появится кнопка.',
            demo: 'position',
        },
        confirm: {
            en: 'Confirm — VS Code asks “Are you sure?” before the command runs.',
            ru: 'Confirm — VS Code спросит «Вы уверены?» и только потом запустит команду.',
            demo: 'confirm',
        },
        edit: {
            en: 'Edit first — a text field opens, you can change the command, then it runs.',
            ru: 'Edit first — сначала поле ввода, правите команду, запускается то, что ввели.',
            demo: 'edit',
        },
        then: {
            en: 'Plus adds a then-command. It runs after the main one: main && then.',
            ru: 'Плюс добавляет дочернюю команду. Она выполнится после основной: main && then.',
            demo: 'then',
        },
        archive: {
            en: 'Remove hides the button, but keeps the command in History and settings.json.',
            ru: 'Крестик убирает кнопку, команда остаётся в истории на панели и в settings.json.',
            demo: 'archive',
        },
        expand: {
            en: 'On start the Commands sidebar opens this category, like Android with Build APK already visible.',
            ru: 'При старте в сайдбаре Commands эта категория уже раскрыта — например Android с Build APK.',
            demo: 'expand',
        },
    };

    function renderDemo(kind) {
        if (kind === 'position') {
            return h('div', { class: 'demo demo-bar' },
                h('span', { class: 'demo-chip demo-chip--slide' }, 'Auto Route'),
                h('span', { class: 'demo-bar__end' }, 'UTF-8'));
        }
        if (kind === 'confirm') {
            return h('div', { class: 'demo demo-confirm' },
                h('div', { class: 'demo-confirm__dialog' },
                    h('div', { class: 'demo-confirm__icon' }, '⚠️'),
                    h('p', { class: 'demo-confirm__title' }, 'Simpler Flutter Tasks'),
                    h('p', { class: 'demo-confirm__text' }, 'Вы уверены, что хотите продолжить?'),
                    h('p', { class: 'demo-confirm__cmd' }, '"git checkout -b"'),
                    h('div', { class: 'demo-confirm__actions' },
                        h('span', { class: 'demo-confirm__cancel' }, 'Cancel'),
                        h('span', { class: 'demo-confirm__yes' }, 'YES'))));
        }
        if (kind === 'edit') {
            return h('div', { class: 'demo demo-edit' },
                h('div', { class: 'demo-edit__box' },
                    h('div', { class: 'demo-edit__field' },
                        h('span', {}, 'git add . && git commit -m \''),
                        h('span', { class: 'demo-edit__typed' }, 'init'),
                        h('span', { class: 'demo-edit__caret' }),
                        h('span', {}, '\'')),
                    h('p', { class: 'demo-edit__hint' }, "Press 'Enter' to confirm your input or 'Escape' to cancel")));
        }
        if (kind === 'then') {
            return h('div', { class: 'demo demo-then' },
                h('code', {}, 'build_runner …'),
                h('span', { class: 'demo-then__and' }, '&&'),
                h('code', {}, 'flutter pub get'));
        }
        if (kind === 'expand') {
            const row = (label, cls) => h('div', { class: `demo-tree__row${cls ? ` ${cls}` : ''}` },
                h('span', { class: 'demo-tree__chevron' }), label);
            return h('div', { class: 'demo demo-expand' },
                h('div', { class: 'demo-expand__switch' },
                    h('span', {}, 'Android'),
                    h('span', { class: 'demo-expand__track' }, h('span', { class: 'demo-expand__thumb' }))),
                h('div', { class: 'demo-tree' },
                    h('div', { class: 'demo-tree__title' }, 'COMMANDS'),
                    row('Build Runner'),
                    row('Flutter'),
                    h('div', { class: 'demo-tree__cat' },
                        row('Android', 'demo-tree__row--active'),
                        h('div', { class: 'demo-tree__kids' },
                            h('div', { class: 'demo-tree__kids-inner' },
                                h('div', { class: 'demo-tree__child' }, '1) Build APK'),
                                h('div', { class: 'demo-tree__child' }, '2) Build App Bundle'),
                                h('div', { class: 'demo-tree__child' }, '3) Build Small apk')))),
                    row('iOS'),
                    row('Git Hub')));
        }
        return h('div', { class: 'demo demo-archive' },
            h('span', { class: 'demo-chip demo-chip--hide' }, 'Auto Route'),
            h('span', { class: 'demo-history' }, 'History / История'));
    }

    function openLesson(id) {
        const lesson = LESSONS[id];
        if (!lesson) {
            return;
        }
        const close = () => overlay.remove();
        const gif = !['confirm', 'edit'].includes(id)
            && typeof LESSON_GIFS !== 'undefined'
            && LESSON_GIFS[id];
        const overlay = h('div', { class: 'confirm', onclick: event => event.target === overlay && close() },
            h('div', { class: 'confirm__box lesson' },
                gif
                    ? h('img', { class: 'lesson__gif', src: gif, alt: lesson.en })
                    : renderDemo(lesson.demo),
                h('p', { class: 'confirm__en' }, lesson.en),
                h('p', { class: 'confirm__ru' }, lesson.ru),
                h('div', { class: 'confirm__actions' },
                    h('button', { class: 'button', onclick: close }, 'Got it / Понятно'))));
        document.body.append(overlay);
    }

    function commandTextInput(index, field, extra) {
        return h('input', {
            class: 'text-input',
            type: 'text',
            value: customCommands[index][field] || '',
            'data-focus': `${field}-${index}`,
            oninput: event => updateCommand(index, { [field]: event.target.value }, false),
            onchange: () => saveCustomCommands(true),
            onkeydown: event => event.key === 'Enter' && event.target.blur(),
            ...extra,
        });
    }

    function renderCommandCard(command, index) {
        const isGit = isGitItem(command);
        const linked = Boolean(command.vscodeCommand);
        const grouped = Boolean(command.group && commandGroups.some(group => group.id === command.group));
        const card = h('div', {
            class: `command${command.enabled ? '' : ' command--disabled'}${linked ? ' command--linked' : ''}`,
            'data-flip': commandKey(command),
            'data-search': `${command.label} ${command.command} ${(command.then || []).join(' ')} ${isGit ? 'git' : ''}`.toLowerCase(),
            draggable: true,
            ondragstart: event => startCommandDrag(event, index),
            ondragend: endCommandDrag,
        },
            h('div', { class: 'command__top' },
                h('span', { class: 'command__grip', title: 'Drag to reorder / Перетащите', 'aria-hidden': 'true' }, '⠿'),
                h('input', {
                    class: 'color',
                    type: 'color',
                    value: normalizeColor(command.color),
                    title: 'Button color',
                    oninput: event => updateCommand(index, { color: event.target.value }, false),
                    onchange: () => saveCustomCommands(true),
                }),
                commandTextInput(index, 'label', { class: 'text-input command__label', placeholder: 'Button label' }),
                switchControl(Boolean(command.enabled), value => {
                    card.classList.toggle('command--disabled', !value);
                    updateCommand(index, { enabled: value });
                }, 'Enabled')),
            linked
                ? h('div', { class: 'command__link' },
                    h('span', { class: 'command__link-badge' }, '🔗 Status Bar Icon'),
                    h('code', {}, command.command || command.vscodeCommand),
                    h('span', { class: 'command__link-hint' }, 'Runs exactly like the status bar button · Запускается как кнопка на status bar'))
                : h('div', { class: `command__cmd${command.command ? '' : ' command__cmd--empty'}` },
                    commandTextInput(index, 'command', { class: 'text-input text-input--mono', placeholder: 'flutter pub get' }),
                    h('p', { class: 'command__hint' },
                        'Several commands in one button: join them with ',
                        h('code', {}, '&&'),
                        ' — e.g. ',
                        h('code', {}, 'git checkout DEV && git pull'),
                        h('br'),
                        'Несколько команд в одной кнопке: через ',
                        h('code', {}, '&&'),
                        '. Следующая запустится, только если предыдущая прошла успешно.')),
            !linked && renderThenList(index),
            h('div', { class: 'command__bottom' },
                !isGit && !grouped && withTip(
                    segmented([{ value: 'left', label: '← Left' }, { value: 'right', label: 'Right →' }], command.position || 'left',
                        value => updateCommand(index, { position: value })),
                    'Puts this button on the left or right of the status bar.',
                    'Кнопка будет слева или справа на status bar.',
                    'position',
                ),
                !linked && flagChip('⚠️ Confirm', {
                    en: 'Asks “Are you sure?” before running. Protects against accidental clicks.',
                    ru: 'Перед запуском спросит «Вы уверены?». Защита от случайного нажатия.',
                }, Boolean(command.warningDialog),
                    value => updateCommand(index, { warningDialog: value }), 'confirm'),
                !linked && flagChip('✏️ Edit first', {
                    en: 'Opens a text field so you can change the command, then runs what you typed.',
                    ru: 'Сначала откроет поле, где можно поправить команду, и запустит то, что вы ввели.',
                }, Boolean(command.askerForCommand),
                    value => updateCommand(index, { askerForCommand: value }), 'edit'),
                h('div', { class: 'spacer' }),
                !linked && withTip(h('button', { class: 'icon-button card__add', onclick: () => addThen(index) }, '+'),
                    'Then-command: runs after this one, chained with &&.',
                    'Дочерняя команда: запустится после основной, через &&.',
                    'then'),
                withTip(h('button', { class: 'icon-button icon-button--trash', title: 'To History / В историю', onclick: () => archiveCommand(index) }, '🗑️'),
                    'Hide from the status bar. The command stays in History and settings.json.',
                    'Убрать из status bar. Команда останется в истории на панели и в settings.json.',
                    'archive')));
        bindCardDrop(card, index);
        return withBarHover(card, isGit || grouped ? undefined : `custom:${index}`);
    }

    function activeIndexes() {
        return customCommands.map((command, index) => command.archived ? -1 : index).filter(index => index >= 0);
    }

    function askConfirm({ en, ru, ok }) {
        return new Promise(resolve => {
            const close = accepted => {
                overlay.remove();
                resolve(accepted);
            };
            const overlay = h('div', { class: 'confirm', onclick: event => event.target === overlay && close(false) },
                h('div', { class: 'confirm__box' },
                    h('p', { class: 'confirm__en' }, en),
                    h('p', { class: 'confirm__ru' }, ru),
                    h('div', { class: 'confirm__actions' },
                        h('button', { class: 'button button--ghost', onclick: () => close(false) }, 'Cancel / Отмена'),
                        h('button', { class: 'button', onclick: () => close(true) }, ok))));
            document.body.append(overlay);
        });
    }

    function startCommandDrag(event, index) {
        if (event.target.closest('input, textarea, button, select, a, label, .flag, .segmented')) {
            event.preventDefault();
            return;
        }
        draggingIndex = index;
        event.dataTransfer.setData('text/plain', String(index));
        event.dataTransfer.effectAllowed = 'move';
        const card = event.currentTarget;
        // The drag image is taken right after dragstart, so dim the card a frame later.
        requestAnimationFrame(() => {
            if (draggingIndex !== undefined) {
                card.classList.add('command--dragging');
            }
        });
        sectionsRoot.classList.add('is-dragging-command');
    }

    function clearDropMarks() {
        sectionsRoot.querySelectorAll('.command--drop-before, .command--drop-after')
            .forEach(element => element.classList.remove('command--drop-before', 'command--drop-after'));
    }

    function endCommandDrag(event) {
        draggingIndex = undefined;
        event.currentTarget.classList.remove('command--dragging');
        sectionsRoot.classList.remove('is-dragging-command');
        clearDropMarks();
    }

    /** Dropping on a card puts the dragged command above or below it, in the card's category. */
    function bindCardDrop(card, index) {
        const isBefore = event => {
            const box = card.getBoundingClientRect();
            return event.clientY < box.top + box.height / 2;
        };
        card.addEventListener('dragover', event => {
            if (draggingIndex === undefined || draggingIndex === index) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'move';
            const before = isBefore(event);
            if (!card.classList.contains(before ? 'command--drop-before' : 'command--drop-after')) {
                clearDropMarks();
                card.classList.add(before ? 'command--drop-before' : 'command--drop-after');
            }
        });
        card.addEventListener('dragleave', event => {
            if (!card.contains(event.relatedTarget)) {
                card.classList.remove('command--drop-before', 'command--drop-after');
            }
        });
        card.addEventListener('drop', event => {
            const from = Number(event.dataTransfer.getData('text/plain'));
            if (!Number.isInteger(from) || from === index || !customCommands[from]) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            clearDropMarks();
            moveCommandTo(from, index, isBefore(event));
        });
    }

    function moveCommandTo(from, target, before) {
        const group = customCommands[target].group || '';
        animateLayout(() => {
            const [moved] = customCommands.splice(from, 1);
            const targetIndex = from < target ? target - 1 : target;
            customCommands.splice(before ? targetIndex : targetIndex + 1, 0, withKey(moved, { ...moved, group }));
            if (group) {
                collapsedCats.delete(group);
                persistUi();
            }
            saveCustomCommands(true);
            rerender();
        }, commandKey(customCommands[from]));
    }

    function bindDrop(element, groupId) {
        element.addEventListener('dragover', event => {
            event.preventDefault();
            element.classList.add('category--dragover');
        });
        element.addEventListener('dragleave', event => {
            if (!element.contains(event.relatedTarget)) {
                element.classList.remove('category--dragover');
            }
        });
        element.addEventListener('drop', event => {
            event.preventDefault();
            element.classList.remove('category--dragover');
            const index = Number(event.dataTransfer.getData('text/plain'));
            const command = customCommands[index];
            if (!command || (command.group || '') === (groupId || '')) {
                return;
            }
            animateLayout(() => {
                if (groupId) {
                    collapsedCats.delete(groupId);
                    persistUi();
                }
                updateCommand(index, { group: groupId || '' });
                rerender();
            }, commandKey(command));
        });
    }

    async function archiveCommand(index) {
        const command = customCommands[index];
        const ok = await askConfirm({
            en: `Remove “${command.label || command.command}” from the status bar? It will stay in History on this panel and in settings.json.`,
            ru: `Убрать «${command.label || command.command}» из status bar? Команда останется в истории на панели и в settings.json.`,
            ok: 'Remove / Убрать',
        });
        if (!ok) {
            return;
        }
        const [removed] = customCommands.splice(index, 1);
        removed.archived = true;
        removed.enabled = false;
        customCommands.push(removed);
        saveCustomCommands(true);
        rerender();
    }

    function restoreCommand(index) {
        const command = customCommands[index];
        const group = isGitItem(command) || (command.group && commandGroups.some(item => item.id === command.group)) ? command.group : '';
        customCommands[index] = { ...command, archived: false, enabled: true, group };
        saveCustomCommands(true);
        rerender();
    }

    async function forgetCommand(index) {
        const command = customCommands[index];
        const ok = await askConfirm({
            en: `Delete “${command.label || command.command}” from settings.json forever?`,
            ru: `Удалить «${command.label || command.command}» из settings.json навсегда?`,
            ok: 'Delete / Удалить',
        });
        if (!ok) {
            return;
        }
        customCommands.splice(index, 1);
        saveCustomCommands(true);
        rerender();
    }

    async function clearHistory() {
        const count = customCommands.filter(command => command.archived).length;
        const ok = await askConfirm({
            en: `Delete all ${count} commands from History and settings.json forever?`,
            ru: `Удалить все ${count} команд из истории и settings.json навсегда?`,
            ok: 'Delete all / Удалить все',
        });
        if (!ok) {
            return;
        }
        customCommands = customCommands.filter(command => !command.archived);
        saveCustomCommands(true);
        rerender();
    }

    function addCommand(group, draft = {}) {
        if (group) {
            collapsedCats.delete(group);
            persistUi();
        }
        customCommands.push({
            label: draft.label || 'New command',
            command: draft.command || '',
            enabled: true,
            color: draft.color || '#02b5ff',
            position: draft.position || 'left',
            warningDialog: false,
            askerForCommand: false,
            then: [],
            group: group || '',
        });
        saveCustomCommands(true);
        rerender();
        const input = sectionsRoot.querySelector(`[data-focus="command-${customCommands.length - 1}"]`);
        if (input) {
            input.focus();
        }
    }

    function gitCommands() {
        return customCommands.map((command, index) => ({ command, index }))
            .filter(({ command }) => !command.archived && isGitItem(command));
    }

    function addGitCommand() {
        const existing = gitCommands();
        addCommand(GIT_CAT, {
            label: 'New git command',
            command: 'git ',
            color: existing[0] && existing[0].command.color,
            position: existing[0] && existing[0].command.position,
        });
    }

    function placeName(command) {
        if (isGitItem(command)) {
            return 'GIT Helps';
        }
        const group = command.group && commandGroups.find(item => item.id === command.group);
        return group ? `📂 ${group.label || 'Menu'}` : 'Own button';
    }

    /** "+" of a category: pick existing commands and Status Bar Icons, or start an empty one. */
    function openAddPicker(groupId, title, onNew) {
        const inGroup = command => !command.archived && (command.group || '') === groupId;
        const linkedHere = new Set(customCommands.filter(inGroup).map(command => command.vscodeCommand).filter(Boolean));
        const own = customCommands.map((command, index) => ({ command, index }))
            .filter(({ command }) => !command.archived && !inGroup(command));
        const builtins = (state.builtinCommands || []).filter(item => !linkedHere.has(item.vscodeCommand));
        const picked = new Set();

        const close = () => overlay.remove();
        const addButton = h('button', { class: 'button', disabled: true, onclick: apply }, 'Add / Добавить');
        const sync = () => {
            addButton.disabled = picked.size === 0;
            addButton.textContent = picked.size > 0 ? `Add ${picked.size} / Добавить` : 'Add / Добавить';
        };
        const row = (key, label, command, tag) => h('label', { class: 'picker__row' },
            h('input', {
                type: 'checkbox',
                onchange: event => {
                    if (event.target.checked) {
                        picked.add(key);
                    } else {
                        picked.delete(key);
                    }
                    sync();
                },
            }),
            h('span', { class: 'picker__text' },
                h('span', { class: 'picker__label' }, label || 'Untitled'),
                h('code', {}, command || '—')),
            tag && h('span', { class: 'picker__tag' }, tag));

        function apply() {
            for (const key of picked) {
                const [kind, value] = key.split(':');
                if (kind === 'own') {
                    const source = customCommands[Number(value)];
                    customCommands.push({ ...source, then: [...(source.then || [])], archived: false, enabled: true, group: groupId });
                } else {
                    const item = builtins[Number(value)];
                    customCommands.push({
                        label: item.label,
                        command: item.command,
                        vscodeCommand: item.vscodeCommand,
                        enabled: true,
                        color: item.color || '#02b5ff',
                        position: 'left',
                        warningDialog: false,
                        askerForCommand: false,
                        then: [],
                        group: groupId,
                    });
                }
            }
            collapsedCats.delete(groupId);
            persistUi();
            close();
            saveCustomCommands(true);
            rerender();
        }

        const overlay = h('div', { class: 'confirm', onclick: event => event.target === overlay && close() },
            h('div', { class: 'confirm__box picker' },
                h('h3', { class: 'picker__title' }, `Add to ${title} · Добавить в ${title}`),
                h('button', {
                    class: 'button button--dashed picker__new',
                    onclick: () => {
                        close();
                        onNew();
                    },
                }, '+ New empty command / Новая пустая команда'),
                h('div', { class: 'picker__lists' },
                    own.length > 0 && h('div', { class: 'picker__section' },
                        h('div', { class: 'picker__head' }, 'Your commands · копия команды'),
                        own.map(({ command, index }) => row(`own:${index}`, command.label, command.command, placeName(command)))),
                    builtins.length > 0 && h('div', { class: 'picker__section' },
                        h('div', { class: 'picker__head' }, 'Status Bar Icons · 🔗 запускает как кнопку'),
                        builtins.map((item, index) => row(`builtin:${index}`, item.label, item.command, '🔗 link')))),
                h('div', { class: 'confirm__actions' },
                    h('button', { class: 'button button--ghost', onclick: close }, 'Cancel / Отмена'),
                    addButton)));
        document.body.append(overlay);
    }

    function thenList(index) {
        return customCommands[index].then || [];
    }

    function addThen(index) {
        updateCommand(index, { then: [...thenList(index), ''] });
        rerender();
        const input = sectionsRoot.querySelector(`[data-focus="then-${index}-${thenList(index).length - 1}"]`);
        if (input) {
            input.focus();
        }
    }

    function updateThen(index, thenIndex, value, immediate) {
        const then = [...thenList(index)];
        then[thenIndex] = value;
        updateCommand(index, { then }, immediate);
    }

    function deleteThen(index, thenIndex) {
        updateCommand(index, { then: thenList(index).filter((_, itemIndex) => itemIndex !== thenIndex) });
        rerender();
    }

    function renderThenList(index) {
        const then = thenList(index);
        if (then.length === 0) {
            return undefined;
        }
        return h('div', { class: 'then-list' },
            then.map((command, thenIndex) => h('div', { class: 'then-row', 'data-search': command.toLowerCase() },
                withTip(h('span', { class: 'then-row__step' }, 'then'),
                    'Runs after the command above.',
                    'Выполнится после команды выше.'),
                h('input', {
                    class: 'text-input text-input--mono',
                    type: 'text',
                    value: command,
                    placeholder: 'flutter pub get',
                    'data-focus': `then-${index}-${thenIndex}`,
                    oninput: event => updateThen(index, thenIndex, event.target.value, false),
                    onchange: () => saveCustomCommands(true),
                    onkeydown: event => event.key === 'Enter' && event.target.blur(),
                }),
                h('button', { class: 'icon-button icon-button--danger', title: 'Remove', onclick: () => deleteThen(index, thenIndex) }, '✕'))));
    }

    function renderHistory() {
        const items = customCommands.map((command, index) => ({ command, index })).filter(({ command }) => command.archived);
        if (items.length === 0) {
            return undefined;
        }
        return h('div', { class: 'history' },
            h('div', { class: 'history__head' },
                h('h3', {}, 'History', h('span', { class: 'counter' }, String(items.length))),
                h('button', {
                    class: 'button button--ghost button--danger',
                    title: 'Delete all History forever',
                    onclick: clearHistory,
                }, '🗑️ Clear all / Удалить все')),
            h('p', { class: 'history__hint' }, 'Removed from the status bar, kept in settings.json. \nУбраны из status bar, сохранены в settings.json.'),
            items.map(({ command, index }) => h('div', {
                class: 'history__row',
                'data-search': `${command.label} ${command.command} history история`.toLowerCase(),
            },
                h('span', { class: 'dot', style: { background: command.color || 'var(--muted)' } }),
                h('div', { class: 'history__text' },
                    h('div', { class: 'row__label' }, command.label || 'Untitled'),
                    h('div', { class: 'row__hint' }, command.command)),
                h('button', { class: 'button button--ghost', onclick: () => restoreCommand(index) }, 'Restore / Вернуть'),
                h('button', { class: 'icon-button icon-button--danger', title: 'Delete forever', onclick: () => forgetCommand(index) }, '✕'))));
    }

    function addGroup() {
        const group = {
            id: `g${Date.now()}`,
            label: commandGroups.length === 0 ? 'Menu' : `Menu ${commandGroups.length + 1}`,
            color: '#02b5ff',
            position: 'left',
            enabled: true,
        };
        commandGroups.push(group);
        saveCustomCommands(true);
        rerender();
        openAddPicker(group.id, `«${group.label}»`, () => addCommand(group.id));
    }

    function updateGroup(id, patch, immediate = true) {
        commandGroups = commandGroups.map(group => group.id === id ? { ...group, ...patch } : group);
        saveCustomCommands(immediate);
    }

    async function deleteGroup(id) {
        const group = commandGroups.find(item => item.id === id);
        const name = (group && group.label) || 'Menu';
        const members = customCommands.filter(command => !command.archived && command.group === id);
        if (members.length > 0) {
            const ok = await askConfirm({
                en: `Delete category “${name}”? Its ${members.length} command(s) will move to History.`,
                ru: `Удалить категорию «${name}»? Её команды (${members.length}) уйдут в историю.`,
                ok: 'Delete / Удалить',
            });
            if (!ok) {
                return;
            }
        }
        commandGroups = commandGroups.filter(item => item.id !== id);
        const kept = [];
        const archived = [];
        customCommands.forEach(command => {
            if (command.group !== id) {
                kept.push(command);
            } else if (command.archived) {
                archived.push({ ...command, group: '' });
            } else {
                archived.push({ ...command, group: '', archived: true, enabled: false });
            }
        });
        customCommands = [...kept, ...archived];
        saveCustomCommands(true);
        rerender();
    }

    function persistUi() {
        vscode.setState({ collapsed: [...collapsed], collapsedCats: [...collapsedCats] });
    }

    function setCategoryCollapsed(id, value) {
        if (value) {
            collapsedCats.add(id);
        } else {
            collapsedCats.delete(id);
        }
        persistUi();
        const box = sectionsRoot.querySelector(`[data-category="${id}"]`);
        if (box) {
            box.classList.toggle('category--collapsed', value);
            const toggle = box.querySelector('.category__toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', String(!value));
                toggle.title = value ? 'Expand / Развернуть' : 'Collapse / Свернуть';
            }
        }
    }

    function categoryToggle(id) {
        const isCollapsed = collapsedCats.has(id);
        return h('button', {
            class: 'category__toggle',
            type: 'button',
            'aria-expanded': String(!isCollapsed),
            title: isCollapsed ? 'Expand / Развернуть' : 'Collapse / Свернуть',
            onclick: () => setCategoryCollapsed(id, !collapsedCats.has(id)),
        }, h('span', { class: 'card__chevron', 'aria-hidden': 'true' }));
    }

    function renderCategory(group) {
        const members = customCommands.map((command, index) => ({ command, index }))
            .filter(({ command }) => !command.archived && command.group === group.id);
        const isCollapsed = collapsedCats.has(group.id);
        const box = h('div', {
            class: `category${isCollapsed ? ' category--collapsed' : ''}`,
            'data-category': group.id,
            'data-flip-size': `group:${group.id}`,
            'data-search': `${group.label} category категория menu`.toLowerCase(),
        },
            h('div', { class: 'category__bar', 'data-flip': `group:${group.id}` },
                categoryToggle(group.id),
                h('span', { class: 'category__icon' }, '📂'),
                h('input', {
                    class: 'text-input category__name',
                    type: 'text',
                    value: group.label,
                    placeholder: 'Menu',
                    oninput: event => updateGroup(group.id, { label: event.target.value }, false),
                    onchange: () => saveCustomCommands(true),
                }),
                h('span', { class: 'category__hint' }, `${members.length} in one button · в одной кнопке`),
                state.colorizedCustom && h('input', {
                    class: 'color',
                    type: 'color',
                    value: normalizeColor(group.color),
                    title: 'Button color',
                    oninput: event => updateGroup(group.id, { color: event.target.value }, false),
                    onchange: () => saveCustomCommands(true),
                }),
                withTip(
                    segmented([{ value: 'left', label: '← Left' }, { value: 'right', label: 'Right →' }], group.position || 'left',
                        value => { updateGroup(group.id, { position: value }); rerender(); }),
                    'Position of this category button on the status bar.',
                    'Позиция этой кнопки-категории на status bar.',
                    'position',
                ),
                h('button', {
                    class: 'icon-button card__add',
                    title: 'Add command here',
                    onclick: () => openAddPicker(group.id, `«${group.label || 'Menu'}»`, () => addCommand(group.id)),
                }, '+'),
                h('button', { class: 'icon-button icon-button--danger', title: 'Delete category / Удалить категорию', onclick: () => deleteGroup(group.id) }, '✕')),
            h('div', { class: 'category__body' },
                members.length > 0
                    ? members.map(({ command, index }) => renderCommandCard(command, index))
                    : h('p', { class: 'category__empty' }, 'Drag commands here · Перетащите команды сюда')));
        bindDrop(box, group.id);
        return withBarHover(box, `group:${group.id}`);
    }

    function setGitMenuPosition(position) {
        customCommands.forEach((command, index) => {
            if (isGitItem(command) && !command.archived) {
                customCommands[index] = { ...command, position };
            }
        });
        saveCustomCommands(true);
        rerender();
    }

    function renderGitCategory() {
        const members = gitCommands();
        const isCollapsed = collapsedCats.has(GIT_CAT);
        const box = h('div', {
            class: `category${isCollapsed ? ' category--collapsed' : ''}`,
            'data-category': GIT_CAT,
            'data-flip-size': `group:${GIT_CAT}`,
            'data-search': 'git helps menu категория category',
        },
            h('div', { class: 'category__bar', 'data-flip': `group:${GIT_CAT}` },
                categoryToggle(GIT_CAT),
                h('span', { class: 'category__icon' }, '⎇'),
                h('span', { class: 'category__name' }, 'GIT Helps'),
                h('span', { class: 'category__hint' }, `${members.length} in one button · в одной кнопке`),
                members.length > 0 && state.colorizedCustom && h('input', {
                    class: 'color',
                    type: 'color',
                    value: normalizeColor(members[0].command.color),
                    title: 'Button color',
                    oninput: event => updateCommand(members[0].index, { color: event.target.value }, false),
                    onchange: () => saveCustomCommands(true),
                }),
                withTip(
                    segmented([{ value: 'left', label: '← Left' }, { value: 'right', label: 'Right →' }],
                        (members[0] && members[0].command.position) || 'left',
                        setGitMenuPosition),
                    'Position of the single Git status bar button.',
                    'Позиция одной кнопки Git на status bar.',
                    'position',
                ),
                h('button', {
                    class: 'icon-button card__add',
                    title: 'Add git command',
                    onclick: () => openAddPicker(GIT_CAT, 'GIT Helps', addGitCommand),
                }, '+')),
            h('div', { class: 'category__body' },
                members.length > 0
                    ? members.map(({ command, index }) => renderCommandCard(command, index))
                    : h('p', { class: 'category__empty' }, 'Drag commands here or add with + · Перетащите команды сюда или добавьте через +')));
        bindDrop(box, GIT_CAT);
        return withBarHover(box, 'customGitMenuIcon');
    }

    function renderCustomCommands() {
        const active = customCommands.map((command, index) => ({ command, index })).filter(({ command }) => !command.archived);
        if (customCommands.length === 0) {
            return h('div', { class: 'empty' },
                h('div', { class: 'empty__icon' }, '🛠️'),
                h('p', {}, 'No custom commands yet.'),
                h('div', { class: 'actions' },
                    h('button', { class: 'button', onclick: () => addCommand() }, '+ Add command'),
                    h('button', { class: 'button button--ghost', onclick: () => post({ type: 'defaultCustomCommands' }) }, 'Use examples')));
        }
        const knownGroups = new Set(commandGroups.map(group => group.id));
        const pins = active.filter(({ command }) =>
            !isGitItem(command) && !(command.group && knownGroups.has(command.group)));
        const pinList = h('div', { class: 'commands__pins', 'data-flip-size': 'pins' },
            pins.length > 0
                ? pins.map(({ command, index }) => renderCommandCard(command, index))
                : h('p', { class: 'history__hint' }, commandGroups.length > 0
                    ? 'Drop here for its own status bar button. / Сюда — отдельная кнопка на status bar.'
                    : 'No active commands. Restore one from History below. / Нет активных команд — верните из истории.'));
        bindDrop(pinList, '');
        return h('div', { class: 'commands' },
            state.gitMenuIcon !== false && renderGitCategory(),
            commandGroups.map(renderCategory),
            pinList,
            h('div', { class: 'commands__actions' },
                h('button', { class: 'button button--dashed', onclick: () => addCommand() }, '+ Add command'),
                h('button', { class: 'button button--dashed', onclick: addGroup }, '+ Category')),
            renderHistory());
    }

    // ---------- sections ----------

    function sectionCounter(section) {
        if (section.customCommands) {
            const live = customCommands.filter(command => command.enabled && !command.archived);
            return `${live.length}/${customCommands.filter(command => !command.archived).length}`;
        }
        const toggles = section.controls.filter(control => control.kind === 'boolean' || control.kind === 'visibility');
        return toggles.length > 0 ? `${toggles.filter(control => control.value).length}/${toggles.length}` : '';
    }

    function sectionIcon(section) {
        const src = typeof SECTION_ICONS !== 'undefined' && SECTION_ICONS[section.id];
        return src ? h('img', { class: 'section-icon', src, alt: '' }) : section.icon;
    }

    function focusSection(id) {
        const card = document.getElementById(`section-${id}`);
        if (!card) {
            pendingFocusId = id;
            return;
        }
        pendingFocusId = undefined;
        setCollapsed(id, false);
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function setCollapsed(id, value) {
        if (value) {
            collapsed.add(id);
        } else {
            collapsed.delete(id);
        }
        persistUi();
        const card = document.getElementById(`section-${id}`);
        if (card) {
            card.classList.toggle('card--collapsed', value);
            card.querySelector('.card__header').setAttribute('aria-expanded', String(!value));
        }
    }

    function renderSection(section) {
        const body = section.customCommands
            ? renderCustomCommands()
            : h('div', { class: section.grid ? 'grid' : 'list' }, section.controls.map(renderControl));
        const isCollapsed = collapsed.has(section.id);

        return h('section', { class: `card${isCollapsed ? ' card--collapsed' : ''}`, id: `section-${section.id}`, 'data-section': section.id },
            h('div', { class: 'card__toolbar' },
                h('button', {
                    class: 'card__header',
                    'aria-expanded': String(!isCollapsed),
                    onclick: () => setCollapsed(section.id, !collapsed.has(section.id)),
                },
                    h('span', { class: 'card__icon' }, sectionIcon(section)),
                    h('span', { class: 'card__titles' },
                        h('h2', {}, section.title, h('span', { class: 'counter' }, sectionCounter(section))),
                        h('p', {}, section.description)),
                    h('span', { class: 'card__chevron', 'aria-hidden': 'true' })),
                section.customCommands && h('button', {
                    class: 'icon-button card__add',
                    title: 'Add command',
                    onclick: () => {
                        setCollapsed(section.id, false);
                        addCommand();
                    },
                }, '+')),
            h('div', { class: 'card__body' },
                h('div', { class: 'card__inner' },
                    section.id === 'statusBar' && statusBarPreview(section),
                    body,
                    section.lesson && h('button', {
                        class: 'button button--ghost card__help card__help--inside',
                        type: 'button',
                        'data-search': 'подробнее more expand expanded',
                        onclick: () => openLesson(section.lesson),
                    }, 'Подробнее · More'))));
    }

    function renderNav() {
        return state.sections.map(section => h('a', {
            class: 'nav__item',
            href: `#section-${section.id}`,
            'data-nav': section.id,
            onclick: event => {
                event.preventDefault();
                setCollapsed(section.id, false);
                document.getElementById(`section-${section.id}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
        },
            h('span', { class: 'nav__icon' }, sectionIcon(section)),
            h('span', { class: 'nav__title' }, section.title),
            h('span', { class: 'nav__counter' }, sectionCounter(section))));
    }

    function rerender() {
        if (!state) {
            return;
        }
        const focused = document.activeElement && document.activeElement.getAttribute('data-focus');
        const scrollTop = document.scrollingElement.scrollTop;

        sectionsRoot.replaceChildren(...state.sections.map(renderSection));
        navRoot.replaceChildren(...renderNav());
        applySearch();
        observeSections();

        if (pendingFocusId) {
            focusSection(pendingFocusId);
        } else {
            document.scrollingElement.scrollTop = scrollTop;
        }
        if (focused) {
            const input = sectionsRoot.querySelector(`[data-focus="${focused}"]`);
            if (input) {
                input.focus();
            }
        }
    }

    function applySearch() {
        const query = searchInput.value.trim().toLowerCase();
        let anyVisible = false;
        sectionsRoot.classList.toggle('searching', Boolean(query));
        for (const card of sectionsRoot.querySelectorAll('.card')) {
            const rows = card.querySelectorAll('[data-search]');
            let visible = 0;
            rows.forEach(row => {
                const match = !query || row.getAttribute('data-search').includes(query);
                row.classList.toggle('hidden', !match);
                if (match) {
                    visible += 1;
                }
            });
            const title = card.querySelector('h2').textContent.toLowerCase();
            const show = !query || visible > 0 || title.includes(query);
            if (query && title.includes(query)) {
                rows.forEach(row => row.classList.remove('hidden'));
            }
            card.classList.toggle('hidden', !show);
            navRoot.querySelector(`[data-nav="${card.getAttribute('data-section')}"]`).classList.toggle('nav__item--dim', !show);
            anyVisible = anyVisible || show;
        }
        emptySearch.hidden = anyVisible;
    }

    let observer;
    function observeSections() {
        if (observer) {
            observer.disconnect();
        }
        observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    navRoot.querySelectorAll('.nav__item').forEach(item =>
                        item.classList.toggle('nav__item--active', item.getAttribute('data-nav') === entry.target.getAttribute('data-section')));
                }
            }
        }, { rootMargin: '-20% 0px -70% 0px' });
        sectionsRoot.querySelectorAll('.card').forEach(card => observer.observe(card));
    }

    function isEditingText() {
        const active = document.activeElement;
        return active && ((active.tagName === 'INPUT' && active.type === 'text') || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA');
    }

    function typeHeroTitle() {
        const title = document.querySelector('.hero__title');
        if (!title || title.dataset.typed === '1') {
            return;
        }
        const text = title.getAttribute('data-type') || 'Simpler Flutter Tasks';
        title.dataset.typed = '1';
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            title.textContent = text;
            title.classList.add('is-typed');
            return;
        }
        let index = 0;
        const tick = () => {
            index += 1;
            title.textContent = text.slice(0, index);
            if (index < text.length) {
                setTimeout(tick, 48);
            } else {
                setTimeout(() => title.classList.add('is-typed'), 900);
            }
        };
        setTimeout(tick, 180);
    }

    function setupHeroLogoMotion() {
        const wrap = document.querySelector('.hero__logo-wrap');
        const logo = wrap && wrap.querySelector('.hero__logo');
        if (!wrap || !logo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const setTilt = (rx, ry, tz, sc) => {
            logo.style.setProperty('--rx', `${rx}deg`);
            logo.style.setProperty('--ry', `${ry}deg`);
            logo.style.setProperty('--tz', `${tz}px`);
            logo.style.setProperty('--sc', String(sc));
        };
        wrap.addEventListener('pointermove', event => {
            const box = wrap.getBoundingClientRect();
            const x = (event.clientX - box.left) / box.width;
            const y = (event.clientY - box.top) / box.height;
            wrap.style.setProperty('--mx', `${x * 100}%`);
            wrap.style.setProperty('--my', `${y * 100}%`);
            wrap.classList.add('is-hot');
            setTilt((0.5 - y) * 24, (x - 0.5) * 32, 14, 1.1);
        });
        wrap.addEventListener('pointerleave', () => {
            wrap.classList.remove('is-hot');
            setTilt(0, 0, 0, 1);
        });
    }

    function applyState(next) {
        const first = !state;
        if (first) {
            sectionsRoot.classList.add('intro');
            setTimeout(() => sectionsRoot.classList.remove('intro'), 600);
        }
        state = next;
        customCommands = next.customCommands.map(command => ({ ...command }));
        commandGroups = (next.customCommandGroups || []).map(group => ({ ...group }));
        flavorConfig = {
            path: (next.flavorConfig && next.flavorConfig.path) || 'lib/main',
            flavors: ((next.flavorConfig && next.flavorConfig.flavors) || []).map(item => ({ ...item })),
            commands: ((next.flavorConfig && next.flavorConfig.commands) || []).map(item => ({ ...item })),
        };
        rerender();
        if (first) {
            document.body.classList.remove('is-booting');
            typeHeroTitle();
        }
        if (expectSaved) {
            expectSaved = false;
            showToast('Saved ✓');
        }
    }

    /** Re-renders a bit later so switch animations can finish, and never under the user's cursor. */
    function flushPendingState() {
        if (!state) {
            const next = pendingState;
            pendingState = undefined;
            if (next) {
                applyState(next);
            }
            return;
        }
        clearTimeout(renderTimer);
        renderTimer = setTimeout(() => {
            if (Date.now() < motionUntil) {
                flushPendingState();
                return;
            }
            if (pendingState && !isEditingText()) {
                const next = pendingState;
                pendingState = undefined;
                applyState(next);
            }
        }, RENDER_DELAY_MS);
    }

    window.addEventListener('message', event => {
        if (event.data.type === 'state') {
            pendingState = event.data.state;
            flushPendingState();
        }
        if (event.data.type === 'focusSection') {
            focusSection(event.data.id);
        }
    });

    document.addEventListener('focusout', flushPendingState);

    searchInput.addEventListener('input', applySearch);
    document.querySelector('[data-action="openSettingsJson"]').addEventListener('click', () => vscode.postMessage({ type: 'openSettingsJson' }));
    document.querySelector('[data-action="exportSettings"]').addEventListener('click', () => vscode.postMessage({ type: 'exportSettings' }));
    document.querySelector('[data-action="importSettings"]').addEventListener('click', () => vscode.postMessage({ type: 'importSettings' }));
    // TODO: EXPORT ALL JSON SETTINGS
    const exportAllJson = document.querySelector('[data-action="exportSettingsJson"]');
    const importAllJson = document.querySelector('[data-action="importSettingsJson"]');
    if (exportAllJson) {
        exportAllJson.addEventListener('click', () => vscode.postMessage({ type: 'exportSettingsJson' }));
    }
    if (importAllJson) {
        importAllJson.addEventListener('click', () => vscode.postMessage({ type: 'importSettingsJson' }));
    }

    setupHeroLogoMotion();
    vscode.postMessage({ type: 'ready' });
}());
