function normalizedQuery(query) {
  return query.toLowerCase();
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
      "Zahlen mit <, > und >= vergleichen",
      "Spaltenauswahl und WHERE kombinieren"
    ]
  },
  missions: [
    {
      id: "where_placeholder",
      title: "WHERE kommt als Nächstes",
      description: "Platzhaltermission für die Planung von Level 2.",
      story:
        "Der Shopkeeper legt einen neuen Stapel Bestellungen auf den Tresen. " +
        "Diesmal reicht es nicht mehr, einfach alles aus der Datenbank zu kippen.",
      task: "Noch keine echte Aufgabe. Als Nächstes planen wir Seed und WHERE-Missionen.",
      reward: {
        money: 0
      },
      validator: (query) => {
        const normalized = normalizedQuery(query);
        return normalized.includes("where") && normalized.includes("from");
      }
    }
  ]
};

export default level2;
