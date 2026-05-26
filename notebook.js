const commandsTab = document.getElementById("commands-tab");
const tablesTab =document.getElementById("tables-tab");
const notebookContent = document.getElementById("notebook-content");

const notebookState = {
    commands: [],
    tables: []
};


export function initNotebook() {
    renderCommandsPage();
    commandsTab.onclick = () => {
    commandsTab.src = "./assets/ui/command_tab.png";
    tablesTab.src = "./assets/ui/table_tab_unselected.png";
    renderCommandsPage();
    };

    tablesTab.onclick = () => {
    commandsTab.src = "./assets/ui/command_tab_unselected.png";
    tablesTab.src = "./assets/ui/table_tab.png";
    renderTablesPage();
    };
}

export function showNotebookUI() {
    const notebook = document.getElementById("sql-notebook-ui");
    notebook.style.display = "block";
}

function renderCommandsPage() {
    const allCommands = [
        "SELECT",
        "FROM",
        "WHERE",
        "LIKE",
        "JOIN",
        "GROUP BY",
        "INSERT INTO"
    ];

    let html = "";
    allCommands.forEach(command => {
    const unlocked = notebookState.commands.includes(command);
        html += `
            <div class="notebook-entry">
                ${command}
                ${unlocked ? "✅" : "⬜"}
            </div>
        `;
    });

    notebookContent.innerHTML = html;
}

function renderTablesPage() {
    const allTables = [
        "products",
        "inventory",
        "customers",
        "invoices"
    ];
    let html = "";
    allTables.forEach(table => {
    const unlocked = notebookState.tables.includes(table);
        html += `
            <div class="notebook-entry">
                ${table}
                ${unlocked ? "✅" : "⬜"}
            </div>
        `;
    });

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

    renderCommandsPage();
}
