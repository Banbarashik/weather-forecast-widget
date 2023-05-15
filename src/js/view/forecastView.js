import View from './View';

class ForecastView extends View {
  constructor() {
    super();
    // this._addHandlerOpenHourlyForecast(this._openHourlyForecast.bind(this));
    // this._addHandlerCloseHourlyForecast(this._closeHourlyForecast.bind(this));
  }

  _parentElement = document.getElementById('forecast');
  _overlay = document.getElementById('overlay');

  _data = {
    displayUnits: {
      temp: '',
      wind: '',
      time: '',
    },
    forecast: [
      {
        date: '',
        displayDate: '',
        temp: {
          min: { c: 0, displayC: '0&deg;', f: 0, displayF: '0&deg;' },
          max: { c: 0, displayC: '0&deg;', f: 0, displayF: '0&deg;' },
        },
        iconUrl: '',
        hourly: [
          {
            time: '',
            displayTime: {
              '24hrFormat': '',
              '12hrFormat': '',
            },
            temp: {
              c: 0,
              displayC: '0&deg;',
              f: 0,
              displayF: '0&deg;',
            },
            condition: { iconUrl: '' },
          },
        ],
      },
    ],
  };

  _getDisplayTemp(obj, unit) {
    return obj['display' + unit];
  }

  _generateMarkup() {
    return this._data.forecast
      .map((day, i) => {
        const date = day.displayDate;
        const icon = day.iconUrl;
        const minTemp = this._getDisplayTemp(
          day.temp.min,
          this._data.displayUnits.temp
        );
        const maxTemp = this._getDisplayTemp(
          day.temp.max,
          this._data.displayUnits.temp
        );
        const hourly = this._generateHourlyForecast(day.hourly);

        return `
          <li class="weather-summary" data-index="${i}">
            <h3 class="weather-summary__day-name">${date}</h3>
            <img class="weather-summary__icon" src="${icon}">
            <p class="weather-summary__temp">
              <span class="weather-summary__temp_min">${minTemp}</span>
              <span class="weather-summary__temp_max">${maxTemp}</span>
            </p>
          </li>
        `;
      })
      .join('');
  }

  _generateHourlyForecast(hourly) {
    return hourly
      .map(hour => {
        const time = hour.displayTime[this._data.displayUnits.time];
        const icon = hour.condition.iconUrl;
        const temp = this._getDisplayTemp(
          hour.temp,
          this._data.displayUnits.temp
        );

        return `
          <li class="weather-hourly__hour">
            <span>${time}</span>
            <img src="${icon}">
            <span>${temp}</span>
          </li>
        `;
      })
      .join('');
  }

  _openHourlyForecast(e) {
    if (e.target === this._parentElement) return;

    const weatherSummary = e.target.closest('.weather-summary');
    const hourlyForecast = weatherSummary.querySelector('.weather-hourly');

    hourlyForecast.classList.add('active');
    this._overlay.classList.remove('hidden');
  }

  addHandlerOpenHourlyForecast(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target === this._parentElement) return;

      const weatherSummary = e.target.closest('.weather-summary');
      const { index } = weatherSummary.dataset;

      const { left: x, bottom: y } = weatherSummary.getBoundingClientRect();
      const coords = { x, y };

      handler(index, coords);
    });
  }

  _closeHourlyForecast() {
    const hourlyForecast = this._parentElement.querySelector(
      '.weather-hourly.active'
    );

    hourlyForecast.classList.remove('active');
    this._overlay.classList.add('hidden');
  }

  _addHandlerOpenHourlyForecast(handler) {
    this._parentElement.addEventListener('click', handler);
  }
  _addHandlerCloseHourlyForecast(handler) {
    this._overlay.addEventListener('click', handler);
  }
}

export default new ForecastView();
