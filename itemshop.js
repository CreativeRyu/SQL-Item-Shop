import {loadTutorialSteps, clearTutorial } from "./tutorial.js";

import { LEVELS } from "./levels/index.js";
import { level0ShopLayout } from "./shopLayouts/level0ShopLayout.js";
import {initNotebook, showNotebookUI, unlockNotebookEntry, completeNotebookEntry, getNotebookState, loadNotebookState} from "./notebook.js";
import { renderShopVisuals, hideTooltip} from "./shop.js";
import { processDiscoveries } from "./notebookDiscovery.js";
import {saveGame,loadGame} from "./savegame.js";
import {
    loadQuotes,
    showHintMessage,
    showRandomQuote,
    showWarningMessage, 
    showTutorialWarning,
    getRandomTutorialWarning
} from "./shopkeeper.js";

let db;
let editor;
let databaseReady = false;
let currentLevel = LEVELS.level0;
let currentMissionIndex = 0;
let hintTimeout;
let gameSystemsReady = false;
let gameActive = false;
let moneyCountAnimation;
let missionTransitionActive = false;
let gameState = {
    money: 0,
    hasNotebook: false,
    is_notebook_unlocked: false
};


async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    db = new SQL.Database();
    // Schema laden
    const schema = await fetch("./database/schema.sql")
        .then(res => res.text());

    db.run(schema);
    // Seed laden
    const seed = await fetch("./database/seed.sql")
        .then(res => res.text());

    db.run(seed);
    console.log("Datenbank geladen!");
    databaseReady = true;
}

window.inspectTable = function(table) {
    const result = db.exec(`PRAGMA table_info(${table})`);
    renderTable(result, `SCHEMA: ${table}`);
};

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

    await initDatabase();
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

    renderShopVisuals(db, level0ShopLayout, buyNotebook);
    refreshMoneyDisplay();
    refreshMission();
    updateEditorToolsVisibility();
    syncTutorialForCurrentMission();
}

function runQuery() {
    if(missionTransitionActive)
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
        processDiscoveries(query, result);
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

    clearTutorial();
    showMissionCompleteStamp(() => {
        advanceMission(mission);
    });
}

function advanceMission(mission) {
    if(mission.id === "notebook_intro") {
        currentLevel = LEVELS.level1;
        currentMissionIndex = 0;
        refreshMission();
        syncTutorialForCurrentMission();
        saveCurrentGame();
        showHintMessage("Willkommen im Ladenbetrieb, Azubi.");

        return;
    }

    currentMissionIndex++;

    // Level Ende
    if(currentMissionIndex >= currentLevel.missions.length) {
        clearTutorial();
        saveCurrentGame();
        return;
    }

    refreshMission();
    syncTutorialForCurrentMission();
    saveCurrentGame();
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
        <div class="quest-description">
            ${mission.description}
        </div>
    </div>
    `;

    startMissionHintTimer();
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

function unlockNotebook() {
    if(gameState.is_notebook_unlocked)
        return;
    gameState.is_notebook_unlocked = true;

    db.run(`
        INSERT INTO inventory
        (product_id, stock)
        VALUES (7, 1)
    `);
    renderShopVisuals(db, level0ShopLayout, buyNotebook);
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
    renderShopVisuals(db, level0ShopLayout, buyNotebook);
    showItemPopup("SQL NOTEBOOK","./assets/sprites/shopItems/notebook.png","Speichert deine neuen\nSQL Befehle und\nTabellenschemata.");
    hideTooltip();
    saveCurrentGame();
}

function showItemPopup(title,icon,description) {
    const overlay = document.getElementById("item-popup-overlay");
    document.getElementById("item-popup-title").innerText = title;
    document.getElementById("item-popup-icon").src = icon;
    document.getElementById("item-popup-description").innerText = description;
    overlay.style.display = "flex";
    overlay.onclick = () => {
        overlay.style.display = "none";
        showNotebookUI()
        if(getCurrentMission().id === "buy_notebook") {
        checkMission("", []);
    }
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
    await initDatabase();

    if(editor) {
        editor.setValue("");
    }

    document.getElementById("result").innerHTML = "";
    document.getElementById("error-box").innerHTML = "";

    renderShopVisuals(db, level0ShopLayout, buyNotebook);
    refreshMoneyDisplay();
    refreshMission();
    syncTutorialForCurrentMission();
    saveCurrentGame();

    showHintMessage("Level wurde neu gestartet.");
}

setInterval(() => {
    if(!gameActive)
        return;
    if(missionHasTutorial())
        return;
    const chance = Math.random();
    if(chance < 0.4) {
        showRandomQuote();
    }
}, 12000);


// DEBUG FEATURES

window.jumpToMission = (index) => {
    currentMissionIndex = index;
    refreshMission();
    const mission = getCurrentMission();
    if(mission?.tutorialSteps) {
        loadTutorialSteps(mission.tutorialSteps);
    }
};

window.debugNotebook = () => {
    gameState.money = 999;
    unlockNotebook();
    currentMissionIndex = 5;
    refreshMoneyDisplay();
    refreshMission();
    loadTutorialSteps(
        currentLevel.missions[5].tutorialSteps
    );
};

window.debugLevel1 = function() {
    currentLevel = LEVELS.level1;
    currentMissionIndex = 0;
    gameState.money = 999;
    gameState.hasNotebook = true;
    gameState.is_notebook_unlocked = true;
    showNotebookUI();
    clearTutorial();
    document.getElementById("tutorial-overlay").style.display = "none";
    refreshMoneyDisplay();
    refreshMission();
    console.log("Level 1 Debug gestartet");
};
