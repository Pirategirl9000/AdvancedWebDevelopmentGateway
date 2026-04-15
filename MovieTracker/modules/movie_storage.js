/**
 * This module provides an object to make it easier to interact with local storage relevant to movies
 * @author Violet French: https://github.com/Pirategirl9000
 */

import * as storage from 'storage';
import Movie from 'movie';

/**
 * <p>Object used for interacting with an array of movies</p>
 * <ul>
 *     <li>retrieve() - Retrieves an array of Movie objects from local storage</li>
 *     <li>store() - Stores a new list of movies to local storage</li>
 *     <li>remove() - Removes all the movies from local storage</li>
 * </ul>
 * @type {{retrieve(): Movie[], store(*): void, remove(): void}}
 */
const movieStorage = {
    /**
     * Retrieves an array of Movie objects from local storage
     * @returns {Movie[]}
     */
    retrieve() {
        const movies = [];
        const movieArray = storage.retrieve("movies");
        if(movieArray) {
            for(let obj of movieArray) {
                movies.push(new Movie(obj.title, obj.genre, obj.rating));
            }
        }
        return movies;
    },

    /**
     * Stores an array of Movie objects to local storage<br>
     * Note: This is a destructive operation and will delete any currently stored movies in the local storage
     * @param movies
     */
    store(movies) {
        storage.store("movies", movies);
    },

    /**
     * Removes all the movies from local storage
     */
    remove() {
        storage.remove("movies");
    }
};

export default movieStorage;