import { API_URL, API_KEY, FORECAST_NUM_OF_DAYS } from './config';
import { fetchAndParse } from './helper';

export const state = {
  searchSuggestions: [],
  weather: {
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localTime: '',
    },
    now: {
      tempC: 0,
      feelsLikeTempC: 0,
      tempF: 0,
      feelsLikeTempF: 0,
      condition: { text: '', iconUrl: '' },
      windSpeed_kmh: 0,
    },
    forecast: [
      {
        dateStr: '',
        maxTempC: 0,
        minTempC: 0,
        maxTempF: 0,
        minTempF: 0,
        iconUrl: '',
        hourly: [{}],
      },
    ],
  },
};

export async function loadSearchSuggestions(query) {
  state.searchSuggestions = await fetchAndParse(
    `${API_URL}/search.json?key=${API_KEY}&q=${query}`
  );
}

export function resetSearchSuggestions() {
  state.searchSuggestions = [];
}

export async function loadForecast(index) {
  const { lat, lon } = state.searchSuggestions[index];

  const forecast = await fetchAndParse(
    `${API_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${FORECAST_NUM_OF_DAYS}`
  );

  const formattedLocationObject = {
    name: forecast.location.name,
    region: forecast.location.region,
    country: forecast.location.country,
    coords: {
      lat: forecast.location.lat,
      lon: forecast.location.lon,
    },
    localTime: forecast.location.localtime,
  };

  const formattedWeatherNowObject = {
    tempC: forecast.current.temp_c,
    feelsLikeTempC: forecast.current.feelslike_c,
    tempF: forecast.current.temp_f,
    feelsLikeTempF: forecast.current.feelslike_f,
    condition: {
      text: forecast.current.condition.text,
      iconUrl: forecast.current.condition.icon,
    },
    windSpeed_kmh: forecast.current.wind_kph,
  };

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

  console.log(formattedLocationObject);
  console.log(formattedWeatherNowObject);
  console.log(formatedForecastArray);

  state.weather.location = formattedLocationObject;
  state.weather.now = formattedWeatherNowObject;
  state.weather.forecast = formatedForecastArray;
}
