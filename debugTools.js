export function initDebugTools({
  LEVELS,
  getDb,
  setCurrentLevel,
  setCurrentMissionIndex,
  setGameState,
  initGameSystems,
  initCurrentLevelDatabase,
  enterGame,
  clearEditor,
  clearQueryPanels,
  renderTable,
  clearTutorial
}) {
  function inspectTable(table) {
    const result = getDb().exec(`PRAGMA table_info(${table})`);
    renderTable(result, `SCHEMA: ${table}`);
  }

  async function debug(levelInput = 0, missionInput = 1) {
    const levelId = normalizeLevelId(levelInput);
    const level = LEVELS[levelId];
    if(!level) {
      console.warn(`Debug level not found: ${levelInput}`);
      return;
    }

    const missionIndex = normalizeMissionIndex(missionInput);
    if(!level.missions[missionIndex]) {
      console.warn(
        `Debug mission not found: ${levelId} mission ${missionInput}`
      );
      return;
    }

    await initGameSystems();

    setCurrentLevel(level);
    setCurrentMissionIndex(missionIndex);
    setGameState({
      money: 999,
      hasNotebook: true,
      is_notebook_unlocked: true
    });

    await initCurrentLevelDatabase();
    clearTutorial();
    clearEditor();
    clearQueryPanels();
    document.getElementById("tutorial-overlay").style.display = "none";
    enterGame();
    console.log(
      `Debug gestartet: ${levelId}, Mission ${missionIndex + 1}`
    );
  }

  registerDebugTools({
    inspectTable,
    debug
  });
}

function normalizeLevelId(levelInput) {
  if(typeof levelInput === "number") {
    return `level${levelInput}`;
  }

  const normalized = String(levelInput).toLowerCase().trim();
  if(/^\d+$/.test(normalized)) {
    return `level${normalized}`;
  }

  return normalized.startsWith("level")
    ? normalized
    : `level${normalized}`;
}

function normalizeMissionIndex(missionInput) {
  const missionNumber = Number(missionInput);
  if(!Number.isFinite(missionNumber)) {
    return 0;
  }

  return Math.max(0, Math.floor(missionNumber) - 1);
}

function registerDebugTools(tools) {
  window.inspectTable = tools.inspectTable;
  window.debug = tools.debug;
  delete window.jumpToMission;
  delete window.debugNotebook;
  delete window.debugLevel1;
  delete window.debugLastMissionLevel1;
  delete window.debugLevel1LastMission;
}
