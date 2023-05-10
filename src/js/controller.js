import '../sass/main.scss';

import * as model from './model';

import searchView from './view/searchView';
import weatherNow from './view/weatherNowView';
import forecastView from './view/forecastView';
import unitSwitchView from './view/unitSwitchView';
import getUserLocationView from './view/getUserLocationView';

async function controlSearch(query) {
  if (!query) model.resetSearchSuggestions();
  if (query) await model.loadSearchSuggestions(query);

  searchView.render(model.state.searchSuggestions);
}

async function controlForecast(index) {
  const coords = model.getSearchSuggestionLocation(index);

  model.resetSearchSuggestions();
  searchView.render(model.state.searchSuggestions);

  await model.loadForecast(coords);

  weatherNow.render({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    location: model.state.weather.location,
    now: model.state.weather.now,
  });
  forecastView.render({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    forecast: model.state.weather.forecast,
  });
}

function controlUnitToggle() {
  model.toggleUnits();

  weatherNow.render({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    location: model.state.weather.location,
    now: model.state.weather.now,
  });
  forecastView.render({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    forecast: model.state.weather.forecast,
  });
}

async function controlGeolocation() {
  await model.getUserLocation();
  await model.loadForecast();

  weatherNow.render({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    location: model.state.weather.location,
    now: model.state.weather.now,
  });
  forecastView.render({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    forecast: model.state.weather.forecast,
  });
}

searchView.addHandlerToggleSearchSuggestions(controlSearch);
searchView.addHandlerShowForecast(controlForecast);
unitSwitchView.addHandlerToggleUnit(controlUnitToggle);
getUserLocationView.addHandlerGetLocation(controlGeolocation);
