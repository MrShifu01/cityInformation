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
        const result = await response.text();
        const data = result.data
        console.log(result)
    } catch (error) {
        console.error(error);
    }
}
cityInfo()



