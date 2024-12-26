const urlParams = new URLSearchParams(window.location.search);
const caller = urlParams.get('caller');

let gameState = 0;

function setGameState() {
    console.log('caller: ' + caller);
    gameState = parseInt(caller, 10);
}

function checkLevel() {
    if (localStorage.getItem('currentLevel') === null) {
        localStorage.setItem('currentLevel', 1);
    }
    return parseInt(localStorage.getItem('currentLevel'), 10);
}

function saveLevel() {
    let currentLevel = checkLevel();
    currentLevel++;
    localStorage.setItem('currentLevel', currentLevel);
}

function loadLevel() 
{
    setGameState();
    let currentLevel = checkLevel();

    console.log('gameState: ' + gameState + ' currentLevel: ' + currentLevel);

    if (gameState > currentLevel || isNaN(gameState) || gameState < 1 || gameState > 10) 
    {
        window.location.href = 'play.html?caller=' + currentLevel;
    }
}

loadLevel();