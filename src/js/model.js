const bgVideosWEBM = importAll(require.context('./../video/webm', false));
const bgVideosMP4H265 = importAll(require.context('./../video/mp4/h265', false)); // prettier-ignore
const bgVideosMP4H264 = importAll(require.context('./../video/mp4/h264', false)); // prettier-ignore
const bgImages = importAll(require.context('./../img', false));

import {
  FORECAST_NUM_OF_DAYS,
  CELSIUS_UNIT,
  FAHRENHEIT_UNIT,
  KILOMETRE_PER_HOUR_UNIT,
  MILE_PER_HOUR_UNIT,
  TWENTY_FOUR_HOURS_FORMAT,
  TWELVE_HOURS_FORMAT,
  TIMEOUT_SEC,
} from './config';
import {
  fetchAndParse,
  formatDate,
  getDayName,
  getHourIn24hrFormat,
  getHourIn12hrFormatNoMinutes,
  formatTemp,
  formatWindSpeed,
  importAll,
  getCurrentPositionPromise,
  injectMultipleLinkPrefetch,
  convertDateStrToValues,
  rejectRequest,
} from './helper';

export const state = {
  searchSuggestions: [
    /* { name: '', region: '', country: '', coords: { lat: 0, lon: 0 } } */
  ],
  isUserApproxLocationLoaded: false,
  isUserPreciseLocationLoaded: false,
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
      localtime: [],
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
      condition: {
        text: '',
        code: 0,
        iconUrl: '',
        videoUrl: { webm: '', mp4_h265: '', mp4_h264: '' },
        imageUrl: '',
      },
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
            time: [],
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

const countryNamesShort = {
  'United States of America': 'USA',
  'United Kingdom': 'UK',
  'Democratic Republic of Congo': 'DRC',
  "Lao People's Democratic Republic": 'Laos',
};

export const resetSearchSuggestions = () => { state.searchSuggestions = [] }; //prettier-ignore

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
  if (!query) {
    state.searchSuggestions = [];
    return;
  }

  const searchSuggestions = await fetchAndParse(
    '/.netlify/functions/load-search-suggestions',
    {
      method: 'POST',
      body: query,
    }
  );

  state.searchSuggestions = formatSearchSuggestionsArr(searchSuggestions);
}

function formatSearchSuggestionsArr(arr) {
  return arr.map(function ({ name, region, country, lat, lon }) {
    return {
      name,
      region: region === 'null' ? null : region,
      country: countryNamesShort[country]
        ? countryNamesShort[country]
        : country,
      coords: { lat, lon },
    };
  });
}

export async function getUserApproxLocation() {
  try {
    const { latitude: lat, longitude: lon } = await Promise.race([
      fetchAndParse('https://geolocation-db.com/json/'),
      rejectRequest(TIMEOUT_SEC),
    ]);

    state.isUserApproxLocationLoaded = true;

    return { lat, lon };
  } catch (err) {
    console.error(err);

    state.isUserApproxLocationLoaded = true;

    return {};
  }
}

export async function getUserPreciseLocation() {
  const {
    coords: { latitude: lat, longitude: lon },
  } = await getCurrentPositionPromise();

  state.isUserPreciseLocationLoaded = true;

  return { lat, lon };
}

export const getUserLocation = async () =>
  state.isUserApproxLocationLoaded
    ? await getUserPreciseLocation()
    : await getUserApproxLocation();

export function getSearchSuggestionLocation(index) {
  const {
    coords: { lat, lon },
    name,
    region,
    country,
  } = state.searchSuggestions[index];
  return { lat, lon, name, region, country };
}

// prettier-ignore
export async function loadForecast({lat = 35.36, lon = -100.38, name = '', region = '', country = ''}) {
  const { location, current, forecast } = await fetchAndParse('/.netlify/functions/load-forecast', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({lat, lon, name, region, country, numOfDays: FORECAST_NUM_OF_DAYS})
  });

  state.weather.location = formatLocationObj(location);
  state.weather.now = formatWeatherNowObj(current);
  state.weather.forecast = formatForecastArr(forecast);
}

export function prefetchBGs() {
  const URLs = [...Object.values(bgVideosWEBM), ...Object.values(bgImages)];

  //* don't prefetch if the user's internet connection < 4g (for browsers that have navigator.connection)
  if (window.navigator.connection?.effectiveType === '4g')
    injectMultipleLinkPrefetch(URLs);

  if (!window.navigator.connection) injectMultipleLinkPrefetch(URLs);
}

function formatLocationObj({ name, region, country, lat, lon, localtime }) {
  const localtimeValues = convertDateStrToValues(localtime);

  return {
    name,
    region,
    country: countryNamesShort[country] ? countryNamesShort[country] : country,
    coords: { lat, lon },
    localtime: localtimeValues,
    displayLocaltime: {
      [TWENTY_FOUR_HOURS_FORMAT]: formatDate(
        new Date(...localtimeValues),
        TWENTY_FOUR_HOURS_FORMAT
      ),
      [TWELVE_HOURS_FORMAT]: formatDate(
        new Date(...localtimeValues),
        TWELVE_HOURS_FORMAT
      ),
    },
  };
}

function formatWeatherNowObj({
  temp_c,
  temp_f,
  feelslike_c,
  feelslike_f,
  wind_kph,
  wind_mph,
  condition,
}) {
  const [k, m, h] = KILOMETRE_PER_HOUR_UNIT;

  const getBgMedia = urls =>
    urls[
      condition.code == 1000
        ? `${condition.code}-${condition.text.toLowerCase()}`
        : condition.code
    ];

  return {
    temp: {
      c: temp_c,
      displayC: formatTemp(temp_c, CELSIUS_UNIT),
      f: temp_f,
      displayF: formatTemp(temp_f, FAHRENHEIT_UNIT),
      feelsLike: {
        c: feelslike_c,
        displayC: formatTemp(feelslike_c, CELSIUS_UNIT),
        f: feelslike_f,
        displayF: formatTemp(feelslike_f, FAHRENHEIT_UNIT),
      },
    },
    condition: {
      text: condition.text,
      code: condition.code,
      iconUrl: condition.icon,
      videoUrl: {
        webm: getBgMedia(bgVideosWEBM),
        mp4_h265: getBgMedia(bgVideosMP4H265),
        mp4_h264: getBgMedia(bgVideosMP4H264),
      },
      imageUrl: getBgMedia(bgImages),
    },
    wind: {
      kmh: wind_kph,
      display_kmh: formatWindSpeed(wind_kph, `${k}${m}/${h}`),
      mph: wind_mph,
      display_mph: formatWindSpeed(wind_mph, MILE_PER_HOUR_UNIT),
    },
  };
}

const formatForecastArr = (function () {
  function _formatForecastHourObj({ time: hour, temp_c, temp_f, condition }) {
    const hourValues = convertDateStrToValues(hour);

    return {
      time: hourValues,
      displayTime: {
        [TWENTY_FOUR_HOURS_FORMAT]: getHourIn24hrFormat(
          new Date(...hourValues)
        ),
        [TWELVE_HOURS_FORMAT]: getHourIn12hrFormatNoMinutes(
          new Date(...hourValues)
        ),
      },
      temp: {
        c: temp_c,
        displayC: formatTemp(temp_c),
        f: temp_f,
        displayF: formatTemp(temp_f),
      },
      condition: { iconUrl: condition.icon },
    };
  }

  function _formatForecastDayObj({ day, date, hour }) {
    return {
      date,
      displayDate: getDayName(new Date(...convertDateStrToValues(date))),
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
      hourly: hour.map(_formatForecastHourObj),
    };
  }

  return forecastArr => forecastArr.map(_formatForecastDayObj);
})();
