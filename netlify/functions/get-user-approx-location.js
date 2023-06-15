exports.handler = async function () {
  const coords = await fetch(
    `${process.env.MAPS_API_URL}?key=${process.env.MAPS_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ considerIp: true }),
    }
  )
    .then(res => res.json())
    .then(res => res.location);

  return {
    statusCode: 200,
    body: JSON.stringify({ lat: coords.lat, lon: coords.lng }),
  };
};
