const fetch = require("node-fetch");

exports.handler = async function(event) {
  const body = JSON.parse(event.body);
  const { message } = body;

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPEN_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a nutritionist that gives infographic-style nutrition breakdowns using green and orange tones."
        },
        {
          role: "user",
          content: `Give me a nutrition breakdown (calories, macros, vitamins) for this meal: ${message}. Format it visually in green and orange as HTML.`
        }
      ],
      temperature: 0.7,
    })
  });

  const data = await openaiResponse.json();
  console.log("OpenAI response data:", JSON.stringify(data, null, 2));


  return {
    statusCode: 200,
    body: JSON.stringify({
      result: data.choices[0].message.content
    })
  };
};
