import '../sass/main.scss';

import * as model from './model';

import searchView from './view/searchView';
import weatherNow from './view/weatherNowView';
import forecastView from './view/forecastView';
import unitSwitchView from './view/unitSwitchView';
import getUserLocationView from './view/getUserLocationView';
import hourlyForecastView from './view/hourlyForecastView';

const controlSearchOnBlur = () => searchView.clear();
const controlSearchOnFocus = () =>
  searchView.render(model.state.searchSuggestions);
const controlSearchOnInput = async query => {
  await model.loadSearchSuggestions(query);
  searchView.render(model.state.searchSuggestions);
};

async function controlForecast(index) {
  searchView.clear();

  const coords = model.getSearchSuggestionLocation(index);
  await model.loadForecast(coords);

  const { displayUnits, displayTimeFormat } = model.state;
  const { location, now, forecast } = model.state.weather;

  weatherNow[weatherNow.isFirstRender ? 'render' : 'update']({
    displayUnits,
    displayTimeFormat,
    location,
    now,
  });

  forecastView[forecastView.isFirstRender ? 'render' : 'update']({
    displayUnits,
    displayTimeFormat,
    forecast,
  });
}

function controlHourlyForecast(forecastDayIndex, coords) {
  if (!forecastDayIndex) {
    hourlyForecastView.clear();
    return;
  }

  const { displayUnits } = model.state;
  const { hourly } = model.state.weather.forecast[forecastDayIndex];

  hourlyForecastView.render({ coords, displayUnits, hourly });
}

function controlUnitToggle() {
  model.toggleUnits();

  if (weatherNow.isFirstRender || forecastView.isFirstRender) return;

  const { displayUnits, displayTimeFormat } = model.state;
  const { location, now, forecast } = model.state.weather;

  weatherNow.update({ displayUnits, displayTimeFormat, location, now });
  forecastView.update({ displayUnits, displayTimeFormat, forecast });
}

async function controlGeolocation() {
  const coords = await model.getUserLocation();
  await model.loadForecast(coords);

  const { displayUnits, displayTimeFormat } = model.state;
  const { location, now, forecast } = model.state.weather;

  weatherNow[weatherNow.isFirstRender ? 'render' : 'update']({
    displayUnits,
    displayTimeFormat,
    location,
    now,
  });

  forecastView[forecastView.isFirstRender ? 'render' : 'update']({
    displayUnits,
    displayTimeFormat,
    forecast,
  });
}

function controlPrefetch() {
  model.prefetchBGs();
}

searchView.addHandlerSearchOnInput(controlSearchOnInput);
searchView.addHandlerSearchOnBlur(controlSearchOnBlur);
searchView.addHandlerSearchOnFocus(controlSearchOnFocus);
searchView.addHandlerShowForecast(controlForecast);
unitSwitchView.addHandlerToggleUnit(controlUnitToggle);
getUserLocationView.addHandlerGetLocation(controlGeolocation);
forecastView.addHandlerToggleHourlyForecast(controlHourlyForecast);

function init() {
  controlGeolocation().then(() =>
    weatherNow.addHandlerPrefetchBGs(controlPrefetch)
  );
}

init();
