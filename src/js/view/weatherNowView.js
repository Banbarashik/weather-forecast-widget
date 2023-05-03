import View from './View';

class WeatherNow extends View {
  _parentElement = document.getElementById('weather-now');
  _data = {
    displayUnit: '',
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localtime: '',
      displayLocaltime: '',
    },
    now: {
      temp: {
        c: 0,
        displayC: '0&deg;C',
        f: 0,
        displayF: '0&deg;F',
        feelsLike: { c: 0, displayC: '0&deg;C', f: 0, displayF: '0&deg;F' },
      },
      condition: { text: '', iconUrl: '' },
      wind: { kmh: 0, display_kmh: '0 km/h', mph: 0, display_mph: '0 mph' },
    },
  };

  _generateMarkup() {
    const location = `${this._data.location.name}, ${this._data.location.country}`;
    const time = this._data.location.displayLocaltime;
    const temp = this._data.now.temp['display' + this._data.displayUnit];
    const feelsLike =
      this._data.now.temp.feelsLike['display' + this._data.displayUnit];
    const wind =
      this._data.now.wind[
        'display_' + (this._data.displayUnit === 'C' ? 'kmh' : 'mph')
      ];
    const condition = this._data.now.condition.text;
    const icon = this._data.now.condition.iconUrl;

    return `
      <div class="weather-summary">
        <h3 class="weather-summary__day-name">Now</h3>
        <img class="weather-summary__icon" src="${icon}">
        <p class="weather-summary__temp">
          <span class="weather-summary__temp_now">${temp}</span>
        </p>
      </div>

      <div class="weather-extra-info">
        <p class="weather-extra-info__location">${location}</p>
        <p class="weather-extra-info__localtime">${time}</p>
        <p class="weather-extra-info__condition">${condition}</p>
        <p class="weather-extra-info__wind-speed">Wind: ${wind}</p>
        <p class="weather-extra-info__feels-like-temp">Feels like: ${feelsLike}</p>
      </div>
    `;
  }
}

export default new WeatherNow();
