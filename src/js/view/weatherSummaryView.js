import View from './View';
import { getDayName } from '../helper';

class WeatherSummary extends View {
  _parentElement = document.getElementById('forecast');
  _data = [{}]; // an array of objects today and next days

  _generateMarkup() {
    return this._data
      .map(function (day) {
        //   date: forecastDay.date,
        // maxTempC: forecastDay.day.maxtemp_c,
        // minTempC: forecastDay.day.mintemp_c,
        // maxTempF: forecastDay.day.maxtemp_f,
        // minTempF: forecastDay.day.mintemp_f,
        // icon: forecastDay.day.condition.icon,
        // hourly: forecastDay.hour,

        /* const { date, day } = data;

        const dayName = getDayName(new Date(date));

        const { icon: iconUrl } = day.condition;

        const { mintemp_c: minTemp, maxtemp_c: maxTemp } = day; */

        const dayName = getDayName(new Date(day.date));
        const { minTempC, maxTempC } = day;
        const { icon: iconUrl } = day;

        return `
          <div class="weather-summary">
            <h3 class="weather-summary__day-name">${dayName}</h3>
            <img class="weather-summary__icon" src="${iconUrl}">
            <p class="weather-summary__temp">
              <span class="weather-summary__temp_min">${minTempC}</span>
              <span class="weather-summary__temp_max">${maxTempC}</span>
            </p>
          </div>
        `;
      })
      .join('');
  }
}

export default new WeatherSummary();
