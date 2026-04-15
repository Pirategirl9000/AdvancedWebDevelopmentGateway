/**
 * This program randomizes a number and has the user try to guess it giving them hints as to how hot or cold their guess was
 * @author Violet French - https://github.com/Pirategirl9000
 * @link https://github.com/Pirategirl9000/HotColdGame
 */

"use strict";

/**
 * The random number the player is trying to guess
 * @type {number}
 * See {@link MAX_NUMBER}
 */
let randomNum = 0;

/**
 * The amount of guesses this attempt
 * @type {number}
 */
let tries = 0;

/**
 * The maximum number that the guess can be randomized to
 * @type {number}
 * See {@link randomNum}
 */
const MAX_NUMBER = 100;

/**
 * The player's all-time best attempt during this browser session
 * @type {number}
 * See {@link tries}
 */
let bestScore;

/**
 * Boolean that tracks whether the current random number has been successfully guessed
 * @type {boolean}
 */
let solved = false;

/**
 * Returns a random integer between 1 and the argument
 * @param max the maximum number to generate
 * @returns {number}
 */
const getRandomInt = (max = 100) => {
    let num = Math.random() * max;  // get a random number between 0 and max
    num = Math.ceil(num);           // round up to nearest integer
    console.log("Random number: " + num);
    return num;
};

/**
 * Updates the best score if necessary
 */
const updateBestScore = () => {
    // If it's a new high score we update the bestScore
    bestScore = (!bestScore || bestScore > tries) ? tries : bestScore;

    document.querySelector("#best_score").textContent = bestScore.toString();
}

/**
 * Triggers when the user enters a guess <br>
 * Checks to see how close it was and produces output indicating their distance from the true number
 */
const guessClick = () => {
    const guess = parseInt(document.querySelector("#number").value);

    let message = "";
    let valid = true;

    // The color of the output message
    let color;

    if (isNaN(guess)) {
        message = "Not a valid number. Please enter a valid number.";
        color = "#FF0000";
        valid = false;
    } else if (guess < 1 || guess > MAX_NUMBER) {
        message = `Invalid number. Enter a number between 1 and ${MAX_NUMBER}`;
        color = "#FF0000";
        valid = false;
    } else if (solved) {
        message = "Nice try, you already guessed this question, hit play again to start a new round";
        color = "#FF0000";
        valid = false;
    } else {
        tries++;
    }

    // Distance is absolute since we don't need to track whether it's too small or big anymore
    const distance = Math.abs(guess - randomNum);

    // Check how close their guess was and produce a message and message color based on their distance from the true answer
    switch (true) {
        case !valid:  // Invalid message so we return the message gotten in the previous if...else chain
            break;
        case distance === 0:
            // If they only needed one try we have the output reflect that
            const lastWord = (tries === 1) ? "try" : "tries";
            solved = true;

            message = `Fire! You guessed it in ${tries} ${lastWord}!`;
            color = "#00FF00";

            updateBestScore();
            break;
        case distance <= 5:
            message = "Hot! (Within 5)";
            color = "#FF0000";
            break;
        case distance <= 10:
            message = "Warmer! (Within 10)";
            color = "#FF4500";
            break;
        case distance <= 20:
            message = "Warm! (Within 20)";
            color = "#FFA500";
            break;
        case distance <= 30:
            message = "Cold! (Within 30)";
            color = "#B0E0E6";
            break;
        case distance <= 40:
            message = "Colder! (Within 40)";
            color = "#4169E1";
            break;
        case distance > 40:
            message = "Freezing! (Over 40)"
            color = "#0000CD";
            break;
    }

    const outputEl = document.querySelector("#message");

    // Output the guesses proximity to the random number
    outputEl.style.color = color;
    outputEl.textContent = message;

    // Clear the field
    document.querySelector("#number").value = "";

    // Focus in on it so they can guess again without needing to re-click into the input box
    document.querySelector("#number").focus();

    // Tell the user how close their guess was
    document.querySelector("#message").textContent = message;

    if (valid)
        document.querySelector("#history").textContent += `Guess ${tries}: ${guess} - ${message}\n`;
};

/**
 * Generates a new random number for the player to try to guess
 */
const playAgainClick = () => {
    randomNum = getRandomInt(MAX_NUMBER);
    tries = 0;
    solved = false;
    document.querySelector("#number").value = "";
    document.querySelector("#message").textContent = "";
    document.querySelector("#history").textContent = "";
};

/**
 * Starts a new game and initializes listeners for buttons when the document loads
 */
document.addEventListener("DOMContentLoaded", () => {
    playAgainClick(); // initial a new game

    document.querySelector("#guess").addEventListener("click", guessClick);

    document.querySelector("#play_again").addEventListener("click", playAgainClick);
});

/**
 * Adds an event listener to the document that listens for keypresses and if they are "enter" it submits the current guess
 */
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        guessClick();
    }
});
