// Test if Gemini supports audio transcription
const fetch = require("node-fetch");

async function testGeminiAudio() {
  try {
    // Test with a simple text-only request first
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCosqRzmP17wA6Zlp1K8BiNTyIkNd-Snso`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Hello, can you hear me?"
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("✅ Gemini text response:", data);

    // Now test if audio is supported (this might fail)
    const audioResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCosqRzmP17wA6Zlp1K8BiNTyIkNd-Snso`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "audio/webm",
                    data: "fake_audio_data"
                  }
                },
                {
                  text: "Transcribe this audio"
                }
              ]
            }
          ]
        })
      }
    );

    const audioData = await audioResponse.json();
    console.log("🎙️ Gemini audio response:", audioData);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testGeminiAudio();