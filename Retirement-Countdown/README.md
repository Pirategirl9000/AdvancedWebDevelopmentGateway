# Retirement Countdown

## Output
![Gif of Output](assets/RetirementProjectorOutput.gif)

## Table of Contents
* [Authors](#authors)
* [Purpose](#purpose)
* [Script Breakdown](#script-breakdown)
* [New Concepts Used](#new-concepts)
* [Output](#output)
* [Credits](#credits)

## Authors
* [Violet French](https://github.com/Pirategirl9000)
* [Kyler Hanson](https://github.com/kyhans07)

## Purpose
The purpose of this program is to take in information about the user's financials (savings balance, monthly savings additions, interest rate) and information about the person (name, email) and the date they want to retire. It then uses this data to determine what the projected income of the user will be based on their financials on their projected retirement date

## Script Breakdown
### Important Globals
* `projectionTimer` - The id of the interval object used to calcualte the yearly projections
* `formatter` - An IntL number formatter set up to convert a number to US formatted currency

### Functions and Listeners
* `processEntries`
  * Processes the entries from the form doing data validation and conversions
  * If it's valid data it passes this to `startProjection`
* `startProjection`
  * Starts an interval object to perform monthly evaluations of what your savings account will have after calculating the interest, monthly add-in, and current savings
  * It will then display that information to the user at the end of a year
  * Calculates a new year in one second increments
* `setTestData`
  * Loads a bunch of test data for easier testing
* `resetForm`
  * resets the form data and the outputs returning the program to its initial state
* `document.onDOMContentLoaded`
  * Adds event listeners to the form and buttons which calls the relevant functions
* `setLocalStorage`
  * Takes in all the input data from the form and saves it to local storage
  * Only gets valid inputs
* `getLocalStorage`
  * Pulls any information about previous inputs and puts them in the inputs when the page is loaded
  * Pulls the info from local storage

## New Concepts
* Date Manipulation
* Intervals
* Regex & Data Validation
* Error Creation and Handling
* Regional Money Formatting
* Local Storage manipulation

## Credits
###### This is an adaptation of a script provided by [Debbie Johnson](https://github.com/dejohns2)
