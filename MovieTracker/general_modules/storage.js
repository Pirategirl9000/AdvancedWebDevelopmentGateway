/**
 * This module provides an interface for interacting with local storage
 * @author Violet French: https://github.com/Pirategirl9000
 */

/**
 * Retrieves the value of the key from local storage and parses it to a JS Object
 * @param key The key whose value you are retrieving
 * @returns {any|null}
 */
function retrieve(key) {
    const json = localStorage.getItem(key);
    if(json) {
        return JSON.parse(json);
    } else {
        return null;
    }
}

/**
 * Stores a key and corresponding Object to local storage<br>
 * Note: The object is automatically parsed to JSON
 * @param key The key for the item
 * @param data The value for the key
 */
function store(key, data) { 
    localStorage.setItem(key, JSON.stringify(data)); 
}

/**
 * Removes the key value pair from local storage
 * @param key The key that identifies the key value pair
 */
function remove(key) { 
    localStorage.removeItem(key); 
}

export {retrieve, store, remove}