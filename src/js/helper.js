// prettier-ignore
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
  // const time = date.getHours() + ':' + date.getMinutes();
  const time = // date.getHours() + ':' + date.getMinutes();
    timeFormat === '24hrFormat'
      ? getHourIn24hrFormat(date)
      : getHourIn12hrFormat(date);

  return dayName + ' ' + time;
}
