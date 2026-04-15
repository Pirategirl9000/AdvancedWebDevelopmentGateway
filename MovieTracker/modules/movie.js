/**
 * This module contains a data carrier class for Movie objects
 * @author Violet French: https://github.com/Pirategirl9000
 */

/**
 * A data carrier object representing a movie with title, genre, and rating
 */
class Movie {
    /**
     * Creates a new Movie with the corresponding movie title, genre, and rating
     * @param title The title of the movie
     * @param genre The genre of the movie
     * @param rating The rating of the movie
     */
    constructor(title, genre, rating) {
        this.title = title;
        this.genre = genre;
        this.rating = rating;
    }

    /**
     * Returns a string representation of the movie in the format:<br>
     * {TITLE | GENRE | Rating: RATING}
     * @returns {string}
     */
    toString() {
        return `${this.title} | ${this.genre} | Rating: ${this.rating}`;
    }
}

export default Movie;