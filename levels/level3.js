function normalizedQuery(query) {
  return query.toLowerCase().replace(/\s+/g, " ").trim();
}

function hasResult(result) {
  return result.length > 0 && result[0].values.length > 0;
}

function usesTable(query, tableName) {
  return new RegExp(`\\bfrom\\s+${tableName}\\b`).test(
    normalizedQuery(query)
  );
}

function usesWhere(query) {
  return normalizedQuery(query).includes(" where ");
}

function usesOperator(query, operator) {
  return new RegExp(`\\b${operator}\\b`).test(normalizedQuery(query));
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

function hasTextCondition(query, column, value) {
  const normalized = normalizedQuery(query);
  const escapedValue = escapeRegExp(value.toLowerCase());
  return new RegExp(`\\b${column}\\s*=\\s*['"]${escapedValue}['"]`).test(
    normalized
  );
}

function hasNumberCondition(query, column, operator, value) {
  const normalized = normalizedQuery(query);
  const escapedOperator = escapeRegExp(operator);
  const valuePattern = numberPattern(value);
  return new RegExp(
    `\\b${column}\\s*${escapedOperator}\\s*${valuePattern}\\b`
  ).test(normalized);
}

function hasBetweenCondition(query, column, min, max) {
  const normalized = normalizedQuery(query);
  return new RegExp(
    `\\b${column}\\s+between\\s+${numberPattern(min)}\\s+and\\s+${numberPattern(max)}\\b`
  ).test(normalized);
}

function hasLikeCondition(query, column, pattern) {
  const normalized = normalizedQuery(query);
  const escapedPattern = escapeRegExp(pattern.toLowerCase());
  return new RegExp(`\\b${column}\\s+like\\s+['"]${escapedPattern}['"]`).test(
    normalized
  );
}

function hasRowCount(result, expectedCount) {
  return hasResult(result) && result[0].values.length === expectedCount;
}

function resultIncludesValue(result, value) {
  if(!hasResult(result)) {
    return false;
  }

  const expected = String(value).toLowerCase();
  return result[0].values.some(row =>
    row.some(cell => String(cell).toLowerCase() === expected)
  );
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function numberPattern(value) {
  const normalized = Number(value);

  if(Number.isInteger(normalized)) {
    return `${normalized}(?:\\.0+)?`;
  }

  return escapeRegExp(String(value));
}

const level3 = {
  levelId: "level3",
  title: "WHERE Advanced",
  seedPath: "./database/seed3.sql",
  shopLayoutId: "level3",
  intro: {
    label: "Nächste Schicht",
    title: "Filter mit Technik",
    description: "Einzelne WHERE-Bedingungen sitzen. Jetzt lernst du, Bedingungen zu kombinieren, Bereiche sauber zu prüfen und Textmuster zu finden.",
    goalsIntro: "Was als Nächstes ansteht:",
    goals: [
      "AND verbindet Bedingungen, die gleichzeitig gelten müssen",
      "OR erlaubt mehrere mögliche Treffer",
      "BETWEEN prüft Wertebereiche",
      "LIKE findet Textmuster mit Platzhaltern"
    ]
  },
  recap: {
    label: "Schicht abgeschlossen",
    title: "Filtertraining erweitert",
    description: "Du hast aus einfachen Filtern richtige Suchtechnik gemacht. Der Laden wirkt nicht kleiner, aber deutlich kontrollierbarer.",
    learnedIntro: "Was jetzt sitzen sollte:",
    learned: [
      "AND kombiniert mehrere Pflichtbedingungen",
      "OR findet Treffer, bei denen eine Bedingung reicht",
      "BETWEEN ist eine lesbare Kurzform für Wertebereiche",
      "LIKE sucht Textmuster mit % als Platzhalter"
    ]
  },
  missions: [
    {
      id: "and_mid_price_products",
      title: "Der saubere Mittelweg",
      description: "Finde Produkte in einem mittleren Preisbereich.",
      story:
        "Nicht zu billig, nicht zu teuer. Manche Kunden wollen Ware mit Vernunft im Preis und Haltung im Regal. " +
        "Dafür reicht eine Bedingung nicht mehr.",
      task:
        "Zeige name und price aus products für Produkte mit price größer als 3 und kleiner als 30. Nutze AND.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Bisher hatte dein <span class='sql-keyword'>WHERE</span> meistens eine Bedingung. Jetzt kombinieren wir zwei."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>AND</span> bedeutet: Beide Bedingungen müssen stimmen. Sauberer Stand, sauberer Filter."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          waitForMission: true,
          text:
            "Tippe jetzt:<br><br>" +
            "<span class='sql-keyword'>SELECT</span> name, price " +
            "<span class='sql-keyword'>FROM</span> <span class='sql-table'>products</span><br>" +
            "<span class='sql-keyword'>WHERE</span> price > <span class='sql-value'>3</span> " +
            "<span class='sql-keyword'>AND</span> price < <span class='sql-value'>30</span>;"
        }
      ],
      hint:
        "AND verbindet zwei Bedingungen. Beide müssen für eine Zeile wahr sein.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE price > ... AND price < ...;</code>",
      reward: {
        money: 25
      },
      completes: ["AND"],
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        usesOperator(query, "and") &&
        hasNumberCondition(query, "price", ">", 3) &&
        hasNumberCondition(query, "price", "<", 30) &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 5)
      )
    },
    {
      id: "or_fruit_choice",
      title: "Zwei schnelle Treffer",
      description: "Finde Apfel oder Banane.",
      story:
        "Ein Kunde schwankt zwischen Apfel und Banane. Der Shopkeeper nennt das keine Entscheidungskrise, sondern eine OR-Aufgabe.",
      task:
        "Zeige alle Spalten aus products für Produkte mit name Apfel oder Banane. Nutze OR.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>OR</span> ist lockerer als AND. Es reicht, wenn eine der Bedingungen stimmt."
        }
      ],
      hint:
        "OR ist richtig, wenn mehrere einzelne Treffer erlaubt sind.",
      blueprint:
        "<code>SELECT *<br>FROM products<br>WHERE name = '...' OR name = '...';</code>",
      reward: {
        money: 25
      },
      completes: ["OR"],
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        usesOperator(query, "or") &&
        hasTextCondition(query, "name", "Apfel") &&
        hasTextCondition(query, "name", "Banane") &&
        hasColumns(result, ["id", "name", "price"]) &&
        hasRowCount(result, 2) &&
        resultIncludesValue(result, "Apfel") &&
        resultIncludesValue(result, "Banane")
      )
    },
    {
      id: "between_customer_budget",
      title: "Budget-Zone",
      description: "Finde Kunden im mittleren Budgetbereich.",
      story:
        "Manche Kunden kaufen spontan. Andere rechnen. Und einige haben genau genug Gold, um interessant zu werden. " +
        "Für Bereiche gibt es eine elegantere Technik.",
      task:
        "Zeige name und budget aus customers für Kunden mit budget BETWEEN 20 AND 100.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>BETWEEN</span> prüft, ob ein Wert in einem Bereich liegt. Die Grenzen zählen dabei mit."
        }
      ],
      hint:
        "BETWEEN 20 AND 100 schließt 20 und 100 mit ein.",
      blueprint:
        "<code>SELECT name, budget<br>FROM customers<br>WHERE budget BETWEEN ... AND ...;</code>",
      reward: {
        money: 25
      },
      completes: ["BETWEEN"],
      validator: (query, result) => (
        usesTable(query, "customers") &&
        usesWhere(query) &&
        hasBetweenCondition(query, "budget", 20, 100) &&
        hasColumns(result, ["name", "budget"]) &&
        hasRowCount(result, 4)
      )
    },
    {
      id: "like_protein_prefix",
      title: "Textmuster im Regal",
      description: "Finde Produkte, deren Name mit Protein beginnt.",
      story:
        "Manchmal kennst du nicht den ganzen Namen. Nur den Anfang. Im Laden reicht das für eine Frage. " +
        "In SQL reicht es für LIKE.",
      task:
        "Zeige name und price aus products für Produkte, deren name mit Protein beginnt. Nutze LIKE 'Protein%'.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>LIKE</span> sucht nach Textmustern. Das Prozentzeichen <span class='sql-symbol'>%</span> steht für beliebige weitere Zeichen."
        }
      ],
      hint:
        "LIKE 'Protein%' bedeutet: Der Text beginnt mit Protein und danach darf noch etwas kommen.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE name LIKE 'Protein%';</code>",
      reward: {
        money: 25
      },
      completes: ["LIKE"],
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasLikeCondition(query, "name", "Protein%") &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 1) &&
        resultIncludesValue(result, "Protein Shake")
      )
    },
    {
      id: "like_customer_prefix",
      title: "Kunden mit M",
      description: "Finde Kunden, deren Name mit M beginnt.",
      story:
        "Der Shopkeeper erinnert sich an ein M. Mehr nicht. Stark im Kreuzheben, schwach bei Namen. " +
        "Zum Glück kann SQL mit halben Erinnerungen arbeiten.",
      task:
        "Zeige name und budget aus customers für Kunden, deren name mit M beginnt. Nutze LIKE 'M%'.",
      hint:
        "Das Muster 'M%' sucht Namen, die mit M anfangen.",
      blueprint:
        "<code>SELECT name, budget<br>FROM customers<br>WHERE name LIKE 'M%';</code>",
      reward: {
        money: 25
      },
      validator: (query, result) => (
        usesTable(query, "customers") &&
        usesWhere(query) &&
        hasLikeCondition(query, "name", "M%") &&
        hasColumns(result, ["name", "budget"]) &&
        hasRowCount(result, 2) &&
        resultIncludesValue(result, "Max") &&
        resultIncludesValue(result, "Marie")
      )
    },
    {
      id: "and_like_training_item",
      title: "Gezielte Trainingsware",
      description: "Kombiniere LIKE mit einer Preisbedingung.",
      story:
        "Jetzt wird der Filter ernst. Wir suchen nicht nur nach einem Namensteil, sondern prüfen gleichzeitig den Preis. " +
        "Das ist keine Hektik. Das ist Technik.",
      task:
        "Zeige name und price aus products für Produkte mit name LIKE 'Protein%' und price kleiner als 5.",
      hint:
        "Kombiniere LIKE mit AND. Erst das Textmuster, dann die Preisgrenze.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE name LIKE 'Protein%' AND price < ...;</code>",
      reward: {
        money: 30
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        usesOperator(query, "and") &&
        hasLikeCondition(query, "name", "Protein%") &&
        hasNumberCondition(query, "price", "<", 5) &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 1) &&
        resultIncludesValue(result, "Protein Shake")
      )
    }
  ]
};

export default level3;
