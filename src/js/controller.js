import '../sass/main.scss';

import * as model from './model';

import searchView from './view/searchView';
import weatherNow from './view/weatherNowView';
import forecastView from './view/forecastView';
import unitSwitchView from './view/unitSwitchView';
import getUserLocationView from './view/getUserLocationView';
import hourlyForecastView from './view/hourlyForecastView';

async function controlSearchOnInput(query) {
  await model.loadSearchSuggestions(query);

  searchView.render(model.state.searchSuggestions);
}
const controlSearchOnBlur = () => searchView.render([]);
const controlSearchOnFocus = () =>
  searchView.render(model.state.searchSuggestions);

async function controlForecast(index) {
  const coords = model.getSearchSuggestionLocation(index);

  searchView.render([]);

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

function controlHourlyForecast(index, coords) {
  if (!index) {
    hourlyForecastView.render();
    return;
  }

  const { hourly } = model.state.weather.forecast[index];

  hourlyForecastView.render({
    coords,
    displayUnits: model.state.displayUnits,
    hourly,
  });
}

function controlUnitToggle() {
  model.toggleUnits();

  if (!model.state.isLocationLoaded) return;

  weatherNow.update({
    displayUnits: model.state.displayUnits,
    displayTimeFormat: model.state.displayTimeFormat,
    location: model.state.weather.location,
    now: model.state.weather.now,
  });
  forecastView.update({
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

searchView.addHandlerSearchOnInput(controlSearchOnInput);
searchView.addHandlerSearchOnBlur(controlSearchOnBlur);
searchView.addHandlerSearchOnFocus(controlSearchOnFocus);
searchView.addHandlerShowForecast(controlForecast);
unitSwitchView.addHandlerToggleUnit(controlUnitToggle);
getUserLocationView.addHandlerGetLocation(controlGeolocation);
forecastView.addHandlerOpenHourlyForecast(controlHourlyForecast);
