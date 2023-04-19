const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function fetchAndParse(url) {
  const res = await fetch(url);
  return res.json();
}

const isToday = date => date.toDateString() === new Date().toDateString();

export const getDayName = date =>
  isToday(date) ? 'Today' : weekdays[date.getDay()];

export function formatCurrentDate(date) {}
