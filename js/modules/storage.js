import { weather } from './weather.js';

/******************* LocalStorage *******************/
const LocalStorage = function () {
    let storedCities = [];
    let defaultCity = "beograd";

    const store = (city) => {
        if (localStorage.getItem("storedCities").includes(city)) {
            alert("This location is already stored.");
            return false;
        } else {
            storedCities.push(city);
            localStorage.setItem("storedCities", JSON.stringify(storedCities));
            return true
        }
    }

    const get = () => {
        if (localStorage.getItem("storedCities") !== null) {
            storedCities = JSON.parse(localStorage.getItem("storedCities"));
        } else {
            storedCities.push(defaultCity);
            localStorage.setItem("storedCities", JSON.stringify(storedCities));
        }
    }

    const remove = (index) => {
        if (index < storedCities.length) {
            storedCities.splice(index, 1);
            localStorage.setItem("storedCities", JSON.stringify(storedCities));
            // location.reload();
        }
    }

    const getStoredCities = () => storedCities;

    return {
        store,
        get,
        remove,
        getStoredCities
    }
}

/******************* Stored Cities *******************/
const StoredCities = function () {
    const storedCitiesWrapper = document.querySelector("#stored-cities-wrapper");

    // let storedCityNames = [];
    // Array.from(document.querySelectorAll("h1.set-city")).forEach(el => storedCityNames.push(el.textContent));
    // if (storedCityNames.indexOf(city) === -1) {
    // }

    const displayCity = (city) => {
        let cityBox = document.createElement("div");
        let cityWrapper = document.createElement("div");
        let deleteWrapper = document.createElement("div");
        let cityTextNode = document.createElement("h1");
        let deleteBtn = document.createElement("button");

        cityBox.classList.add("display-flex", "stored-city-box");
        cityTextNode.textContent = city.toLowerCase();
        cityTextNode.classList.add("set-city");
        cityWrapper.classList.add("set-city");
        cityWrapper.append(cityTextNode);
        cityBox.append(cityWrapper);

        deleteBtn.classList.add("remove-stored-city");
        deleteBtn.setAttribute("title", "Delete");
        deleteBtn.innerHTML = "&#10060";
        deleteWrapper.append(deleteBtn);
        cityBox.append(deleteWrapper);

        storedCitiesWrapper.append(cityBox);
    }

    const _deleteCity = (cityRemoveBtn) => {
        let nodes = Array.from(storedCitiesWrapper.children);
        let cityWrapper = cityRemoveBtn.closest(".stored-city-box");
        let cityIndex = nodes.indexOf(cityWrapper);
        ls.remove(cityIndex);
        cityWrapper.remove();
    }

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-stored-city")) {
            _deleteCity(e.target);
        }
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("set-city")) {
            let nodes = Array.from(storedCitiesWrapper.children);
            let cityWrapper = e.target.closest(".stored-city-box");
            let cityIndex = nodes.indexOf(cityWrapper);

            let storedCities = ls.getStoredCities();
            weather.getWeather(storedCities[cityIndex], false);
        }
    });

    return {
        displayCity
    }
}

export const ls = new LocalStorage();
export const sc = new StoredCities();