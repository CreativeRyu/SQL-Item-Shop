export function saveGame(data) {
    localStorage.setItem("sql-item-shop-save", JSON.stringify(data));
}

export function loadGame() {
    const save = localStorage.getItem("sql-item-shop-save");

    if(!save)
        return null;

    return JSON.parse(save);
}

export function deleteSave() {
    localStorage.removeItem("sql-item-shop-save");
}