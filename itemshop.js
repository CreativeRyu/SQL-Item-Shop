import {loadTutorialSteps, clearTutorial } from "./tutorial.js";

import { LEVELS } from "./levels/index.js";
import { SHOP_LAYOUTS } from "./shopLayouts/index.js";
import {initNotebook, showNotebookUI, unlockNotebookEntry, completeNotebookEntry, getNotebookState, loadNotebookState} from "./notebook.js";
import { renderShopVisuals, hideTooltip} from "./shop.js";
import { processDiscoveries } from "./notebookDiscovery.js";
import {saveGame,loadGame} from "./savegame.js";
import { initDebugTools } from "./debugTools.js";
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
let hintTimeout;
let gameSystemsReady = false;
let gameActive = false;
let moneyCountAnimation;
let missionTransitionActive = false;
let levelTransitionActive = false;
const SCROLL_ANIMATION_DURATION = 480;
let gameState = {
    money: 0,
    hasNotebook: false,
    is_notebook_unlocked: false
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
    initStartScreen();
    showStartScreen();
    clearTutorial();
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
        is_notebook_unlocked: false
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
    gameState = save.gameState;
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
    if(gameState.hasNotebook) {
        showNotebookUI();
    }

    syncUnlockedShopItems();
    renderShopVisuals(db, getCurrentShopLayout(), buyNotebook, getKeyItemActions());
    refreshMoneyDisplay();
    refreshMission();
    updateEditorToolsVisibility();
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

    refreshMission();
    syncTutorialForCurrentMission();
    saveCurrentGame();
}

function completeCurrentLevel() {
    clearTutorial();
    clearTimeout(hintTimeout);

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
        gameState,
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
    clearTimeout(hintTimeout);

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
    clearQuestHint();
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

    startMissionHintTimer();
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

function startMissionHintTimer() {
    if(missionHasTutorial())
        return;
    clearTimeout(hintTimeout);
    const mission = getCurrentMission();
    if(!mission.hint)
        return;
    hintTimeout = setTimeout(() => {
        showHintMessage(mission.hint,true);
        renderQuestHint(mission.hint);
    }, 30000);
}

function renderQuestHint(text) {
    const hintBox = document.getElementById("quest-hint");
    hintBox.innerHTML = `
        <div class="quest-hint-title">
            Shopkeeper's HINT
        </div>
        <div class="quest-hint">
            ${text}
        </div>`;
}

function clearQuestHint() {
    const hintBox = document.getElementById("quest-hint");
    hintBox.innerHTML = "";
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
    renderShopVisuals(db, getCurrentShopLayout(), buyNotebook, getKeyItemActions());
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
    renderShopVisuals(db, getCurrentShopLayout(), buyNotebook, getKeyItemActions());
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
    showItemPopup(
        "SHOPKEEPER HINT",
        "./assets/sprites/shopItems/hint.png",
        "Schaltet einen\nShopkeeper-Hinweis\nfür diese Mission frei."
    );
    hideTooltip();
}

function showQueryBlueprintPopup() {
    showItemPopup(
        "QUERY BLUEPRINT",
        "./assets/sprites/shopItems/blueprint.png",
        "Schaltet ein\nQuery-Gerüst\nfür diese Mission frei."
    );
    hideTooltip();
}

function getKeyItemActions() {
    return {
        showShopkeeperHintPopup,
        showQueryBlueprintPopup
    };
}

function showItemPopup(title,icon,description,onClose) {
    clearTutorial();
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
        gameState,
        notebookState: getNotebookState()
    });
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
    clearTimeout(hintTimeout);
    currentMissionIndex = 0;
    await initCurrentLevelDatabase();

    if(editor) {
        editor.setValue("");
    }

    clearQueryPanels();

    renderShopVisuals(db, getCurrentShopLayout(), buyNotebook, getKeyItemActions());
    refreshMoneyDisplay();
    refreshMission();
    syncTutorialForCurrentMission();
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
        showRandomQuote();
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
