// Core Game Functions


// Round Timer Object 
roundTimer = {

    delay: 25000,
    start: 0,
    updateInterval: null,
    
    timeRemaining: function() {
        return this.delay - (Date.now() - this.start);
    },

    setTimer: function () {

        // Set time started
        this.start = Date.now();
        
        // Set Interval Update
        this.updateInterval = setInterval(() => {
            let timeEle = document.getElementById("display-time-remaining");
            timeEle.textContent = Math.round(roundTimer.timeRemaining()/1000);
        }, 50);

        // Set Timer Stop Time
        setTimeout(() => {
           
            // End Round
           clearInterval(roundTimer.updateInterval);
           game_round_end();
        }, this.delay);
    }
}

// Game Objects/Variables
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
    playerHitTotal:  0,
    playerMissTotal: 0,
    playerBestHit:   0
}

// Update Gamespeed
gameData.gameSpeedCurrent = gameData.gameSpeedOptions.fast;

// --- Update DOM UI Game Info
function game_ui_update_game_info() {

    // Get DOM elements
    let correctDiv  = document.getElementById("game-info-display-hit");
    let wrongDiv    = document.getElementById("game-info-display-miss");

    // Update Elements with current info
    correctDiv.textContent = gameData.playerHitTotal;
    wrongDiv.textContent = gameData.playerMissTotal;
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

// --- FX: Create Impact Flash
function fx_create_flash_wrong(cellNumber) {

    let cellID = "c" + cellNumber;
    let moleDiv = document.getElementById(cellID);
    let flashDiv = document.createElement("div");
    flashDiv.classList.add("fx-flash");
    flashDiv.innerHTML = `<img src="assets/imgs/fx_wrong.png">`;
    moleDiv.appendChild(flashDiv);

    flashDivTimer = setTimeout(() => {
        moleDiv.removeChild(flashDiv);
    }, 400);
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
            gameData.playerMissTotal++;

            // Update Game Info Dom
            game_ui_update_game_info();

            // Wrong
            fx_create_flash_wrong(cellNumber);
        }

        // Correct Input
        if (gameData.cellMatrix[cellNumber - 1] === 1) {

            // Update Game Value: Correct Inputs
            gameData.playerHitTotal++;

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

// --- Round Start
function game_round_start () {

    // Hide Button
    let btnEle = document.getElementsByClassName("btn")[0];
    let timeEle = document.getElementsByClassName("display-time")[0];
    btnEle.style.display = "none";
    timeEle.style.display = "block";

    // Start Game Loop
    game_mole_loop_start();

    // Set Round Timer
    roundTimer.setTimer();

    // Reset Player Round Data
    gameData.playerHitTotal  = 0;
    gameData.playerMissTotal = 0;
    game_ui_update_game_info();
}

// --- Round End
function game_round_end () {

    // Update Button/Time DOM
    let btnEle = document.getElementsByClassName("btn")[0];
    let timeEle = document.getElementsByClassName("display-time")[0];
    btnEle.style.display = "inline-block";
    timeEle.style.display = "none";

    // Stop Mole Loop
    game_mole_loop_stop();

}
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