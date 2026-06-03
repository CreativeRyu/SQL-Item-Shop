let tutorialSteps = [];
let currentTutorialStep = 0;
let finishCallback = null;

export function loadTutorialSteps(steps, softTutorial = false) {
    tutorialSteps = steps;
    currentTutorialStep = 0;
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
    if(step.waitForMission) {
        overlay.classList.add("waiting-for-mission");
    } else {
        overlay.classList.remove("waiting-for-mission");
    }
    const target = document.querySelector(step.target);
    const rect = target.getBoundingClientRect();
    const highlight = document.getElementById("tutorial-highlight");
    highlight.style.display = step.disableHighlight ? "none" : "block";
    const padding = step.padding || 10;
    highlight.style.left = rect.left - padding + "px";
    highlight.style.top = rect.top - padding + "px";
    highlight.style.width = rect.width + padding * 2 + "px";
    highlight.style.height = rect.height + padding * 2 + "px";
    document.getElementById("tutorial-text").innerHTML = step.text;
    const nextButton = document.getElementById("tutorial-next-btn");
    if(step.waitForMission) {
        nextButton.style.display = "none";
        runButton.style.position = "relative";
        runButton.style.zIndex = "10001";
    } else {
        nextButton.style.display = "block";
        runButton.style.zIndex = "";
    }

    const textBox = document.getElementById("tutorial-text-box");
    textBox.style.top = "";
    textBox.style.bottom = "";
    switch(step.position) {
        case "target-bottom":
            textBox.style.top = (rect.bottom + 20) + "px";
            break;
        case "target-top":
            textBox.style.top = (rect.top - 180) + "px";
            break;
        case "bottom":
            textBox.style.bottom = "18vh";
            break;
        case "top":
            textBox.style.top = "5h";
            break;
        default:
            textBox.style.bottom = "41vh";
    }
}

document.getElementById("tutorial-next-btn").onclick = () => {
    currentTutorialStep++;
    if(currentTutorialStep >= tutorialSteps.length) {
    document.getElementById("tutorial-overlay").style.display = "none";
    document.body.style.overflow = "";
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

export function clearTutorial() {
    tutorialSteps = [];
    currentTutorialStep = 0;
    document.getElementById("tutorial-overlay").style.display = "none";
    document.body.style.overflow = "";
}
