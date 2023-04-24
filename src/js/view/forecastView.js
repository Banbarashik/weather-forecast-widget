import View from './View';
import { getDayName } from '../helper';

class ForecastView extends View {
  _parentElement = document.getElementById('forecast');
  _data = [
    {
      date: '',
      temp: {
        min: { c: 0, f: 0 },
        max: { c: 0, f: 0 },
      },
      iconUrl: '',
      hourly: [{}],
    },
  ];

  _generateMarkup() {
    return this._data
      .map(function (day) {
        const dayName = getDayName(new Date(day.date));

        return `
          <li class="weather-summary">
            <h3 class="weather-summary__day-name">${dayName}</h3>
            <img class="weather-summary__icon" src="${day.iconUrl}">
            <p class="weather-summary__temp">
              <span class="weather-summary__temp_min">${day.temp.min.c}</span>
              <span class="weather-summary__temp_max">${day.temp.max.c}</span>
            </p>
          </li>
        `;
      })
      .join('');
  }
}

export default new ForecastView();
