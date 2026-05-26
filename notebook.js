const tablesTab = document.getElementById("tables-tab");
const dqlTab = document.getElementById("dql-tab");
const dmlTab = document.getElementById("dml-tab");
const ddlTab = document.getElementById("ddl-tab");
const dclTab = document.getElementById("dcl-tab");
const tclTab = document.getElementById("tcl-tab");
const notebookContent = document.getElementById("notebook-content");

const notebookState = {
    commands: [],
    tables: []
};

let currentPage = "TABLES";
export function initNotebook() {
    renderTablesPage();

    tablesTab.onclick = () => {
        resetTabs();
        currentPage = "TABLES";
        tablesTab.src = "./assets/ui/table_tab.png";
        renderTablesPage();
    };

    dqlTab.onclick = () => {
        resetTabs();
        currentPage = "DQL";
        dqlTab.src = "./assets/ui/dql_tab.png";
        renderCategoryPage("DQL");
    };

    dmlTab.onclick = () => {
        resetTabs();
        currentPage = "DML";
        dmlTab.src = "./assets/ui/dml_tab.png";
        renderCategoryPage("DML");
    };

    ddlTab.onclick = () => {
        resetTabs();
        currentPage = "DDL";
        ddlTab.src = "./assets/ui/ddl_tab.png";
        renderCategoryPage("DDL");
    };

    dclTab.onclick = () => {
        resetTabs();
        currentPage = "DCL";
        dclTab.src = "./assets/ui/dcl_tab.png";
        renderCategoryPage("DCL");
    };

    tclTab.onclick = () => {
        resetTabs();
        currentPage = "TCL";
        tclTab.src = "./assets/ui/tcl_tab.png";
        renderCategoryPage("TCL");
    };
}

function resetTabs() {
    tablesTab.src = "./assets/ui/table_tab_unselected.png";
    dqlTab.src = "./assets/ui/dql_tab_unselected.png";
    dmlTab.src = "./assets/ui/dml_tab_unselected.png";
    ddlTab.src = "./assets/ui/ddl_tab_unselected.png";
    dclTab.src = "./assets/ui/dcl_tab_unselected.png";
    tclTab.src = "./assets/ui/tcl_tab_unselected.png";
}

export function showNotebookUI() {
    const notebook = document.getElementById("sql-notebook-ui");
    notebook.style.display = "block";
}

function renderCategoryPage(category) {
    const categories = {
        DQL: {
            description: "Data Quiery Language<br><br>Abfragen von Daten",
            commands: [
                "SELECT",
                "WHERE",
                "JOIN",
                "GROUP BY",
                "HAVING"
            ]
        },

        DML: {
            description: "Data Manipulation Language<br><br>Daten verändern",
            commands: [
                "INSERT INTO",
                "UPDATE",
                "DELETE"
            ]
        },

        DDL: {
            description: "Data Definition Language<br><br>Tabellen und Struktur",
            commands: [
                "CREATE TABLE",
                "ALTER TABLE",
                "DROP TABLE"
            ]
        },

        DCL: {
            description: "Data Control Language<br><br>Rechte und Zugriffe",
            commands: [
                "GRANT",
                "REVOKE"
            ]
        },

        TCL: {
            description: "Transaction Control Language<br><br>Transaktionen steuern",
            commands: [
                "COMMIT",
                "ROLLBACK",
                "SAVEPOINT"
            ]
        }
    };

    const data = categories[category];

    let html = `
        <div class="notebook-left-page">
            <div class="notebook-category-title">
                ${category}
            </div>

            <div class="notebook-category-description">
                ${data.description}
            </div>

        </div>
        <div class="notebook-right-page">
    `;

    data.commands.forEach(command => {

        const unlocked = notebookState.commands.includes(command);

        html += `
            <div class="notebook-list-entry">

                <div class="notebook-list-text">
                    ${command}
                </div>

                <div class="notebook-list-status ${unlocked ? "unlocked" : "locked"}"></div>
            </div>
        `;
    });
    html += `</div>`;
    notebookContent.innerHTML = html;
}

function renderTablesPage() {
    const allTables = [
        "products",
        "inventory",
        "customers",
        "invoices"
    ];
    let html = `
        <div class="notebook-left-page">
            <div class="notebook-category-title">
                TABLES
            </div>
            <div class="notebook-category-description">
                Bekannte Tabellen und freigeschaltete Datenstrukturen.
            </div>
        </div>
        <div class="notebook-right-page">
    `;

    allTables.forEach(table => {
        const unlocked = notebookState.tables.includes(table);
        html += `
            <div class="notebook-list-entry">

                <div class="notebook-list-text">
                    ${table}
                </div>

                <div class="notebook-list-status ${unlocked ? "unlocked" : ""}">
                </div>

            </div>
        `;
    });

    html += `</div>`;
    notebookContent.innerHTML = html;
}

export function unlockNotebookEntry(entry) {
    const isTable = entry === entry.toLowerCase();
    if(isTable) {
        if(!notebookState.tables.includes(entry)) {
            notebookState.tables.push(entry);
        }
    } else {
        if(!notebookState.commands.includes(entry)) {
            notebookState.commands.push(entry);
        }
    }

    if(currentPage === "TABLES") {
        renderTablesPage();
    } else {
        renderCategoryPage(currentPage);
    }
}