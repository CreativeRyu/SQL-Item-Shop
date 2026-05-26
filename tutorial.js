let tutorialSteps = [
    {
        target: "#shopkeeper",
        text: "Ahh... endlich Verstärkung. Die letzten Azubis haben die Kundendatenbank abgefackelt."
    },
    {
        target: ".CodeMirror",
        text: "Hier unten schreibst du SQL Befehle. Am Anfang reicht einfachet Zeug."
    },
    {
        target: "#run-btn",
        text: "Damit führst du deine Queries aus. Wenn deine Antwort stimmt, jibts Jeld."
    },
    {
        target: "#mission-panel",
        text: "Links siehst du deine Aufgaben. Ab und an gebe ich auch mal einen Lösungshinweis. Kunden warten nicht gern. Also streng dich an."
    },
    {
        target: "#result-panel",
        text: "Hier landen deine Ergebnisse. Wenn da Unsinn steht, hast du vermutlich Unsinn geschrieben."
    },
    {
        target: "#mission-panel",
        text: "Okay Azubi. Deine erste Aufgabe ist simpel."
    },
    {
        target: ".CodeMirror",
        text: "Tippe jetzt:\n\nSELECT 1;"
    }
];

let currentTutorialStep = 0;

let finishCallback = null;

export function startTutorial(onFinish) {
    finishCallback = onFinish;
    showTutorialStep();
}

export function loadTutorialSteps(steps) {
    tutorialSteps = steps;
    currentTutorialStep = 0;
    showTutorialStep();
}

function showTutorialStep() {
    const step = tutorialSteps[currentTutorialStep];
    const target = document.querySelector(step.target);
    const rect = target.getBoundingClientRect();
    const highlight = document.getElementById("tutorial-highlight");
    highlight.style.left = rect.left - 10 + "px";
    highlight.style.top = rect.top - 10 + "px";
    highlight.style.width = rect.width + 20 + "px";
    highlight.style.height = rect.height + 20 + "px";
    document.getElementById("tutorial-text").innerText = step.text;
}

document.getElementById("tutorial-next-btn").onclick = () => {
    currentTutorialStep++;
    if(currentTutorialStep >= tutorialSteps.length) {
    document.getElementById("tutorial-overlay").style.display = "none";
    if(finishCallback) {
        finishCallback();
    }

    return;
}
    showTutorialStep();
};
