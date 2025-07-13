const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const { message } = body;

    console.log("Received message:", message);

    const apiKey = process.env.Open_AI_API_KEY;

    if (!apiKey) {
      console.log("API key is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OpenAI API key" })
      };
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
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
        max_tokens: 500
      })
    });

    const data = await openaiResponse.json();
    console.log("OpenAI response:", data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("OpenAI did not return expected content");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.choices[0].message.content })
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function crashed", details: err.message })
    };
  }
};
