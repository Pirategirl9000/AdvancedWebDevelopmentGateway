/**
 * This file is the main entry point for the program and manages all the logic
 * @author Violet French: https://github.com/Pirategirl9000
 */

import movieList from "movie_list";
import Movie from "movie";
import * as dom from "DOM";

/**
 * Grabs the movies from the movieList and adds them to the document
 */
const displayMovies = () => {
    movieList.sort();

    const select = dom.get("#movies");
    select.textContent = "";  // clear previous movies

    for (let movie of movieList) {
        const opt = document.createElement("option");
        opt.appendChild(document.createTextNode(movie));
        select.appendChild(opt);
    }
    dom.focus("#movie");
}

/**
 * Add an event listener to DOMContentLoaded which will add listeners for the add, clear, and delete movie buttons<br>
 * After adding the listeners it loads in the movies from local storage and displays them to the document
 */
dom.load(() => {
    dom.addClick("#add_movie", () => {
        dom.clear("#msg");             // clear any previous message

        const newMovie = new Movie(
            dom.getValue("#movie"),
            dom.getValue("#genre"),
            dom.getValue("#rating"));

        let message = "";

        // Validate the inputs
        if (newMovie.title === "") {
            message = "Movie is required. ";
        } else if (newMovie.genre === "") {
            message = "Genre is required. ";
        } else if (newMovie.rating === "" || isNaN(newMovie.rating) || !Number.isInteger(Number(newMovie.rating))) {
            message = "Integer number rating is required. ";
        }

        if (message === "") {
            movieList.load().add(newMovie).save();
            dom.clear("#movie");
            displayMovies();
        } else {
            dom.setText("#msg", message);
            dom.select("#movie");
        }
    });

    dom.addClick("#clear_movies", () => {
        movieList.clear();
        dom.clear("#movies");
        dom.clear("#movie");
        dom.clear("#due_date");
        dom.clear("#msg");
        dom.focus("#movie");
    });

    dom.addClick("#delete_movie", () => {
        dom.clear("#msg");             // clear any previous message

        const index = dom.get("#movies").selectedIndex;
        if (index === -1) {
            dom.setText("#msg", "Please select a movie to delete.");
        } else {
            movieList.load().delete(index).save();
            displayMovies();
        }
    });
    movieList.load()
    displayMovies();
});