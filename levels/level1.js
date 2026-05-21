const level1 = {
  title: "SELECT Basics",
  missions: [
    {
      id: 1,
      title: "Tabellen finden",
      description: "Finde heraus welche Tabellen in der Datenbank existieren.<br> Wir verwenden SQLite.",
      hint: "SQLite besitzt interne Tabellen mit Metadaten.",
      reward: {
        money: 15
      },

  unlocks: [
    "SELECT",
    "sqlite_master"
  ],
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("sqlite_master");
      },
    },
    {
      id: 2,
      title: "Produkte anzeigen",
      description: "Zeige alle Produkte an.",
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("from products");
      },
    },
    {
      id: 3,
      title: "Kunden anzeigen",
      description: "Zeige alle Kunden an.",
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("from customers");
      },
    },
    {
      id: 4,
      title: "Produktnamen",
      description: "Zeige nur die Namen aller Produkte an.",
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
      id: 5,
      title: "Produkte unter 3€",
      description: "Finde alle Produkte die weniger als 3€ kosten.",
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return (
          normalized.includes("where") &&
          normalized.includes("price") &&
          result.length > 0
        );
      },
    },

    {
      id: 6,
      title: "Tabellenstruktur",
      description: "Finde die Struktur der products-Tabelle heraus.",
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return (
          normalized.includes("pragma") &&
          normalized.includes("table_info") &&
          normalized.includes("products")
        );
      },
    },
  ],
};

export default level1;
