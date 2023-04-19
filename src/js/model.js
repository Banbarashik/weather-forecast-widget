import { API_URL, API_KEY, FORECAST_NUM_OF_DAYS } from './config';
import { fetchAndParse } from './helper';

export const state = {
  searchSuggestions: [],
  currentCity: { location: {}, weatherNow: {}, forecast: [] },
};

export async function loadSearchSuggestions(query) {
  state.searchSuggestions = await fetchAndParse(
    `${API_URL}/search.json?key=${API_KEY}&q=${query}`
  );
}

export async function loadForecast(index) {
  const { lat, lon } = state.searchSuggestions[index];

  const forecast = await fetchAndParse(
    `${API_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${FORECAST_NUM_OF_DAYS}`
  );

  const formatedForecastArray = forecast.forecast.forecastday.map(function (
    forecastDay
  ) {
    return {
      dateStr: forecastDay.date,
      maxTempC: forecastDay.day.maxtemp_c,
      minTempC: forecastDay.day.mintemp_c,
      maxTempF: forecastDay.day.maxtemp_f,
      minTempF: forecastDay.day.mintemp_f,
      iconUrl: forecastDay.day.condition.icon,
      hourly: forecastDay.hour,
    };
  });

  console.log(formatedForecastArray);

  state.currentCity.forecast = formatedForecastArray;
}


// Features:
// a button which will ask for the user's location and show the temp for their city
// change the background depending of the current weather conditions
