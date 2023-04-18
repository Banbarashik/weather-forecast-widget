import View from './View';
import { getDayName } from '../helper';

class WeatherSummary extends View {
  _parentElement = document.getElementById('forecast');
  _data = [{}]; // an array of objects today and next days

  _generateMarkup() {
    return this._data
      .map(function (day) {
        const { date: dateStr } = day;
        const dateObj = new Date(dateStr);
        const dayName = getDayName(dateObj);

        const { icon: iconUrl } = day.condition;

        const { mintemp_c: minTemp, maxtemp_c: maxTemp } = day;

        return `
          <div class="weather-summary">
            <h3 class="weather-summary__day-name">${dayName}</h3>
            <img class="weather-summary__icon" src="${iconUrl}">
            <p class="weather-summary__temp">
              <span class="weather-summary__temp_min">${minTemp}</span>
              <span class="weather-summary__temp_max">${maxTemp}</span>
            </p>
          </div>
        `;
      })
      .join('');
  }
}

export default new WeatherSummary();
