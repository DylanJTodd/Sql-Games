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

    let levelNum = document.getElementById('level-number');
    let levelTagline = document.getElementById('level-tagline');
    let scenarioText = document.getElementById('scenario-text');
    let schemaLink = document.getElementById('experienced-schema');

    let sql_solution = document.getElementById('sql-solution-div');
    // Level 1 -----------------------------------
    
    if (gameState == 1)
    {
        levelNum.innerText = 'Level 1';

        levelTagline.innerText = 'Marble Count';

        scenarioText.innerHTML = 'Welcome to the first level of the SQL Games! Hahahehehoho! <i>cough cough ahem</i>. In this level, we\'re starting with the basics. You will be counting how many <b>RED</b> marbles, weighing <b>2LBS OR UNDER</b>, and are <b>5CM OR SMALLER</b> in diameter are in this jar';

        schemaLink.src = 'images/schemas/level1.jpg';
        schemaLink.width = '300';

        sql_solution.setAttribute('data-question', 'Did you count correctly?');
        sql_solution.setAttribute('data-default-text', `INSERT INTO solution VALUES (1, 'Insert how many marbles you counted');

--clone=false`);
    }

    // Level 2 -----------------------------------

    if (gameState == 2)
    {
        levelNum.innerText = 'Level 2';

        levelTagline.innerText = 'The Honeycomb';

        scenarioText.innerHTML = 'So you were good enough to pass the <i>tutorial</i> huh? Well, let\'s see how you do with this one. In Level 2, you are tasked with finding the <b>SOLE</b> honeycomb which has the <b>STAR</b> shape, is <b>WET</b>, and has the <b>LOWEST DIFFICULTY</b>. Good luck! I can\'t wait to see you fail!';

        schemaLink.src = 'images/schemas/level2.jpg';
        schemaLink.width = '300';

        sql_solution.setAttribute('data-question', 'Did you find the right honeycomb?');
        sql_solution.setAttribute('data-default-text', `INSERT INTO solution VALUES (1, 'Insert the ID of the most fitting honeycomb');

--clone=false`);
    }

    if (gameState == 3)
        {
            levelNum.innerText = 'Level 3';
    
            levelTagline.innerText = 'Lights Out';
    
            scenarioText.innerHTML = 'Filler Text';
    
            schemaLink.src = 'images/schemas/level3.jpg';
            schemaLink.width = '800';
    
            sql_solution.setAttribute('data-question', 'Did you find the next best room?');
            sql_solution.setAttribute('data-default-text', `INSERT INTO solution VALUES (1, 'Insert the ID of the best room to move to');
                
--clone=false`);
        }

}

loadLevel();