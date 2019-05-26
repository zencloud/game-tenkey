// Core Game Functions

// Game Variables
gameData = {

    // Game Cells Used
    cellMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    timeoutMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    // Mole Loop Controls
    moleLoopTimeout: -1,

    // Game Difficulty/Speed
    gameSpeedOptions: {
        "normal": [350, 1000],
        "fast": [250, 750],
        "crazy": [150, 450],
    },

    gameSpeedCurrent: [],
    gameLoopRunning: false,

    // Player Stats
    playerInputCorrectTotal: 0,
    playerInputWrongTotal: 0
}

// Update Gamespeed
gameData.gameSpeedCurrent = gameData.gameSpeedOptions.normal;

// --- Update DOM UI Game Info
function game_ui_update_game_info() {

    // Get DOM elements
    let correctDiv = document.getElementById("game-info-input-correct-total");
    let wrongDiv = document.getElementById("game-info-input-wrong-total");

    // Update Elements with current info
    correctDiv.textContent = gameData.playerInputCorrectTotal;
    wrongDiv.textContent = gameData.playerInputWrongTotal;
}

// --- FX: Create Impact Flash
function fx_create_flash(cellNumber) {

    let cellID = "c" + cellNumber;
    let moleDiv = document.getElementById(cellID);
    let flashDiv = document.createElement("div");
    flashDiv.classList.add("fx-flash");
    flashDiv.innerHTML = `<img src="assets/imgs/fx_flash.png">`;
    moleDiv.appendChild(flashDiv);

    flashDivTimer = setTimeout(() => {
        moleDiv.removeChild(flashDiv);
    }, 50);
}

// --- Mole is created at cell spot
function game_mole_create() {

    // Get array of all free cells
    let freeCells = [];
    for (let i = 0; i < gameData.cellMatrix.length; i++) {
        if (gameData.cellMatrix[i] == 0) {
            freeCells.push(i + 1);
        }
    }

    // Select 1 cell from free cellsq
    let foundCell = freeCells[getRandomInt(0, freeCells.length - 1)];

    // Update Cell Matrix
    gameData.cellMatrix[foundCell - 1] = 1;

    // Find cell in DOM and generate mole
    let cellID = "c" + foundCell;
    let moleDiv = document.getElementById(cellID).getElementsByClassName("mole-img")[0];
    moleDiv.innerHTML = `
        <img data-cell="${foundCell}" class="animate-pop-up" src="assets/imgs/mole.png">`;

    // Reset Mole Delay
    gameData.timeoutMatrix[foundCell - 1] = setTimeout(() => {

        // Update Matrix
        gameData.cellMatrix[foundCell - 1] = 0;

        // Update with image change
        moleDiv.innerHTML = `
        <img data-cell="${foundCell}" class="animate-drop-down" src="assets/imgs/mole.png">`;
    }, 1500);
}


// --- Get Player Input
document.addEventListener("keyup", function (event) {

    // Check if Number

    if (!isNaN(event.key)) {

        // Convert key to number
        let cellNumber = parseInt(event.key);

        // Wrong Input
        if (gameData.cellMatrix[cellNumber - 1] === 0) {

            // Update Game Value: Correct Inputs
            gameData.playerInputWrongTotal++;

            // Update Game Info Dom
            game_ui_update_game_info();
        }

        // Correct Input
        if (gameData.cellMatrix[cellNumber - 1] === 1) {

            // Update Game Value: Correct Inputs
            gameData.playerInputCorrectTotal++;

            // Update Game Info Dom
            game_ui_update_game_info();

            // Update Matrix
            gameData.cellMatrix[cellNumber - 1] = 0;

            // Update Mole hit
            let cellID = "c" + cellNumber;
            let moleDiv = document.getElementById(cellID).getElementsByClassName("mole-img")[0];

            // Update with image change
            moleDiv.innerHTML = `
            <img class="animate-drop-down" src="assets/imgs/mole_damages.png">`;

            // Creat FX
            fx_create_flash(cellNumber);

            // Disable Mole Timeout
            clearTimeout(gameData.timeoutMatrix[cellNumber - 1]);
        }
    }
});


// --- Mole Loop Start Running
function game_mole_loop_start() {
    gameData.gameLoopRunning = true;
    let timeDelay = getRandomInt(gameData.gameSpeedCurrent[0], gameData.gameSpeedCurrent[1]);
    gameData.moleLoopTimeout = setTimeout(() => {
        game_mole_create();
        game_mole_loop_start();
    }, timeDelay);
}


// --- Mole Loop Stop Running
function game_mole_loop_stop() {
    clearTimeout(gameData.moleLoopTimeout);
    gameData.moleLoopTimeout = -1;
    gameData.gameLoopRunning = false;

}