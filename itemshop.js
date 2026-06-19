import {loadTutorialSteps, clearTutorial } from "./tutorial.js";

import { LEVELS } from "./levels/index.js";
import { SHOP_LAYOUTS } from "./shopLayouts/index.js";
import {initNotebook, showNotebookUI, unlockNotebookEntry, completeNotebookEntry, getNotebookState, loadNotebookState, setNotebookDatabaseProvider} from "./notebook.js";
import { renderShopVisuals, hideTooltip} from "./shop.js";
import { processDiscoveries } from "./notebookDiscovery.js";
import {saveGame,loadGame} from "./savegame.js";
import { initDebugTools } from "./debugTools.js";
import {
    initSoundEffects,
    playItemAcquiredSound,
    playSqlErrorSound,
    playStampSound
} from "./sounds.js";
import {
    loadQuotes,
    showHintMessage,
    showRandomQuote,
    showWarningMessage, 
    showTutorialWarning,
    getRandomTutorialWarning
} from "./shopkeeper.js";

let db;
let SQL;
let editor;
let databaseReady = false;
let currentLevel = LEVELS.level0;
let currentMissionIndex = 0;
let gameSystemsReady = false;
let gameActive = false;
let moneyCountAnimation;
let missionTransitionActive = false;
let levelTransitionActive = false;
const SCROLL_ANIMATION_DURATION = 480;
const GAME_BASE_WIDTH = 1718;
const GAME_MIN_SCALE = 0.72;
const GAME_SIDE_PADDING = 40;
const RADIO_PRICE = 100;
const RADIO_DECORATION_VISUAL = {
    sprite: "./assets/sprites/shopItems/radio.png",
    posX: 56,
    posY: 154,
    scale: 1.5
};
const MUSIC_TRACKS = [
    "./assets/music/LSV_Bossa_031_bpm_100bpm_G4.mp3",
    "./assets/music/LSV_Bossa_030_Jazz_94bpm_C5.mp3",
    "./assets/music/LSV_Bossa_028_bpm_106bpm_F4.mp3",
    "./assets/music/LSV_Bossa_027_bpm_106bpm_E4.mp3",
    "./assets/music/LSV_Bossa_025_NuJazz_104bpm_G4.mp3",
    "./assets/music/LSV_Bossa_016_laidback_104bpm_C4.mp3",
    "./assets/music/LSV_Bossa_011_lush_94bpm_E4.mp3",
    "./assets/music/LSV_Bossa_007_solos_137bpm_F4.mp3",
    "./assets/music/bossanovasong_1.wav"
];
const HELP_ITEMS = {
    hint: {
        price: 10,
        title: "SHOPKEEPER HINT",
        icon: "./assets/sprites/shopItems/hint.png",
        popupDescription: "Schaltet einen\nShopkeeper-Hinweis\nfür diese Aufgabe frei."
    },
    blueprint: {
        price: 25,
        title: "QUERY BLUEPRINT",
        icon: "./assets/sprites/shopItems/blueprint.png",
        popupDescription: "Schaltet ein\nQuery-Gerüst\nfür diese Aufgabe frei."
    }
};
let activeHelpType = null;
let musicPlayer;
let gameState = {
    money: 0,
    hasNotebook: false,
    is_notebook_unlocked: false,
    hasRadio: false,
    musicEnabled: false,
    currentTrackIndex: 0,
    helpPurchases: {}
};


async function initSqlEngine() {
    if(SQL)
        return SQL;

    SQL = await initSqlJs({
        locateFile: file =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    return SQL;
}

async function initDatabase(seedPath = "./database/seed.sql") {
    const SQL = await initSqlEngine();

    databaseReady = false;
    db = new SQL.Database();
    // Schema laden
    const schema = await fetch("./database/schema.sql")
        .then(res => res.text());

    db.run(schema);
    // Seed laden
    const seed = await fetch(seedPath)
        .then(res => res.text());

    db.run(seed);
    console.log(`Datenbank geladen: ${seedPath}`);
    databaseReady = true;
}

async function initCurrentLevelDatabase() {
    await initDatabase(currentLevel.seedPath);
}

bootApp();

function bootApp() {
    initSoundEffects();
    updateGameScale();
    window.addEventListener("resize", updateGameScale);
    initStartScreen();
    showStartScreen();
    clearTutorial();
}

function updateGameScale() {
    const availableWidth = window.innerWidth - GAME_SIDE_PADDING;
    const scale = Math.min(
        1,
        Math.max(GAME_MIN_SCALE, availableWidth / GAME_BASE_WIDTH)
    );

    document.documentElement.style.setProperty(
        "--game-scale",
        scale.toFixed(3)
    );

    window.dispatchEvent(new CustomEvent("game-scale-change"));
}

function initStartScreen() {
    const newGameButton = document.getElementById("new-game-btn");
    const loadGameButton = document.getElementById("load-game-btn");
    const supportProjectButton = document.getElementById("support-project-btn");
    const supportPopupCloseButton = document.getElementById("support-popup-close");
    const supportPopupOverlay = document.getElementById("support-popup-overlay");

    newGameButton.addEventListener("click", startNewGame);
    loadGameButton.addEventListener("click", continueGame);
    supportProjectButton.addEventListener("click", showSupportPopup);
    supportPopupCloseButton.addEventListener("click", hideSupportPopup);
    supportPopupOverlay.addEventListener("click", event => {
        if(event.target === supportPopupOverlay) {
            hideSupportPopup();
        }
    });
}

function showSupportPopup() {
    document
        .getElementById("support-popup-overlay")
        .classList.remove("hidden");
}

function hideSupportPopup() {
    document
        .getElementById("support-popup-overlay")
        .classList.add("hidden");
}

async function initGameSystems() {
    if(gameSystemsReady)
        return;

    await initSqlEngine();
    await loadQuotes();
    initNotebook();
    setNotebookDatabaseProvider(getDb);
    initHelpPanel();
    initSoundControls();
    gameSystemsReady = true;
}

function initEditor() {
    if(editor)
        return;

    editor = CodeMirror.fromTextArea(
    document.getElementById("sql-input"),
    {
        mode: "text/x-sql",
        theme: "ambiance",
        lineNumbers: true
    });

    const runButton = document.getElementById("run-btn");
    runButton.addEventListener("click", runQuery);
    const resetButton = document.getElementById("reset-level-btn");
    resetButton.addEventListener("click", resetCurrentLevel);
}


function showStartScreen() {
    document.getElementById("start-screen").classList.remove("hidden");
    document.getElementById("game-screen").classList.add("hidden");
}

function hideStartScreen() {
    document.getElementById("start-screen").classList.add("hidden");
}

function showGameScreen() {
    document.getElementById("game-screen").classList.remove("hidden");
}

async function startNewGame() {
    await initGameSystems();

    currentLevel = LEVELS.level0;
    currentMissionIndex = 0;
    gameState = {
        money: 0,
        hasNotebook: false,
        is_notebook_unlocked: false,
        hasRadio: false,
        musicEnabled: false,
        currentTrackIndex: 0,
        helpPurchases: {}
    };

    // später: altes Savegame löschen
    await initCurrentLevelDatabase();
    enterGame();
}

async function continueGame() {
    const save = loadGame();

    if (!save) {
        alert("Kein Spielstand gefunden.");
        return;
    }

    await initGameSystems();

    currentLevel = LEVELS[save.levelId] || LEVELS.level0;
    currentMissionIndex = save.missionIndex;
    gameState = normalizeGameState(save.gameState);
    gameState.musicEnabled = false;
    loadNotebookState(save.notebookState);

    await initCurrentLevelDatabase();
    enterGame();
}

function enterGame() {
    hideStartScreen();
    showGameScreen();
    window.scrollTo(0, 0);
    initEditor();
    gameActive = true;
    renderGame();
}

function renderGame() {
    gameState = normalizeGameState(gameState);

    if(gameState.hasNotebook) {
        showNotebookUI();
    }

    syncUnlockedShopItems();
    renderCurrentShopVisuals();
    refreshMoneyDisplay();
    refreshMission();
    renderLevelBanners();
    updateEditorToolsVisibility();
    updateSoundControls();
    updateHelpPanel();
    syncTutorialForCurrentMission();
}

function runQuery() {
    if(missionTransitionActive || levelTransitionActive)
        return;

    if (!databaseReady) {
        alert("Datenbank lädt noch...");
        return;
    }
    const query = editor.getValue();
    const resultDiv = document.getElementById("result");
    const errorBox = document.getElementById("error-box");

    resultDiv.innerHTML = "";
    errorBox.innerHTML = "";

    try {
        if(!isQueryAllowed(query)) {
            if(missionHasTutorial()) {
                showTutorialWarning(
                    getRandomTutorialWarning()
                );
            } else {
                showWarningMessage(
                    getRandomTutorialWarning()
                );
            }
            return;
        }
        const result = db.exec(query);
        processDiscoveries(query, result, db);
        renderTable(result);
        checkMission(query, result);

    } catch (err) {
        errorBox.innerText = err.message;
        playSqlErrorSound();
    }
}

function isQueryAllowed(query) {
    const forbidden = [
        "insert",
        "update",
        "delete",
        "drop",
        "alter",
        "create"
    ];
    const normalized = query.toLowerCase().trim();
    return !forbidden.some(keyword =>
        normalized.includes(keyword)
    );
}

function checkMission(query, result) {
    if(missionTransitionActive)
        return;

    const mission = getCurrentMission();
    const solved = mission.validator(query, result, gameState);
    if(!solved)
        return;
    
    const rewardMoney = mission.reward?.money || 0;
    const previousMoney = gameState.money;
    gameState.money += rewardMoney;
    mission.unlocks?.forEach(entry => {
        unlockNotebookEntry(entry);
    });

    mission.completes?.forEach(entry => {
        completeNotebookEntry(entry);
    });
    if(rewardMoney > 0) {
        animateMoneyGain(previousMoney, gameState.money, rewardMoney);
    } else {
        refreshMoneyDisplay();
    }

    if(mission.id === "names_and_prices") {
        unlockNotebook();
    }

    clearEditor();
    clearTutorial();
    showMissionCompleteStamp(() => {
        advanceMission(mission);
    });
}

function advanceMission(mission) {
    currentMissionIndex++;

    // Level Ende
    if(currentMissionIndex >= currentLevel.missions.length) {
        completeCurrentLevel();
        return;
    }

    renderCurrentShopVisuals();
    refreshMission();
    syncTutorialForCurrentMission();
    updateHelpPanel();
    saveCurrentGame();
}

function completeCurrentLevel() {
    clearTutorial();

    const completedLevel = currentLevel;
    const nextLevel = getNextLevel(completedLevel);

    if(!nextLevel) {
        currentMissionIndex = currentLevel.missions.length - 1;
        saveCurrentGame();
        showHintMessage("Mehr Ladenbetrieb kommt bald.");
        return;
    }

    saveGame({
        levelId: nextLevel.levelId,
        missionIndex: 0,
        gameState: getSaveableGameState(),
        notebookState: getNotebookState()
    });

    showLevelTransition(completedLevel, nextLevel, async () => {
        currentLevel = nextLevel;
        currentMissionIndex = 0;
        await initCurrentLevelDatabase();
        renderGame();
        saveCurrentGame();
        if(!missionHasTutorial()) {
            showHintMessage("Willkommen in der nächsten Schicht, Azubi.");
        }
    });
}

function getNextLevel(level) {
    const levels = Object.values(LEVELS);
    const currentIndex = levels.findIndex(
        entry => entry.levelId === level.levelId
    );

    if(currentIndex < 0)
        return null;

    return levels[currentIndex + 1] || null;
}

function showLevelTransition(completedLevel, nextLevel, onComplete) {
    levelTransitionActive = true;
    clearTutorial();

    const overlay = document.getElementById("level-transition-overlay");
    const content = document.getElementById("level-scroll-content");
    const button = document.getElementById("level-scroll-button");
    let step = "recap";

    overlay.classList.remove("hidden");
    content.classList.add("hidden");
    button.disabled = true;
    setLevelScrollImage("closed");

    setTimeout(() => {
        setLevelScrollImage("open");
    }, 60);

    setTimeout(() => {
        setLevelScrollImage("static");
        renderLevelScrollContent(
            completedLevel.recap || getFallbackRecap(completedLevel),
            "Weiter"
        );
        content.classList.remove("hidden");
        button.disabled = false;
    }, SCROLL_ANIMATION_DURATION + 60);

    button.onclick = () => {
        if(step === "recap") {
            step = "intro";
            renderLevelScrollContent(
                nextLevel.intro || getFallbackIntro(nextLevel),
                "Schicht starten"
            );
            return;
        }

        content.classList.add("hidden");
        button.disabled = true;
        setLevelScrollImage("close");

        setTimeout(() => {
            overlay.classList.add("hidden");
            levelTransitionActive = false;
            onComplete?.();
        }, SCROLL_ANIMATION_DURATION);
    };
}

function renderLevelScrollContent(data, buttonText) {
    document.getElementById("level-scroll-label").innerText =
        data.label || "";
    document.getElementById("level-scroll-title").innerText =
        data.title || "";
    document.getElementById("level-scroll-description").innerText =
        data.description || "";
    document.getElementById("level-scroll-button").innerText =
        buttonText;

    renderLevelScrollList(data.learned || data.goals || [], data.learnedIntro || data.goalsIntro);
}

function renderLevelScrollList(items, introText = "") {
    const list = document.getElementById("level-scroll-list");

    if(items.length === 0) {
        list.innerHTML = introText
            ? `<div class="level-scroll-list-intro">${introText}</div>`
            : "";
        return;
    }

    list.innerHTML = `
        ${introText ? `<div class="level-scroll-list-intro">${introText}</div>` : ""}
        <ul>
            ${items.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;
}

function setLevelScrollImage(state) {
    const image = document.getElementById("level-scroll-image");
    const paths = {
        closed: "./assets/ui/scroll_closed.png",
        open: "./assets/ui/scroll_open.gif",
        static: "./assets/ui/scroll.png",
        close: "./assets/ui/scroll_close.gif"
    };

    const src = paths[state];
    const shouldRestartGif = state === "open" || state === "close";
    image.src = shouldRestartGif
        ? `${src}?t=${Date.now()}`
        : src;
}

function getFallbackRecap(level) {
    return {
        label: "Schicht abgeschlossen",
        title: level.title,
        description: "Diese Schicht ist geschafft.",
        learned: []
    };
}

function getFallbackIntro(level) {
    return {
        label: "Nächste Schicht",
        title: level.title,
        description: "Ein neuer Abschnitt beginnt.",
        goals: []
    };
}

function showMissionCompleteStamp(onComplete) {
    const stamp = document.getElementById("mission-complete-stamp");
    missionTransitionActive = true;
    stamp.classList.remove("visible");

    requestAnimationFrame(() => {
        playStampSound();
        stamp.classList.add("visible");
    });

    setTimeout(() => {
        stamp.classList.remove("visible");
        missionTransitionActive = false;
        onComplete();
    }, 1100);
}

function renderTable(results, header= null) {
    const resultDiv =
        document.getElementById("result");
    resultDiv.innerHTML = "";

    if(results.length === 0) {
        resultDiv.innerHTML =
            "<p>Query erfolgreich ausgeführt.</p>";
        return;
    }
    results.forEach((tableData, index) => {
        let title = header || (results.length > 1 ? `Result ${index + 1}` : "Query Result");
        let html = `<h4>${title}</h4>`;
        html += "<table>";

        // Header
        html += "<tr>";
        tableData.columns.forEach(column => {
            html += `<th>${column}</th>`;
        });
        html += "</tr>";

        // Rows
        tableData.values.forEach(row => {
            html += "<tr>";
            row.forEach(cell => {
                html += `<td>${cell}</td>`;
            });
            html += "</tr>";
        });
        html += "</table>";
        resultDiv.innerHTML += html;
    });
}

function refreshMission() {
    const missionText = document.getElementById("mission-text");
    const panelHeader = document.querySelector(".quest-panel-header");
    const mission = getCurrentMission();
    panelHeader.innerHTML = `
        QUEST ${currentMissionIndex + 1}
        von ${currentLevel.missions.length}`;
    missionText.innerHTML = `
        <div class="quest-card">
        <div class="quest-title">
            ${mission.title}
        </div>
        ${renderMissionDescription(mission)}
    </div>
    `;
}

function renderLevelBanners() {
    const stack = document.getElementById("level-banner-stack");

    if(!stack)
        return;

    const levels = Object.values(LEVELS);
    const currentIndex = levels.findIndex(
        level => level.levelId === currentLevel.levelId
    );

    if(currentIndex < 0) {
        stack.innerHTML = "";
        return;
    }

    stack.innerHTML = levels
        .slice(0, currentIndex + 1)
        .map((level, index) => `
            <div
                class="level-banner ${index === currentIndex ? "current" : "completed"}"
                title="${level.title}">
                <span>${index}</span>
            </div>
        `)
        .join("");
}

function renderMissionDescription(mission) {
    if(mission.story || mission.task) {
        return `
            <div class="quest-description quest-description-expanded">
                ${mission.story ? `
                    <div class="quest-story">
                        <div class="quest-section-label">Der Shopkeeper:</div>
                        <div>${mission.story}</div>
                    </div>
                ` : ""}
                ${mission.task ? `
                    <div class="quest-task">
                        <div class="quest-section-label">Aufgabe:</div>
                        <div>${mission.task}</div>
                    </div>
                ` : ""}
            </div>
        `;
    }

    return `
        <div class="quest-description">
            ${mission.description}
        </div>
    `;
}

function refreshMoneyDisplay() {
    const moneyDisplay = document.getElementById("money-display");
    moneyDisplay.innerHTML = `
        <img src="./assets/sprites/Coin_Spin.gif">
        <span class="money-amount">${gameState.money}$</span>`;
}

function setMoneyDisplayAmount(amount) {
    const moneyAmount = document.querySelector("#money-display .money-amount");
    if(!moneyAmount) {
        refreshMoneyDisplay();
        return;
    }

    moneyAmount.innerText = `${amount}$`;
}

function animateMoneyGain(fromAmount, toAmount, rewardMoney) {
    cancelAnimationFrame(moneyCountAnimation);
    refreshMoneyDisplay();
    setMoneyDisplayAmount(fromAmount);
    showMoneyGainPopup(rewardMoney);

    const duration = 800;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentAmount = Math.round(
            fromAmount + (toAmount - fromAmount) * easedProgress
        );

        setMoneyDisplayAmount(currentAmount);

        if(progress < 1) {
            moneyCountAnimation = requestAnimationFrame(step);
            return;
        }

        setMoneyDisplayAmount(toAmount);
    }

    moneyCountAnimation = requestAnimationFrame(step);
}

function showMoneyGainPopup(rewardMoney) {
    const moneyDisplay = document.getElementById("money-display");
    const popup = document.createElement("span");
    popup.className = "money-gain-popup";
    popup.innerText = `+${rewardMoney}$`;
    moneyDisplay.appendChild(popup);

    popup.addEventListener("animationend", () => {
        popup.remove();
    });
}

function getCurrentMission() {
    return currentLevel
        .missions[currentMissionIndex];
}

function normalizeGameState(state = {}) {
    return {
        money: state.money || 0,
        hasNotebook: !!state.hasNotebook,
        is_notebook_unlocked: !!state.is_notebook_unlocked,
        hasRadio: !!state.hasRadio,
        musicEnabled: !!state.musicEnabled,
        currentTrackIndex: state.currentTrackIndex || 0,
        helpPurchases: state.helpPurchases || {}
    };
}

function getDb() {
    return db;
}

function setCurrentLevel(level) {
    currentLevel = level;
}

function setCurrentMissionIndex(index) {
    currentMissionIndex = index;
}

function setGameState(nextGameState) {
    gameState = nextGameState;
}

function getCurrentShopLayout() {
    return SHOP_LAYOUTS[currentLevel.shopLayoutId] || SHOP_LAYOUTS.level0;
}

function getCurrentMissionKey() {
    return `${currentLevel.levelId}:${getCurrentMission()?.id || currentMissionIndex}`;
}

function isHelpIntroduced() {
    if(currentLevel.levelId === "level2") {
        return currentMissionIndex >= 2;
    }

    return currentLevel.levelId !== "level0" && currentLevel.levelId !== "level1";
}

function getCurrentHelpPurchases() {
    const missionKey = getCurrentMissionKey();
    gameState.helpPurchases[missionKey] ||= {};
    return gameState.helpPurchases[missionKey];
}

function hasHelpPurchase(type) {
    return !!getCurrentHelpPurchases()[type];
}

function clearHelpPurchasesForLevel(levelId) {
    Object.keys(gameState.helpPurchases).forEach(key => {
        if(key.startsWith(`${levelId}:`)) {
            delete gameState.helpPurchases[key];
        }
    });
}

function getCurrentSpecialShopItems() {
    const items = [];

    if(gameState.hasRadio) {
        items.push({
            layoutId: "radio-decoration",
            name: "Retro Radio",
            stock: 1,
            visual: RADIO_DECORATION_VISUAL,
            isDecorative: true,
            hideCount: true,
            className: gameState.musicEnabled
                ? "shop-radio-decoration shop-radio-playing"
                : "shop-radio-decoration"
        });
    }

    if(!isHelpIntroduced())
        return items;

    if(!hasHelpPurchase("hint")) {
        items.push({
            layoutId: 12,
            name: "Shopkeeper Hint",
            stock: 1
        });
    }

    if(!hasHelpPurchase("blueprint")) {
        items.push({
            layoutId: 8,
            name: "Query Blueprint",
            stock: 1
        });
    }

    return items;
}

function renderCurrentShopVisuals() {
    renderShopVisuals(
        db,
        getCurrentShopLayout(),
        buyNotebook,
        getKeyItemActions(),
        getCurrentSpecialShopItems()
    );
}

function missionHasTutorial() {
    return !!getCurrentMission()?.tutorialSteps;
}

function syncTutorialForCurrentMission() {
    const mission = getCurrentMission();

    if(missionHasTutorial()) {
        loadTutorialSteps(
            mission.tutorialSteps,
            mission.softTutorial
        );
    } else {
        clearTutorial();
    }
}

function initHelpPanel() {
    document
        .getElementById("help-hint-tab")
        .addEventListener("click", () => selectHelpType("hint"));
    document
        .getElementById("help-blueprint-tab")
        .addEventListener("click", () => selectHelpType("blueprint"));
}

function selectHelpType(type) {
    if(!hasHelpPurchase(type))
        return;

    activeHelpType = type;
    updateHelpPanel();
}

function updateHelpPanel() {
    const panel = document.getElementById("help-panel");
    const hintTab = document.getElementById("help-hint-tab");
    const blueprintTab = document.getElementById("help-blueprint-tab");
    const card = document.getElementById("help-card");
    const cardTitle = document.getElementById("help-card-title");
    const cardContent = document.getElementById("help-card-content");

    if(!isHelpIntroduced()) {
        panel.classList.add("hidden");
        activeHelpType = null;
        return;
    }

    panel.classList.remove("hidden");

    if(activeHelpType && !hasHelpPurchase(activeHelpType)) {
        activeHelpType = null;
    }

    setHelpTabState(hintTab, "hint");
    setHelpTabState(blueprintTab, "blueprint");

    if(!activeHelpType) {
        card.className = "hidden";
        cardTitle.innerText = "";
        cardContent.innerHTML = "";
        return;
    }

    const content = getHelpContent(activeHelpType);
    card.className = `help-card-${activeHelpType}`;
    cardTitle.innerText = content.title;
    cardContent.innerHTML = content.body;
}

function setHelpTabState(tab, type) {
    tab.classList.toggle("unlocked", hasHelpPurchase(type));
    tab.classList.toggle("active", activeHelpType === type);
    tab.disabled = !hasHelpPurchase(type);
}

function getHelpContent(type) {
    const mission = getCurrentMission();

    if(type === "hint") {
        return {
            title: "Shopkeeper's Hint",
            body: mission.hint || "Für diese Mission liegt noch kein Hinweis bereit."
        };
    }

    return {
        title: "Query Blueprint",
        body: mission.blueprint || "Für diese Mission liegt noch kein Blueprint bereit."
    };
}

function clearEditor() {
    if(!editor)
        return;

    editor.setValue("");
}

function clearQueryPanels() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("error-box").innerHTML = "";
}

function syncUnlockedShopItems() {
    if(gameState.is_notebook_unlocked && !gameState.hasNotebook) {
        ensureInventoryItem(7, 1);
    }

    if(gameState.hasRadio) {
        db.run(`
            DELETE FROM inventory
            WHERE product_id = 8
        `);
    }
}

function ensureInventoryItem(productId, stock) {
    const result = db.exec(`
        SELECT stock
        FROM inventory
        WHERE product_id = ${productId}
    `);

    const hasItem = result[0]?.values?.length > 0;

    if(hasItem)
        return;

    db.run(`
        INSERT INTO inventory
        (product_id, stock)
        VALUES (${productId}, ${stock})
    `);
}

function unlockNotebook() {
    if(gameState.is_notebook_unlocked)
        return;
    gameState.is_notebook_unlocked = true;

    db.run(`
        INSERT INTO inventory
        (product_id, stock)
        VALUES (7, 1)
    `);
    renderCurrentShopVisuals();
}

function buyNotebook() {
    if(gameState.hasNotebook)
        return;
    if(gameState.money < 30) {
        showHintMessage("Du brauchst mehr Gold.");
        return;
    }
    gameState.money -= 30;
    gameState.hasNotebook = true;
    db.run(`
        DELETE FROM inventory
        WHERE product_id = 7
    `);
    refreshMoneyDisplay();
    renderCurrentShopVisuals();
    showItemPopup(
        "SQL NOTEBOOK",
        "./assets/sprites/shopItems/notebook.png",
        "Speichert deine neuen\nSQL Befehle und\nTabellenschemata.",
        () => {
            showNotebookUI();
            if(getCurrentMission().id === "buy_notebook") {
                checkMission("", []);
            }
        }
    );
    hideTooltip();
    saveCurrentGame();
}

function showShopkeeperHintPopup() {
    buyHelpItem("hint");
}

function showQueryBlueprintPopup() {
    buyHelpItem("blueprint");
}

function buyRadio() {
    if(gameState.hasRadio)
        return;

    if(gameState.money < RADIO_PRICE) {
        showHintMessage("Das Radio kostet 100 Gold. Erst verdienen, dann aufdrehen.");
        hideTooltip();
        return;
    }

    gameState.money -= RADIO_PRICE;
    gameState.hasRadio = true;
    gameState.musicEnabled = false;

    db.run(`
        DELETE FROM inventory
        WHERE product_id = 8
    `);

    refreshMoneyDisplay();
    renderCurrentShopVisuals();
    updateSoundControls();
    saveCurrentGame();

    showItemPopup(
        "RETRO RADIO",
        "./assets/sprites/shopItems/radio.png",
        "Schaltet Musik\nund Soundsteuerung\nfür den Laden frei.",
        () => {
            showHintMessage("Endlich Atmosphäre. Play drücken, dann arbeitet der Laden mit Rhythmus.");
        }
    );
    hideTooltip();
}

function buyHelpItem(type) {
    const item = HELP_ITEMS[type];

    if(!item)
        return;

    if(hasHelpPurchase(type)) {
        selectHelpType(type);
        return;
    }

    if(gameState.money < item.price) {
        showHintMessage("Dafür brauchst du mehr Gold. Disziplin ist kostenlos, Hinweise nicht.");
        hideTooltip();
        return;
    }

    gameState.money -= item.price;
    getCurrentHelpPurchases()[type] = true;
    activeHelpType = type;

    refreshMoneyDisplay();
    renderCurrentShopVisuals();
    updateHelpPanel();
    saveCurrentGame();

    showItemPopup(
        item.title,
        item.icon,
        item.popupDescription,
        () => {
            if(type === "hint") {
                const hint = getCurrentMission()?.hint;
                if(hint) {
                    showHintMessage(hint, true);
                }
            }

            updateHelpPanel();
        }
    );
    hideTooltip();
}

function getKeyItemActions() {
    return {
        showShopkeeperHintPopup,
        showQueryBlueprintPopup,
        buyRadio
    };
}

function initSoundControls() {
    const soundOnButton = document.getElementById("sound-on-btn");
    const soundOffButton = document.getElementById("sound-off-btn");
    const soundNextButton = document.getElementById("sound-next-btn");

    soundOnButton.addEventListener("click", playMusic);
    soundOffButton.addEventListener("click", stopMusic);
    soundNextButton.addEventListener("click", playNextTrack);
}

function getMusicPlayer() {
    if(musicPlayer)
        return musicPlayer;

    musicPlayer = new Audio();
    musicPlayer.volume = 0.45;
    musicPlayer.addEventListener("ended", playNextTrack);
    return musicPlayer;
}

function playMusic() {
    if(!gameState.hasRadio)
        return;

    const player = getMusicPlayer();
    gameState.currentTrackIndex = getRandomTrackIndex();
    player.src = MUSIC_TRACKS[gameState.currentTrackIndex];
    gameState.musicEnabled = true;
    renderCurrentShopVisuals();
    player.play().catch(() => {
        gameState.musicEnabled = false;
        renderCurrentShopVisuals();
        saveCurrentGame();
    });
    saveCurrentGame();
}

function stopMusic() {
    if(musicPlayer) {
        musicPlayer.pause();
        musicPlayer.currentTime = 0;
    }
    gameState.musicEnabled = false;
    renderCurrentShopVisuals();
    saveCurrentGame();
}

function playNextTrack() {
    if(!gameState.hasRadio)
        return;

    gameState.currentTrackIndex = (getCurrentTrackIndex() + 1) % MUSIC_TRACKS.length;

    if(gameState.musicEnabled) {
        const player = getMusicPlayer();
        player.src = MUSIC_TRACKS[gameState.currentTrackIndex];
        player.play().catch(() => {
            gameState.musicEnabled = false;
            saveCurrentGame();
        });
    }

    saveCurrentGame();
}

function getCurrentTrackIndex() {
    return gameState.currentTrackIndex % MUSIC_TRACKS.length;
}

function getRandomTrackIndex() {
    if(MUSIC_TRACKS.length <= 1)
        return 0;

    const currentIndex = getCurrentTrackIndex();
    let nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);

    while(nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
    }

    return nextIndex;
}

function updateSoundControls() {
    const controls = document.getElementById("sound-controls");
    controls.classList.toggle("hidden", !gameState.hasRadio);
}

function showItemPopup(title,icon,description,onClose) {
    clearTutorial();
    playItemAcquiredSound();
    const overlay = document.getElementById("item-popup-overlay");
    document.getElementById("item-popup-title").innerText = title;
    document.getElementById("item-popup-icon").src = icon;
    document.getElementById("item-popup-description").innerText = description;
    overlay.style.display = "flex";
    overlay.onclick = () => {
        overlay.style.display = "none";
        onClose?.();
    };
}

function saveCurrentGame() {
    saveGame({
        levelId: currentLevel.levelId,
        missionIndex: currentMissionIndex,
        gameState: getSaveableGameState(),
        notebookState: getNotebookState()
    });
}

function getSaveableGameState() {
    return {
        ...gameState,
        musicEnabled: false
    };
}

function updateEditorToolsVisibility() {
    const resetButton = document.getElementById("reset-level-btn");
    resetButton.classList.add("hidden");
}

async function resetCurrentLevel() {
    const confirmed = confirm("Dieses Level wirklich von vorne starten?");
    if(!confirmed)
        return;

    databaseReady = false;
    clearTutorial();
    currentMissionIndex = 0;
    clearHelpPurchasesForLevel(currentLevel.levelId);
    activeHelpType = null;
    await initCurrentLevelDatabase();

    if(editor) {
        editor.setValue("");
    }

    clearQueryPanels();

    renderCurrentShopVisuals();
    refreshMoneyDisplay();
    refreshMission();
    syncTutorialForCurrentMission();
    updateSoundControls();
    updateHelpPanel();
    saveCurrentGame();

    showHintMessage("Level wurde neu gestartet.");
}

setInterval(() => {
    if(!gameActive)
        return;
    if(levelTransitionActive)
        return;
    if(missionHasTutorial())
        return;
    const chance = Math.random();
    if(chance < 0.4) {
        showRandomQuote({
            includeMusicQuotes: gameState.musicEnabled
        });
    }
}, 12000);


initDebugTools({
    LEVELS,
    getDb,
    setCurrentLevel,
    setCurrentMissionIndex,
    setGameState,
    initGameSystems,
    initCurrentLevelDatabase,
    enterGame,
    clearEditor,
    clearQueryPanels,
    renderTable,
    clearTutorial
});
