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
      localTime: '',
    },
    now: {
      temp: {
        c: 0,
        f: 0,
        feelsLike: { c: 0, f: 0 },
      },
      condition: { text: '', iconUrl: '' },
      windSpeed_kmh: 0,
    },
  };

  _generateMarkup() {
    const displayDate = formatDate(new Date(this._data.location.localTime));
    // const displayTempC = Math.round()

    return `
      <div class="weather-summary">
        <h3 class="weather-summary__day-name">Now</h3>
        <img class="weather-summary__icon" src="${this._data.now.condition.iconUrl}">
        <p class="weather-summary__temp">
          <span class="weather-summary__temp_now">${this._data.now.temp.c}</span>
        </p>
      </div>

      <div class="weather-now__extra-info">
        <p class="weather-now__local-time">${displayDate}</p>
        <p class="weather-now__condition">${this._data.now.condition.text}</p>
        <p class="weather-now__wind-speed">${this._data.now.windSpeed_kmh}</p>
        <p class="weather-now__feels-like-temp">${this._data.now.temp.feelsLike.c}</p>
      </div>
    `;
  }
}

export default new WeatherNow();
