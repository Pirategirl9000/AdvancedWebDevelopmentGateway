const express = require('express');
const path = require('path');
const cacheMod = require('./LFUCache');

/**
 * The express app object which serves as the primary router for our application
 * @type {Express}
 */
const app = express();

/**
 * Returns the country data from the API
 * @param countryRequested The country requested
 * @returns {Promise<{country: String, region: String, flag: String, flagAlt: String, languages: String[], capital: String}>}
 */
async function getCountryData(countryRequested) {
    // Request the country info and parse it to JSON
    const fetchResponse = await fetch(`https://restcountries.com/v3.1/name/${countryRequested}`);
    const fetchData = await fetchResponse.json();

    // Since we only requested one item we grab the first (and only) item in the array the api responded with
    const data = fetchData[0];

    // Grab anything we want to send back to the client
    return {
        country: countryRequested,
        region: data.region,
        flag: data.flags.png,
        flagAlt: data.flags.alt,
        languages: data.languages,
        capital: data.capital
    }
}

/**
 * The options for the cache object
 * @type {{capacity: Number, TTLM: Number, decayInterval: {amount: Number, ms: Number}, onInvalid: function }}
 */
const cacheOptions = {
    'capacity': 30,
    'TTLM': 1000 * 60 * 60 * 24 * 90,  // 3 Months
    'decayInterval': {
        'amount': 1,
        'ms': 1000 * 60 * 60  // 1 Hour
    },
    'onInvalid': getCountryData
}

/**
 * The cache object for storing the country data
 */
const cache = new cacheMod(cacheOptions);

// Serve up the static pages with each request
app.use(express.static(path.join(__dirname, 'public')));


// Listen on /api/country/ for requests for country information
app.get('/api/country/:country', async (req, res) => {
    // If they don't request for JSON then we send an error
    if (!req.accepts('json')) {
        res.status(406).end('Not an accepted type');
    }

    // We don't need to populate the cache ourselves since we passed onInvalid to the cache so it knows how to handle missing items
    // or stale items
    cache.get(req.params.country).then((response) => {
        res.send(response);
    }).catch(error => {
        res.status(500).end(error.message);
    });
})

app.listen(3000, () => {
    console.log('Listening on port 3000: http://localhost:3000');
})