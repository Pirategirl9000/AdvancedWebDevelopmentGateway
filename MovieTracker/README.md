# Movie Tracker

## Output
![Video of Output](assets/MovieListOutput.gif)

## Author
* [Violet French](https://github.com/Pirategirl9000)

## Table of Contents
* [Output](#output)
* [Author](#author)
* [New Concepts](#new-concepts)
* [Script Breakdown](#script-breakdown)
* [Credits](#credits)

## New Concepts
* Classes
* Objects
* Modules
* Symbol.iterator
* Advanced Array Manipulation

## Script Breakdown
* `DOM.js`
  * This module provides an interface for interacting with the DOM API
* `storage.js`
  * This module provides an interface for interacting with the local storage
* `movie.js`
  * This module stores a data carrier class for representing movies with a title, genre, and rating
* `movie_storage.js`
  * This module provides an interface for interacting with local storage in regard to movie objects
  * Uses `storage.js` to interact with the local storage
* `movie_list.js`
  * This module provides an interface for interacting with the list of movies acting similar to a wrapper class
* `movie_tracker.js`
  * This is the main entry point for the program and sets up event listeners and delegates work for the different buttons and for pulling movies in from local storage

## Credits
###### This script is an adaptation of a script provided by [Murach's Modern Javascript](https://www.murach.com/shop/murach-s-modern-javascript-detail) and modified by [Debbie Johnson](https://github.com/dejohns2)
