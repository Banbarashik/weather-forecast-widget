import View from './View';

class WeatherNow extends View {
  _parentElement = document.getElementById('weather-now');
  _bgImage = document.getElementById('bg-image');

  _data = {
    displayUnits: { temp: '', wind: '', time: '' },
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localtime: '',
      displayLocaltime: { '24hrFormat': '', '12hrFormat': '' },
    },
    now: {
      temp: {
        c: 0,
        displayC: '0&deg;C',
        f: 0,
        displayF: '0&deg;F',
        feelsLike: { c: 0, displayC: '0&deg;C', f: 0, displayF: '0&deg;F' },
      },
      condition: { text: '', code: 0, iconUrl: '', videoUrl: '', imageUrl: '' },
      wind: { kmh: 0, display_kmh: '0 km/h', mph: 0, display_mph: '0 mph' },
    },
  };

  render(data) {
    super.render(data);
    this._bgImage.style.backgroundImage = `url(${this._data.now.condition.imageUrl})`;
  }

  _getDisplayTemp(obj, unit) {
    return obj['display' + unit];
  }

  _generateMarkup() {
    const location = `${this._data.location.name}, ${this._data.location.country}`;
    const time =
      this._data.location.displayLocaltime[this._data.displayUnits.time];
    const temp = this._getDisplayTemp(
      this._data.now.temp,
      this._data.displayUnits.temp
    );
    const feelsLike = this._getDisplayTemp(
      this._data.now.temp.feelsLike,
      this._data.displayUnits.temp
    );
    const wind = this._data.now.wind['display_' + this._data.displayUnits.wind];
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

      <video id="widget-bg-video" class="bg-video" src="${this._data.now.condition.videoUrl}"
      autoplay loop playsinline muted></video>
    `;
  }
}

export default new WeatherNow();
