// Utility Functions

// Get random number between range
// Returns: Number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get total characters in string
// Returns: Number
function getChrCount(string, chr) {
    return string.split(chr).length - 1;
}