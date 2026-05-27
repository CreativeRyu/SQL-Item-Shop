const level0 = {
  title: "Shop Training",
  missions: [
    {
      id: "welcome",
      title: "Willkommen im SQL Item Shop",
      description: "Führe deine erste SQL Query aus.",
      tutorialSteps: [
          {
              target: "#shopkeeper",
              text: "Ahh... endlich Verstärkung. Willkommen im SQL Item Shop."
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
              text: "Hier rechts ist das Ergebnissfenster. Dort landen deine zarten Ergebnisse. Wenn da Unsinn steht, hast du vermutlich Unsinn geschrieben."
          },
          {
              target: ".CodeMirror",
              text: "Hier unten schreibst du SQL Befehle. Ruhige Hände. Saubere Queries. Am Anfang reicht einfaches Zeug."
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
              waitForMission: true
          }
      ],
      hint: "",
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
      tutorialSteps: [
          {
              target: "#shopkeeper",
              text: "Nicht schlecht Azubi."
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
              text: "Texte setzt man in einfache Anführungszeichen."
          },
          {
              target: "#mission-panel",
              text: "Deine nächste Mission ist es, deinen Ausbilder ordentlich zu grüßen."
          },
          {
              target: ".CodeMirror",
              text: "Sag doch mal Hi:\n\n<span class='sql-keyword'>SELECT</span> <span class='sql-string'>'Hi Shopkeeper'</span>;",
              waitForMission: true
          }
      ],
      hint: "",
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
              text: "Mit <span class='sql-keyword'>FROM</span> sagst du SQL aus welcher Tabelle gelesen werden soll."
          },
          {
              target: ".CodeMirror",
              text: "Das Sternsymbol <span class='sql-symbol'>*</span> bedeutet: zeige alles."
          },
          {
              target: "#mission-panel",
              text: "Zeig mir jetzt den kompletten Warenbestand."
          },
          {
              target: ".CodeMirror",
              text: "Tippe jetzt:\n\n<span class='sql-keyword'>SELECT</span> <span class='sql-symbol'>*</span> <span class='sql-keyword'>FROM</span> <span class='sql-table'>shop_items</span>;",
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
        money: 15,
      },
      unlocks: ["FROM"],
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        return normalized.includes("from shop_items");
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
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
        money: 20,
      },
      unlocks: ["COLUMN_SELECTION"],
      validator: (query, result) => {
        const normalized = query.toLowerCase();
        if (!normalized.includes("from shop_items")) {
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
              target: "#shopkeeper",
              text: "Sehr gut. Du musst dich natürlich nicht auf eine einzelne Spalte beschränken."
          },
          {
              target: "#result",
              text: "Mehrere Spalten können auch abgefragt werden. Man trennt sie einfach mit Kommas."
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
              waitForMission: true
          }
      ],
      hint: "",
      reward: {
          money: 25,
      },
      unlocks: ["MULTI_COLUMN_SELECTION"],
      validator: (query, result) => {
          const normalized = query.toLowerCase();
          if(!normalized.includes("from shop_items")) {
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
