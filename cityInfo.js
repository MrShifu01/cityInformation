
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
const document = dom.window.document;

async function cityInfo(cityIndex) {
    try {
        const fetch = (await import('node-fetch')).default;

        // City Population + Latitude and Longitude
        const geoUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=Q258&minPopulation=3000000'
        const geoOptions = {
            method: 'GET',
            headers: {
                'content-type': 'application/octet-stream',
                'X-RapidAPI-Key': '4759b95509msh43762097ba3acc0p16668cjsn947628a07f0b',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        };
        const geoResponse = await fetch(geoUrl, geoOptions)

        if (!geoResponse.ok) throw new Error("Error fetching City data")

        result = await geoResponse.json()
        let geoData = result.data

        // Converting the names of South Africas 4 biggest cities
        for (let i = 0; i < geoData.length; i++) {
            if (geoData[i].city.includes("Cape Town")) {
                geoData[i].city = "Cape Town"
            } else if (geoData[i].city.includes("Tshwane")) {
                geoData[i].city = "Pretoria"
            } else if (geoData[i].city.includes("eThekweni")) {
                geoData[i].city = "Durban"
            }
        } 

        // Elevation
        const eleUrl = `https://api.open-meteo.com/v1/elevation?latitude=${geoData[cityIndex].latitude}&longitude=${geoData[cityIndex].longitude}`;
        const eleResponse = await fetch(eleUrl);

        if (!eleResponse.ok) throw new Error("Error fetching elevation data.");

        const eleData = await eleResponse.json();

        // Weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geoData[cityIndex].latitude}&lon=${geoData[cityIndex].longitude}&appid=63b2d23bc2de38b4670f9725b0985bb5&units=metric`
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) throw new Error('Error fetching weather location data.');

        const weatherData = await weatherResponse.json();

        return {
            name: geoData[cityIndex].city,
            lat: geoData[cityIndex].latitude,
            lon: geoData[cityIndex].longitude,
            temp: weatherData.main.temp,
            pop: geoData[cityIndex].population,
            ele: eleData.elevation,
        };

        } catch (error) {
            console.log(`Error: ${error.message}`);
            return null;
        }
}

(async () => {
    const cityData = await cityInfo(0);
    if (cityData) {
        console.log(`City Name: ${cityData.name}`);
        console.log(`Latitude: ${cityData.lat}`);
        console.log(`Longitude: ${cityData.lon}`);
        console.log(`Temperature: ${cityData.temp}C`);
        console.log(`Population: ${cityData.pop} people`)
        console.log(`Elevation: ${cityData.ele}m`)
    } else {
        console.log('Failed to fetch city information.');
    }
})();
