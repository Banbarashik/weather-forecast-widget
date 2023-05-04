import {
  API_URL,
  API_KEY,
  FORECAST_NUM_OF_DAYS,
  CELSIUS_UNIT,
  FAHRENHEIT_UNIT,
  KILOMETRE_PER_HOUR_UNIT,
  MILE_PER_HOUR_UNIT,
  TWENTY_FOUR_HOURS_FORMAT,
  TWELVE_HOURS_FORMAT,
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
  displayUnits: {
    temp: CELSIUS_UNIT,
    wind: KILOMETRE_PER_HOUR_UNIT,
    time: TWENTY_FOUR_HOURS_FORMAT,
  },
  weather: {
    location: {
      name: '',
      region: '',
      country: '',
      coords: { lat: 0, lon: 0 },
      localtime: '',
      displayLocaltime: {
        [TWENTY_FOUR_HOURS_FORMAT]: '',
        [TWELVE_HOURS_FORMAT]: '',
      },
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
            time: '',
            displayTime: {
              [TWENTY_FOUR_HOURS_FORMAT]: '',
              [TWELVE_HOURS_FORMAT]: '',
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

export function toggleUnits() {
  if (state.displayUnits.temp === CELSIUS_UNIT) {
    state.displayUnits.temp = FAHRENHEIT_UNIT;
    state.displayUnits.wind = MILE_PER_HOUR_UNIT;
    state.displayUnits.time = TWELVE_HOURS_FORMAT;
    return;
  }

  if (state.displayUnits.temp === FAHRENHEIT_UNIT) {
    state.displayUnits.temp = CELSIUS_UNIT;
    state.displayUnits.wind = KILOMETRE_PER_HOUR_UNIT;
    state.displayUnits.time = TWENTY_FOUR_HOURS_FORMAT;
  }
}

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
    displayLocaltime: {
      [TWENTY_FOUR_HOURS_FORMAT]: formatDate(
        new Date(forecast.location.localtime),
        TWENTY_FOUR_HOURS_FORMAT
      ),
      [TWELVE_HOURS_FORMAT]: formatDate(
        new Date(forecast.location.localtime),
        TWELVE_HOURS_FORMAT
      ),
    },
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
      display_kmh:
        Math.round(forecast.current.wind_kph) +
        ' ' +
        KILOMETRE_PER_HOUR_UNIT.slice(0, 2) +
        '/' +
        KILOMETRE_PER_HOUR_UNIT.slice(2),
      mph: forecast.current.wind_mph,
      display_mph:
        Math.round(forecast.current.wind_mph) + ' ' + MILE_PER_HOUR_UNIT,
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
          time: hour.time,
          displayTime: {
            [TWENTY_FOUR_HOURS_FORMAT]: getHourIn24hrFormat(
              new Date(hour.time)
            ),
            [TWELVE_HOURS_FORMAT]: getHourIn12hrFormat(new Date(hour.time)),
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

  state.weather.location = formattedLocationObject;
  state.weather.now = formattedWeatherNowObject;
  state.weather.forecast = formatedForecastArray;
}
