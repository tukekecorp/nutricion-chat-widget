const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const { message } = body;

    // Log the input message
    console.log("Received message:", message);

    const apiKey = process.env.Open_AI_API_KEY; // ✅ Case-sensitive

    if (!apiKey) {
      throw new Error("Open_AI_API_KEY is not defined");
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a nutritionist that gives infographic-style nutrition breakdowns using green and orange tones.",
          },
          {
            role: "user",
            content: `Give me a nutrition breakdown (calories, macros, vitamins) for this meal: ${message}. Format it visually in green and orange as HTML.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiResponse.json();

    // Log full response to debug
    console.log("OpenAI Response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Unexpected OpenAI response format.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: data.choices[0].message.content,
      }),
    };
  } catch (err) {
    console.error("Error in openai-nutrition:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: err.message,
      }),
    };
  }
};


