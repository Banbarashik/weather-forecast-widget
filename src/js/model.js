import { API_URL, API_KEY, FORECAST_NUM_OF_DAYS } from './config';
import { fetchAndParse } from './helper';

export const state = {
  searchSuggestions: [],
  forecast: { location: {}, current: {}, forecast: { forecastday: [] } }, // the same structure as in the object returned from the API
};

export async function loadSearchSuggestions(query) {
  state.searchSuggestions = await fetchAndParse(
    `${API_URL}/search.json?key=${API_KEY}&q=${query}`
  );
}

export async function loadForecast(index) {
  const { lat, lon } = state.searchSuggestions[index];

  state.forecast = await fetchAndParse(
    `${API_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${FORECAST_NUM_OF_DAYS}`
  );
}
