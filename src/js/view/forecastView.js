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
      hourly: [
        {
          time: {
            '24hrFormat': '',
            '12hrFormat': '',
          },
          temp: { c: 0, f: 0 },
          condition: { iconUrl: '' },
        },
      ],
    },
  ];

  _generateMarkup() {
    return this._data
      .map(function (dayOfWeek) {
        const displayData = {
          dayName: getDayName(new Date(dayOfWeek.date)),
          temp: {
            min: {
              c: Math.round(dayOfWeek.temp.min.c) + '&deg;',
              f: Math.round(dayOfWeek.temp.min.f) + '&deg;',
            },
            max: {
              c: Math.round(dayOfWeek.temp.max.c) + '&deg;',
              f: Math.round(dayOfWeek.temp.max.f) + '&deg;',
            },
          },
          iconUrl: dayOfWeek.iconUrl,
          hourly: dayOfWeek.hourly.map(function (hour) {
            return {
              time: hour.time,
              temp: {
                c: Math.round(hour.temp.c) + '&deg;',
                f: Math.round(hour.temp.f) + '&deg;',
              },
              condition: { iconUrl: hour.condition.iconUrl },
            };
          }),
        };

        return `
          <li class="weather-summary">
            <h3 class="weather-summary__day-name">${displayData.dayName}</h3>
            <img class="weather-summary__icon" src="${displayData.iconUrl}">
            <p class="weather-summary__temp">
              <span class="weather-summary__temp_min">${displayData.temp.min.c}</span>
              <span class="weather-summary__temp_max">${displayData.temp.max.c}</span>
            </p>
            TODO markup for each hour's forecast
          </li>
        `;
      })
      .join('');
  }
}

export default new ForecastView();