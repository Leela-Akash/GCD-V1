// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

/**
 * submitComplaint
 * - Stores complaint in database
 * - Triggers background analysis
 * - Returns only success to user
 */
exports.submitComplaint = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { description, category, customCategory, location, userId } = req.body;

      if (!description || typeof description !== "string" || !description.trim()) {
        return res.status(400).json({ error: "Description is required" });
      }

      // Store complaint in database
      const docRef = await db.collection("complaints").add({
        description: description.trim(),
        category: category || "Other",
        customCategory: customCategory || "",
        location: location || null,
        userId: userId || "anonymous",
        status: "submitted",
        priority: "pending",
        createdAt: FieldValue.serverTimestamp(),
        analyzedAt: null
      });

      // Trigger background analysis
      analyzeComplaintBackground(docRef.id, description.trim());

      return res.json({ 
        success: true,
        message: "Complaint submitted successfully",
        id: docRef.id
      });
    } catch (err) {
      console.error("🔥 Submit error:", err);
      return res.status(500).json({ error: "Failed to submit complaint" });
    }
  });
});

/**
 * Convert audio to text using Gemini with improved processing
 */
async function convertAudioToText(audioData) {
  try {
    console.log("🎙️ Calling Gemini for audio transcription...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                    data: audioData
                  }
                },
                {
                  text: "Transcribe this audio to text accurately. Rules: 1) Return only the clean transcribed text 2) Remove repetitive words or phrases 3) Fix grammar and punctuation 4) If the audio is unclear, return 'Audio unclear - please try again' 5) Maximum 500 characters"
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 150
          }
        })
      }
    );

    const data = await response.json().catch(() => ({}));
    console.log("🎙️ Gemini response:", JSON.stringify(data, null, 2));
    
    let transcribedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean up repetitive text
    transcribedText = cleanRepetitiveText(transcribedText.trim());
    
    console.log("🎙️ Cleaned transcribed text:", transcribedText);
    
    return transcribedText;
  } catch (err) {
    console.error("🔥 Audio conversion failed:", err);
    return "Audio transcription failed";
  }
}

/**
 * Clean repetitive text from transcription
 */
function cleanRepetitiveText(text) {
  if (!text || text.length < 10) return text;
  
  // Remove excessive repetition of words/phrases
  const words = text.split(' ');
  const cleanWords = [];
  let lastWord = '';
  let repeatCount = 0;
  
  for (const word of words) {
    if (word === lastWord) {
      repeatCount++;
      if (repeatCount < 2) { // Allow max 1 repetition
        cleanWords.push(word);
      }
    } else {
      cleanWords.push(word);
      repeatCount = 0;
    }
    lastWord = word;
  }
  
  let cleaned = cleanWords.join(' ');
  
  // Remove repetitive phrases (3+ words)
  const sentences = cleaned.split(/[.!?]+/);
  const uniqueSentences = [];
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed && !uniqueSentences.some(s => s.includes(trimmed) || trimmed.includes(s))) {
      uniqueSentences.push(trimmed);
    }
  }
  
  return uniqueSentences.join('. ').trim();
}

/**
 * Background function to analyze complaint with Gemini
 * Updates database with analysis results for admin
 */
async function analyzeComplaintBackground(complaintId, description) {
  try {
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an expert civic complaint analyst. Analyze this complaint and provide:

1. Priority: CRITICAL, HIGH, MEDIUM, or LOW
2. Category: Road, Water, Electricity, Garbage, or Other  
3. Brief analysis: Explain the issue, potential impact, and suggested action (2-3 sentences)

Complaint: "${description}"

Priority Guidelines:
- CRITICAL: Safety hazards, major infrastructure failures, health emergencies
- HIGH: Significant disruptions, urgent repairs needed, affects many people
- MEDIUM: Important but not urgent, moderate impact
- LOW: Minor issues, cosmetic problems, low impact

Respond in this exact format:
Priority: [PRIORITY]
Category: [CATEGORY]
Analysis: [Your detailed analysis explaining why this priority was assigned and what action should be taken]
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json().catch(() => ({}));
    console.log(`🤖 Gemini API Response Status: ${response.status}`);
    console.log(`🤖 Gemini API Response:`, JSON.stringify(data, null, 2));
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse AI response
    const priorityMatch = aiResponse.match(/Priority:\s*(CRITICAL|HIGH|MEDIUM|LOW)/i);
    const categoryMatch = aiResponse.match(/Category:\s*(\w+)/i);
    const analysisMatch = aiResponse.match(/Analysis:\s*(.+)/s);
    
    const priority = priorityMatch ? priorityMatch[1].toUpperCase() : "MEDIUM";
    const aiCategory = categoryMatch ? categoryMatch[1] : "Other";
    const analysis = analysisMatch ? analysisMatch[1].trim() : `AI Analysis: This appears to be a ${priority.toLowerCase()} priority ${aiCategory.toLowerCase()} issue that requires attention from the relevant municipal department. The complaint has been categorized and will be processed accordingly.`;

    console.log(`✅ Parsed Analysis - Priority: ${priority}, Category: ${aiCategory}, Analysis: ${analysis.substring(0, 100)}...`);

    // Update complaint with analysis results
    await db.collection("complaints").doc(complaintId).update({
      priority,
      aiCategory,
      aiAnalysis: analysis,
      status: "analyzed",
      analyzedAt: FieldValue.serverTimestamp()
    });

    console.log(`✅ Complaint ${complaintId} analyzed: ${priority}`);
  } catch (err) {
    console.error(`🔥 Analysis failed for ${complaintId}:`, err);
    
    // Update with error status
    await db.collection("complaints").doc(complaintId).update({
      status: "analysis_failed",
      priority: "MEDIUM",
      aiAnalysis: "Analysis failed - manual review required",
      analyzedAt: FieldValue.serverTimestamp()
    });
  }
}

/**
 * updateComplaintMedia
 * - Expects { id, media: [ { url, type } ] }
 * - Updates the complaint doc's media array
 */
exports.updateComplaintMedia = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { id, media } = req.body;
      if (!id || !Array.isArray(media)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      await db.collection("complaints").doc(id).update({
        media
      });

      return res.json({ success: true });
    } catch (err) {
      console.error("🔥 Media update error:", err);
      return res.status(500).json({ error: "Failed to update media" });
    }
  });
});

/**
 * analyzeMedia
 * - Analyzes uploaded images/videos with Gemini Vision
 * - Updates complaint with media insights
 */
exports.analyzeMedia = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { complaintId, mediaUrls } = req.body;

      if (!complaintId || !mediaUrls || !Array.isArray(mediaUrls)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      let mediaInsights = [];

      for (const media of mediaUrls) {
        if (media.type.startsWith('image/')) {
          const insight = await analyzeImageWithGemini(media.url);
          if (insight) {
            mediaInsights.push(`Image Analysis: ${insight}`);
          }
        }
      }

      if (mediaInsights.length > 0) {
        // Update complaint with media insights
        await db.collection("complaints").doc(complaintId).update({
          mediaAnalysis: mediaInsights.join("\n\n"),
          hasMediaAnalysis: true
        });
      }

      return res.json({ success: true, insights: mediaInsights });
    } catch (err) {
      console.error("🔥 Media analysis error:", err);
      return res.status(500).json({ error: "Failed to analyze media" });
    }
  });
});

/**
 * Analyze image with Gemini Vision
 */
async function analyzeImageWithGemini(imageUrl) {
  try {
    // Convert image URL to base64
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const base64Image = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                  }
                },
                {
                  text: "Analyze this civic complaint image. Describe what you see, identify the problem, assess severity, and suggest priority level (CRITICAL/HIGH/MEDIUM/LOW). Focus on infrastructure issues, safety hazards, or civic problems."
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("🔥 Image analysis failed:", err);
    return null;
  }
}
