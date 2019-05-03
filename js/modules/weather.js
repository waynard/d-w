import { ui } from './ui.js';
import { ls, sc } from './storage.js';

/******************* Get Location *******************/
const GetLocation = function () {
    let city;
    const cityInput = document.querySelector("#location-input");
    const addCityBtn = document.querySelector("#add-location-btn");

    cityInput.addEventListener("input", function () {
        let inputText = this.value.trim();

        if (inputText !== "") {
            addCityBtn.removeAttribute("disabled");
            addCityBtn.classList.remove("disabled");
            addCityBtn.innerHTML = '<img class="icon-36" src="resources/icons/add-blue.png" alt="Add icon"></img>';
        } else {
            addCityBtn.setAttribute("disabled", true);
            addCityBtn.classList.add("disabled");
            addCityBtn.innerHTML = '<img class="icon-36" src="resources/icons/add-gray.png" alt="Add icon"></img>';
        }
    });

    const _addCity = () => {
        city = cityInput.value;
        cityInput.value = "";
        addCityBtn.setAttribute("disabled", true);
        addCityBtn.classList.add("disabled");
        addCityBtn.innerHTML = '<img class="icon-36" src="resources/icons/add-gray.png" alt="Add icon"></img>';

        // Get weather data
        weather.getWeather(city, true); // city = location, stored = true
    }

    addCityBtn.addEventListener("click", _addCity);
}

/******************* Weather *******************/
const Weather = function () {
    const darkSkyKEY = "845f6922f233e4f6181f3623308d0ef9";
    const openCageKEY = "d3ed8726630e4f90a71508b73b47195c";
    // https://cors-anywhere.herokuapp.com - acts as a proxy to avoid CORS error, and allows making requests even from localhost
    // const proxy = "http://crossorigin.me/";
    const proxy = "https://cors-anywhere.herokuapp.com/";
    let config = {
        headers: {
            "Origin": "X-Requested-With"
        }
    }

    const _getOpenCageURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${openCageKEY}`;
    const _getDarkSkyURL = (lat, lng) => `${proxy}https://api.darksky.net/forecast/${darkSkyKEY}/${lat},${lng}`;

    const _getDarkSkyData = (url, city) => {
        axios.get(url)
            .then(res => {
                // console.log(res.headers);
                ui.displayWeatherData(res.data, city);
            })
            .catch(err => console.error(err));
    }

    const getWeather = (location, stored) => {
        ui.loadApp();
        let openCageURL = _getOpenCageURL(location);

        axios.get(openCageURL)
            .then(res => {
                console.log("OpenCage", res);
                if (res.data.results.length === 0) {
                    console.error("Nonexistent location.");
                    alert("Nonexistent location.");
                    ui.showApp();
                    return;
                }

                // display location (if it doesn't already exist in Storage)
                if (stored) {
                    let storedLocations = ls.store(location.toLowerCase());
                    if (storedLocations) sc.displayCity(location);
                }
                

                let lat = res.data.results[0].geometry.lat;
                let lng = res.data.results[0].geometry.lng;

                let darkSkyURL = _getDarkSkyURL(lat, lng);
                _getDarkSkyData(darkSkyURL, location);
            })
            .catch(err => console.error(err));
    }

    return {
        getWeather
    }
}

export const gl = new GetLocation();
export const weather = new Weather();