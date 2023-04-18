// prettier-ignore
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function fetchAndParse(url) {
  const res = await fetch(url);
  return res.json();
}

export function formatCurrentDate(date) {}
