import { API_URL, API_KEY, FORECAST_NUM_OF_DAYS } from './config';
import {
  fetchAndParse,
  getHourIn24hrFormat,
  getHourIn12hrFormat,
} from './helper';

export const state = {
  searchSuggestions: [],
  weather: {
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localtime: '',
    },
    now: {
      temp: {
        c: 0,
        f: 0,
        feelsLike: { c: 0, f: 0 },
      },
      condition: { text: '', iconUrl: '' },
      wind: { kmh: 0, mph: 0 },
    },
    forecast: [
      {
        date: '',
        temp: {
          min: { c: 0, f: 0 },
          max: { c: 0, f: 0 },
        },
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
    localtime: forecast.location.localtime,
  };

  const formattedWeatherNowObject = {
    temp: {
      c: forecast.current.temp_c,
      f: forecast.current.temp_f,
      feelsLike: {
        c: forecast.current.feelslike_c,
        f: forecast.current.feelslike_f,
      },
    },
    condition: {
      text: forecast.current.condition.text,
      iconUrl: forecast.current.condition.icon,
    },
    wind: {
      kmh: forecast.current.wind_kph,
      mph: forecast.current.wind_mph,
    },
  };

  const formatedForecastArray = forecast.forecast.forecastday.map(function (
    forecastDay
  ) {
    return {
      date: forecastDay.date,
      temp: {
        min: { c: forecastDay.day.mintemp_c, f: forecastDay.day.mintemp_f },
        max: { c: forecastDay.day.maxtemp_c, f: forecastDay.day.maxtemp_f },
      },
      iconUrl: forecastDay.day.condition.icon,
      hourly: forecastDay.hour.map(function (hour) {
        return {
          time: {
            '24hrFormat': getHourIn24hrFormat(new Date(hour.time)),
            '12hrFormat': getHourIn12hrFormat(new Date(hour.time)),
          },
          temp: {
            c: hour.temp_c,
            f: hour.temp_f,
          },
          condition: { iconUrl: hour.condition.icon },
        };
      }),
    };
  });

  console.log(formattedLocationObject);
  console.log(formattedWeatherNowObject);
  console.log(formatedForecastArray);
  console.log(
    formatedForecastArray[0].hourly[0].time['24hrFormat'],
    formatedForecastArray[0].hourly[0].time['12hrFormat']
  );

  state.weather.location = formattedLocationObject;
  state.weather.now = formattedWeatherNowObject;
  state.weather.forecast = formatedForecastArray;
}
