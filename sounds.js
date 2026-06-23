const SOUND_PATHS = {
    regularUi: [
        "./assets/sounds/UI_Keypad_3.mp3",
        "./assets/sounds/UI_Keypad_4.mp3",
        "./assets/sounds/UI_Keypad_5.mp3"
    ],
    itemAcquired: "./assets/sounds/Item_Acquire.mp3",
    runButton: "./assets/sounds/run_button.mp3",
    sqlError: "./assets/sounds/sql_error.mp3",
    continueButton: "./assets/sounds/weiter_button.mp3",
    openGreatNotebook: "./assets/sounds/open_great_notebook.wav",
    closeGreatNotebook: "./assets/sounds/close_great_notebook.wav",
    flippingPageRegister: "./assets/sounds/Flipping_page_register.wav",
    flippingPage: "./assets/sounds/Flipping_page.wav",
    stamps: [
        "./assets/sounds/stamp1.mp3",
        "./assets/sounds/stamp2.mp3"
    ],
    shopkeeperNormal: "./assets/sounds/shopkeeper_normal_voice.wav"
};

const SOUND_VOLUMES = {
    regularUi: 0.32,
    itemAcquired: 0.48,
    runButton: 0.35,
    sqlError: 0.42,
    continueButton: 0.34,
    openGreatNotebook: 0.48,
    closeGreatNotebook: 0.48,
    flippingPageRegister: 0.42,
    flippingPage: 0.42,
    stamp: 0.5,
    shopkeeper: 0.2
};

const audioTemplates = new Map();
const lastRandomIndexes = new Map();
let soundEffectsInitialized = false;
let shopkeeperVoice = null;

export function initSoundEffects() {
    if(soundEffectsInitialized)
        return;

    Object.values(SOUND_PATHS)
        .flat()
        .forEach(preloadSound);

    document.addEventListener("click", handleButtonClick);
    soundEffectsInitialized = true;
}

export function playItemAcquiredSound() {
    playSound(SOUND_PATHS.itemAcquired, SOUND_VOLUMES.itemAcquired);
}

export function playSqlErrorSound() {
    playSound(SOUND_PATHS.sqlError, SOUND_VOLUMES.sqlError);
}

export function playStampSound() {
    playRandomSound("stamp", SOUND_PATHS.stamps, SOUND_VOLUMES.stamp);
}

export function playContinueSound() {
    playSound(SOUND_PATHS.continueButton, SOUND_VOLUMES.continueButton);
}

export function playOpenGreatNotebookSound() {
    playSound(SOUND_PATHS.openGreatNotebook, SOUND_VOLUMES.openGreatNotebook);
}

export function playCloseGreatNotebookSound() {
    playSound(SOUND_PATHS.closeGreatNotebook, SOUND_VOLUMES.closeGreatNotebook);
}

export function playNotebookRegisterSound() {
    playSound(
        SOUND_PATHS.flippingPageRegister,
        SOUND_VOLUMES.flippingPageRegister
    );
}

export function playNotebookPageSound() {
    playSound(SOUND_PATHS.flippingPage, SOUND_VOLUMES.flippingPage);
}

export function playShopkeeperVoice() {
    stopShopkeeperVoice();
    shopkeeperVoice = createPlayback(
        SOUND_PATHS.shopkeeperNormal,
        SOUND_VOLUMES.shopkeeper
    );
    shopkeeperVoice.loop = true;
    playAudio(shopkeeperVoice);
}

export function stopShopkeeperVoice() {
    if(!shopkeeperVoice)
        return;

    shopkeeperVoice.pause();
    shopkeeperVoice.currentTime = 0;
    shopkeeperVoice = null;
}

function handleButtonClick(event) {
    const button = event.target.closest("button");

    if(!button || button.disabled)
        return;

    if(button.id === "tutorial-next-btn")
        return;

    if(isNotebookPaperButton(button))
        return;

    if(button.id === "run-btn") {
        playSound(SOUND_PATHS.runButton, SOUND_VOLUMES.runButton);
        return;
    }

    playRandomSound(
        "regularUi",
        SOUND_PATHS.regularUi,
        SOUND_VOLUMES.regularUi
    );
}

function isNotebookPaperButton(button) {
    return (
        button.id === "notebook-expand-btn" ||
        button.id === "large-notebook-close" ||
        button.classList.contains("large-notebook-entry") ||
        button.classList.contains("large-notebook-next-page")
    );
}

function preloadSound(path) {
    if(audioTemplates.has(path))
        return;

    const audio = new Audio(path);
    audio.preload = "auto";
    audioTemplates.set(path, audio);
}

function playRandomSound(poolName, paths, volume) {
    if(paths.length === 0)
        return;

    const previousIndex = lastRandomIndexes.get(poolName);
    let nextIndex = Math.floor(Math.random() * paths.length);

    if(paths.length > 1) {
        while(nextIndex === previousIndex) {
            nextIndex = Math.floor(Math.random() * paths.length);
        }
    }

    lastRandomIndexes.set(poolName, nextIndex);
    playSound(paths[nextIndex], volume);
}

function playSound(path, volume) {
    playAudio(createPlayback(path, volume));
}

function createPlayback(path, volume) {
    preloadSound(path);
    const audio = audioTemplates.get(path).cloneNode();
    audio.volume = volume;
    return audio;
}

function playAudio(audio) {
    audio.play().catch(() => {
        // Browser duerfen Audio bis zur ersten Nutzerinteraktion blockieren.
    });
}
