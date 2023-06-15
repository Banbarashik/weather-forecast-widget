exports.handler = async function (event) {
  const requestData = JSON.parse(event.body);

  const forecast = await fetch(
    `${process.env.API_URL}/forecast.json?` +
      `key=${process.env.API_KEY}` +
      `&q=${requestData.lat}%20${requestData.lon}%20${requestData.name}%20${requestData.region}%20${requestData.country}` +
      `&days=${requestData.numOfDays}`
  )
    .then(res => res.json())
    .then(function (res) {
      return {
        location: res.location,
        current: res.current,
        forecast: res.forecast.forecastday,
      };
    });

  return {
    statusCode: 200,
    body: JSON.stringify(forecast),
  };
};
