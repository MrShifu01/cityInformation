let city = "johannesburg";

async function cityInfo(city) {
    try {
        const fetch = (await import('node-fetch')).default;

        // Geo - City Population
        const popUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=Q258&minPopulation=3000000'
        const popOptions = {
            method: 'GET',
            headers: {
                'content-type': 'application/octet-stream',
                'X-RapidAPI-Key': '4759b95509msh43762097ba3acc0p16668cjsn947628a07f0b',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        };
        const popResponse = await fetch(popUrl, popOptions)

        if (!popResponse.ok) throw new Error("Error fetching City data")

        result = await popResponse.json()
        let popData = result.data

        // Converting the names of South Africas 4 biggest cities
        for (let i = 0; i < popData.length; i++) {
            if (popData[i].city.includes("Cape Town")) {
                popData[i].city = "Cape Town"
            }
        }

        city = popData[0].city
        
        // Geo - Longitude and Latitude
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=63b2d23bc2de38b4670f9725b0985bb5`;
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) throw new Error('Error fetching geolocation data.');

        const geoData = await geoResponse.json();

        // Geo - Elevation
        const eleUrl = `https://api.open-meteo.com/v1/elevation?latitude=${geoData[0].lat}&longitude=${geoData[0].lon}`;
        const eleResponse = await fetch(eleUrl);

        if (!eleResponse.ok) throw new Error("Error fetching elevation data.");

        const eleData = await eleResponse.json();

        // Weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geoData[0].lat}&lon=${geoData[0].lon}&appid=63b2d23bc2de38b4670f9725b0985bb5&units=metric`
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) throw new Error('Error fetching weather location data.');

        const weatherData = await weatherResponse.json();

        return {
            name: geoData[0].name,
            lat: geoData[0].lat,
            lon: geoData[0].lon,
            temp: weatherData.main.temp,
            pop: popData[0].population,
            ele: eleData.elevation,
        };

        } catch (error) {
            console.log(`Error: ${error.message}`);
            return null;
        }
}

(async () => {
    const cityData = await cityInfo(city);
    if (cityData) {
        console.log(`City name: ${cityData.name}`);
        console.log(`Latitude: ${cityData.lat}`);
        console.log(`Longitude: ${cityData.lon}`);
        console.log(`Temperature: ${cityData.temp} C`);
        console.log(`Population: ${cityData.pop}`)
        console.log(`Elevation: ${cityData.ele}`)
    } else {
        console.log('Failed to fetch city information.');
    }
})();
