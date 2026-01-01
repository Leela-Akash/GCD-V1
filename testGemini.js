const API_KEY = "AIzaSyCosqRzmP17wA6Zlp1K8BiNTyIkNd-Snso";

async function test() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Classify this civic complaint priority (Low, Medium, High): Open drain near hospital causing health issues"
              }
            ]
          }
        ]
      })
    }
  );

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
