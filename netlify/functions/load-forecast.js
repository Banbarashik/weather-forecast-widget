exports.handler = async function (event) {
  const { lat, lon, name, region, country, numOfDays } = JSON.parse(event.body);

  const {
    location,
    current,
    forecast: { forecastday },
  } = await fetch(
    `${process.env.API_URL}/forecast.json?` +
      `key=${process.env.API_KEY}` +
      `&q=${lat}%20${lon}%20${name}%20${region}%20${country}` +
      `&days=${numOfDays}`
  ).then(res => res.json());

  return {
    statusCode: 200,
    body: JSON.stringify({ location, current, forecast: forecastday }),
  };
};
