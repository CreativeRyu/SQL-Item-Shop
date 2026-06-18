export const NOTEBOOK_CATEGORIES = {
    TABLES: {
        title: "TABLES",
        description:
            "Tabellen sind die Regale deiner Datenbank. Das Schema zeigt, welche Spalten eine Tabelle hat; die Vorschau zeigt ein paar echte Zeilen."
    },
    DQL: {
        title: "DQL",
        description:
            "Data Query Language. Hier sammelst du alles, womit du Daten abfragst, filterst, sortierst und später kombinierst."
    },
    DML: {
        title: "DML",
        description:
            "Data Manipulation Language. Diese Befehle verändern Daten. Im Laden kommt das erst, wenn die Technik sitzt."
    },
    DDL: {
        title: "DDL",
        description:
            "Data Definition Language. Damit untersuchst oder veränderst du Strukturen wie Tabellen und Spalten."
    },
    DCL: {
        title: "DCL",
        description:
            "Data Control Language. Hier geht es später um Rechte und Zugriff auf Daten."
    },
    TCL: {
        title: "TCL",
        description:
            "Transaction Control Language. Diese Befehle halten mehrere Änderungen als sichere Einheit zusammen."
    }
};

export const NOTEBOOK_TOPICS = {
    DQL: [
        {
            id: "DQL_SELECT",
            label: "SELECT",
            unlockKey: "SELECT",
            teaser: "Der erste Griff ins Datenregal.",
            summary:
                "SELECT bestimmt, welche Werte oder Spalten du sehen willst. Es ist der Startpunkt fast jeder Abfrage.",
            syntax: "SELECT spalte\nFROM tabelle;",
            example: "SELECT name, price\nFROM products;",
            note:
                "Der Shopkeeper sagt: Erst sauber auswählen, dann schwerer werden."
        },
        {
            id: "DQL_FROM",
            label: "FROM",
            unlockKey: "FROM",
            teaser: "Sagt SQL, aus welcher Tabelle die Daten kommen.",
            summary:
                "FROM nennt die Tabelle oder View, aus der SELECT lesen soll.",
            syntax: "SELECT spalte\nFROM tabelle;",
            example: "SELECT name\nFROM shop_items;",
            note:
                "Ohne FROM weiss SQL nicht, welches Regal du gerade meinst."
        },
        {
            id: "DQL_WILDCARD",
            label: "Wildcard *",
            unlockKey: "*",
            teaser: "Alle Spalten auf einmal anzeigen.",
            summary:
                "Das Sternchen steht für alle Spalten der gewählten Tabelle. Es ist praktisch zum Erkunden, aber selten die sauberste Endlösung.",
            syntax: "SELECT *\nFROM tabelle;",
            example: "SELECT *\nFROM products;",
            note:
                "Gut zum Umschauen. Für präzise Arbeit wählt der Profi einzelne Spalten."
        },
        {
            id: "DQL_WHERE",
            label: "WHERE",
            unlockKey: "WHERE",
            teaser: "Filtert Zeilen nach einer Bedingung.",
            summary:
                "WHERE lässt nur Zeilen durch, bei denen die Bedingung wahr ist.",
            syntax: "SELECT spalten\nFROM tabelle\nWHERE bedingung;",
            example: "SELECT name, price\nFROM products\nWHERE name = 'Apfel';",
            note:
                "WHERE ist wie ein Türsteher für Tabellenzeilen."
        },
        {
            id: "DQL_COMPARISON",
            label: "Vergleiche",
            unlockKey: "COMPARISON_OPERATORS",
            teaser: "Prüft Werte mit =, >, <, >= und <=.",
            summary:
                "Vergleichsoperatoren prüfen Zahlen oder Texte. Textwerte schreibst du in Anführungszeichen.",
            syntax: "WHERE spalte = wert\nWHERE preis > 10",
            example: "SELECT name\nFROM products\nWHERE price < 5;",
            note:
                "Bei Text sauber quoten. Bei Zahlen klar vergleichen."
        },
        {
            id: "DQL_AND",
            label: "AND",
            unlockKey: "AND",
            teaser: "Mehrere Bedingungen müssen gleichzeitig stimmen.",
            summary:
                "AND verbindet Bedingungen. Eine Zeile kommt nur durch, wenn alle verbundenen Bedingungen wahr sind.",
            syntax: "WHERE bedingung_1\nAND bedingung_2",
            example: "SELECT name, price\nFROM products\nWHERE price > 3 AND price < 30;",
            note:
                "AND ist Disziplin: beide Seiten liefern, sonst kein Treffer."
        },
        {
            id: "DQL_OR",
            label: "OR",
            unlockKey: "OR",
            teaser: "Eine von mehreren Bedingungen reicht.",
            summary:
                "OR verbindet Alternativen. Eine Zeile kommt durch, wenn mindestens eine Bedingung wahr ist.",
            syntax: "WHERE bedingung_1\nOR bedingung_2",
            example: "SELECT *\nFROM products\nWHERE name = 'Apfel' OR name = 'Banane';",
            note:
                "OR ist Auswahl, nicht Chaos."
        },
        {
            id: "DQL_BETWEEN",
            label: "BETWEEN",
            unlockKey: "BETWEEN",
            teaser: "Prüft einen Bereich mit zwei Grenzen.",
            summary:
                "BETWEEN prüft, ob ein Wert zwischen zwei Grenzen liegt. Die Grenzen zählen mit.",
            syntax: "WHERE spalte BETWEEN untere_grenze AND obere_grenze",
            example: "SELECT name, budget\nFROM customers\nWHERE budget BETWEEN 20 AND 100;",
            note:
                "Gut für Preiszonen, Budgets und alles, was zwischen zwei Punkten liegt."
        },
        {
            id: "DQL_LIKE",
            label: "LIKE",
            unlockKey: "LIKE",
            teaser: "Sucht Textmuster mit Platzhaltern.",
            summary:
                "LIKE vergleicht Texte mit Mustern. Das Prozentzeichen % steht für beliebig viele Zeichen.",
            syntax: "WHERE spalte LIKE 'Muster%'",
            example: "SELECT name\nFROM products\nWHERE name LIKE 'Protein%';",
            note:
                "Wenn du nur einen Teil kennst, trainiert LIKE den Rest."
        },
        {
            id: "DQL_ORDER_BY",
            label: "ORDER BY",
            unlockKey: "ORDER BY",
            teaser: "Sortiert Ergebnisse.",
            summary:
                "ORDER BY sortiert Zeilen nach einer oder mehreren Spalten.",
            syntax: "ORDER BY spalte ASC\nORDER BY spalte DESC",
            example: "SELECT name, price\nFROM products\nORDER BY price DESC;",
            note:
                "Kommt später, wenn der Laden nach Reihenfolge fragt."
        },
        {
            id: "DQL_LIMIT",
            label: "LIMIT",
            unlockKey: "LIMIT",
            teaser: "Begrenzt die Anzahl der Ergebniszeilen.",
            summary:
                "LIMIT gibt nur eine bestimmte Anzahl Zeilen zurück.",
            syntax: "SELECT spalten\nFROM tabelle\nLIMIT anzahl;",
            example: "SELECT *\nFROM products\nLIMIT 3;",
            note:
                "Perfekt für schnelle Vorschauen."
        },
        {
            id: "DQL_JOIN",
            label: "JOIN",
            unlockKey: "JOIN",
            teaser: "Verbindet Daten aus mehreren Tabellen.",
            summary:
                "JOIN kombiniert Zeilen aus Tabellen, wenn passende Schlüssel zusammengehören.",
            syntax: "FROM tabelle_a\nJOIN tabelle_b ON tabelle_a.id = tabelle_b.a_id",
            example: "SELECT customers.name, products.name\nFROM sales\nJOIN customers ON sales.customer_id = customers.id\nJOIN products ON sales.product_id = products.id;",
            note:
                "Später wird daraus echtes Ladenverständnis."
        }
    ],
    DML: [
        {
            id: "DML_INSERT",
            label: "INSERT INTO",
            unlockKey: "INSERT INTO",
            teaser: "Fügt neue Zeilen ein."
        },
        {
            id: "DML_UPDATE",
            label: "UPDATE",
            unlockKey: "UPDATE",
            teaser: "Verändert vorhandene Zeilen."
        },
        {
            id: "DML_DELETE",
            label: "DELETE",
            unlockKey: "DELETE",
            teaser: "Entfernt Zeilen."
        }
    ],
    DDL: [
        {
            id: "DDL_PRAGMA_TABLE_INFO",
            label: "PRAGMA table_info",
            unlockKey: "PRAGMA table_info",
            teaser: "Untersucht die Spalten einer Tabelle.",
            summary:
                "PRAGMA table_info zeigt das Schema einer Tabelle: Spaltennamen, Datentypen und Schlüsselinformationen.",
            syntax: "PRAGMA table_info(tabelle);",
            example: "PRAGMA table_info(products);",
            note:
                "Einmal sauber untersucht, bleibt das Schema im Notebook."
        },
        {
            id: "DDL_CREATE_TABLE",
            label: "CREATE TABLE",
            unlockKey: "CREATE TABLE",
            teaser: "Erstellt neue Tabellen."
        },
        {
            id: "DDL_ALTER_TABLE",
            label: "ALTER TABLE",
            unlockKey: "ALTER TABLE",
            teaser: "Verändert Tabellenstrukturen."
        },
        {
            id: "DDL_DROP_TABLE",
            label: "DROP TABLE",
            unlockKey: "DROP TABLE",
            teaser: "Entfernt Tabellen."
        }
    ],
    DCL: [
        {
            id: "DCL_GRANT",
            label: "GRANT",
            unlockKey: "GRANT",
            teaser: "Vergibt Rechte."
        },
        {
            id: "DCL_REVOKE",
            label: "REVOKE",
            unlockKey: "REVOKE",
            teaser: "Entzieht Rechte."
        }
    ],
    TCL: [
        {
            id: "TCL_COMMIT",
            label: "COMMIT",
            unlockKey: "COMMIT",
            teaser: "Speichert eine Transaktion endgültig."
        },
        {
            id: "TCL_ROLLBACK",
            label: "ROLLBACK",
            unlockKey: "ROLLBACK",
            teaser: "Macht eine Transaktion rückgängig."
        },
        {
            id: "TCL_SAVEPOINT",
            label: "SAVEPOINT",
            unlockKey: "SAVEPOINT",
            teaser: "Setzt einen Zwischenpunkt in einer Transaktion."
        }
    ]
};
