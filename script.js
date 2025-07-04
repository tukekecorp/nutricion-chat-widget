async function handleMealInput() {
  const meal = document.getElementById("mealInput").value;
  document.getElementById("infographic").innerHTML = "⏳ Analyzing...";

  const response = await fetch("/.netlify/functions/openai-nutrition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ meal }),
  });

  const data = await response.json();
  document.getElementById("infographic").innerHTML = data.result;
}

