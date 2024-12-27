const urlParams = new URLSearchParams(window.location.search);
const caller = urlParams.get('caller');

let gameState = 0;

function setGameState() {
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

    if (gameState > currentLevel || isNaN(gameState) || gameState < 1 || gameState > 10) 
    {
        window.location.href = 'play.html?caller=' + currentLevel;
    }

    // Level 1 -----------------------------------
    
    if (gameState == 1)
    {
        let levelNum = document.getElementById('level-number');
        let levelTagline = document.getElementById('level-tagline');
        let scenarioText = document.getElementById('scenario-text');
        let schemaLink = document.getElementById('experienced-schema');

        let sql_solution = document.getElementById('sql-solution-div');

        levelNum.innerText = 'Level 1';

        levelTagline.innerText = 'Marble Count';

        scenarioText.innerHTML = 'Welcome to the first level of the SQL Games! Hahahehehoho! <i>cough cough ahem</i>. In this level, we\'re starting with the basics. You will be counting how many <b>RED</b> marbles, weighing <b>2LBS OR UNDER</b>, and are <b>5CM OR SMALLER</b> in diameter are in this jar';

        schemaLink.src = 'images/schemas/level1.jpg';
        schemaLink.width = '300';

        sql_solution.setAttribute('data-question', 'Did you count correctly?');
        sql_solution.setAttribute('data-default-text', `INSERT INTO solution VALUES (1, 'Insert how many marbles you counted');`);
    }

    // Level 1 -----------------------------------

}

loadLevel();