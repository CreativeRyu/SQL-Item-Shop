import {loadTutorialSteps } from "./tutorial.js";
import level0 from "./levels/level0.js";
import level1 from "./levels/level1.js";
import {initNotebook, showNotebookUI, unlockNotebookEntry, completeNotebookEntry} from "./notebook.js";
import { renderShopVisuals, hideTooltip} from "./shop.js";
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
let tutorialActive = true;
let currentLevel = level0;
let currentMissionIndex = 0;
let hintTimeout;
let tutorialViolations = 0;
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

startApp();

async function startApp() {
    await initDatabase();
    await loadQuotes();
    loadTutorialSteps(currentLevel.missions[0].tutorialSteps, currentLevel.missions[0].softTutorial);
    initNotebook();
    renderShopVisuals(db, buyNotebook);
    refreshMoneyDisplay();
    refreshMission();
    editor = CodeMirror.fromTextArea(
    document.getElementById("sql-input"),
    {
        mode: "text/x-sql",
        theme: "ambiance",
        lineNumbers: true
    });

    const runButton = document.getElementById("run-btn");
    runButton.addEventListener("click", runQuery);
}

function runQuery() {
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
        if(tutorialActive && !isTutorialQueryAllowed(query)) {
            console.log("WARNING AUSGELÖST");
            showTutorialWarning(getRandomTutorialWarning());
            return;
        }

        const result = db.exec(query);
        renderTable(result);
        checkMission(query, result);

    } catch (err) {
        errorBox.innerText = err.message;
    }
}

function isTutorialQueryAllowed(query) {
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
    const mission = getCurrentMission();
    const solved = mission.validator(query, result, gameState);
    if(!solved)
        return;
    
    const rewardMoney = mission.reward?.money || 0;
    gameState.money += rewardMoney;
    mission.unlocks?.forEach(entry => {
        unlockNotebookEntry(entry);
    });

    mission.completes?.forEach(entry => {
        completeNotebookEntry(entry);
    });
    refreshMoneyDisplay();


    currentMissionIndex++;
    const nextMission = getCurrentMission();
    if(nextMission?.tutorialSteps) {
        loadTutorialSteps(nextMission.tutorialSteps, nextMission.softTutorial);
        }      

    if(mission.id === "names_and_prices") {
        unlockNotebook();
    }

    if(mission.id === "notebook_intro") {
        tutorialActive = false;
        document.getElementById("tutorial-overlay").style.display = "none";
        currentLevel = level1;
        currentMissionIndex = 0;
        refreshMission();
        showHintMessage("Willkommen im Ladenbetrieb, Azubi.");
        return;
    }

    // Level Ende
    if(currentMissionIndex >= currentLevel.missions.length) {
        refreshMission();
        return;
    }

    refreshMission();
}

function renderTable(results) {
    const resultDiv =
        document.getElementById("result");
    resultDiv.innerHTML = "";

    if(results.length === 0) {
        resultDiv.innerHTML =
            "<p>Query erfolgreich ausgeführt.</p>";
        return;
    }
    results.forEach((tableData, index) => {
        let html = `<h4>Result ${index + 1}</h4>`;
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
        <span>${gameState.money}$</span>`;
}

function getCurrentMission() {
    return currentLevel
        .missions[currentMissionIndex];
}


function startMissionHintTimer() {
    if(tutorialActive)
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
    renderShopVisuals(db, buyNotebook);
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
    renderShopVisuals(db, buyNotebook);
    showItemPopup("SQL NOTEBOOK","./assets/sprites/shopItems/notebook.png","Speichert deine neuen\nSQL Befehle und\nTabellenschemata.");
    hideTooltip();
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

setInterval(() => {
    if(tutorialActive)
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
    currentLevel = level1;
    currentMissionIndex = 0;
    gameState.money = 999;
    gameState.hasNotebook = true;
    gameState.is_notebook_unlocked = true;
    showNotebookUI();
    tutorialActive = false;
    document.getElementById(
        "tutorial-overlay"
    ).style.display = "none";
    refreshMoneyDisplay();
    refreshMission();
    console.log("Level 1 Debug gestartet");
};