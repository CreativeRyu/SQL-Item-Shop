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

function hasOrderBy(query, column, direction = "") {
  const normalized = normalizedQuery(query);
  const directionPattern = direction
    ? `\\s+${direction}\\b`
    : "(?:\\s+asc\\b|\\s+desc\\b)?";

  return new RegExp(`\\border\\s+by\\s+${column}\\b${directionPattern}`).test(
    normalized
  );
}

function hasLimit(query, amount) {
  return new RegExp(`\\blimit\\s+${amount}\\b`).test(normalizedQuery(query));
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

function resultColumnValues(result, column) {
  if(!hasResult(result)) {
    return [];
  }

  const columnIndex = result[0].columns.indexOf(column);
  if(columnIndex < 0) {
    return [];
  }

  return result[0].values.map(row => row[columnIndex]);
}

function isSortedByColumn(result, column, direction = "asc") {
  const values = resultColumnValues(result, column);
  if(values.length === 0) {
    return false;
  }

  return values.every((value, index) => {
    if(index === 0) {
      return true;
    }

    const previous = values[index - 1];
    return direction === "desc"
      ? previous >= value
      : previous <= value;
  });
}

function resultColumnEquals(result, column, expectedValues) {
  const values = resultColumnValues(result, column).map(value =>
    String(value).toLowerCase()
  );
  const expected = expectedValues.map(value =>
    String(value).toLowerCase()
  );

  return (
    values.length === expected.length &&
    expected.every((value, index) => values[index] === value)
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

const level4 = {
  levelId: "level4",
  title: "ORDER BY und LIMIT",
  seedPath: "./database/seed4.sql",
  shopLayoutId: "level4",
  intro: {
    label: "Nächste Schicht",
    title: "Ordnung auf dem Tresen",
    description: "Filtern sitzt. Jetzt bringst du Ergebnisse in Reihenfolge und holst nur die Treffer, die wirklich nach vorne gehören.",
    goalsIntro: "Was als Nächstes ansteht:",
    goals: [
      "ORDER BY sortiert Ergebnisse nach einer Spalte",
      "ASC und DESC bestimmen die Richtung",
      "LIMIT begrenzt die Ergebnisliste",
      "Kategorien machen Produktfragen genauer"
    ]
  },
  recap: {
    label: "Schicht abgeschlossen",
    title: "Der Tresen ist sortiert",
    description: "Du hast aus Treffern brauchbare Listen gemacht. Der Shopkeeper muss nicht mehr suchen. Er sieht oben, was wichtig ist.",
    learnedIntro: "Was jetzt sitzen sollte:",
    learned: [
      "ORDER BY bringt Ergebnisse in eine feste Reihenfolge",
      "ASC sortiert aufsteigend, DESC absteigend",
      "LIMIT zeigt nur die ersten Treffer",
      "WHERE, ORDER BY und LIMIT arbeiten sauber zusammen"
    ]
  },
  missions: [
    {
      id: "order_products_price_asc",
      title: "Billig nach oben",
      description: "Sortiere Produkte nach Preis aufsteigend.",
      story:
        "Wenn Kunden sparen wollen, sollen sie nicht erst den Rubin sehen. " +
        "Sortiere die Preisliste von günstig nach teuer.",
      task:
        "Zeige Name und Preis unserer Produkte. Sortiere die Ergebnismenge aufsteigend nach dem Preis mit ORDER BY.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: "#shopkeeper",
          text:
            "Neue Schicht. Filtern kannst du jetzt. Aber ein Haufen Treffer ist noch keine brauchbare Liste."
        },
        {
          target: "#shopkeeper",
          text:
            "Wenn ich Preise vergleichen will, will ich nicht raten. Ich will sehen, was oben steht. Günstig zuerst, teuer zuletzt. Ordnung schlägt Sucherei."
        },
        {
          target: "#result-panel",
          text:
            "Bisher kamen Ergebnisse meistens in der Reihenfolge zurück, in der sie in der Tabelle liegen. Für echte Ladenarbeit bestimmst du die Reihenfolge selbst."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Für Sortierung benutzen wir <span class='sql-keyword'>ORDER BY</span>. Damit sagst du SQL, nach welcher Spalte die Treffer geordnet werden sollen."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>ORDER BY</span> kommt nach FROM und nach einem möglichen WHERE. " +
            "Damit bestimmst du die Reihenfolge deiner Ergebniszeilen."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Die Produkttabelle hat für diese Schicht zusätzlich eine Kategorie bekommen. " +
            "Wenn du die Struktur sehen willst, kannst du products wie gewohnt über das Notebook prüfen."
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
            "<span class='sql-keyword'>ORDER BY</span> price <span class='sql-keyword'>ASC</span>;"
        }
      ],
      hint:
        "ORDER BY price ASC sortiert vom kleinsten zum größten Preis.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>ORDER BY ... ASC;</code>",
      reward: {
        money: 25
      },
      completes: ["ORDER BY"],
      validator: (query, result) => (
        usesTable(query, "products") &&
        hasOrderBy(query, "price") &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 12) &&
        isSortedByColumn(result, "price", "asc")
      )
    },
    {
      id: "order_products_price_desc",
      title: "Premium zuerst",
      description: "Sortiere Produkte nach Preis absteigend.",
      story:
        "Manchmal will der Laden wissen, was oben ins Premium-Regal gehört. " +
        "Dafür drehst du die Sortierung um.",
      task:
        "Zeige name und price aus products. Sortiere nach price absteigend mit DESC.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>ASC</span> bedeutet aufsteigend. " +
            "<span class='sql-keyword'>DESC</span> bedeutet absteigend. Gleiche Übung, andere Richtung."
        }
      ],
      hint:
        "DESC bringt die größten Werte nach oben.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>ORDER BY price ...;</code>",
      reward: {
        money: 25
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        hasOrderBy(query, "price", "desc") &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 12) &&
        isSortedByColumn(result, "price", "desc")
      )
    },
    {
      id: "limit_three_cheapest",
      title: "Die günstigsten Drei",
      description: "Zeige nur die drei günstigsten Produkte.",
      story:
        "Eine sortierte Liste ist gut. Eine kurze sortierte Liste ist besser, wenn der Kunde schon ungeduldig mit Münzen klimpert.",
      task:
        "Zeige name und price der drei günstigsten Produkte. Nutze ORDER BY price ASC und LIMIT 3.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>LIMIT</span> begrenzt, wie viele Zeilen du zurückbekommst. " +
            "Es kommt am Ende der Query."
        }
      ],
      hint:
        "Sortiere zuerst günstig nach teuer, begrenze danach mit LIMIT 3.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>ORDER BY price ASC<br>LIMIT ...;</code>",
      reward: {
        money: 30
      },
      completes: ["LIMIT"],
      validator: (query, result) => (
        usesTable(query, "products") &&
        hasOrderBy(query, "price") &&
        hasLimit(query, 3) &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 3) &&
        isSortedByColumn(result, "price", "asc") &&
        resultColumnEquals(result, "name", ["Apfel", "Banane", "Karotte"])
      )
    },
    {
      id: "cheap_food_choices",
      title: "Lebensmittel zuerst",
      description: "Finde die vier günstigsten Obst- oder Gemüseprodukte.",
      story:
        "Jetzt kommt altes Filtertraining wieder dazu. Obst oder Gemüse, günstig nach oben, nur die ersten vier. " +
        "Das ist keine neue Magie. Das ist sauberes Kombinieren.",
      task:
        "Zeige name, price und category für Produkte aus Obst oder Gemüse. Sortiere nach price ASC und nutze LIMIT 4.",
      hint:
        "Nutze OR für Obst oder Gemüse, danach ORDER BY price ASC und LIMIT 4.",
      blueprint:
        "<code>SELECT name, price, category<br>FROM products<br>WHERE category = 'Obst' OR category = 'Gemüse'<br>ORDER BY price ASC<br>LIMIT 4;</code>",
      reward: {
        money: 30
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        usesOperator(query, "or") &&
        hasTextCondition(query, "category", "Obst") &&
        hasTextCondition(query, "category", "Gemüse") &&
        hasOrderBy(query, "price") &&
        hasLimit(query, 4) &&
        hasColumns(result, ["name", "price", "category"]) &&
        hasRowCount(result, 4) &&
        resultColumnEquals(result, "name", ["Apfel", "Banane", "Karotte", "Tomate"])
      )
    },
    {
      id: "vegetable_price_zone",
      title: "Gemüse im Bereich",
      description: "Kombiniere Kategorie und Preisbereich.",
      story:
        "Bereiche kennst du aus Level 3. Jetzt sortierst du sie zusätzlich, damit aus Treffern eine brauchbare Einkaufsliste wird.",
      task:
        "Zeige name und price für Gemüse mit price BETWEEN 3 AND 6. Sortiere nach price ASC.",
      hint:
        "Kombiniere category = 'Gemüse' mit AND und price BETWEEN 3 AND 6.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE category = 'Gemüse' AND price BETWEEN 3 AND 6<br>ORDER BY price ASC;</code>",
      reward: {
        money: 30
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        usesOperator(query, "and") &&
        hasTextCondition(query, "category", "Gemüse") &&
        hasBetweenCondition(query, "price", 3, 6) &&
        hasOrderBy(query, "price") &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 3) &&
        resultColumnEquals(result, "name", ["Tomate", "Gurke", "Kartoffel"])
      )
    },
    {
      id: "protein_sorted_shortlist",
      title: "Protein-Kurzliste",
      description: "Nutze LIKE mit Sortierung und LIMIT.",
      story:
        "Der Shopkeeper will die Proteinware nicht komplett ausbreiten. Nur die günstigsten Treffer. " +
        "LIKE findet den Bereich, ORDER BY bringt Ordnung, LIMIT hält die Liste kurz.",
      task:
        "Zeige name und price für Produkte mit name LIKE 'Protein%'. Sortiere nach price ASC und nutze LIMIT 2.",
      hint:
        "LIKE 'Protein%' aus Level 3 bleibt der Filter. Danach sortierst und begrenzt du.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE name LIKE 'Protein%'<br>ORDER BY price ASC<br>LIMIT 2;</code>",
      reward: {
        money: 30
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasLikeCondition(query, "name", "Protein%") &&
        hasOrderBy(query, "price") &&
        hasLimit(query, 2) &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 2) &&
        resultColumnEquals(result, "name", ["Protein Bar", "Protein Shake"])
      )
    },
    {
      id: "top_two_fitness",
      title: "Fitness oben ins Regal",
      description: "Finde die zwei teuersten Fitness-Produkte.",
      story:
        "Fitnessware verkauft sich besser, wenn die starken Stücke oben liegen. " +
        "Der Shopkeeper nennt das Merchandising. Und Rückentraining.",
      task:
        "Zeige name und price der zwei teuersten Produkte aus der Kategorie Fitness.",
      hint:
        "Fitness filtern, nach price DESC sortieren, dann LIMIT 2.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE category = 'Fitness'<br>ORDER BY price DESC<br>LIMIT 2;</code>",
      reward: {
        money: 35
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasTextCondition(query, "category", "Fitness") &&
        hasOrderBy(query, "price", "desc") &&
        hasLimit(query, 2) &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 2) &&
        resultIncludesValue(result, "Lifting Belt") &&
        resultIncludesValue(result, "Creatine")
      )
    }
  ]
};

export default level4;
