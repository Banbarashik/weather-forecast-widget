import View from './View';
import { getDayName } from '../helper';

class ForecastView extends View {
  _parentElement = document.getElementById('forecast');
  _data = [
    {
      dateStr: '',
      maxTempC: 0,
      minTempC: 0,
      maxTempF: 0,
      minTempF: 0,
      iconUrl: '',
      hourly: [{}],
    },
  ];

  _generateMarkup() {
    return this._data
      .map(function (day) {
        const date = new Date(day.dateStr);
        const dayName = getDayName(date);

        return `
          <li class="weather-summary">
            <h3 class="weather-summary__day-name">${dayName}</h3>
            <img class="weather-summary__icon" src="${day.iconUrl}">
            <p class="weather-summary__temp">
              <span class="weather-summary__temp_min">${day.minTempC}</span>
              <span class="weather-summary__temp_max">${day.maxTempC}</span>
            </p>
          </li>
        `;
      })
      .join('');
  }
}

export default new ForecastView();
