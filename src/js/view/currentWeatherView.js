import View from './View';

class CurrentWeatherView extends View {
  _parentElement = document.getElementById('current__weather-block');
  _data;

  _generateMarkup() {
    return `
      <p id="current__city-name">${this._data.location.name}</p>
      <p id="current__temp"></p>
    `;
  }
}

export default new CurrentWeatherView();
