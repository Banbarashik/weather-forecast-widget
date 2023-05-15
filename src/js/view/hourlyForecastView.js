import View from './View';

class hourlyForecastView extends View {
  _parentElement = document.getElementById('popper');
  _overlay = document.getElementById('overlay');

  _data = {
    displayUnits: {
      temp: '',
      wind: '',
      time: '',
    },
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
  };

  _getDisplayTemp(obj, unit) {
    return obj['display' + unit];
  }

  _generateMarkup() {
    return this._data.hourly
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
}

export default new hourlyForecastView();
