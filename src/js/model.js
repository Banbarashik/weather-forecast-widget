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
  formatTemp,
  formatWindSpeed,
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

function formatLocationObj({ name, region, country, lat, lon, localtime }) {
  return {
    name,
    region,
    country,
    coords: { lat, lon },
    localtime,
    displayLocaltime: {
      [TWENTY_FOUR_HOURS_FORMAT]: formatDate(
        new Date(localtime),
        TWENTY_FOUR_HOURS_FORMAT
      ),
      [TWELVE_HOURS_FORMAT]: formatDate(
        new Date(localtime),
        TWELVE_HOURS_FORMAT
      ),
    },
  };
}

function formatWeatherNowObj({
  temp_c,
  temp_f,
  feelsLike_c,
  feelsLike_f,
  wind_kph,
  wind_mph,
  condition,
}) {
  const [k, m, h] = KILOMETRE_PER_HOUR_UNIT;

  return {
    temp: {
      c: temp_c,
      displayC: formatTemp(temp_c, CELSIUS_UNIT),
      f: temp_f,
      displayF: formatTemp(temp_c, FAHRENHEIT_UNIT),
      feelsLike: {
        c: feelsLike_c,
        displayC: formatTemp(feelsLike_c, CELSIUS_UNIT),
        f: feelsLike_f,
        displayF: formatTemp(feelsLike_f, FAHRENHEIT_UNIT),
      },
    },
    condition: { text: condition.text, iconUrl: condition.icon },
    wind: {
      kmh: wind_kph,
      display_kmh: formatWindSpeed(wind_kph, `${k}${m}/${h}`),
      mph: wind_mph,
      display_mph: formatWindSpeed(wind_mph, MILE_PER_HOUR_UNIT),
    },
  };
}

function formatForecastHourObj(obj) {
  return {
    time: obj.time,
    displayTime: {
      [TWENTY_FOUR_HOURS_FORMAT]: getHourIn24hrFormat(new Date(obj.time)),
      [TWELVE_HOURS_FORMAT]: getHourIn12hrFormat(new Date(obj.time)),
    },
    temp: {
      c: obj.temp_c,
      displayC: formatTemp(obj.temp_c),
      f: obj.temp_f,
      displayF: formatTemp(obj.temp_f),
    },
    condition: { iconUrl: obj.condition.icon },
  };
}

const formatHourlyForecastArr = arr => arr.map(formatForecastHourObj);

function formatForecastDayObj({ day, date, hour }) {
  return {
    date,
    displayDate: getDayName(new Date(date)),
    temp: {
      min: {
        c: day.mintemp_c,
        displayC: formatTemp(day.mintemp_c),
        f: day.mintemp_f,
        displayF: formatTemp(day.mintemp_f),
      },
      max: {
        c: day.maxtemp_c,
        displayC: formatTemp(day.maxtemp_c),
        f: day.maxtemp_f,
        displayF: formatTemp(day.maxtemp_f),
      },
    },
    iconUrl: day.condition.icon,
    hourly: formatHourlyForecastArr(hour),
  };
}

const formatForecastArr = arr => arr.map(formatForecastDayObj);

export async function loadForecast(index) {
  const { lat, lon } = state.searchSuggestions[index];

  const forecast = await fetchAndParse(
    `${API_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${FORECAST_NUM_OF_DAYS}`
  );

  state.weather.location = formatLocationObj(forecast.location);
  state.weather.now = formatWeatherNowObj(forecast.current);
  state.weather.forecast = formatForecastArr(forecast.forecast.forecastday);
}
