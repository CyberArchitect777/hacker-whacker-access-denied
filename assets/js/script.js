
// Minimum global variables implemented in place of using HTML hidden elements to hold values

/**
 * A global object storing all useful game data for access by all functions
 */
const hackerGameData = {
    hackerLocation: -1,
    gameRounds: 30,
    timeInterval: 1,
    currentScore: 0,
    highScore: 0,
    gameRun: "",
    clickFlag: true,
    setUpObject: function () {
        this.hackerLocation = -1;
        this.currentScore = 0;
        hackerGameData.currentTime = (hackerGameData.gameRounds / hackerGameData.timeInterval);
        clickFlag = true;
    }
};

function setUpButtonEventListeners() {

    // Button event listener set up area

    // All screens

    const logoText = document.querySelector("header a");
    logoText.addEventListener("click", function () {
        exitLoop();
        resetGame();
        displayWindow("menu-screen");
        disableStartButton(false);
    });

    // Main menu buttons

    const menuStartGameButton = document.getElementById("menu-start-button");
    menuStartGameButton.addEventListener("click", function () {
        displayWindow("game-screen");
    });

    const instructionsButton = document.getElementById("how-to-play-button");
    instructionsButton.addEventListener("click", function () {
        displayWindow("instructions-screen");
    });

    // Game screen buttons

    const gameStartButton = document.getElementById("start-game-button");
    gameStartButton.addEventListener("click", function () {
        gameStartButton.innerText = "Started";
        gameStart();
    });

    const gameEndButton = document.getElementById("end-game-button");
    gameEndButton.addEventListener("click", function () {
        exitLoop();
        hackerGameData.clickFlag = true;
        updateFinalScore();
        displayWindow("score-screen");
        gameStartButton.innerText = "Start Game";
        disableStartButton(false);
    });

    // Instructions screen buttons

    const mainMenuButton = document.getElementById("main-menu-button");
    mainMenuButton.addEventListener("click", function () {
        displayWindow("menu-screen");
    });

    // Final score screen buttons

    const playAgainButton = document.getElementById("play-again-button");
    playAgainButton.addEventListener("click", function () {
        resetGame();
        displayWindow("game-screen");
        gameStartButton.innerText = "Started";
        gameStart();
    });

    const exitMenuButton = document.getElementById("exit-main");
    exitMenuButton.addEventListener("click", function () {
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
 * Checks the location of the user action against the actual location of the hacker and adjusts the score apropriately
 **/
function checkAnswer(eventAction) {
    let targetBox = (eventAction.target.id).substring(5);
    if (hackerGameData.clickFlag != true) {
        if (targetBox == hackerGameData.hackerLocation) {
            updateGameScore(hackerGameData.currentScore + 5);
            hackerGameData.clickFlag = true;
            document.getElementById(eventAction.target.id).src = "assets/images/hacker_skullgreen.png";
            document.getElementById(eventAction.target.id).alt = "Gameplay clicked hacker tile image";
            setTimeout(() => {
                document.getElementById(eventAction.target.id).src = "assets/images/desktop.png";
                document.getElementById(eventAction.target.id).alt = "Gameplay desktop tile image";
            }, 200);
        } else {
            updateGameScore(hackerGameData.currentScore - 10);
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
 * Places the hacker image on a given box
 **/
function placeHacker(hackerPosition) {
    document.getElementById("image" + hackerPosition).src = "assets/images/hacker_skull.png";
    document.getElementById("image" + hackerPosition).alt = "Gameplay unclicked hacker tile image";
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
            placeHacker(newHackerLocation);
            hackerGameData.hackerLocation = newHackerLocation;
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
    document.getElementById("time-display").innerText = "Time: " + newTime;
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
