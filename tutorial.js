let tutorialSteps = [];
let currentTutorialStep = 0;
let finishCallback = null;
let runButtonIntroduced = false;

export function loadTutorialSteps(steps, softTutorial = false) {
    tutorialSteps = steps;
    currentTutorialStep = 0;
    runButtonIntroduced = false;
    moveTutorialOverlayIntoGameScreen();
    document.getElementById("tutorial-overlay").style.display = "block";
    const overlay = document.getElementById("tutorial-overlay");
    overlay.classList.toggle("soft-tutorial",softTutorial);
    showTutorialStep();
}

function showTutorialStep() {
    document.body.style.overflow = "hidden";
    const step = tutorialSteps[currentTutorialStep];
    const overlay = document.getElementById("tutorial-overlay");
    const runButton = document.getElementById("run-btn");
    const editorZone = document.getElementById("editor-zone");
    if(step.waitForMission) {
        overlay.classList.add("waiting-for-mission");
    } else {
        overlay.classList.remove("waiting-for-mission");
    }
    const target = document.querySelector(step.target);
    const rect = getStageRect(target);
    const highlight = document.getElementById("tutorial-highlight");
    highlight.style.display = step.disableHighlight ? "none" : "block";
    runButtonIntroduced ||= step.target === "#run-btn";
    const padding = step.padding || 10;
    highlight.style.left = rect.left - padding + "px";
    highlight.style.top = rect.top - padding + "px";
    highlight.style.width = rect.width + padding * 2 + "px";
    highlight.style.height = rect.height + padding * 2 + "px";
    document.getElementById("tutorial-text").innerHTML = step.text;
    const nextButton = document.getElementById("tutorial-next-btn");
    if(runButtonIntroduced || step.waitForMission) {
        editorZone.style.zIndex = "10001";
        editorZone.style.pointerEvents = step.waitForMission ? "" : "none";
        runButton.style.position = "relative";
        runButton.style.zIndex = "10002";
        runButton.style.pointerEvents = step.waitForMission ? "" : "none";
    } else {
        editorZone.style.zIndex = "";
        editorZone.style.pointerEvents = "";
        runButton.style.position = "";
        runButton.style.zIndex = "";
        runButton.style.pointerEvents = "";
    }

    if(step.waitForMission) {
        nextButton.style.display = "none";
    } else {
        nextButton.style.display = "block";
    }

    const textBox = document.getElementById("tutorial-text-box");
    textBox.style.top = "auto";
    textBox.style.bottom = "auto";
    switch(step.position) {
        case "target-bottom":
            textBox.style.top = (rect.bottom + 20) + "px";
            break;
        case "target-top":
            textBox.style.top = (rect.top - 180) + "px";
            break;
        case "editor-top":
            placeTextBoxAtCounter(textBox);
            break;
        case "bottom":
            placeTextBoxAtEditorTop(textBox);
            break;
        case "top":
            textBox.style.top = "5vh";
            break;
        default:
            placeTextBoxAtCounter(textBox);
    }
}

function placeTextBoxAtCounter(textBox) {
    const shopElement = document.getElementById("shop-screen");

    if(!shopElement) {
        textBox.style.bottom = "41vh";
        return;
    }

    const shopRect = getStageRect(shopElement);
    const top = Math.max(
        20,
        shopRect.top + shopRect.height * 0.72
    );

    textBox.style.top = `${top}px`;
}

function placeTextBoxAtEditorTop(textBox) {
    const editorElement = document.querySelector(".CodeMirror");

    if(!editorElement) {
        textBox.style.bottom = "18vh";
        return;
    }

    const editorRect = getStageRect(editorElement);
    const top = Math.max(
        20,
        editorRect.top + 12
    );

    textBox.style.top = `${top}px`;
}

document.getElementById("tutorial-next-btn").onclick = () => {
    currentTutorialStep++;
    if(currentTutorialStep >= tutorialSteps.length) {
        hideTutorialOverlay();
        if(finishCallback) {
            finishCallback();
        }

        return;
    }
    showTutorialStep();
};

window.addEventListener("resize", () => {
    if(
        tutorialSteps.length > 0 &&
        document.getElementById("tutorial-overlay").style.display !== "none"
    ) {
        showTutorialStep();
    }
});

window.addEventListener("game-scale-change", () => {
    if(
        tutorialSteps.length > 0 &&
        document.getElementById("tutorial-overlay").style.display !== "none"
    ) {
        showTutorialStep();
    }
});

export function clearTutorial() {
    tutorialSteps = [];
    currentTutorialStep = 0;
    runButtonIntroduced = false;
    hideTutorialOverlay();
}

function hideTutorialOverlay() {
    const overlay = document.getElementById("tutorial-overlay");
    overlay.style.display = "none";
    overlay.classList.remove("waiting-for-mission", "soft-tutorial");
    document.getElementById("editor-zone").style.zIndex = "";
    document.getElementById("editor-zone").style.pointerEvents = "";
    document.getElementById("run-btn").style.position = "";
    document.getElementById("run-btn").style.zIndex = "";
    document.getElementById("run-btn").style.pointerEvents = "";
    document.body.style.overflow = "";
}

function moveTutorialOverlayIntoGameScreen() {
    const overlay = document.getElementById("tutorial-overlay");
    const gameScreen = document.getElementById("game-screen");

    if(overlay.parentElement === gameScreen)
        return;

    gameScreen.appendChild(overlay);
}

function getStageRect(element) {
    const overlay = document.getElementById("tutorial-overlay");
    const overlayRect = overlay.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const scale = getGameScale();

    return {
        left: (rect.left - overlayRect.left) / scale,
        top: (rect.top - overlayRect.top) / scale,
        right: (rect.right - overlayRect.left) / scale,
        bottom: (rect.bottom - overlayRect.top) / scale,
        width: rect.width / scale,
        height: rect.height / scale
    };
}

function getGameScale() {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--game-scale");
    const scale = Number.parseFloat(value);

    return Number.isFinite(scale) && scale > 0
        ? scale
        : 1;
}
