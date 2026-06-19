import {
    NOTEBOOK_CATEGORIES,
    NOTEBOOK_TOPICS
} from "./notebookContent.js";

const tablesTab = document.getElementById("tables-tab");
const dqlTab = document.getElementById("dql-tab");
const dmlTab = document.getElementById("dml-tab");
const ddlTab = document.getElementById("ddl-tab");
const dclTab = document.getElementById("dcl-tab");
const tclTab = document.getElementById("tcl-tab");
const notebookContent = document.getElementById("notebook-content");
const notebookExpandButton = document.getElementById("notebook-expand-btn");
const largeNotebookOverlay = document.getElementById("large-notebook-overlay");
const largeNotebookCloseButton = document.getElementById("large-notebook-close");
const largeNotebookTabs = document.querySelectorAll(".large-notebook-tab");
const largeNotebookContent = document.getElementById("large-notebook-content");
const notebookState = {
    commands: {},
    tables: {},
    schemas: {}
};

const SMALL_NOTEBOOK_CATEGORIES = {
    TABLES: {
        title: "TABLES",
        description: "Bekannte Tabellen und freigeschaltete Datenstrukturen."
    },
    DQL: {
        title: "DQL",
        description: "Data Query Language<br><br>Abfragen von Daten"
    },
    DML: {
        title: "DML",
        description: "Data Manipulation Language<br><br>Daten verändern"
    },
    DDL: {
        title: "DDL",
        description: "Data Definition Language<br><br>Tabellen und Struktur"
    },
    DCL: {
        title: "DCL",
        description: "Data Control Language<br><br>Rechte und Zugriffe"
    },
    TCL: {
        title: "TCL",
        description: "Transaction Control Language<br><br>Transaktionen steuern"
    }
};

const PAGE_SIZE = 12;
const selectedEntries = {};
const pageOffsets = {};
let currentPage = "TABLES";
let currentDetailPage = 1;
let getDatabase = () => null;

export function initNotebook() {
    renderTablesPage();
    initLargeNotebook();

    tablesTab.onclick = () => selectPage("TABLES");
    dqlTab.onclick = () => selectPage("DQL");
    dmlTab.onclick = () => selectPage("DML");
    ddlTab.onclick = () => selectPage("DDL");
    dclTab.onclick = () => selectPage("DCL");
    tclTab.onclick = () => selectPage("TCL");
}

export function setNotebookDatabaseProvider(provider) {
    getDatabase = provider;
}

function initLargeNotebook() {
    notebookExpandButton.onclick = showLargeNotebook;
    largeNotebookCloseButton.onclick = hideLargeNotebook;
    largeNotebookOverlay.onclick = event => {
        if(event.target === largeNotebookOverlay) {
            hideLargeNotebook();
        }
    };

    largeNotebookTabs.forEach(tab => {
        tab.onclick = () => selectPage(tab.dataset.page);
    });
}

function selectPage(page) {
    currentPage = page;
    currentDetailPage = 1;
    ensureSelectedEntry(page);
    syncNotebookTabs();
    renderCurrentPage();
    renderLargeNotebookPage();
}

function showLargeNotebook() {
    ensureSelectedEntry(currentPage);
    syncNotebookTabs();
    renderLargeNotebookPage();
    largeNotebookOverlay.classList.remove("hidden");
}

function hideLargeNotebook() {
    largeNotebookOverlay.classList.add("hidden");
}

function renderCurrentPage() {
    if(currentPage === "TABLES") {
        renderTablesPage();
        return;
    }

    renderCategoryPage(currentPage);
}

function syncNotebookTabs() {
    const tabData = getTabData();

    Object.entries(tabData).forEach(([page, data]) => {
        data.small.src = page === currentPage
            ? data.selected
            : data.unselected;
    });

    largeNotebookTabs.forEach(tab => {
        const data = tabData[tab.dataset.page];
        tab.src = tab.dataset.page === currentPage
            ? data.selected
            : data.unselected;
    });
}

function getTabData() {
    return {
        TABLES: {
            small: tablesTab,
            selected: "./assets/ui/table_tab.png",
            unselected: "./assets/ui/table_tab_unselected.png"
        },
        DQL: {
            small: dqlTab,
            selected: "./assets/ui/dql_tab.png",
            unselected: "./assets/ui/dql_tab_unselected.png"
        },
        DML: {
            small: dmlTab,
            selected: "./assets/ui/dml_tab.png",
            unselected: "./assets/ui/dml_tab_unselected.png"
        },
        DDL: {
            small: ddlTab,
            selected: "./assets/ui/ddl_tab.png",
            unselected: "./assets/ui/ddl_tab_unselected.png"
        },
        DCL: {
            small: dclTab,
            selected: "./assets/ui/dcl_tab.png",
            unselected: "./assets/ui/dcl_tab_unselected.png"
        },
        TCL: {
            small: tclTab,
            selected: "./assets/ui/tcl_tab.png",
            unselected: "./assets/ui/tcl_tab_unselected.png"
        }
    };
}

export function showNotebookUI() {
    const notebook = document.getElementById("sql-notebook-ui");
    notebook.style.display = "block";
}

function renderCategoryPage(category) {
    const data = SMALL_NOTEBOOK_CATEGORIES[category];
    const topics = NOTEBOOK_TOPICS[category] || [];

    let html = `
        <div class="notebook-left-page">
            <div class="notebook-category-title">
                ${data.title}
            </div>

            <div class="notebook-category-description">
                ${data.description}
            </div>
        </div>
        <div class="notebook-right-page">
    `;

    topics
        .filter(topic => isEntryKnown(topic.unlockKey))
        .forEach(topic => {
            html += renderSmallEntry(topic.label, getEntryStatus(topic.unlockKey));
        });

    html += `</div>`;
    notebookContent.innerHTML = html;
}

function renderTablesPage() {
    const data = SMALL_NOTEBOOK_CATEGORIES.TABLES;
    let html = `
        <div class="notebook-left-page">
            <div class="notebook-category-title">
                TABLES
            </div>
            <div class="notebook-category-description">
                ${data.description}
            </div>
        </div>
        <div class="notebook-right-page">
    `;

    Object.entries(notebookState.tables)
        .forEach(([table, unlocked]) => {
            html += renderSmallEntry(table, unlocked ? "complete" : "known", "notebook-table-entry");
        });

    html += `</div>`;
    notebookContent.innerHTML = html;
}

function renderSmallEntry(label, status, extraClass = "") {
    return `
        <div class="notebook-list-entry ${extraClass}">
            <div class="notebook-list-text">
                ${escapeHtml(label)}
            </div>
            <div class="notebook-list-status ${status === "complete" ? "unlocked" : ""}"></div>
        </div>
    `;
}

function renderLargeNotebookPage() {
    if(currentPage === "TABLES") {
        renderLargeTablesPage();
        return;
    }

    renderLargeTopicPage(currentPage);
}

function renderLargeTopicPage(category) {
    const categoryData = NOTEBOOK_CATEGORIES[category];
    const topics = NOTEBOOK_TOPICS[category] || [];
    ensureSelectedEntry(category);
    const selectedTopic = topics.find(topic => topic.id === selectedEntries[category]) || topics[0];

    largeNotebookContent.innerHTML = `
        <div class="large-notebook-left-page">
            <div class="large-notebook-category-title">${categoryData.title}</div>
            <div class="large-notebook-category-description">${categoryData.description}</div>
            ${renderLargeEntryList(topics, category)}
        </div>
        <div class="large-notebook-right-page">
            ${renderTopicDetails(selectedTopic)}
        </div>
        ${renderLargePageNumber(currentDetailPage)}
        ${renderLargeNextButton(topics, category)}
    `;

    attachLargeEntryListeners(category, topics);
}

function renderLargeTablesPage() {
    const categoryData = NOTEBOOK_CATEGORIES.TABLES;
    const tables = Object.keys(notebookState.tables).map(table => ({
        id: table,
        label: table,
        unlockKey: table
    }));
    ensureSelectedEntry("TABLES");
    const selectedTable = selectedEntries.TABLES || tables[0]?.id;

    largeNotebookContent.innerHTML = `
        <div class="large-notebook-left-page">
            <div class="large-notebook-category-title">${categoryData.title}</div>
            <div class="large-notebook-category-description">${categoryData.description}</div>
            ${renderLargeEntryList(tables, "TABLES")}
        </div>
        <div class="large-notebook-right-page">
            ${renderTableDetails(selectedTable)}
        </div>
        ${renderLargePageNumber(currentDetailPage)}
        ${renderLargeNextButton(tables, "TABLES", selectedTable)}
    `;

    attachLargeEntryListeners("TABLES", tables);
}

function renderLargeEntryList(entries, page) {
    const offset = pageOffsets[page] || 0;
    const visibleEntries = entries.slice(offset, offset + PAGE_SIZE);

    return `
        <div class="large-notebook-entry-list">
            ${visibleEntries.map(entry => renderLargeEntry(entry, page)).join("")}
        </div>
    `;
}

function renderLargeNextButton(entries, page, selectedTable = "") {
    const hasMoreEntryPages = entries.length > PAGE_SIZE;
    const hasTablePreviewPage = page === "TABLES" && hasSchema(selectedTable);

    if(!hasMoreEntryPages && !hasTablePreviewPage) {
        return "";
    }

    return `
        <button
            class="large-notebook-next-page"
            type="button"
            title="Nächste Seite"
            aria-label="Nächste Seite anzeigen"></button>
    `;
}

function renderLargePageNumber(pageNumber) {
    return `
        <div class="large-notebook-page-number" aria-label="Seite ${pageNumber}">
            ${pageNumber}
        </div>
    `;
}

function renderLargeEntry(entry, page) {
    const status = getEntryStatus(entry.unlockKey);
    const active = selectedEntries[page] === entry.id;

    return `
        <button
            class="large-notebook-entry ${status} ${active ? "active" : ""}"
            type="button"
            data-entry-id="${escapeAttribute(entry.id)}">
            <span class="large-notebook-entry-label">${escapeHtml(entry.label)}</span>
            <span class="notebook-list-status ${status === "complete" ? "unlocked" : ""}"></span>
        </button>
    `;
}

function renderTopicDetails(topic) {
    if(!topic) {
        return `
            <div class="large-notebook-empty">
                Hier erscheinen Lerninhalte, sobald diese Kategorie Einträge hat.
            </div>
        `;
    }

    const status = getEntryStatus(topic.unlockKey);

    if(status === "locked") {
        return `
            <div class="large-notebook-detail-title">${escapeHtml(topic.label)}</div>
            <div class="large-notebook-locked-note">
                ${escapeHtml(topic.teaser || "Dieser Lerninhalt kommt in einer späteren Schicht.")}
            </div>
        `;
    }

    return `
        <div class="large-notebook-detail-title">${escapeHtml(topic.label)}</div>
        <div class="large-notebook-detail-section">
            ${escapeHtml(topic.summary || topic.teaser || "")}
        </div>
        ${topic.syntax ? renderCodeBlock("Syntax", topic.syntax) : ""}
        ${topic.example ? renderCodeBlock("Beispiel", topic.example) : ""}
        ${topic.note ? `
            <div class="large-notebook-shopkeeper-note">
                ${escapeHtml(topic.note)}
            </div>
        ` : ""}
    `;
}

function renderTableDetails(tableName) {
    if(!tableName) {
        return `
            <div class="large-notebook-empty">
                Sobald Tabellen bekannt sind, kannst du hier ihr Schema und eine kleine Vorschau ansehen.
            </div>
        `;
    }

    const schema = getKnownSchema(tableName);
    if(schema.length > 0 && currentDetailPage === 2) {
        return `
            <div class="large-notebook-detail-title">${escapeHtml(tableName)}</div>
            <div class="large-notebook-detail-section">
                Vorschau der ersten drei Zeilen. Das Schema wurde bereits freigeschaltet.
            </div>
            ${renderPreviewTable(tableName)}
        `;
    }

    return `
        <div class="large-notebook-detail-title">${escapeHtml(tableName)}</div>
        <div class="large-notebook-detail-section">
            Das Schema zeigt dir, welche Spalten diese Tabelle hat.
        </div>
        ${renderSchemaTable(tableName, schema)}
    `;
}

function renderSchemaTable(tableName, schema) {
    if(schema.length === 0) {
        return `
            <div class="large-notebook-schema-missing">
                Schema noch nicht untersucht.<br>
                Nutze:<br>
                <code>PRAGMA table_info(${escapeHtml(tableName)});</code>
            </div>
        `;
    }

    return `
        <div class="large-notebook-section-title">Schema</div>
        <table class="large-notebook-schema-table">
            <thead>
                <tr>
                    <th>Spalte</th>
                    <th>Typ</th>
                    <th>Info</th>
                </tr>
            </thead>
            <tbody>
                ${schema.map(column => `
                    <tr>
                        <td>${escapeHtml(column.name)}</td>
                        <td>${escapeHtml(column.type || "-")}</td>
                        <td>${column.pk ? "PRIMARY KEY" : ""}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function renderPreviewTable(tableName) {
    const db = getDatabase?.();

    if(!db || !isSafeTableName(tableName)) {
        return "";
    }

    const result = db.exec(`SELECT * FROM ${tableName} LIMIT 3`);
    const table = result[0];

    if(!table || table.values.length === 0) {
        return `
            <div class="large-notebook-section-title">Vorschau</div>
            <div class="large-notebook-empty">Keine Beispieldaten vorhanden.</div>
        `;
    }

    return `
        <div class="large-notebook-section-title">Vorschau</div>
        <table class="large-notebook-preview-table">
            <thead>
                <tr>
                    ${table.columns.map(column => `<th>${escapeHtml(column)}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${table.values.map(row => `
                    <tr>
                        ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function renderCodeBlock(label, code) {
    return `
        <div class="large-notebook-section-title">${label}</div>
        <pre class="large-notebook-code"><code>${escapeHtml(code)}</code></pre>
    `;
}

function attachLargeEntryListeners(page, entries) {
    largeNotebookContent
        .querySelectorAll(".large-notebook-entry")
        .forEach(button => {
            button.onclick = () => {
                selectedEntries[page] = button.dataset.entryId;
                currentDetailPage = 1;
                renderLargeNotebookPage();
            };
        });

    const nextButton = largeNotebookContent.querySelector(".large-notebook-next-page");
    if(nextButton) {
        nextButton.onclick = () => {
            if(page === "TABLES" && hasSchema(selectedEntries.TABLES)) {
                toggleTableDetailPage();
                renderLargeNotebookPage();
                return;
            }

            const currentOffset = pageOffsets[page] || 0;
            const nextOffset = currentOffset + PAGE_SIZE;
            pageOffsets[page] = nextOffset >= entries.length ? 0 : nextOffset;
            selectedEntries[page] = entries[pageOffsets[page]]?.id || "";
            currentDetailPage = 1;
            renderLargeNotebookPage();
        };
    }
}

function toggleTableDetailPage() {
    currentDetailPage = currentDetailPage === 2 ? 1 : 2;
}

function hasSchema(tableName) {
    return getKnownSchema(tableName).length > 0;
}

function getKnownSchema(tableName) {
    const storedSchema = notebookState.schemas[tableName] || [];
    if(storedSchema.length > 0) {
        return storedSchema;
    }

    if(notebookState.tables[tableName] !== true) {
        return [];
    }

    const db = getDatabase?.();
    if(!db || !isSafeTableName(tableName)) {
        return [];
    }

    const schemaResult = db.exec(`PRAGMA table_info(${tableName})`);
    const rows = schemaResult[0]?.values || [];

    if(rows.length === 0) {
        return [];
    }

    notebookState.schemas[tableName] = rows.map(row => ({
        name: row[1],
        type: row[2],
        notNull: row[3] === 1,
        defaultValue: row[4],
        pk: row[5] === 1
    }));

    return notebookState.schemas[tableName];
}

function ensureSelectedEntry(page) {
    const entries = page === "TABLES"
        ? Object.keys(notebookState.tables).map(table => ({ id: table }))
        : NOTEBOOK_TOPICS[page] || [];
    const selectedExists = entries.some(entry => entry.id === selectedEntries[page]);

    if(!selectedExists) {
        selectedEntries[page] = entries[pageOffsets[page] || 0]?.id || "";
    }
}

function getEntryStatus(key) {
    if(!key) {
        return "locked";
    }

    if(isEntryComplete(key)) {
        return "complete";
    }

    if(isEntryKnown(key)) {
        return "known";
    }

    return "locked";
}

function isEntryKnown(key) {
    return (
        key in notebookState.commands ||
        key in notebookState.tables
    );
}

function isEntryComplete(key) {
    return (
        notebookState.commands[key] === true ||
        notebookState.tables[key] === true
    );
}

export function unlockNotebookEntry(entry) {
    const isTable = isTableEntry(entry);
    if(isTable) {
        if(!(entry in notebookState.tables)) {
            notebookState.tables[entry] = false;
        }
    } else if(!(entry in notebookState.commands)) {
        notebookState.commands[entry] = false;
    }

    renderAfterNotebookStateChange();
}

export function completeNotebookEntry(entry) {
    const isTable = isTableEntry(entry);
    if(isTable) {
        notebookState.tables[entry] = true;
    } else {
        notebookState.commands[entry] = true;
    }

    renderAfterNotebookStateChange();
}

export function rememberTableSchema(tableName, columns) {
    notebookState.schemas[tableName] = columns;
    unlockNotebookEntry(tableName);
    completeNotebookEntry(tableName);
}

function renderAfterNotebookStateChange() {
    renderCurrentPage();
    if(!largeNotebookOverlay.classList.contains("hidden")) {
        ensureSelectedEntry(currentPage);
        renderLargeNotebookPage();
    }
}

function isTableEntry(entry) {
    return entry === entry.toLowerCase();
}

export function getNotebookState() {
    return notebookState;
}

export function loadNotebookState(data = {}) {
    notebookState.commands = data.commands || {};
    notebookState.tables = data.tables || {};
    notebookState.schemas = data.schemas || {};

    renderAfterNotebookStateChange();
}

function isSafeTableName(tableName) {
    return /^[a-z_][a-z0-9_]*$/i.test(tableName);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
