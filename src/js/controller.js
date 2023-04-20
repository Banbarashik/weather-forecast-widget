import '../sass/main.scss';

import * as model from './model';

import searchView from './view/searchView';
import weatherNow from './view/weatherNowView';
import forecastView from './view/forecastView';

async function controlSearch(query) {
  await model.loadSearchSuggestions(query);

  searchView.render(model.state.searchSuggestions);
}

async function controlCurrentWeather(index) {
  await model.loadForecast(index);

  weatherNow.render({
    location: model.state.weather.location,
    now: model.state.weather.now,
  });
  forecastView.render(model.state.weather.forecast);
}

searchView.addHandlerShowSearchSuggestions(controlSearch);
searchView.addHandlerShowCurrentWeather(controlCurrentWeather);
