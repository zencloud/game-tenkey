// Core Game Functions

// Game Variables
gameData = {

    // Game Cells Used
    cellMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    timeoutMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    // Mole Loop Controls
    moleLoopTimeout: -1,
}

function fx_create_flash (cellNumber) {
    
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
            freeCells.push(i+1);
        }
    }

    // Select 1 cell from free cellsq
    let foundCell = freeCells[getRandomInt(0, freeCells.length-1)];

    // Update Cell Matrix
    gameData.cellMatrix[foundCell-1] = 1;
    
    // Find cell in DOM and generate mole
    let cellID = "c" + foundCell;
    let moleDiv = document.getElementById(cellID).getElementsByClassName("mole-img")[0];
    moleDiv.innerHTML = `
        <img data-cell="${foundCell}" class="animate-pop-up" src="assets/imgs/mole.png">`;

    // Reset Mole Delay
    gameData.timeoutMatrix[foundCell-1] = setTimeout(() => {

        // Update Matrix
        gameData.cellMatrix[foundCell-1] = 0;

        // Update with image change
        moleDiv.innerHTML = `
        <img data-cell="${foundCell}" class="animate-drop-down" src="assets/imgs/mole.png">`;
    }, 1500);
}


// --- Get Player Input
document.addEventListener("keyup", function(event) {

    // Check if Number
    if (!isNaN(event.key)) {
        
        // Check Matrix against input
        // Convert key to number
        let cellNumber = parseInt(event.key);
        if (gameData.cellMatrix[cellNumber-1] === 1) {


            // Update Matrix
            gameData.cellMatrix[cellNumber-1] = 0;

            // Update Mole hit
            let cellID = "c" + cellNumber;
            let moleDiv = document.getElementById(cellID).getElementsByClassName("mole-img")[0];
            
            // Creat FX
            fx_create_flash(cellNumber);

            // Disable Mole Timeout
            clearTimeout(gameData.timeoutMatrix[cellNumber-1]);

            // Update with image change
            moleDiv.innerHTML = `
            <img class="animate-drop-down" src="assets/imgs/mole_damages.png">`;
            
        }
    }
});


// --- Mole Loop Start Running
function game_mole_loop_start () {

    let timeDelay = getRandomInt(300, 1000);
    gameData.moleLoopTimeout = setTimeout(() => {
        game_mole_create();
        game_mole_loop_start();
    }, timeDelay);
}

// --- Mole Loop Stop Running
function game_mole_loop_stop () {
    clearTimeout(gameData.moleLoopTimeout);
    gameData.moleLoopTimeout = -1;
}