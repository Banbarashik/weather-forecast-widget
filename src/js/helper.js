export async function fetchAndParse(url) {
    const res = await fetch(url);
    return res.json();
  }