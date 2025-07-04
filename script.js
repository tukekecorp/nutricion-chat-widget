async function handleMealInput() {
  const meal = document.getElementById("mealInput").value;
  document.getElementById("infographic").innerHTML = "⏳ Analyzing...";

  // Send to GPT + USDA
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_OPENAI_API_KEY",
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
          content: `Give me a nutrition breakdown (calories, macros, vitamins) for this meal: ${meal}. Format it visually in green and orange as HTML.`
        }
      ],
      temperature: 0.7,
    })
  });

  const data = await response.json();
  const result = data.choices[0].message.content;
  document.getElementById("infographic").innerHTML = result;
}
