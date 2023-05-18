import View from './View';

class hourlyForecastView extends View {
  _parentElement = document.getElementById('popper');

  isFirstRender = true;

  _data = {
    coords: { x: 0, y: 0 },
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
    if (!this._data) return '';

    return `<ul style="left: ${this._data.coords.x}px; top: ${
      this._data.coords.y
    }px" class="weather-hourly">${this._data.hourly
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
      .join('')}</ul>`;
  }
}

export default new hourlyForecastView();
