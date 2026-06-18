import {
    unlockNotebookEntry,
    completeNotebookEntry,
    rememberTableSchema
} from "./notebook.js";

export function processDiscoveries(query, result, db) {
    discoverTables(query, db);
}

function discoverTables(query, db) {
    const normalized = query.toLowerCase();
    const pragmaMatch = normalized.match(/pragma\s+table_info\s*\(\s*([a-z_]+)\s*\)/);

    if(!pragmaMatch || !db)
        return;

    const tableName = pragmaMatch[1];
    const schemaResult = db.exec(`PRAGMA table_info(${tableName})`);
    const tableExists = schemaResult[0]?.values?.length > 0;

    if(!tableExists)
        return;

    rememberTableSchema(
        tableName,
        schemaResult[0].values.map(row => ({
            name: row[1],
            type: row[2],
            notNull: row[3] === 1,
            defaultValue: row[4],
            pk: row[5] === 1
        }))
    );
}
