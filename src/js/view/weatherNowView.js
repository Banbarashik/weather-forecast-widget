import View from './View';
import { formatDate } from '../helper';

class WeatherNow extends View {
  _parentElement = document.getElementById('weather-now');
  _data = {
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localtime: '',
    },
    now: {
      temp: {
        c: 0,
        f: 0,
        feelsLike: { c: 0, f: 0 },
      },
      condition: { text: '', iconUrl: '' },
      wind: { kmh: 0, mph: 0 },
    },
  };

  _generateMarkup() {
    const {
      location: { name, country, localtime },
      now: { temp, condition, wind },
    } = this._data;

    const displayData = {
      location: `${name}, ${country}`,
      localtime: formatDate(new Date(localtime)),
      temp: {
        c: Math.round(temp.c) + '&deg;C',
        f: Math.round(temp.f) + '&deg;F',
        feelsLike: {
          c: Math.round(temp.feelsLike.c) + '&deg;C',
          f: Math.round(temp.feelsLike.f) + '&deg;F',
        },
      },
      wind: {
        kmh: Math.round(wind.kmh) + ' km/h',
        mph: Math.round(wind.mph) + ' mph',
      },
      condition,
    };

    return `
      <div class="weather-summary">
        <h3 class="weather-summary__day-name">Now</h3>
        <img class="weather-summary__icon" src="${displayData.condition.iconUrl}">
        <p class="weather-summary__temp">
          <span class="weather-summary__temp_now">${displayData.temp.c}</span>
        </p>
      </div>

      <div class="weather-now__extra-info">
        <p class="weather-now__location">${displayData.location}</p>
        <p class="weather-now__localtime">${displayData.localtime}</p>
        <p class="weather-now__condition">${displayData.condition.text}</p>
        <p class="weather-now__wind-speed">Wind: ${displayData.wind.kmh}</p>
        <p class="weather-now__feels-like-temp">Feels like: ${displayData.temp.feelsLike.c}</p>
      </div>
    `;
  }
}

export default new WeatherNow();
