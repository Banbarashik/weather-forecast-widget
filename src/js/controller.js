import '../sass/main.scss';

import * as model from './model';

import topPanelView from './view/topPanelView';
import weatherNow from './view/weatherNowView';
import forecastView from './view/forecastView';
import hourlyForecastView from './view/hourlyForecastView';

const controlSearchOnBlur = () => topPanelView.clear();
const controlSearchOnFocus = () =>
  topPanelView.render(model.state.searchSuggestions);
const controlSearchOnInput = async query => {
  await model.loadSearchSuggestions(query);
  topPanelView.render(model.state.searchSuggestions);
};

async function controlForecast(suggestionIndex) {
  topPanelView.clear();

  const coords = suggestionIndex
    ? model.getSearchSuggestionLocation(suggestionIndex)
    : await model.getUserLocation();

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

function controlPrefetch() {
  model.prefetchBGs();
}

topPanelView.addHandlerSearchOnInput(controlSearchOnInput);
topPanelView.addHandlerSearchOnBlur(controlSearchOnBlur);
topPanelView.addHandlerSearchOnFocus(controlSearchOnFocus);
topPanelView.addHandlerShowForecast(controlForecast);
topPanelView.addHandlerToggleUnit(controlUnitToggle);
forecastView.addHandlerToggleHourlyForecast(controlHourlyForecast);

function init() {
  controlForecast().then(() =>
    weatherNow.addHandlerPrefetchBGs(controlPrefetch)
  );
}

init();
