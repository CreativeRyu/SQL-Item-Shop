function normalizedQuery(query) {
  return query.toLowerCase().replace(/\s+/g, " ").trim();
}

function usesTable(query, tableName) {
  return new RegExp(`\\bfrom\\s+${tableName}\\b`).test(
    normalizedQuery(query)
  );
}

const level0 = {
    levelId: "level0",
    title: "Shop Training",
    seedPath: "./database/seed.sql",
    shopLayoutId: "level0",
    recap: {
      label: "Schicht abgeschlossen",
      title: "Der Laden steht noch",
      description: "Du hast die erste Schicht überlebt und der Laden steht noch. Gute Quote.",
      learnedIntro: "Was du gelernt hast:",
      learned: [
        "SELECT gibt Werte und Daten aus",
        "FROM wählt die Tabelle für eine Abfrage",
        "Spaltennamen fragen gezielt Informationen ab",
        "PRAGMA table_info zeigt die Struktur einer Tabelle"
      ]
    },
    missions: [
    {
      id: "welcome",
      title: "Willkommen im SQL Item Shop",
      description: "Führe deine erste SQL Query aus.",
      tutorialSteps: [
          {
              target: "#shopkeeper",
              text: "Ahh... endlich Verstärkung. Willkommen im SQL Item Shop.",
          },
          {
            target: "#shopkeeper",
            text: "Ich verwalte diesen Laden schon seit über zehn Jahren. Items, Inventare. Kundendaten. Bestellungen. Alles läuft sauber."
          },
          {
            target: "#shopkeeper",
            text: "Naja... Zumindest bis die letzten beiden Azubis beschlossen haben, <span class='sql-keyword'>DELETE</span> ohne <span class='sql-keyword'>WHERE</span> auszuführen."
          },
          {
            target: "#shopkeeper",
            text: "Drei Tabellen gelöscht. Eine Datenbank wurde abgefackelt und einer hat versucht ein Backup mit Excel zu machen."
          },
          {
            target: "#shopkeeper",
            text: "Das lief so Semi erfolgreich."
          },
          {
            target: "#shopkeeper",
            text: "Also pass gut auf. Ich bringe dir jetzt richtiges SQL bei."
          },
          {
            target: "#mission-panel",
            text: "Links erscheinen deine Aufgaben. Gute Arbeit bringt Gold. Schlechte Arbeit bringt Kopfschmerzen. Meistens für mich."
          },
          {
              target: "#result-panel",
              text: "Hier rechts ist das Ergebnisfenster. Dort landen deine zarten Ergebnisse. Wenn da Unsinn steht, hast du vermutlich Unsinn geschrieben."
          },
          {
              target: ".CodeMirror",
              text: "Hier unten schreibst du SQL Befehle. Ruhige Hände. Saubere Queries. Am Anfang reicht einfaches Zeug.",
              position: "editor-top"
          },
          {
              target: "#run-btn",
              text: "Damit führst du deine Query aus. Kein Grund nervös zu werden."
          },
          {
              target: "#mission-panel",
              text: "Gut. Fangen wir mit etwas Einfachem an. Hier ist deine erste Aufgabe."
          },
          {
              target: ".CodeMirror",
              text: "Zeig mir ob du tippen kannst. Gib jetzt:\n\n<span class='sql-keyword'>SELECT</span> <span class='sql-value'>1</span>; ein.",
              position: "editor-top",
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
        money: 5,
      },
      unlocks: [],
      completes: ["SELECT"],
      validator: (query, result) => {
            if(result.length === 0)
                return false;

            const value =
                result[0].values?.[0]?.[0];

            return value === 1;
        },
    },
    {
      id: "hello_shopkeeper",
      title: "Gruß an den Händler",
      description: "Sende eine Nachricht an den Händler.",
      tutorialSteps: [
          {
              target: "#shopkeeper",
              text: "Nicht schlecht."
          },
          {
              target: "#result-panel",
              text: "Siehst du das Ergebnis rechts? SQL kann Werte direkt zurückgeben."
          },
          {
              target: "#result-panel",
              text: "Aber Zahlen sind langweilig. Texte funktionieren ebenfalls."
          },
          {
              target: ".CodeMirror",
              text: "Texte setzt man in einfache Anführungszeichen.",
              position: "editor-top"
          },
          {
              target: "#mission-panel",
              text: "Deine nächste Mission ist es, deinen Ausbilder ordentlich zu grüßen."
          },
          {
              target: ".CodeMirror",
              text: "Sag doch mal Hi:\n\n<span class='sql-keyword'>SELECT</span> <span class='sql-string'>'Hi Shopkeeper'</span>;",
              position: "editor-top",
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
        money: 10,
      },
      unlocks: [],
      validator: (query, result) => {
            if(result.length === 0)
                return false;

            const value =
                result[0].values?.[0]?.[0];

            return typeof value === "string";
        },
    },
    {
      id: "show_products",
      title: "Produkte ansehen",
      description: "Zeige alle Produkte im Shop an.",
      tutorialSteps: [
          {
              target: "#shopkeeper",
              text: "Gut. Zeit dir mal den eigentlichen Laden zu zeigen."
          },
          {
              target: "#shopkeeper",
              text: "Alle Produkte, Kunden und Bestellungen liegen in Tabellen."
          },
          {
              target: "#shopkeeper",
              text: "Eine Tabelle ist im Grunde nur eine sauber organisierte Liste."
          },
          {
              target: "#shopkeeper",
              text: "Unsere Produkttabelle ist jedoch etwas... empfindlich. Deshalb arbeiten neue Azubis erstmal mit der Händleransicht <span class='sql-table'>shop_items</span>."
          },
          {
              target: ".CodeMirror",
              text: "Mit <span class='sql-keyword'>FROM</span> sagst du SQL aus welcher Tabelle gelesen werden soll.",
              position: "editor-top"
          },
          {
              target: ".CodeMirror",
              text: "Das Sternsymbol <span class='sql-symbol'>*</span> bedeutet: zeige alles.",
              position: "editor-top"
          },
          {
              target: "#mission-panel",
              text: "Zeig mir jetzt den kompletten Warenbestand."
          },
          {
              target: ".CodeMirror",
              text: "Tippe jetzt:\n\n<span class='sql-keyword'>SELECT</span> <span class='sql-symbol'>*</span> <span class='sql-keyword'>FROM</span> <span class='sql-table'>shop_items</span>;",
              position: "editor-top",
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
        money: 15,
      },
      unlocks: [],
      completes: ["FROM", "*"],
      validator: (query, result) => {
        if(!usesTable(query, "shop_items")) {
          return false;
        }

        if(result.length === 0) {
          return false;
        }

        const columns = result[0].columns;
        return (
          columns.length === 3 &&
          columns.includes("id") &&
          columns.includes("name") &&
          columns.includes("price")
        );
      },
    },
    {
      id: "only_names",
      title: "Nur die Namen",
      description: "Zeige nur die Namen der Produkte an.",
      tutorialSteps: [
          {
              target: "#result-panel",
              text: "Genau so. Jetzt verstehst du warum Händler SQL benutzen."
          },
          {
              target: "#result-panel",
              text: "Das dort rechts ist eine echte Tabelle mit Produktdaten live in Farbe."
          },
          {
              target: "#result-panel",
              text: "Jede Zeile ist ein Produkt. Jede Spalte enthält bestimmte Informationen."
          },
          {
              target: "#result",
              text: "Aber manchmal braucht man nicht ALLE Daten."
          },
          {
              target: "#result-panel th",
              text: "Du kannst auch gezielt einzelne Spalten auswählen."
          },
          {
              target: "#mission-panel",
              text: "Zeig mir jetzt nur die Produktnamen."
          },
          {
              target: ".CodeMirror",
              text: "Tippe jetzt:\n\n<span class='sql-keyword'>SELECT</span> name <span class='sql-keyword'>FROM</span> <span class='sql-table'>shop_items</span>;",
              position: "editor-top",
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
        money: 20,
      },
      unlocks: [],
      validator: (query, result) => {
        if (!usesTable(query, "shop_items")) {
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
  id: "names_and_prices",
  title: "Preisschilder",
  description: "Zeige Namen und Preise aller Produkte an.",
  tutorialSteps: [
          {
              target: "#result",
              text: "Sehr gut. Du musst dich natürlich nicht auf eine einzelne Spalte beschränken."
          },
          {
              target: "#shopkeeper",
              text: "Mehrere Spalten können auch abgefragt werden. Man trennt sie einfach mit einem Komma."
          },
          {
              target: "#result-panel",
              text: "So bauen Händler Preislisten, Inventare oder Kundenübersichten."
          },
          {
              target: "#mission-panel",
              text: "Zeig mir jetzt Namen UND Preise aller Produkte."
          },
          {
             target: ".CodeMirror",
             text:
              "Tippe jetzt:\n\n" +
              "<span class='sql-keyword'>SELECT</span> " +
              "name, price " +
              "<span class='sql-keyword'>FROM</span> " +
              "<span class='sql-table'>shop_items</span>;",
              position: "editor-top",
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
          money: 25,
      },
      unlocks: [],
      validator: (query, result) => {
          if(!usesTable(query, "shop_items")) {
              return false;
          }
          if(result.length === 0) {
              return false;
          }
          const columns = result[0].columns;
          return (
              columns.length === 2 &&
              columns.includes("name") &&
              columns.includes("price")
          );
      }
    },
    {
        id: "buy_notebook",
        title: "Das alte SQL Notebook",
        description: "Du hast genug Gold verdient.<br>Kaufe das SQL Notebook im Shop.",
        tutorialSteps: [
            {
                target: "#result-panel",
                text: "Siehst du? Genau so entstehen echte Produktlisten."
            },
            {
                target: "#shopkeeper",
                text: "Aber glaub mir... sobald Datenbanken größer werden, verlierst du ohne Struktur sehr schnell den Überblick."
            },
            {
                target: "#shopkeeper",
                text: "Denn <span class='sql-keyword'>OHNE STRUKTUR, KEIN INHALT.</span>"
            },
            {
                target: "#shopkeeper",
                text: "Deshalb laufen gute Händler niemals ohne Notizen herum."
            },
            {
                target: "#shop-screen",
                text: "Das gute ist, ich verkaufe hier im Laden ab und zu auch spezielle Werkzeuge für SQL Lehrlinge."
            },
            {
                target: ".shop-key-item",
                text: "Wie dieses schöne SQL Notebook hier.",
                position: "bottom"
            },
            {
                target: "#money-display",
                text: "Du hast genug Gold durch deine Aufgaben verdient."
            },
            {
                target: "body",
                text: "Also hol es dir. Denn starke Queries brauchen starke Notizen.",
                position: "bottom",
                waitForMission: true
            }
        ],
      hint: "",
      reward: {
        money: 0,
      },
      unlocks: ["SQL_NOTEBOOK"],
      validator: (query, result, gameState) => {
        return gameState.hasNotebook === true;
      },
    },
    {
    id: "notebook_intro",
    title: "Das SQL Notebook",
    description: "Lerne dein neues Werkzeug kennen.",
    softTutorial: true,
    tutorialSteps: [
        {
            target: "#sql-notebook-ui",
            text: "Jawoll. Das ist dein SQL Notebook.",
            padding: 20,
            glowTarget: true
        },
        {
            target: "#sql-notebook-ui",
            text: "Jedes Mal wenn du etwas Neues lernst, landet es hier. Neue SQL Befehle. Neue Tabellen. Neue Strukturen.",
            padding: 20,
            glowTarget: true
        },
        {
            target: "#tables-tab",
            text: "Auf dieser Seite findest du bekannte Tabellen und Tabellenschemata.",
            glowTarget: true
        },
        {
            target: "#dql-tab",
            text: "Weitere Seiten enthalten SQL Befehle, die du im Laufe deiner Ausbildung lernst.",
            glowTarget: true
        },
        {
            target: "#sql-notebook-ui",
            text: "Das hier ist nur die Schnellübersicht. Gelernt wird mit Primärliteratur.",
            padding: 20
        },
        {
            target: "body",
            text: "Gute Händler merken sich nicht alles.",
            disableHighlight: true
        },
        {
            target: "body",
            text: "Sie wissen wo es steht.",
            disableHighlight: true
        },
        {
            target: "body",
            text: "Gut... weiter im Text.",
            disableHighlight: true
        },
        {
            target: "body",
            text: "Bevor du Daten abfragst, solltest du wissen womit du arbeitest.",
            disableHighlight: true
        },
        {
            target: "body",
            text: "Ein guter Händler schaut zuerst auf die Struktur. Erst dann auf den Inhalt.",
            disableHighlight: true
        },
        {
            target: "body",
            text: "Dafür verwenden wir <span class='sql-keyword'>PRAGMA table_info</span>.",
            disableHighlight: true
        },
        {
            target: "body",
            text: "Probiere es aus, mit:<br><br><span class='sql-keyword'>PRAGMA table_info</span>(<span class='sql-table'>shop_items</span>);",
            disableHighlight: true,
            waitForMission: true
        }
    ],
    hint: "",
    reward: {
        money: 10
    },
    unlocks: [],
    completes: ["shop_items", "PRAGMA table_info"],
    validator: (query, result) => {
        const normalized = query.toLowerCase();

        return (
            normalized.includes("pragma") &&
            normalized.includes("shop_items")
        );
    }
}
  ],
};

export default level0;
