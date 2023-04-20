import View from './View';
import { formatCurrentDate } from '../helper';

class WeatherNow extends View {
  _parentElement = document.getElementById('weather-now');
  _data = {
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localTime: '',
    },
    now: {
      tempC: 0,
      feelsLikeTempC: 0,
      tempF: 0,
      feelsLikeTempF: 0,
      condition: { text: '', iconUrl: '' },
      windSpeed_kmh: 0,
    },
  };

  _generateMarkup() {
    return `
      <li class="weather-summary">
        <h3 class="weather-summary__day-name">Now</h3>
        <img class="weather-summary__icon" src="${this._data.now.condition.iconUrl}">
        <p class="weather-summary__temp">
          <span class="weather-summary__temp_now">${this._data.now.tempC}</span>
        </p>
      </li>
    `;
  }
}

export default new WeatherNow();
