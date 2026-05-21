import level0 from "./levels/level0.js";

let db;
let editor;
let databaseReady = false;
let gameState = {
    money: 0,
    hasNotebook: false
};
let currentLevel = level0;
let currentMissionIndex = 0;
let hintTimeout;
const shopItems = document.getElementById("shop-items");
let quotes = [];

async function loadQuotes() {
    quotes = await fetch("./shopkeeperQuotes.json")
        .then(res => res.json());
}

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
    renderShopVisuals();
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

function renderShopVisuals() {
    const result = db.exec(`SELECT
        products.name,
        products.sprite,
        products.pos_x,
        products.pos_y,
        products.scale,
        inventory.stock
    FROM inventory
    JOIN products
    ON inventory.product_id = products.id`);

    const rows = result[0].values;
    shopItems.innerHTML = "";

    rows.forEach(row => {
        const name = row[0];
        const sprite = row[1];
        const posX = row[2];
        const posY = row[3];
        const scale = row[4];
        const stock = row[5];

        const html = `
        <div class="item-stack"
            style="
            left:${posX}px;
            top:${posY}px;">

            <img class="shop-item"
                src="${sprite}"
                style="transform: scale(${scale});">

            <div class="item-count"
            style="
                right:${-7 * scale}px;
                bottom:${-8 * scale}px;">
                ${stock}
            </div>
        </div>`;

        shopItems.innerHTML += html;
    });
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
        const result = db.exec(query);
        renderTable(result);
        checkMission(query, result);

    } catch (err) {
        errorBox.innerText = err.message;
    }
}

function checkMission(query, result) {
    const mission = getCurrentMission();
    const solved = mission.validator(query, result);
    if(!solved)
        return;
    
    const rewardMoney = mission.reward?.money || 0;
    gameState.money += rewardMoney;
    refreshMoneyDisplay();

    currentMissionIndex++;

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
    const missionText = document.getElementById("mission-text");
    const missionStatus = document.getElementById("mission-status");
    const mission = getCurrentMission();
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

    if(currentMissionIndex >= currentLevel.missions.length) {
        missionStatus.innerHTML = `✅ Level abgeschlossen`;
    } else {
        missionStatus.innerHTML = `Mission ${currentMissionIndex + 1}
        / ${currentLevel.missions.length}`;
    }
    startMissionHintTimer();
}

function refreshMoneyDisplay() {
    const moneyDisplay = document.getElementById("money-display");
    moneyDisplay.innerHTML = `
        <img src="./assets/sprites/Coin_spin.gif">
        <span>${gameState.money}$</span>`;
}

function getCurrentMission() {
    return currentLevel
        .missions[currentMissionIndex];
}

function showHintMessage(text) {
    const bubble = document.getElementById("shopkeeper-hint");
    bubble.innerHTML = text;
    bubble.classList.add("visible");
    clearTimeout(bubble.hideTimeout);
    bubble.hideTimeout =
        setTimeout(() => {
            bubble.classList.remove("visible");
        }, 7000);
}

function startMissionHintTimer() {
    clearTimeout(hintTimeout);
    const mission = getCurrentMission();
    if(!mission.hint)
        return;
    hintTimeout = setTimeout(() => {
        showHintMessage(
            mission.hint,
            true
        );
    }, 35000);
}

function showRandomQuote() {
    if(quotes.length === 0)
        return;
    const bubble = document.getElementById("shopkeeper-dialogue");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    bubble.innerText = randomQuote;
    bubble.style.opacity = 1;
    setTimeout(() => {
        bubble.style.opacity = 0;
    }, 4000);
}

setInterval(() => {
    const chance = Math.random();
    if(chance < 0.35) {
        showRandomQuote();
    }
}, 12000);