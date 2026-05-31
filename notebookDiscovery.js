import {
    unlockNotebookEntry,
    completeNotebookEntry
} from "./notebook.js";

export function processDiscoveries(query, result) {
    discoverTables(query);
}

function discoverTables(query) {
    const normalized = query.toLowerCase();
    const pragmaMatch = normalized.match(/pragma\s+table_info\s*\(\s*([a-z_]+)\s*\)/);

    if(!pragmaMatch)
        return;

    const tableName = pragmaMatch[1];
    unlockNotebookEntry(tableName);
    completeNotebookEntry(tableName);
}