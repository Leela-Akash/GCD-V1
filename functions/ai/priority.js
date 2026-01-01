import fetch from "node-fetch";

export async function getPriorityFromGemini(description) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are a civic issue classifier.

Classify the following complaint into ONLY ONE of these words:
High
Medium
Low

Rules:
- Respond with ONLY one word.
- No explanation.
- No punctuation.
- No markdown.

Complaint:
${description}
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Clean & normalize
  const cleaned = rawText.trim().toLowerCase();

  if (cleaned.includes("high")) return "High";
  if (cleaned.includes("medium")) return "Medium";
  return "Low";
}
