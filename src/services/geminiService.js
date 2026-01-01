export async function submitComplaint({ description, category, customCategory, location, userId }) {
  const res = await fetch(
    "http://127.0.0.1:5001/ai-civic-voice/us-central1/submitComplaint",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description,
        category,
        customCategory,
        location,
        userId
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error("Failed to submit complaint");
  }

  return data;
}

export async function uploadComplaintMedia(complaintId, files) {
  const res = await fetch(
    "http://127.0.0.1:5001/ai-civic-voice/us-central1/updateComplaintMedia",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: complaintId,
        media: files
      })
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload media");
  }

  return res.json();
}

export async function analyzeComplaintMedia(complaintId, mediaUrls) {
  const res = await fetch(
    "http://127.0.0.1:5001/ai-civic-voice/us-central1/analyzeMedia",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        complaintId,
        mediaUrls
      })
    }
  );

  if (!res.ok) {
    console.error("Media analysis failed");
  }

  return res.json();
}
