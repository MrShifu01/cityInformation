
// Getting City Information

const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=Q258&minPopulation=3000000&limit=10';
const options = {
    method: 'GET',
    headers: {
    'content-type': 'application/octet-stream',
    'X-RapidAPI-Key': '4759b95509msh43762097ba3acc0p16668cjsn947628a07f0b',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

const cityInfo = async () => {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const data = result.data
        // let pickCity = prompt(`Pick one of these South African cities:\na - Cape Town\nb - Johannesburg\nc - Durban\cd - Pretoria`)
        for (let i = 0; i < data.length; i++) {
            

            // Renaming some of the cities
            if (data[i].city.includes("Cape Town")) {
                data[i].city = "Cape Town"
            } else if (data[i].city.includes("eThekwini")) {
                data[i].city = "Durban"
            } else if (data[i].city.includes("Tshwane")) {
                data[i].city = "Pretoria"
            }
            
            // Adding the cities and there relevant information to an array
            if (data[i].city === "Cape Town" || data[i].city === "Johannesburg"|| data[i].city === "Durban" || data[i].city === "Pretoria") {
                const citiesSA = {name: data[i].city, population: data[i].population, latitude: data[i].latitude, longitude: data[i].longitude}
                console.log(citiesSA)
            }
        }
        
    } catch (error) {
        console.error(error);
    }
}

cityInfo()




