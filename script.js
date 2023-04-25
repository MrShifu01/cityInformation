
// API configurations
const weatherApi = {
    key: "63b2d23bc2de38b4670f9725b0985bb5",
    base: "https://api.openweathermap.org/data/2.5/"
} 

const geoApi = {
    base: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    
    options: {
        headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': '4759b95509msh43762097ba3acc0p16668cjsn947628a07f0b',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    }
}

// Selecting the DOM elements
const btn = document.querySelector(".btn")
const search = document.querySelector(".search")

// Add event listener to the submit button
btn.addEventListener('click', getInput);

// Function to handle the button click event
function getInput (event) {
    event.preventDefault();
    if (event.type === "click") {
        getData(search.value)
    }
}

// Function to get the data
async function getData () {
    try {
        // Fetching the geoDB Cities API to get the city name, population and Lat/Lon for finding elevation
        const response = await fetch(`${geoApi.base}?limit=10&countryIds=Q258&minPopulation=3000000`, geoApi.options)
        result = await response.json()
        data = result.data
        let dataObj = {}



        // Changing the names of the South African Cities
        for (let i = 0; i < data.length; i++) {
            if (data[i].city.includes("Cape Town")) {
                data[i].city = "Cape Town"
            
            } else if (data[i].city.includes("Tshwane")) {
                data[i].city = "Pretoria"

            } else if (data[i].city.includes("eThekwini")) {
                data[i].city = "Durban"

            } else if (data[i].city.includes("City of Johannesburg")) {
                data[i].city = ''
            } else if (data[i].city.includes('Ekurhuleni')) {
                data[i].city = ''
            }
        }

        // searching through cities to see if a name matches and then declaring our data object to use for the front end
        const searchLowercase = search.value.toLowerCase()
        for (let i = 0; i < data.length; i++) {
            const cityLowercase = data[i].city.toLowerCase()
            
            if (cityLowercase.includes(searchLowercase)) {
                
                // Finding the elevation of a city using the open-meteo API
                const elevationResponse = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${data[i].latitude}&longitude=${data[i].longitude}`)
                const elevationData = await elevationResponse.json()

                // Fetching the weather data from openweathermap API
                const weatherResponse = await fetch(`${weatherApi.base}weather?q=${search.value}&appid=${weatherApi.key}`)
                const weatherData = await weatherResponse.json()
                
                // Creating an object to hold all the needed information
                dataObj = {
                    name: data[i].city,
                    population: data[i].population,
                    temp: Math.round(weatherData.main.temp - 273.15),
                    elevation: elevationData.elevation
                }
                break
            }
        }

        // Display the data on the front end
        displayData(dataObj)

    } catch (error) {
        console.error("Error fetching the data", error)
    }
}

// Function to display the data
function displayData (dataObj) {
    
    // Print an error if there is data missing or they user input the wrong value
    if (!dataObj || !dataObj.name || !dataObj.population || !dataObj.temp || !dataObj.elevation) {
        const error = document.querySelector(".error")
        error.textContent = "Try: Johannesburg, Durban, Cape Town or Pretoria"
        search.value = ""
    
    } else {
        
        // Populate the information container
        const name = document.querySelector(".name")
        name.textContent = `City Name: ${dataObj.name}`

        const population = document.querySelector(".population")
        population.textContent = `Population: ${dataObj.population}`

        const temp = document.querySelector(".temp")
        temp.textContent = `Current Temperature: ${dataObj.temp} °C`
        
        const elevation = document.querySelector(".elevation")
        elevation.textContent = `Elevation: ${dataObj.elevation}m`

        // Clear the search input and the error message
        search.value = "";
        const error = document.querySelector(".error")
        error.textContent = "";
    }
}
