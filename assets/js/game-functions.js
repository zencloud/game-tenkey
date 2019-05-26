// Core Game Functions

// Game Variables
gameData = {

    // Game Cells Used
    cellMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    // Mole Loop Controls
    moleLoopTimeout: -1,
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

    
    // Select 1 cell from free cells
    let foundCell = freeCells[getRandomInt(0, freeCells.length)];

    // Error Catching hack
    // Sometimes foundCell is undefined even though array is good. Very strange.
    while (foundCell === undefined && freeCells.length > 0) {
        console.log("ERROR FIX");
        foundCell = freeCells[getRandomInt(0, freeCells.length)];
    }

    // Update Cell Matrix
    gameData.cellMatrix[foundCell-1] = 1;

    // Find cell in DOM and generate mole
    let cellID = "c" + foundCell;
    let moleDiv = document.getElementById(cellID).getElementsByClassName("mole-img")[0];
    moleDiv.innerHTML = `
        <img class="animate-pop-up" src="assets/imgs/mole.png">`;
}

// --- Mole is clicked, takes mole value
function game_mole_clicked(moleValue) {
    // Do 
}

// --- Get Player Input
document.addEventListener("keyup", function(event) {
    //game_mole_create();
    game_mole_loop_stop();
});


// Mole Loop Start Running
function game_mole_loop_start () {

    let timeDelay = getRandomInt(1000, 1500);
    gameData.moleLoopTimeout = setTimeout(() => {
        game_mole_create();
        game_mole_loop_start();
    }, timeDelay);
}

function game_mole_loop_stop () {
    clearTimeout(gameData.moleLoopTimeout);
    gameData.moleLoopTimeout = -1;
}