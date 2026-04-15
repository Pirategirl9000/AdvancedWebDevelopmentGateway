/**
 * This module handles the list of movies
 * @author Violet French: https://github.com/Pirategirl9000
 */

import movieStorage from 'movie_storage';

/**
 * The list of movies associated with the movieList object
 * @type {Movie[]}
 */
let movies = [];         // private variable

/**
 * A facade for working with a list of Movie objects
 * @type {{load(): this, save(): this, add(*): this, delete(*): this, clear(): this, sort(): this, [Symbol.iterator](): Generator<Movie, void, *>}}
 */
const movieList = {
    /**
     * Loads the list of movies from storage
     * @returns {movieList} The movie list object to allow method chaining
     */
    load() {
        movies = movieStorage.retrieve();
        return this;
    },

    /**
     * Saves the current movie list to storage
     * @returns {movieList} The movie list object to allow method chaining
     */
    save() {
        movieStorage.store(movies);
        return this;
    },

    /**
     * Adds a new movie to the movie list<br>
     * Note: This operation does not save the new list to local storage only to memory
     * @param movie The movie object to add
     * @returns {movieList} The movie list object to allow method chaining
     */
    add(movie) {
        movies.push(movie);
        return this;
    },

    /**
     * Pops the movie at the given index; index is relative to the sorted order of movies<br>
     * Note: This operation does not save the movie list to local storage only to memory
     * @param i The index of the movie to pop
     * @returns {movieList} The movie list object to allow method chaining
     */
    delete(i) {
        this.sort(); // sort so in same order as page
        movies.splice(i, 1);
        return this;
    },

    /**
     * Clears the movie list<br>
     * Note: This operation does not save the movie list to local storage only to memory
     * @returns {movieList} The movie list object to allow method chaining
     */
    clear() {
        movies.length = 0;
        movieStorage.remove();
        return this;
    },

    /**
     * Sorts the movie list by genre, rating, and title descending
     * @returns {movieList} The movie list object to allow method chaining
     */
    sort() {
        movies.sort((a, b) => {
            return a.genre.toLowerCase().localeCompare(b.genre.toLowerCase()) ||
                (b.rating - a.rating) ||
                a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        return this;
    },

    /**
     * Iterator object to allow iteration through this object
     * @returns {Generator<Movie, void, *>}
     */
    *[Symbol.iterator]() {
        for (let movie of movies) {
            yield movie;
        }
    }
};

export default movieList;