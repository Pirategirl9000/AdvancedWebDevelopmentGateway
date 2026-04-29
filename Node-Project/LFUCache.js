/**
 * Class for handling a cache, has built in TTL for items and an LFU based ejection system when capacity is reached
 * @author Violet French
 */
class LFUCache {
    /**
     * The total capacity for the cache, '-1' signifies no max capacity
     * @see put
     * @author Violet French
     */
    #capacity;

    /**
     * The total time to live in milliseconds any item has after it is put inside the cache, '-1' signifies no timeout
     * @type {Number}
     * @author Violet French
     */
    #TTLM;

    /**
     * The cached items, stores the data, timeSaved, and the hits for this request
     * @type {{data: Object, timeSaved: Number, hits: Number}}
     * @author Violet French
     */
    #items = {};

    /**
     * A callback function for when a cache item is invalid, returns a new value that is passed to this.put to attempt to read the item<br>
     * The callback function is passed the key as it is given to the get method
     * @type {function}
     * @author Violet French
     */
    #onInvalid;

    /**
     * The decay interval for this cache
     */
    #decayInterval;

    /**
     * Whether we are currently trying to revalidate a cache item using onInvalid
     * @type {boolean}
     * @see onInvalid
     * @see get
     * @author Violet French
     */
    #revalidating = false;

    /**
     * Codes for the checkValid method, functionally similar to an enum
     * @type {{VALID: number, NOT_FOUND: number, CACHE_INVALID: number}}
     * @see get
     * @author Violet French
     */
    #CHECK_CODES = {
        'VALID': 200,
        'NOT_FOUND': 404,
        'CACHE_INVALID': 409
    }

    /**
     * Creates a new cache with a default capacity, TTLM, and invalidation handling <br>
     * Options:
     * - capacity - The initial capacity for the cache, not specifying this or inputting -1 results in no cache limit
     * - TTLM - The time to live in milliseconds for any cached item, items are invalidated when the time since they were saved exceeds this. Not specifying this or inputting -1 results in no timeout for cached items
     * - onInvalid - A callback function for when an item is marked invalid, should return a new value that will be passed automatically to the put method
     * - deayInterval - An interval that decrements the hits for each request every so many ms to avoid once popular objects from remaining as the most requested object
     *   - decayAmount - The amount to decay the hits by each interval tick
     *   - intervalMS - The MS between each decay interval tick
     * @param options {{
     *     capacity: Number,
     *     TTLM: Number,
     *     onInvalid: Function,
     *     decayInterval: {
     *         amount: Number,
     *         ms: Number
     *     }
     * }}
     * @author Violet French
     */
    constructor(options = {}) {
        const capacity = options.capacity;
        const TTLM = options.TTLM;
        const decayInterval = options.decayInterval;
        const onInvalid = options.onInvalid;

        if (onInvalid) {
            if (typeof onInvalid !== 'function') {
                throw new TypeError('onInvalid must be a function');
            }

            this.#onInvalid = onInvalid;
        }

        if (capacity) {
            if (isNaN(capacity) || !Number.isSafeInteger(capacity)) {
                throw new TypeError('Cache capacity must be a safe integer');
            } else if (capacity < 0 && capacity !== -1) {
                throw new RangeError("Capacity must be a positive integer or -1 for no capacity");
            }

            this.#capacity = capacity;
        } else {
            this.#capacity = -1;  // default to no cache limit
        }

        if (TTLM) {
            if (isNaN(TTLM) || !Number.isSafeInteger(TTLM)) {
                throw new TypeError('TTLM must be a safe integer');
            } else if (TTLM < 0 && TTLM !== -1) {
                throw new RangeError("TTLM must be a positive integer or -1 for no cache invalidation based on timeout");
            }

            this.#TTLM = TTLM;
        } else {
            this.#TTLM = -1;  // Default to no TTL expiration
        }

        if (decayInterval && decayInterval.amount && decayInterval.ms) {
            if (Number.isNaN(decayInterval.ms) || !Number.isSafeInteger(decayInterval.ms)) {
                throw new TypeError('DecayInterval must be a safe positive integer');
            } else if (decayInterval.ms < 0) {
                throw new RangeError("DecayInterval ms must be greater than zero");
            }

            if (Number.isNaN(decayInterval.amount) || !Number.isSafeInteger(decayInterval.amount)) {
                throw new TypeError('DecayInterval must be a safe positive/non-zero integer');
            } else if (decayInterval.amount < 0) {
                throw new RangeError("decayInterval amount must be greater than zero");
            }

            this.setDecayInterval(decayInterval.amount, decayInterval.ms);
        }
    }

    /**
     * Returns the capacity of the cache<br>
     * When adding new items at max capacity items will be ejected out of the cache using LFU
     * @returns {Number}
     * @constructor
     * @author Violet French
     */
    get capacity() {
        return this.#capacity;
    }

    /**
     * Returns the time to live in milliseconds for items in the cache<br>
     * When an item is cached that time is tracked and if the time elapsed since then exceeds the TTLM it is marked invalid<br>
     * Set up a onInvalid method to handle cases of invalidation or handle the errors when they are returned
     * @returns {Number}
     * @constructor
     * @author Violet French
     */
    get TTLM() {
        return this.#TTLM;
    }

    /**
     * Sets a new onInvalid callback function<br>
     * A callback function for when a cache item is invalid, must return a new value that is passed to this.put to attempt to read the item<br>
     * The callback function is passed the key as it is given to the get method
     * @param callback The callback function
     * @see get
     * @see put
     * @author Violet French
     */
    set onInvalid(callback) {
        if (typeof callback !== 'function') {
            throw new Error('onInvalid must be a function');
        }

        this.#onInvalid = callback;
    }

    /**
     * Sets the time to live in milliseconds for any request before it is ejected from the cache
     * @param TTLM The time to live in milliseconds
     * @constructor
     * @author Violet French
     */
    set TTLM(TTLM) {
        if (isNaN(TTLM) || !Number.isSafeInteger(TTLM)) {
            throw new Error('TTLM must be an integer');
        }

        if (TTLM < 0 && TTLM !== -1) {
            throw new Error("TTLM must be a positive integer or -1 for no cache invalidation based on timeout");
        }

        this.#TTLM = TTLM;
    }

    /**
     * Puts the new item into the cache removing an old item using LFU if the capacity is met<br>
     * If an item with this key already exists it gets reassigned with a new TTL timer and 0 hits
     * @param key The key for the new item
     * @param value The value for the new item
     * @see get
     * @author Violet French
     */
    put(key, value) {
        // If we don't have an item with this key already, and capacity is exceeded then we make room via LFU before assignment
        if (!this.has(key) && Object.keys(this.#items).length >= this.#capacity && this.#capacity !== -1) {
            let leastUsed;

            // Get the least frequently used cache object
            for (const entry of Object.entries(this.#items)) {
                if (!leastUsed) {
                    leastUsed = entry;
                } else if (entry[1].hits < leastUsed[1].hits) {
                    leastUsed = entry;
                }
            }

            const leastUsedKey = leastUsed[0];

            // Remove the determined oldest item
            this.remove(leastUsedKey);
        }

        this.#items[key] = {'data': value, 'timeSaved': Date.now(), 'hits': 0};
    }

    /**
     * Tries to grab the item with a corresponding key from the cache<br>
     * If the item is invalid it will try to call the onInvalid method to remedy this<br>
     * If it can't find the key, onInvalid isn't set up and the item is expired, or the onInvalid method fails it will throw an error
     * @param key The key of the desired value
     * @returns {Promise<Object>} Object containing the data about this item
     * @see put
     * @see onInvalid
     * @author Violet French
     */
    async get(key) {
        const item = this.#items[key];
        const itemStatus = this.#checkValid(item);

        switch (itemStatus) {
            case this.#CHECK_CODES.VALID:
                this.#revalidating = false;
                item.hits += 1;
                return item.data;

            case this.#CHECK_CODES.NOT_FOUND:
                if (this.#revalidating) {
                    this.#revalidating = false;
                    throw new Error("onInvalid function failed to remedy item not found");
                }
                
                if (this.#onInvalid) {
                    await this.#revalidate(key);
                    return this.get(key);
                }
                
                throw new Error("Item was not found and no onInvalid function was found");

            case this.#CHECK_CODES.CACHE_INVALID:
                if (this.#revalidating) {
                    this.#revalidating = false;
                    throw new Error("onInvalid function failed to remedy cache expiration");
                }

                if (this.#onInvalid) {
                    await this.#revalidate(key)
                    return this.get(key);
                }
                
                throw new Error("Item was invalidated an no onInvalid function was found")
        }
    }

    /**
     * Returns whether the item with a corresponding key exists in the cache
     * @param key The key to check for
     * @returns {boolean} Whether an item with that key exists in the cache
     * @author Violet French
     */
    has(key) {
        for (const trueKey in this.#items) {
            if (trueKey === key) return true;
        }

        return false;
    }

    /**
     * Removes the item with the corresponding key
     * @param key The key of the item to be removed
     * @author Violet French
     */
    remove(key) {
        delete this.#items[key];
    }

    /**
     * Clears the cache
     * @author Violet French
     */
    clear() {
        this.#items = {};
    }

    /**
     * Sets an intervale for decaying the hits on items in the cache<br>
     * This prevents certain objects that were popular once from remaining in the cache until their TTL expires<br>
     * All objects will have their hits decremented by the passed value on the passed interval<br>
     * If there is an existing decay interval it will be cleared and a new one will be created
     * @param decayAmount The amount to decrement the hits by
     * @param intervalMS The milliseconds between each interval tick
     * @see {@link https://en.wikipedia.org/wiki/Least_frequently_used#Problems}
     * @author Violet French
     */
    setDecayInterval(decayAmount, intervalMS) {
        if (this.#decayInterval) {
            this.removeDecayInterval();
        }


        this.#decayInterval = setInterval( () => {
            for (const entry of Object.entries(decayAmount)) {
                entry.hits = (entry.hits - decayAmount >= 0) ? entry.hits - decayAmount : 0;
            }
        }, intervalMS);
    }

    /**
     * Clears the current decay interval<br>
     * If there is no current interval this method does nothing
     * @author Violet French
     */
    removeDecayInterval() {
        clearInterval(this.#decayInterval);
        this.#decayInterval = null;  // Remove old id of the interval
    }

    /**
     * Checks whether an item is valid or exists in the cache
     * @param item The item to check (value of the cached item)
     * @returns {number} CHECK_CODE that signifies the status of the cached item
     * @author Violet French
     */
    #checkValid(item) {
        if (!item) return this.#CHECK_CODES.NOT_FOUND;
        if (Date.now() - item.timeSaved > this.#TTLM && this.#TTLM !== -1) return this.#CHECK_CODES.CACHE_INVALID;

        return this.#CHECK_CODES.VALID;
    }

    /**
     * Attempts to run the onInvalid function and revalidate the cached item
     * @param key The key for the item being revalidated
     * @author Violet French
     */
    async #revalidate(key) {
        try {
            this.#revalidating = true;
            const newValue = await this.#onInvalid(key);  // User may make onInvalid async if it requires something like a fetch
            this.put(key, newValue);
        } catch (error) {
            throw new Error("An error occured trying to remedy cache invalidation via passed 'revalidate' function: " + error);
        }
    }
}

module.exports = LFUCache;