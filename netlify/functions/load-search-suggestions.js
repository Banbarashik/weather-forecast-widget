exports.handler = async function (event) {
  const searchSuggestions = await fetch(
    `${process.env.API_URL}/search.json?key=${process.env.API_KEY}&q=${event.body}`
  ).then(res => res.json());

  return {
    statusCode: 200,
    body: JSON.stringify(searchSuggestions),
  };
};
