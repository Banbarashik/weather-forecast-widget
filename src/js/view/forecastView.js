import View from './View';

class ForecastView extends View {
  _parentElement = document.getElementById('forecast');

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

        return `
          <li class="weather-summary" data-forecast-day-index="${i}">
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

  addHandlerToggleHourlyForecast(handler) {
    document.addEventListener('click', function (e) {
      const weatherSummary = e.target.closest('.weather-summary');

      if (!weatherSummary) {
        handler();
        return;
      }

      const { forecastDayIndex } = weatherSummary.dataset;
      const { left: x, bottom: y } = weatherSummary.getBoundingClientRect();
      const coords = { x, y };

      handler(forecastDayIndex, coords);
    });
  }
}

export default new ForecastView();
