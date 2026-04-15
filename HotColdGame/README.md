# Hot Cold Game
## Output
![Output](assets/HotColdOutput.gif)

## Author
* [Violet French](https://github.com/Pirategirl9000)

## Purpose
This program creates a guessing number game for the user. The user will try to guess a number with the program giving them hints based on their proximity like the game Hot-Cold. It also tracks the best score for each attempt

## Table of Contents
* [Author](#author)
* [Purpose](#purpose)
* [Script Breakdown](#script-breakdown)
* [Output](#output)
* [Credits](#credits)


## Script Breakdown
### Globals
* `randomNum` - The random number picked for this game
* `tries` - The total guesses for this round
* `MAX_NUMBER` - The max number that the `randomNum` can be randomized to
* `bestScore` - The best score for all the rounds in this session
* `solved` - Tracks whether this random number has already been solved
### Functions and Listeners
* `getRandomInt(max = 100)`
  * Gets a random integer between 1 and some maximum inclusive
* `updateBestScore`
  * Updates the best score if this round was a new personal best
* `guessClick`
  *  Triggered by clicking the guess button
  *  Checks the current guess against the random number and outputs a response based on the proximity of the guess to the real answer
    * "Fire" - Correct guess
    * "Hot" - Distance within 5
    * "Warmer" - Distance within 10
    * "Warm" - Distance within 20
    * "Cold" - Distance within 30
    * "Colder" - Distance within 40
    * "Freezing" - Distance over 40
* `playAgainClick`
  * Starts a new round with a new random number
* `Document.OnDOMContentLoaded`
  * Starts a new game and adds event listeners to the two buttons
* `GuessButton.onClick`
  * Adds an event listener to the guess button which submits a guess on click
* `PlayAgainButton.onClick`
  * Adds and event listener to the play again button which starts a new round
* `Document.onKeyDown`
  * Adds a keylistener to the document that listens for `Enter` key presses and submits a guess if it detects one
## Credits
###### This script is an adaptation of a script provided by [Debbie Johnson](https://github.com/dejohns2)
