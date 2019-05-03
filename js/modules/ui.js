/******************* UI Elements Module *******************/
const UI = function () {
    const storage = document.querySelector("#storage-section");

    // show the app and hide the loading screen
    const showApp = () => {
        document.querySelector("#app-loader").classList.add("display-none");
        document.querySelector("main").removeAttribute("hidden");
    }

    // hide the app and show the loading screen
    const loadApp = () => {
        document.querySelector("#app-loader").classList.remove("display-none");
        document.querySelector("main").setAttribute("hidden", true);
    }

    const _showStorage = () => storage.style.right = 0;
    const _hideStorage = () => storage.style.right = `-${Math.round(storage.offsetWidth / window.innerWidth * 100)}%`;
    // Storage events
    document.querySelector("#open-storage-btn").addEventListener("click", _showStorage);
    document.querySelector("#close-storage-btn").addEventListener("click", _hideStorage);

    const _toggleWeather = () => {
        const hourlyWeather = document.querySelector("#hourly-weather-div");
        const dailyWeather = document.querySelector("#daily-weather-div");
        const toggleBtn = document.querySelector("#toggle-weather-btn");
        const toggleIcon = document.querySelector("#toggle-weather-btn img");
        const active = toggleIcon.getAttribute("data-active");

        if (active === "false") {
            toggleIcon.setAttribute("data-active", "true");
            hourlyWeather.style.bottom = 0;
            toggleIcon.setAttribute("src", "resources/icons/7days.png");
            toggleIcon.setAttribute("alt", "7days icon");
            toggleBtn.setAttribute("title", "Weather for the next 7 days");
            dailyWeather.style.opacity = 0;
        } else if (active === "true") {
            toggleIcon.setAttribute("data-active", "false");
            hourlyWeather.style.bottom = "-30%";
            toggleIcon.setAttribute("src", "resources/icons/24-hours.png");
            toggleIcon.setAttribute("alt", "24h icon7days icon");
            toggleBtn.setAttribute("title", "Weather for the next 24h");
            dailyWeather.style.opacity = 1;
        } else console.error("Invalid state of the data-active attribute");
    };

    // Toggle daily/hourly weather event
    document.querySelector("#toggle-weather-btn").addEventListener("click", _toggleWeather);


    /***** Display weather data on screen *****/
    const displayWeatherData = (data, city) => {
        console.log("DarkSky", data);
        console.log(city);

        const { icon, summary, temperature, humidity, windSpeed, pressure, cloudCover } = data.currently;
        const dailyData = data.daily.data;
        const hourlyData = data.hourly.data;
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dailyWeatherDiv = document.querySelector("#daily-weather-div");
        let dailyWeatherModel, day, dayMonth, maxMinTemp, dailyIcon;

        const hourlyWeatherDiv = document.querySelector("#hourly-weather-div");
        let hourlyWeatherModel, hour, hourlyIcon;

        // set current city
        document.querySelector("#label-24h-container h1").textContent = city.toLowerCase();
        // set the background
        // document.querySelector("main").style.backgroundImage = `url("resources/img/weather-img/${icon}.jpg")`;
        // set the icon
        document.querySelector("#currently-icon").setAttribute("src", `resources/icons/weather-icons/${icon}.png`);
        // set summary label
        document.querySelector("#summary-label").textContent = summary;
        // set temperature from F to C
        document.querySelector("#temperature-label").innerHTML = Math.round((temperature - 32) * 5 / 9) + " &#176;C";
        // set humidity
        document.querySelector("#humidity-label").textContent = Math.round(humidity * 100) + "%";
        // set wind speed
        document.querySelector("#wind-speed-label").textContent = Math.round(windSpeed * 1.609) + " km/h";
        // set pressure
        document.querySelector("#pressure-label").textContent = Math.round(pressure) + " hPa";
        // set cloud cover
        document.querySelector("#cloud-cover-label").textContent = Math.round(cloudCover * 100) + "%";

        /*** set daily weather ***/
        // removes 8 days divs of previously displayed city
        while (dailyWeatherDiv.children[1]) {
            dailyWeatherDiv.removeChild(dailyWeatherDiv.children[1]);
        }

        for (let i = 0; i <= 7; i++) {
            // clone the node and remove class="display-none"
            dailyWeatherModel = dailyWeatherDiv.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove("display-none");
            day = daysOfWeek[new Date(dailyData[i].time * 1000).getDay()];
            dayMonth = new Date(dailyData[i].time * 1000).getDate() + "/" + (new Date(dailyData[i].time * 1000).getMonth() + 1);
            // set the name of the day h1
            dailyWeatherModel.children[0].children[0].textContent = day;
            // set the day/month span
            dailyWeatherModel.children[0].children[1].textContent = dayMonth;
            // set dailyIcon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[0].setAttribute("src", `resources/icons/weather-icons/${dailyIcon}.png`);
            // set the min/max temperature
            maxMinTemp = `<span  id="max-temp">${Math.round((dailyData[i].temperatureMax - 32) * 5 / 9)}&#176;</span> | <span  id="min-temp">${Math.round((dailyData[i].temperatureMin - 32) * 5 / 9)}&#176;</span>`;
            dailyWeatherModel.children[2].innerHTML = maxMinTemp;
            // append the dailyWeatherModel
            dailyWeatherDiv.appendChild(dailyWeatherModel);
        }

        /*** set hourly weather ***/
        // removes 24 h divs of previously displayed city
        while (hourlyWeatherDiv.children[1]) {
            hourlyWeatherDiv.removeChild(hourlyWeatherDiv.children[1]);
        }

        for (let i = 0; i <= 24; i++) {
            // clone the node and remove class="display-none"
            hourlyWeatherModel = hourlyWeatherDiv.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove("display-none");
            // set hour
            hour = new Date(hourlyData[i].time * 1000).getHours();
            hourlyWeatherModel.children[0].children[0].textContent = (hour < 10 ? "0" : "") + hour + ":00";
            // set hourlyIcon
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[0].setAttribute("src", `resources/icons/weather-icons/${hourlyIcon}.png`);
            // set temperature by hour
            hourlyWeatherModel.children[2].children[0].innerHTML = Math.round((hourlyData[i].temperature - 32) * 5 / 9) + "&#176;";
            // append the hourlyWeatherModel
            hourlyWeatherDiv.appendChild(hourlyWeatherModel);
        }

        ui.showApp();
    }

    return {
        showApp,
        loadApp,
        displayWeatherData
    }
}

export const ui = new UI();