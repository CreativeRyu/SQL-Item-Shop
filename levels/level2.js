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
        "Neben Schwertern und Proteinriegeln findest du heute auch frisches Gemüse auf unserem Tresen. " +
        "Je mehr Waren hier liegen, desto wichtiger wird es, das Richtige schnell zu finden.",
      task:
        "Zeige nur das Produkt mit dem Namen Apfel. Nutze dafür WHERE.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Bisher hast du ganze Tabellen gelesen. Das ist solide, aber ein Kunde will keinen Blick auf den ganzen Tresen werfen. " +
            "Er sucht nach genau dem, was er braucht. " +
            "Mit <span class='sql-keyword'>WHERE</span> lernst du, gezielt auszuwählen. "
        },
        {
          target: ".CodeMirror",
          disableHighlight: true,
          position: "editor-top",
          text:
            "<span class='sql-keyword'>WHERE</span> folgt auf die Tabelle. " +
            "Danach schreibst du die Bedingung, die deine Auswahl einschränkt."
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
        "",
      blueprint:
        "",
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
        "Bananen sind voller Kalium. " +
        "Vielleicht führen wir eines Tages sogar Makronährstoffe in unserer Datenbank. " +
        "Für heute reichen Name und Preis. ",
      task:
        "Zeige nur name und preis der Banane an.",
      blueprint:
        "",
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
        "Teuer bedeutet nicht automatisch besser. " +
        "Manchmal steckt der größte Nutzen in den einfachen Dingen.",
      task:
        "Zeige alle Produkte, deren price kleiner als 3.00 ist.",
      softTutorial: true,
      tutorialSteps: [
        {
          target: "#shop-screen",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Übrigens, Sind dir die zwei kleinen Hilfsitems im Shop aufgefallen. Natürlich sind sie dir aufgefallen."
        },
        {
          target: "#shop-screen",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Der <span class='help-hint-keyword'>Shopkeeper Hint</span> gibt dir einen kleinen Hinweis zur aktuellen Aufgabe. Kein Geschenk, eher ein sauberer Trainingsimpuls."
        },
        {
          target: "#shop-screen",
          disableHighlight: true,
          position: "editor-top",
          text:
            "Der <span class='help-blueprint-keyword'>Query Blueprint</span> zeigt dir ein Query-Gerüst. Den Weg musst du trotzdem selbst gehen."
        }
      ],
      hint:
        "Nutze einen Zahlenvergleich mit kleiner als <.",
      blueprint:
        "<code>SELECT *<br>FROM products<br>WHERE ... < ...;</code>",
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
        "Die günstigen Waren kennen wir bereits. " +
        "Jetzt wird es Zeit für das Premium-Regal.",
      task:
        "Zeige Name und Preis aller Produkte über 25 Gold.",
      hint:
        "Wieder ein Zahlenvergleich aber dieses mal mit größer als >.",
      blueprint:
        "<code>SELECT name, ...<br>FROM products<br>WHERE ... > ...;</code>",
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
        "Wenn die Tür aufgeht und der Geldbeutel schwer klingt, hört ein Händler automatisch genauer zu.",
      task:
        "Zeige name und budget für Kunden mit mindestens 50 Gold.",
      hint:
        "Mindestens bedeutet größer oder gleich: >=.",
      blueprint:
        "<code>SELECT name, ...<br>FROM customers<br>WHERE ... >= ...;</code>",
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
        "Wenn der Bestand knapp ist, merkt man das nicht erst, wenn der Kunde heulend vor einem Regal steht. " +
        "Gute Händler erkennen Engpässe vorher.",
      task:
        "Zeige ID und Bestand der kritischen Lagerbestände? Berücksichtige alle Bestände von 2 oder weniger.",
      hint:
        "Höchstens bedeutet kleiner oder gleich <=.",
      blueprint:
        "<code>SELECT product_id, ...<br>FROM inventory<br>WHERE stock ...;</code>",
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
        "Der Rubin ist unser teuerstes Stueck im Regal. Nicht anfassen, nicht anstarren, nur sauber abfragen. " +
        "Ein guter Händler weiss, wo der Wert liegt.",
      task:
        "Zeige Name und Preis des Rubins.",
      hint:
        "Filtere nach dem Textwert 'Rubin'.",
      blueprint:
        "<code>SELECT ... <br>FROM products<br>WHERE ... = '...';</code>",
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
