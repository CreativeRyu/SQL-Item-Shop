function normalizedQuery(query) {
  return query.toLowerCase();
}

function usesTable(query, tableName) {
  return normalizedQuery(query).includes(`from ${tableName}`);
}

function avoidsWhere(query) {
  return !normalizedQuery(query).includes("where");
}

function hasResult(result) {
  return result.length > 0;
}

function hasColumns(result, expectedColumns) {
  if(!hasResult(result)) {
    return false;
  }

  const columns = result[0].columns;

  return (
    columns.length === expectedColumns.length &&
    expectedColumns.every(column => columns.includes(column))
  );
}

function selectsAllFrom(query, result, tableName) {
  return (
    usesTable(query, tableName) &&
    avoidsWhere(query) &&
    hasResult(result)
  );
}

function selectsColumnsFrom(query, result, tableName, expectedColumns) {
  return (
    usesTable(query, tableName) &&
    avoidsWhere(query) &&
    hasColumns(result, expectedColumns)
  );
}

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
      "Mehrere Spalten sauber auswählen",
      "Tabellenstrukturen mit PRAGMA table_info nachschlagen"
    ]
  },
  missions: [
    {
      id: "find_tables",
      title: "Die letzten Tabellen",
      description: "Finde heraus welche Tabellen im Laden noch übrig sind.",
      story:
        "Die letzten beiden Azubis haben aus diesem Laden fast ein sehr teures Lagerfeuer gemacht. "  +
        "Bevor wir arbeiten, prüfen wir erstmal, welche Tabellen überhaupt noch übrig sind.",
      task: "Finde heraus welche Tabellen im Laden noch übrig sind.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "So, wir schauen mal, welche Tabellen die letzten beiden Azubis hier noch übrig gelassen haben."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "SQLite führt dafür eine interne Liste. Die heißt <span class='sql-table'>sqlite_master</span>."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          waitForMission: true,
          text:
            "Tippe jetzt:<br><br>" +
            "<span class='sql-keyword'>SELECT</span> name " +
            "<span class='sql-keyword'>FROM</span> <span class='sql-table'>sqlite_master</span><br>" +
            "<span class='sql-keyword'>WHERE</span> type = <span class='sql-string'>'table'</span>;"
        }
      ],
      hint:
        "Nutze <span class='sql-keyword'>SELECT</span> name " +
        "<span class='sql-keyword'>FROM</span> <span class='sql-table'>sqlite_master</span> " +
        "<span class='sql-keyword'>WHERE</span> type = <span class='sql-string'>'table'</span>;",
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
        const normalized = normalizedQuery(query);

        return (
          normalized.includes("sqlite_master") &&
          hasResult(result)
        );
      }
    },
    {
      id: "show_products",
      title: "Warenbestand prüfen",
      description: "Zeige alle Produkte an.",
      story:
        "Wenn ein Kunde fragt, was wir haben, möchte ich nicht mit 'Moment, ich rate kurz' antworten. " +
        "Zeig mir die komplette Produkttabelle.",
      task: "Zeige alle Produkte aus der Tabelle products an.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Sauber. Das <span class='sql-keyword'>WHERE</span> war gerade nur ein kleiner SQLite-Filter für die Tabellenliste. Richtig trainieren wir Bedingungen erst später."
        }
      ],
      reward: {
        money: 15
      },
      validator: (query, result) => selectsAllFrom(query, result, "products")
    },
    {
      id: "show_customers",
      title: "Kundenliste prüfen",
      description: "Zeige alle Kunden an.",
      story:
        "Die letzten Azubis haben Kundennamen auf Bierdeckel geschrieben. " +
        "Bitte sag mir, dass unsere Datenbank wenigstens noch Kunden kennt.",
      task: "Zeige alle Kunden aus der Tabelle customers an.",
      reward: {
        money: 15
      },
      validator: (query, result) => selectsAllFrom(query, result, "customers")
    },
    {
      id: "show_inventory",
      title: "Lager zählen",
      description: "Zeige den kompletten Lagerbestand an.",
      story:
        "Produkte im Regal sind schön. Produkte im Lager sind besser. " +
        "Schau nach, was laut Inventar noch da ist.",
      task: "Zeige alle Einträge aus der Tabelle inventory an.",
      reward: {
        money: 15
      },
      validator: (query, result) => selectsAllFrom(query, result, "inventory")
    },
    {
      id: "product_names",
      title: "Nur die Produktnamen",
      description: "Zeige nur die Namen aller Produkte an.",
      story:
        "Der Preisschilder-Stapel sieht aus, als hätte jemand Cardio mit Bürobedarf verwechselt. " +
        "Wir machen das sauber: Erstmal nur die Produktnamen.",
      task: "Zeige nur die Spalte name aus der Tabelle products an.",
      reward: {
        money: 20
      },
      validator: (query, result) =>
        selectsColumnsFrom(query, result, "products", ["name"])
    },
    {
      id: "customer_names",
      title: "Namensliste",
      description: "Zeige nur die Namen aller Kunden an.",
      story:
        "Wenn jemand in den Laden kommt und wir nur ratlos nicken, wirkt das nicht professionell. " +
        "Besorg uns eine kurze Namensliste.",
      task: "Zeige nur die Spalte name aus der Tabelle customers an.",
      reward: {
        money: 20
      },
      validator: (query, result) =>
        selectsColumnsFrom(query, result, "customers", ["name"])
    },
    {
      id: "product_price_list",
      title: "Preisliste bauen",
      description: "Zeige Namen und Preise aller Produkte an.",
      story:
        "Jetzt wird es nützlich. Für Verkaufsgespräche brauchen wir keine IDs, " +
        "sondern Namen und Preise. Alles andere macht den Tresen nur unruhig.",
      task: "Zeige die Spalten name und price aus der Tabelle products an.",
      reward: {
        money: 25
      },
      validator: (query, result) =>
        selectsColumnsFrom(query, result, "products", ["name", "price"])
    },
    {
      id: "products_schema",
      title: "Struktur der Produkte",
      description: "Finde die Struktur der products-Tabelle heraus.",
      story:
        "Bevor du dich auf Spaltennamen verlässt, schau lieber nach, " +
        "wie die Tabelle wirklich aufgebaut ist. Gute Händler raten nicht.",
      task: "Führe PRAGMA table_info(products); aus.",
      reward: {
        money: 20
      },
      validator: (query, result) => {
        const normalized = normalizedQuery(query);
        return (
          normalized.includes("pragma") &&
          normalized.includes("table_info") &&
          normalized.includes("products") &&
          hasResult(result)
        );
      }
    },
    {
      id: "customers_schema",
      title: "Struktur der Kunden",
      description: "Finde die Struktur der customers-Tabelle heraus.",
      story:
        "Die Kundenliste hat mehr als nur Namen. Schau dir die Struktur an, " +
        "bevor später jemand mit Geld, Wünschen und Chaos vor dem Tresen steht.",
      task: "Führe PRAGMA table_info(customers); aus.",
      reward: {
        money: 20
      },
      validator: (query, result) => {
        const normalized = normalizedQuery(query);
        return (
          normalized.includes("pragma") &&
          normalized.includes("table_info") &&
          normalized.includes("customers") &&
          hasResult(result)
        );
      }
    }
  ],
};

export default level1;
