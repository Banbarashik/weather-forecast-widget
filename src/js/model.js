import {
  API_URL,
  API_KEY,
  FORECAST_NUM_OF_DAYS,
  CELSIUS_UNIT,
  FAHRENHEIT_UNIT,
} from './config';
import {
  fetchAndParse,
  formatDate,
  getDayName,
  getHourIn24hrFormat,
  getHourIn12hrFormat,
} from './helper';

export const state = {
  searchSuggestions: [],
  displayUnit: CELSIUS_UNIT,
  weather: {
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localtime: '',
      displayLocaltime: '',
    },
    now: {
      temp: {
        c: 0,
        displayC: '0&deg;C',
        f: 0,
        displayF: '0&deg;F',
        feelsLike: { c: 0, displayC: '0&deg;C', f: 0, displayF: '0&deg;F' },
      },
      condition: { text: '', iconUrl: '' },
      wind: { kmh: 0, display_kmh: '0 km/h', mph: 0, display_mph: '0 mph' },
    },
    forecast: [
      {
        date: '',
        displayDate: '',
        temp: {
          min: { c: 0, displayC: '0&deg;', f: 0, displayF: '0&deg;' },
          max: { c: 0, displayC: '0&deg;', f: 0, displayF: '0&deg;' },
        },
        iconUrl: '',
        hourly: [
          {
            time: {
              '24hrFormat': '',
              '12hrFormat': '',
            },
            temp: {
              c: 0,
              displayC: '0&deg;',
              f: 0,
              displayF: '0&deg;',
            },
            condition: { iconUrl: '' },
          },
        ],
      },
    ],
  },
};

export const toggleUnit = () =>
  (state.displayUnit =
    state.displayUnit === CELSIUS_UNIT ? FAHRENHEIT_UNIT : CELSIUS_UNIT);

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
    displayLocaltime: formatDate(new Date(forecast.location.localtime)),
  };

  const formattedWeatherNowObject = {
    temp: {
      c: forecast.current.temp_c,
      displayC: Math.round(forecast.current.temp_c) + '&deg;' + CELSIUS_UNIT,
      f: forecast.current.temp_f,
      displayF: Math.round(forecast.current.temp_f) + '&deg;' + FAHRENHEIT_UNIT,
      feelsLike: {
        c: forecast.current.temp_c,
        displayC: Math.round(forecast.current.temp_c) + '&deg;' + CELSIUS_UNIT,
        f: forecast.current.temp_f,
        displayF:
          Math.round(forecast.current.temp_f) + '&deg;' + FAHRENHEIT_UNIT,
      },
    },
    condition: {
      text: forecast.current.condition.text,
      iconUrl: forecast.current.condition.icon,
    },
    wind: {
      kmh: forecast.current.wind_kph,
      display_kmh: Math.round(forecast.current.wind_kph) + ' km/h',
      mph: forecast.current.wind_mph,
      display_mph: Math.round(forecast.current.wind_mph) + ' mph',
    },
  };

  const formatedForecastArray = forecast.forecast.forecastday.map(function ({
    date,
    day,
    hour: hours,
  }) {
    return {
      date: date,
      displayDate: getDayName(new Date(date)),
      temp: {
        min: {
          c: day.mintemp_c,
          displayC: Math.round(day.mintemp_c) + '&deg;',
          f: day.mintemp_f,
          displayF: Math.round(day.mintemp_f) + '&deg;',
        },
        max: {
          c: day.maxtemp_c,
          displayC: Math.round(day.maxtemp_c) + '&deg;',
          f: day.maxtemp_f,
          displayF: Math.round(day.maxtemp_f) + '&deg;',
        },
      },
      iconUrl: day.condition.icon,
      hourly: hours.map(function (hour) {
        return {
          time: {
            '24hrFormat': getHourIn24hrFormat(new Date(hour.time)),
            '12hrFormat': getHourIn12hrFormat(new Date(hour.time)),
          },
          temp: {
            c: hour.temp_c,
            displayC: Math.round(hour.temp_c) + '&deg;',
            f: hour.temp_f,
            displayF: Math.round(hour.temp_f) + '&deg;',
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
