const commandsTab = document.getElementById("commands-tab");
const tablesTab =document.getElementById("tables-tab");


export function initNotebook() {
    commandsTab.onclick = () => {
    commandsTab.src = "./assets/ui/command_tab.png";
    tablesTab.src = "./assets/ui/table_tab_unselected.png";
    };

    tablesTab.onclick = () => {
    commandsTab.src = "./assets/ui/command_tab_unselected.png";
    tablesTab.src = "./assets/ui/table_tab.png";
    };
}

export function showNotebookUI() {
    const notebook = document.getElementById("sql-notebook-ui");
    notebook.style.display = "block";
}

