// prettier-ignore
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function fetchAndParse(url) {
  const res = await fetch(url);
  return res.json();
}

const isToday = date => date.toDateString() === new Date().toDateString();

export const getDayName = date =>
  isToday(date) ? 'Today' : weekdays[date.getDay()].slice(0, 3);

export function formatDate(date) {
  const dayName = weekdays[date.getDay()];
  const time = date.getHours() + ':' + date.getMinutes();

  return dayName + ' ' + time;
}
