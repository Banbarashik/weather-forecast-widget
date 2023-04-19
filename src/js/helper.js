const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export async function fetchAndParse(url) {
  const res = await fetch(url);
  return res.json();
}

export const getDayName = date => weekdays[date.getDay()];

export function formatCurrentDate(date) {}
