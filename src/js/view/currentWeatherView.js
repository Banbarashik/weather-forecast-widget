import View from './View';
import { formatCurrentDate } from '../helper';

class CurrentWeatherView extends View {
  _parentElement = document.getElementById('current__weather-block');
  _data;

  _generateMarkup() {
    const { localtime } = this._data.location;
    const date = new Date(localtime);
    const displayDate = formatCurrentDate(date);

    return `
      <p id="current__city-name">${this._data.location.name}</p>
      <p id="current__date">${displayDate}</p>
      <p id="current__temp"></p>
    `;
  }
}

export default new CurrentWeatherView();
