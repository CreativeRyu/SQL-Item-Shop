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

const level2 = {
  levelId: "level2",
  title: "WHERE Basics",
  seedPath: "./database/seed2.sql",
  shopLayoutId: "level2",
  intro: {
    label: "Nächste Schicht",
    title: "Nicht alles auf einmal",
    description: "Bisher hast du Tabellen komplett gelesen. Jetzt lernst du, gezielt nur die Zeilen herauszufiltern, die für den Laden gerade wichtig sind.",
    goalsIntro: "Was als Nächstes ansteht:",
    goals: [
      "WHERE als Filter für Zeilen verstehen",
      "Texte mit = vergleichen",
      "Zahlen mit <, >, >= und <= vergleichen",
      "Spaltenauswahl und WHERE kombinieren"
    ]
  },
  recap: {
    label: "Schicht abgeschlossen",
    title: "Filtertraining bestanden",
    description: "Du hast gelernt, nicht mehr den ganzen Laden auf den Tresen zu kippen. Der Shopkeeper nickt. Knapp, aber mit Respekt.",
    learnedIntro: "Was jetzt sitzen sollte:",
    learned: [
      "WHERE filtert Zeilen aus einer Tabelle",
      "Textwerte werden mit Anführungszeichen verglichen",
      "Zahlen können mit <, >, >= und <= gefiltert werden",
      "SELECT wählt Spalten, WHERE wählt Zeilen"
    ]
  },
  missions: [
    {
      id: "where_find_apple",
      title: "Der Apfel-Test",
      description: "Finde das Produkt mit dem Namen Apfel.",
      story:
        "Ich habe heute ein paar mehr Gegenstände ausgepackt. Gemüse, Trainingsware, ein Rubin. " +
        "Ein normaler Arbeitstag, wenn man Körper und Datenbank gleich ernst nimmt.",
      task:
        "Finde in der Tabelle products das Produkt mit dem Namen Apfel. Nutze dafür WHERE.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Bisher hast du ganze Tabellen gelesen. Das ist solide, aber nicht immer sauber. " +
            "Wenn du nur bestimmte Zeilen brauchst, trainierst du mit <span class='sql-keyword'>WHERE</span>."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>WHERE</span> steht nach der Tabelle und beschreibt, welche Zeilen du sehen willst."
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          waitForMission: true,
          text:
            "Tippe jetzt:<br><br>" +
            "<span class='sql-keyword'>SELECT</span> * " +
            "<span class='sql-keyword'>FROM</span> <span class='sql-table'>products</span><br>" +
            "<span class='sql-keyword'>WHERE</span> name = <span class='sql-string'>'Apfel'</span>;"
        }
      ],
      hint:
        "Nutze WHERE name = 'Apfel', um nur den Apfel zu finden.",
      blueprint:
        "<code>SELECT *<br>FROM products<br>WHERE name = '...';</code>",
      reward: {
        money: 20
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasTextCondition(query, "name", "Apfel") &&
        hasRowCount(result, 1) &&
        resultIncludesValue(result, "Apfel")
      )
    },
    {
      id: "where_banana_price",
      title: "Nur das Nötige",
      description: "Zeige Name und Preis der Banane.",
      story:
        "Die Banane braucht kein komplettes Datenbank-Solo. Name und Preis reichen. " +
        "Alles andere ist Showtraining vor dem Spiegel.",
      task:
        "Zeige nur die Spalten name und price aus products für das Produkt Banane.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE name = '...';</code>",
      reward: {
        money: 20
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasTextCondition(query, "name", "Banane") &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 1) &&
        resultIncludesValue(result, "Banane")
      )
    },
    {
      id: "where_products_under_three",
      title: "Unter der Preisgrenze",
      description: "Finde Produkte, die weniger als 3.00 kosten.",
      story:
        "Billige Ware ist nicht automatisch schwach. Manchmal ist sie einfach effizient. " +
        "So wie ein sauberer Satz Kniebeugen ohne Drama.",
      task:
        "Zeige alle Produkte aus products, deren price kleiner als 3.00 ist.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: "#shop-screen",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Übrigens: Dir sind die zwei kleinen Trainingshilfen im Shop aufgefallen. Natürlich sind sie dir aufgefallen."
        },
        {
          target: "#shop-screen",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Der <span class='sql-value'>Shopkeeper Hint</span> gibt dir einen kleinen Hinweis zur aktuellen Mission. Kein Geschenk, eher ein sauberer Trainingsimpuls."
        },
        {
          target: "#shop-screen",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Der <span class='sql-value'>Query Blueprint</span> zeigt dir ein Query-Gerüst. Denken musst du trotzdem selbst. Das ist Absicht."
        }
      ],
      hint:
        "Nutze einen Zahlenvergleich: WHERE price < 3.00.",
      blueprint:
        "<code>SELECT *<br>FROM products<br>WHERE price < ...;</code>",
      reward: {
        money: 25
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasNumberCondition(query, "price", "<", 3) &&
        hasRowCount(result, 3)
      )
    },
    {
      id: "where_premium_products",
      title: "Premium-Regal",
      description: "Zeige Name und Preis von Produkten über 25.00.",
      story:
        "Jetzt schauen wir auf die schwereren Gewichte im Regal. Teuer ist nicht immer besser, " +
        "aber es sollte wenigstens auffindbar sein.",
      task:
        "Zeige name und price aus products für Produkte, deren price größer als 25.00 ist.",
      hint:
        "Du brauchst WHERE price > 25.00 und nur die Spalten name, price.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE price > ...;</code>",
      reward: {
        money: 25
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasNumberCondition(query, "price", ">", 25) &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 3)
      )
    },
    {
      id: "where_customers_budget",
      title: "Solides Budget",
      description: "Finde Kunden mit mindestens 50 Budget.",
      story:
        "Kunden mit Budget sind wie gute Vorbereitung: Sie machen den Satz nicht automatisch leicht, " +
        "aber sie erhöhen die Erfolgschance deutlich.",
      task:
        "Zeige name und budget aus customers für Kunden mit budget größer oder gleich 50.",
      hint:
        "Mindestens bedeutet größer oder gleich: >=.",
      blueprint:
        "<code>SELECT name, budget<br>FROM customers<br>WHERE budget >= ...;</code>",
      reward: {
        money: 25
      },
      validator: (query, result) => (
        usesTable(query, "customers") &&
        usesWhere(query) &&
        hasNumberCondition(query, "budget", ">=", 50) &&
        hasColumns(result, ["name", "budget"]) &&
        hasRowCount(result, 3)
      )
    },
    {
      id: "where_low_stock",
      title: "Fast leer",
      description: "Finde Lagerbestände mit höchstens 2 Stück.",
      story:
        "Wenn der Bestand niedrig ist, merkt man das nicht erst, wenn der Kunde traurig auf ein leeres Regal zeigt. " +
        "Gute Technik erkennt Engpässe vorher.",
      task:
        "Zeige product_id und stock aus inventory für Einträge mit stock kleiner oder gleich 2.",
      hint:
        "Höchstens 2 bedeutet: WHERE stock <= 2.",
      blueprint:
        "<code>SELECT product_id, stock<br>FROM inventory<br>WHERE stock <= ...;</code>",
      reward: {
        money: 25
      },
      validator: (query, result) => (
        usesTable(query, "inventory") &&
        usesWhere(query) &&
        hasNumberCondition(query, "stock", "<=", 2) &&
        hasColumns(result, ["product_id", "stock"]) &&
        hasRowCount(result, 3)
      )
    },
    {
      id: "where_rubin_check",
      title: "Der Rubin-Check",
      description: "Zeige Name und Preis vom Rubin.",
      story:
        "Der Rubin liegt nicht da, weil er praktisch ist. Er liegt da, weil ein Laden Haltung braucht. " +
        "Und Haltung beginnt mit einer präzisen Abfrage.",
      task:
        "Zeige name und price aus products für das Produkt Rubin.",
      hint:
        "Filtere nach dem Textwert 'Rubin' und zeige nur name, price.",
      blueprint:
        "<code>SELECT name, price<br>FROM products<br>WHERE name = '...';</code>",
      reward: {
        money: 30
      },
      validator: (query, result) => (
        usesTable(query, "products") &&
        usesWhere(query) &&
        hasTextCondition(query, "name", "Rubin") &&
        hasColumns(result, ["name", "price"]) &&
        hasRowCount(result, 1) &&
        resultIncludesValue(result, "Rubin")
      )
    }
  ]
};

export default level2;
