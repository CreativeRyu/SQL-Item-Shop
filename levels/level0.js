const level0 = {
  title: "Shop Training",
  missions: [
    {
      id: "first_query",
      title: "Die Datenbank erwacht",
      description: "Führe deine erste SQL Query aus.",
      hint: "Versuche etwas Einfaches wie SELECT 1;",
      reward: {
        money: 5,
      },
      unlocks: ["SELECT"],
      validator: (query, result) => {
        const normalized = query.toLowerCase().trim();
        return normalized.includes("select");
      },
    },
    {
      id: "hello_shopkeeper",
      title: "Gruss an den Händler",
      description: "Sende eine Nachricht an den Händler.",
      hint: "SQL kann auch Texte zurückgeben.",
      reward: {
        money: 10,
      },
      unlocks: ["TEXT_VALUES"],
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("select") && result.length > 0;
      },
    },
    {
      id: "show_products",
      title: "Produkte ansehen",
      description: "Zeige alle Produkte im Shop an.",
      hint: "Die Tabelle heißt wahrscheinlich products.",
      reward: {
        money: 15,
      },
      unlocks: ["FROM", "products"],
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("from products");
      },
    },
    {
      id: "only_names",
      title: "Nur die Namen",
      description: "Zeige nur die Namen der Produkte an.",
      hint: "Du musst nicht immer alle Spalten auswählen.",
      reward: {
        money: 20,
      },
      unlocks: ["COLUMN_SELECTION"],
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        if (!normalized.includes("from products")) {
          return false;
        }
        if (result.length === 0) {
          return false;
        }
        const columns = result[0].columns;
        return columns.length === 1 && columns.includes("name");
      },
    },

    {
      id: "buy_notebook",
      title: "Das alte SQL Notebook",
      description:
        "Du hast genug Gold verdient.<br>Kaufe das SQL Notebook im Shop.",
      hint: "Ich verkaufe manchmal nützliche Werkzeuge.",
      reward: {
        money: 0,
      },
      unlocks: ["SQL_NOTEBOOK"],
      validator: () => {
        return gameState.hasNotebook === true;
      },
    },
  ],
};

export default level0;
