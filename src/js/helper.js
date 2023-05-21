// prettier-ignore
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function importAll(requireFn) {
  return requireFn.keys().map(function (key) {
    const value = requireFn(key);

    const keys = key.match(/\w+/)[0].split('_');

    return [keys, value];
  });
}

/* export function importAll(requireFn) {
  const entries = requireFn.keys().map(function (key) {
    const propName = key
      .match(/\w+/)[0]
      .replace('_', '')
      .replace(/[A-Z]/, c => c.toLowerCase());

    const propValue = requireFn(key);

    return [propName, propValue];
  });

  return Object.fromEntries(entries);
} */

export async function fetchAndParse(url) {
  const res = await fetch(url);
  return res.json();
}

const isToday = date => date.toDateString() === new Date().toDateString();

export const getDayName = date =>
  isToday(date) ? 'Today' : weekdays[date.getDay()].slice(0, 3);

const hourFormatter = hour12 =>
  new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    hour12,
  });

export const getHourIn24hrFormat = date => hourFormatter(false).format(date);
export const getHourIn12hrFormat = date => hourFormatter(true).format(date);

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

export function getLocationPromise() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
