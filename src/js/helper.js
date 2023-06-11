import {
  TWELVE_HOURS_FORMAT_CYCLE,
  TWENTY_FOUR_HOURS_FORMAT_CYCLE,
} from './config';

// prettier-ignore
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function injectLinkPrefetch(url) {
  const linkTag = document.createElement('link');
  linkTag.rel = 'prefetch';
  linkTag.href = url;
  if (/\.jpg$/.test(url)) linkTag.as = 'image';
  if (/\.webm$/.test(url)) linkTag.as = 'video';

  document.head.appendChild(linkTag);
}

// prettier-ignore
export const injectMultipleLinkPrefetch = arrOfURLs => arrOfURLs.forEach(injectLinkPrefetch);

export function importAll(requireFn) {
  const entries = requireFn
    .keys()
    .map(function (key) {
      const value = requireFn(key);
      const keys = key.match(/[\w-]+/)[0].split('_');

      return keys.map(key => [key, value]);
    })
    .flat();

  return Object.fromEntries(entries);
}

export async function fetchAndParse(url, settings) {
  const res = await fetch(url, settings);
  return res.json();
}

const isToday = date => date.toDateString() === new Date().toDateString();

export const getDayName = date =>
  isToday(date) ? 'Today' : weekdays[date.getDay()].slice(0, 3);

const hourFormatter = (hourCycle, minute = true) =>
  new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    ...(minute && { minute: 'numeric' }),
    hourCycle,
  });

// prettier-ignore
export const getHourIn24hrFormat = date => hourFormatter(TWENTY_FOUR_HOURS_FORMAT_CYCLE).format(date);
// prettier-ignore
export const getHourIn12hrFormat = date => hourFormatter(TWELVE_HOURS_FORMAT_CYCLE).format(date);
// prettier-ignore
export const getHourIn12hrFormatNoMinutes = date => hourFormatter(TWELVE_HOURS_FORMAT_CYCLE, false).format(date);

export function formatDate(date, timeFormat) {
  const dayName = weekdays[date.getDay()];
  const time =
    timeFormat === '24hrFormat'
      ? getHourIn24hrFormat(date)
      : getHourIn12hrFormat(date);

  return dayName + ' ' + time;
}

export const formatTemp = (temp, unit = '') =>
  Math.round(temp) + '&deg;' + unit;

export const formatWindSpeed = (speed, unit) => Math.round(speed) + ' ' + unit;

export function getCurrentPositionPromise() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      maximumAge: Infinity,
    });
  });
}
