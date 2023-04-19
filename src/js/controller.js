import '../sass/main.scss';

import * as model from './model';

import searchView from './view/searchView';
import currentWeatherView from './view/currentWeatherView';
import forecastView from './view/forecastView';

async function controlSearch(query) {
  await model.loadSearchSuggestions(query);

  searchView.render(model.state.searchSuggestions);
}

async function controlCurrentWeather(index) {
  await model.loadForecast(index);

  forecastView.render(model.state.currentCity.forecast);
}

searchView.addHandlerShowSearchSuggestions(controlSearch);
searchView.addHandlerShowCurrentWeather(controlCurrentWeather);
