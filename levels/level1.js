const level1 = {
  levelId: "level1",
  title: "SELECT Basics",
  intro: {
    label: "Nächste Schicht",
    title: "Der Ladenbetrieb beginnt",
    description: "Jetzt wird aus Trockenübung echte Ladenarbeit. Du untersuchst Tabellen, liest Produkt- und Kundendaten und machst deine Abfragen genauer.",
    goalsIntro: "Was als Nächstes ansteht:",
    goals: [
      "Tabellen in der Datenbank finden",
      "Produkt- und Kundendaten gezielt anzeigen",
      "Erste WHERE-Bedingungen benutzen"
    ]
  },
  missions: [
    {
      id: "find_tables",
      title: "Die letzten Tabellen",
      description: "Finde heraus welche Tabellen im Laden noch übrig sind.",
      hint: "Nutze SELECT name FROM sqlite_master WHERE type='table';",
      reward: {
        money: 15
      },
      unlocks: [
        "products",
        "inventory",
        "customers",
        "sales"
      ],
      validator: (query, result) => {
        const normalized = query.toLowerCase();

        return (
          normalized.includes("sqlite_master") &&
          result.length > 0
        );
      }
    },
    {
      id: 2,
      title: "Produkte anzeigen",
      description: "Zeige alle Produkte an.",
      reward: {
        money: 15
      },
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("from products");
      }
    },
    {
      id: 3,
      title: "Kunden anzeigen",
      description: "Zeige alle Kunden an.",
      reward: {
        money: 15
      },
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("from customers");
      }
    },
    {
      id: 4,
      title: "Produktnamen",
      description: "Zeige nur die Namen aller Produkte an.",
      reward: {
        money: 20
      },
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
      }
    },
    {
      id: 5,
      title: "Produkte unter 3$",
      description: "Finde alle Produkte die weniger als 3$ kosten.",
      reward: {
        money: 25
      },
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return (
          normalized.includes("where") &&
          normalized.includes("price") &&
          result.length > 0
        );
      }
    },
    {
      id: 6,
      title: "Tabellenstruktur",
      description: "Finde die Struktur der products-Tabelle heraus.",
      reward: {
        money: 20
      },
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return (
          normalized.includes("pragma") &&
          normalized.includes("table_info") &&
          normalized.includes("products")
        );
      }
    }
  ],
};

export default level1;
