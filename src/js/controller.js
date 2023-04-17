import * as model from './model';

import searchView from './view/searchView';
import currentWeatherView from './view/currentWeatherView';

async function controlSearch(query) {
  await model.loadSearchSuggestions(query);

  searchView.render(model.state.searchSuggestions);
}

async function controlCurrentWeather(index) {
  await model.loadForecast(index);

  currentWeatherView.render(model.state.forecast);
}

searchView.addHandlerShowSearchSuggestions(controlSearch);
searchView.addHandlerShowCurrentWeather(controlCurrentWeather);
