import { ui } from './modules/ui.js';
import { ls, sc } from './modules/storage.js';
import { gl, weather } from './modules/weather.js';

window.onload = function () {
    ls.get();
    let cities = ls.getStoredCities();
    if (cities.length !== 0) {
        cities.forEach(city => sc.displayCity(city));
        weather.getWeather(cities[cities.length - 1], false);
    } else {
        ui.showApp();
    }
}
