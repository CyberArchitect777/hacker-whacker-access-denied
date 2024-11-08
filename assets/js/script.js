
// Minimum global variables implemented in place of using HTML hidden elements to hold values

/**
 * A global object storing all useful game data for access by all functions
 */
const hackerGameData = {
    hackerLocation: -1,
    hackerType: 0,
    gameRounds: 30,
    timeInterval: 1,
    currentScore: 0,
    highScore: 0,
    antiMalware: true,
    gameSpeed: 1,
    gameRun: "",
    clickFlag: true,
    //clickSound: new Audio("assets/sounds/click.mp3"),
    setUpObject: function () {
        this.hackerLocation = -1;
        this.currentScore = 0;
        hackerGameData.currentTime = (hackerGameData.gameRounds / hackerGameData.timeInterval);
        clickFlag = true;
    }
};

function setUpButtonEventListeners() {

    // Button event listener set up area

    // Main menu buttons

    const menuStartGameButton = document.getElementById("menu-start-button");
    menuStartGameButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        displayWindow("game-screen");
    });

    const gameSettingsButton = document.getElementById("game-settings-button");
    gameSettingsButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        displayWindow("settings-screen");
    });

    const instructionsButton = document.getElementById("how-to-play-button");
    instructionsButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        displayWindow("instructions-screen");
    });

    // Game screen buttons

    const gameStartButton = document.getElementById("start-game-button");
    gameStartButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        gameStartButton.innerText = "Started";
        gameStart();
    });

    const gameEndButton = document.getElementById("end-game-button");
    gameEndButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        exitLoop();
        hackerGameData.clickFlag = true;
        updateFinalScore();
        displayWindow("score-screen");
        gameStartButton.innerText = "Start Game";
        disableStartButton(false);
    });

    // Game settings screen buttons

    const antiMalwareSwitch = document.getElementById("anti-malware-switch");
    antiMalwareSwitch.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        hackerGameData.antiMalware = hackerGameData.antiMalware ? false : true; 
        setIndividualSettingColours(hackerGameData.antiMalware, antiMalwareSwitch);
    });

    const speedSwitch = document.getElementById("speed-switch");
    speedSwitch.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        if (hackerGameData.gameSpeed === 0) {
            hackerGameData.gameSpeed = 1;
            hackerGameData.gameRounds = 30;
            hackerGameData.timeInterval = 1;
        } else if (hackerGameData.gameSpeed === 1) {
            hackerGameData.gameSpeed = 2;
            hackerGameData.gameRounds = 15;
            hackerGameData.timeInterval = 0.5;
        } else {
            hackerGameData.gameSpeed = 0;
            hackerGameData.gameRounds = 45;
            hackerGameData.timeInterval = 1.5;
        }
        setSpeedText();
    });

    const mainMenuButton1 = document.getElementById("main-menu-button1");
    mainMenuButton1.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        displayWindow("menu-screen");
    });

    // Instructions screen buttons

    const mainMenuButton2 = document.getElementById("main-menu-button2");
    mainMenuButton2.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        displayWindow("menu-screen");
    });

    // Final score screen buttons

    const playAgainButton = document.getElementById("play-again-button");
    playAgainButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        resetGame();
        displayWindow("game-screen");
        gameStartButton.innerText = "Started";
        gameStart();
    });

    const exitMenuButton = document.getElementById("exit-main");
    exitMenuButton.addEventListener("click", function () {
        new Audio("assets/sounds/click.mp3").play(); // Play sound on click
        resetGame();
        displayWindow("menu-screen");
    });
}

/**
 * Exit out of the thread loop to stop the hacker generation
 */
function exitLoop() {
    clearInterval(hackerGameData.gameRun);
}

/**
 * Reset the game back to default values
 */
function resetGame() {
    hackerGameData.setUpObject(); // Reset the hacker data object to starting values
    updateStartingTime();
    updateGameScore(0);
    resetBoard();
}
/** Reset the entire game board back to desktop images */
function resetBoard() {
    for (let x = 0; x < 16; x++) {
        document.getElementById("image" + x).src = "assets/images/desktop.png";
        document.getElementById("image" + x).alt = "Gameplay desktop tile image";
    }
}

/**
 * Displays the required div frame after being activated by an event or call.
 **/
function displayWindow(windowName) {
    const allSitePages = document.querySelectorAll(".sitepage");

    for (let oneSitePage of allSitePages) {
        if (oneSitePage.id == windowName) {
            oneSitePage.classList.remove("hide");
            oneSitePage.setAttribute("aria-hidden", "false");
        } else {
            oneSitePage.classList.add("hide");
            oneSitePage.setAttribute("aria-hidden", "true");
        }
    }
}

/**
 * Creates the HTML code and embeds it in the page to display the initial play board
 **/
function createBoard() {
    let gameBoard = document.getElementById("boxes");
    let gameCode = "";

    gameCode += `<div class="row">`;

    for (let x = 0; x < 16; x++) {
        if (x % 4 == 0) {
            gameCode += `</div><div class="row d-flex justify-content-center">`;
        }
        gameCode += `<div id="box${x}" class="hackerbox col-3"><img id="image${x}" class="img-fluid" alt="Gameplay desktop tile image" src="assets/images/desktop.png"></div>`;
    }

    gameCode += "</div>";
    gameBoard.innerHTML += gameCode;

    setUpListeners();
}

/**
 * Sets up event listeners for all created boxes on the play board
 **/
function setUpListeners() {
    for (let x = 0; x < 16; x++) {
        let selectedImage = document.getElementById("image" + x);
        selectedImage.addEventListener("click", checkAnswer);
    }
}

/**
 * Sets the colour of individual items in the settings panel based on current game settings. 
 * Only applies to boolean settings
 */
function setIndividualSettingColours(dataElement, pageElement) {
    if (dataElement == true) {
        pageElement.innerText = "ON";
    } else {
        pageElement.innerText = "OFF";
    }
}

/**
 * Set the colour of all settings menu items to those matching the current game settings
 */
function setAllSettingColours() {
    setIndividualSettingColours(hackerGameData.antiMalware, document.getElementById("anti-malware-switch"));
    setSpeedText();
}

/**
 * Change the game speed setting and adjust the interface in the settings panel to reflect this
 */
function setSpeedText() {
    switch(hackerGameData.gameSpeed) {
        case 0:
            document.getElementById("speed-switch").innerText = "SLOW";
            break;
        case 1:
            document.getElementById("speed-switch").innerText = "MEDIUM";
            break;
        case 2:
            document.getElementById("speed-switch").innerText = "FAST";            
            break;
    }
}

/**
 * Checks the location of the user action against the actual location of the hacker and adjusts the score apropriately
 **/
function checkAnswer(eventAction) {
    let targetBox = (eventAction.target.id).substring(5);
    if (hackerGameData.clickFlag != true) {
        if (targetBox == hackerGameData.hackerLocation) {
            if (hackerGameData.hackerType == 0) {
                new Audio("assets/sounds/success.wav").play(); // Play success sound after succeeding
                updateGameScore(hackerGameData.currentScore + 5);
            } else {
                new Audio("assets/sounds/fail.wav").play(); // Play fail sound after succeeding
                updateGameScore(hackerGameData.currentScore - 20);
            }            
            hackerGameData.clickFlag = true;
            if (hackerGameData.hackerType == 0) { /* Display green version of the box image after user click for feedback */
                document.getElementById(eventAction.target.id).src = "assets/images/hacker_skullgreen.png";
                document.getElementById(eventAction.target.id).alt = "Gameplay clicked hacker tile image";    
            } else {
                document.getElementById(eventAction.target.id).src = "assets/images/hacker_shieldred.png";
                document.getElementById(eventAction.target.id).alt = "Gameplay clicked anti-malware tile image";
            }            
            setTimeout(() => { /* Put tile image back on game screen after 200ms */
                document.getElementById(eventAction.target.id).src = "assets/images/desktop.png";
                document.getElementById(eventAction.target.id).alt = "Gameplay desktop tile image";
            }, 200);
        } else {
            updateGameScore(hackerGameData.currentScore - 10);
            new Audio("assets/sounds/fail.wav").play();
            hackerGameData.clickFlag = true;
            document.getElementById(eventAction.target.id).style.backgroundColor = "red";
            setTimeout(() => {
                document.getElementById(eventAction.target.id).style.backgroundColor = "transparent";
            }, 200);
        }
    }
}

/**
 * Removes the hacker image from a given box
 **/
function removeHacker(hackerPosition) {
    document.getElementById("image" + hackerPosition).src = "assets/images/desktop.png";
    document.getElementById("image" + hackerPosition).alt = "Gameplay desktop tile image";
}

/**
 * Places the hacker image on a given box depending on hacker type for this iteration
 **/
function placeHacker(hackerPosition, hackerType) {
    if (hackerType == 0) {
        document.getElementById("image" + hackerPosition).src = "assets/images/hacker_skull.png";
        document.getElementById("image" + hackerPosition).alt = "Gameplay unclicked hacker tile image";
    } else {
        document.getElementById("image" + hackerPosition).src = "assets/images/hacker_shield.png";
        document.getElementById("image" + hackerPosition).alt = "Gameplay unclicked anti-malware tile image";
    }
}

/**
 * The main function that runs the game by calling other functions.
 **/
function gameStart() {

    disableStartButton(true);
    updateTimeLeft(hackerGameData.currentTime);
    hackerGameData.clickFlag = true;

    // Starts the new game thread which runs every hackerGameData.timeInterval for hackerGameData.gameRounds
    hackerGameData.gameRun = setInterval(function () {

        if (hackerGameData.hackerLocation != -1) {
            removeHacker(hackerGameData.hackerLocation);
        }

        if ((hackerGameData.currentTime == 0)) {
            clearInterval(hackerGameData.gameRun);
            updateFinalScore(hackerGameData.currentScore);
            disableStartButton(false);
            hackerGameData.clickFlag = true;
            document.getElementById("start-game-button").innerText = "Start Game";
            displayWindow("score-screen");
        } else {
            const newHackerLocation = Math.floor(Math.random() * 16);
            let newHackerType = 0;
            if (hackerGameData.antiMalware == 1) {
                newHackerType = Math.floor(Math.random() * 5) /* Gives a 20% chance of getting a anti-malware box */
            }
            if (newHackerType == 4) {
                placeHacker(newHackerLocation, 1);
            }
            else {
                placeHacker(newHackerLocation, 0);
            }
            hackerGameData.hackerLocation = newHackerLocation;
            hackerGameData.hackerType = newHackerType == 4 ? 1 : 0;
            updateTimeLeft(hackerGameData.currentTime - hackerGameData.timeInterval);
            hackerGameData.clickFlag = false;
        }
    }, (hackerGameData.timeInterval * 1000), hackerGameData.gameRounds);
}

/**
 * Creates the game board and updates the starting time
 */
function setUpInitialGame() {
    createBoard();
    updateStartingTime();
}

/**
 * Updates the score locally and on the HTML page
 **/
const updateGameScore = newScore => {
    hackerGameData.currentScore = Number(newScore);
    document.getElementById("score-display").innerText = "Score: " + String(newScore);
};

/**
 * Updates the time left locally and on the HTML page
 **/
const updateTimeLeft = newTime => {
    hackerGameData.currentTime = Number(newTime);
    document.getElementById("time-display").innerText = "Time: " + Math.round(newTime);
};

/**
 * Updates the final score found on the score screen
 */
const updateFinalScore = () => document.getElementById("final-score").innerText = "Final Score: " + hackerGameData.currentScore;

/**
 * 
 * Sets a starting time value
 */
const updateStartingTime = () => {
    hackerGameData.setUpObject();
    document.getElementById("time-display").innerText = "Time: " + hackerGameData.currentTime;
};

/**
 * Enables or disables the start game button on the game screen. True enables it, false disables it.
 */
const disableStartButton = buttonState => (document.getElementById("start-game-button")).disabled = buttonState;

setUpButtonEventListeners();
setUpInitialGame();
setAllSettingColours();
