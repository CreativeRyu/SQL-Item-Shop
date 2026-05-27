let tutorialSteps = [];
let currentTutorialStep = 0;
let finishCallback = null;

export function loadTutorialSteps(steps) {
    tutorialSteps = steps;
    currentTutorialStep = 0;
    document.getElementById("tutorial-overlay").style.display = "block";
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
    highlight.style.left = rect.left - 10 + "px";
    highlight.style.top = rect.top - 10 + "px";
    highlight.style.width = rect.width + 20 + "px";
    highlight.style.height = rect.height + 20 + "px";
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
