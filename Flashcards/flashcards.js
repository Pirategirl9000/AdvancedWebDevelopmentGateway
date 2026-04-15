/**
 * This program allows the creation of flashcards for studying and quizzing
 * @link https://github.com/Pirategirl9000/Flashcards
 * @author Violet French
 * @author Isaiah Guilliatt
 * @author Rafael Negrete Fonseca
 */

"use strict";

// declare two arrays for the questions and answers
/**
 * The current questions stored for flashcards, associates with an [answer]{@link answers} at the same index
 * @type {[string]}
 */
const questions = [];

/**
 * The current answers stored for flashcards, associates with a [question]{@link questions} at the same index
 * @type {[string]}
 */
const answers = [];

/*
Two global script variables used during quiz mode:
1) currentIndex for keeping track of which question is being displayed
2) displayAnswer used during the quiz phase to only show the answer after first displaying the question
 */
/**
 * The index for the current [question]{@link questions} being displayed
 * @type {number}
 */
let currentIndex = 0;

/**
 * Variable for tracking whether this quiz iteration should display the [answer]{@link answers}
 * @type {boolean}
 */
let displayAnswer = false;

/*
Create DOM references for all the DOM elements that have ids
use getElementById() which is the safest default (slightly faster)
instead of using querySelector() for advanced selection like CSS selector support
*/
/**
 * The DOM element that take in the current command
 * @type {HTMLElement}
 */
const commandEl = document.getElementById("command"); // add, list, quiz, clear

/**
 * The DOM element for displaying errors related to the command input
 * @type {HTMLElement}
 */
const commandErrorEl = document.getElementById("commandError");

/**
 * The DOM element that takes in the question
 * @type {HTMLElement}
 */
const questionEl = document.getElementById("question");

/**
 * The DOM element for displaying errors related to the question input
 * @type {HTMLElement}
 */
const questionErrorEl = document.getElementById("questionError");

/**
 * The DOM element taht takes in an answer for a question
 * @type {HTMLElement}
 */
const answerEl = document.getElementById("answer");

/**
 * The DOM element for displaying errors related to the answer input
 * @type {HTMLElement}
 */
const answerErrorEl = document.getElementById("answerError");

/**
 * The DOM element to display output to
 * @type {HTMLElement}
 */
const outputEl = document.getElementById("output"); // display output to the user


/**
 * The form element whose submission triggers the code
 * @type {HTMLElement}
 */
const form = document.getElementById("flashcardForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent default form button behavior

    // clear all errors from the previous submit
    commandErrorEl.textContent = "";
    questionErrorEl.textContent = "";
    answerErrorEl.textContent = "";
    outputEl.textContent = "";

    //noinspection JSUnresolvedVariable
    switch (commandEl.value) {
        case "add":
            //noinspection JSUnresolvedVariable
            addCard(questionEl.value.trim(), answerEl.value.trim());
            break;
        case "list":
            listCards();
            break;
        case "quiz":
            showNextCard();
            break;
        case "clear":
            clearCards();
            break;
        case "load_default":
            loadDefault();
            break;
        default:
            outputEl.textContent = "Not a valid command";
            break;
    }
});

/**
 * Verify that both the question and answer contain a values using a boolean comparison
 * and if they are empty then display the error message(s) and return
 * make sure the first character of the question and answer are capitalized using the function
 * make sure the question ends with a question mark
 * add the question and answer to the arrays
 * display the question #, question, and answer in the output area
 *
 * @param question the input question trimmed value
 * @param answer the input answer trimmed value
 */
function addCard(question, answer) {
    let dataValidationError = false;

    // Check for empty string
    if (!question){
        dataValidationError = true;
        questionErrorEl.textContent = "Must contain a question";
    }

    // Check for empty string
    if (!answer){
        dataValidationError = true;
        answerErrorEl.textContent = "Must contain an answer";
    }

    // Exit early if there was an error with data validation
    if (dataValidationError){
        outputEl.textContent = "Error validating data inputs"
        return;
    }

    // Capitilize the question and answer
    question = capitalizeFirstChar(question);
    answer = capitalizeFirstChar(answer);

    //Add the question and answer to their respective arrays
    questions.push(question);
    answers.push(answer);

    // Output the added question
    outputEl.textContent = `Added card #${questions.length}:\nQ: ${question}?\nA: ${answer}`

}

/**
 * Set the question and answer input fields to an empty string using textContent
 * If there are no questions, display an error message in the output area
 * Define a string that says "All cards:\n"
 * using a for...in display the card #, question (do not display the answer)
 * NOTE: the first card should display #1 instead #0
 */
function listCards() {
    let outputStr = "All cards:\n";
    for (let i = 0; i < questions.length; i++) {
        outputStr += `${i + 1}. ${questions[i]}\n`;
    }
    outputEl.textContent = outputStr;
}

/**
 * Set the question and answer input fields to an empty string using textContent
 * Clear the current questions and answers using the function
 * and then load a few default questions and answers
 * and display how many questions were loaded in the output area
 */
function loadDefault() {
    questions.push("What's Rafael's first last name?");
    answers.push("Negrete");

    questions.push("How many dogs does Violet have?");
    answers.push("Two");

    questions.push("How many times has Isaiah been ran over?");
    answers.push("One");

    outputEl.textContent = "Three default questions loaded."
}

/**
 * Set the question and answer input fields to an empty string using textContent
 * if there are no questions, display an error in the output area and return
 * if displayAnswer is true then
 *    display the card #, question, and answer using the currentIndex variable
 *    and tell the user to Press run to see the answer
 *    NOTE: the first card should display #1 not #0
 *    set displayAnswer to false
 *    increment currentIndex
 *    if currentIndex is equal to the array's length and reset back to 0
 * else
 *    only display the card # and current question to the output area
 *    and tell the user to Press run to see the next question
 *    NOTE: the first card should display #1 not #0
 *    set displayAnswer to true
  */
function showNextCard() {
    // If there isn't any cards to display throw an error message
    if (!questions.length){
        outputEl.textContent = "No cards found.";
        return;
    }

    if (displayAnswer) {
        outputEl.textContent =
            `Card #${currentIndex+1}\n` +
            `Q: ${questions[currentIndex]}\n` +
            `A: ${answers[currentIndex]}\n\n` +
            `Press Run To See The Next Question`;

        currentIndex++;  // Move to next card

        // If there is no more cards then reset the current index for quizzing
        if (currentIndex >= questions.length) {
            currentIndex = 0;
        }
    } else {
        outputEl.textContent =
            `Card #${currentIndex+1}\n` +
            `Q: ${questions[currentIndex]}\n\n` +
            `Press Run To See The Answer`;
    }

    // Inverts the value of display answer
    displayAnswer = !displayAnswer;
}

/**
 * Set the question and answer input fields to an empty string using textContent
 * clear the question and answer fields
 * clear all arrays by setting the length to 0
 * reset currentIndex to 0
 * display "All cards cleared." to the output area
 */
function clearCards() {
    // Clear the cards
    questions.length = 0;
    answers.length = 0;

    currentIndex = 0;  // Reset to the first card index so next quiz mode starts from the first card
    displayAnswer = false; // Reset display answer so it doesn't immediately show the answer if you go into quiz mode

    outputEl.textContent = "All cards cleared.";
}

/**
 * if !str then return the str unchanged
 * else using method chaining charAt, toUpperCase, slice
 * @param str the user's input for question or answer
 * @returns {*|string} where the first letter is uppercased
 */
function capitalizeFirstChar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
