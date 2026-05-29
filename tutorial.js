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
        case "bottom":
            textBox.style.bottom = "200px";
            break;
        case "top":
            textBox.style.top = "20px";
            break;
        default:
            textBox.style.bottom = "380px";
    }
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
