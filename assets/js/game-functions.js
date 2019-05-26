// Core Game Functions

// Game Variables
gameData = {

    // Game Cells Used
    cellMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0]
}

// --- Mole is created at cell spot
function game_mole_create(cellNumber) {
    
    let freeCells = [];
    for (let i = 0; i < gameData.cellMatrix.length; i++) {
        if (gameData.cellMatrix[i] == 0) {
            freeCells.push(i+1);
        }
    }


    // Create Mole in random available cell

    
    let foundCell = getRandomInt(1, freeCells.length)//freeCells[getRandomInt(0, freeCells.length)];
    console.log(foundCell);
    let cellID = "c" + foundCell;
    
    console.log(cellID);
    let moleDiv = document.getElementById(cellID).getElementsByClassName("mole-img")[0];
    moleDiv.innerHTML = `<img class="animate-pop-up" src="assets/imgs/mole.png">`;
}

// --- Mole is clicked, takes mole value
function game_mole_clicked(moleValue) {
    // Do 
}

// --- Get Player Input
document.addEventListener("keyup", function(event) {
    //game_mole_create();
});

