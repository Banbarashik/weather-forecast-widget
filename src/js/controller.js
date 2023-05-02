import '../sass/main.scss';

import * as model from './model';

import searchView from './view/searchView';
import weatherNow from './view/weatherNowView';
import forecastView from './view/forecastView';
import unitSwitchView from './view/unitSwitchView';

async function controlSearch(query) {
  await model.loadSearchSuggestions(query);

  searchView.render(model.state.searchSuggestions);
}

async function controlForecast(index) {
  await model.loadForecast(index);

  model.resetSearchSuggestions();

  searchView.render(model.state.searchSuggestions);

  weatherNow.render({
    location: model.state.weather.location,
    now: model.state.weather.now,
  });
  forecastView.render(model.state.weather.forecast);
}

function controlUnitToggle() {
  model.toggleUnit();
}

searchView.addHandlerShowSearchSuggestions(controlSearch);
searchView.addHandlerShowForecast(controlForecast);
unitSwitchView.addHandlerToggleUnit(controlUnitToggle);
