let quotes = [];
let musicQuotes = [];

const tutorialWarnings = [
    "Langsam, Azubi. Für solche Befehle fehlt dir noch die Ausbildung.",
    "Die letzten beiden Azubis haben das auch versucht.",
    "Finger weg von der Abrissbirne.",
    "Heute wird gelernt, nicht gelöscht.",
    "Gleich fliegt was...",
    "Du spielst mit Mächten, die du noch nicht kontrollieren kannst.",
    "Willst du das Tutorial nochmal von vorne starten?",
    "Einfach... NEIN",
    "Das ist genau die Art von Idee, die Meetings verursacht.",
    "Du willst nicht, dass ich Kopfschmerzen habe.",
    "Interessanter Ansatz, wird aber so semi erfolgreich.",
    "Netter Versuch..."
];


export async function loadQuotes() {
    const quoteData = await fetch("./shopkeeperQuotes.json")
        .then(res => res.json());

    if(Array.isArray(quoteData)) {
        quotes = quoteData;
        musicQuotes = [];
        return;
    }

    quotes = quoteData.default || [];
    musicQuotes = quoteData.music || [];
}

export function showHintMessage(text, duration = 7000) {
    const displayDuration =
        typeof duration === "number" ? duration : 7000;
    const bubble = document.getElementById("shopkeeper-hint");
    bubble.innerHTML = text;
    bubble.classList.add("visible");
    clearTimeout(bubble.hideTimeout);
    bubble.hideTimeout =
        setTimeout(() => {
            bubble.classList.remove("visible");
        }, displayDuration);
}

export function showRandomQuote(options = {}) {
    const availableQuotes = options.includeMusicQuotes
        ? quotes.concat(musicQuotes)
        : quotes;

    if(availableQuotes.length === 0)
        return;

    const bubble = document.getElementById("shopkeeper-dialogue");
    const randomQuote = availableQuotes[
        Math.floor(Math.random() * availableQuotes.length)
    ];
    bubble.innerText = randomQuote;
    bubble.style.opacity = 1;

    setTimeout(() => {
        bubble.style.opacity = 0;
    }, 4000);
}

export function showWarningMessage(text) {
    const bubble = document.getElementById("shopkeeper-warning");
    bubble.innerHTML = text;
    bubble.classList.add("visible");
    clearTimeout(bubble.hideTimeout);
    bubble.hideTimeout =
        setTimeout(() => {
            bubble.classList.remove("visible");
        }, 5000);
}

export function showTutorialWarning(text) {
    const box = document.getElementById("tutorial-warning-box" );
    const textBox = document.getElementById("tutorial-warning-text");
    textBox.innerHTML = text;
    box.classList.add("visible");
    clearTimeout(box.hideTimeout);
    box.hideTimeout = setTimeout(() => {
        box.classList.remove("visible");
    }, 3000);
}


export function getRandomTutorialWarning() {
    return tutorialWarnings[
        Math.floor(
            Math.random() * tutorialWarnings.length
        )
    ];
}
