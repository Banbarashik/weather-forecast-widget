exports.handler = async function (event) {
  console.log(event.body);

  const searchSuggestions = await fetch(
    `${process.env.API_URL}/search.json?key=${process.env.API_KEY}&q=`
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello' }),
  };
};
