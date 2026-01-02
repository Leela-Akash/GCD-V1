// Get the base URL for API calls
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  return '/api'; // Use relative path for production
};

export async function submitComplaint({ description, category, customCategory, location, userId }) {
  const res = await fetch(
    `${getApiBaseUrl()}/submit-complaint`,
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
    `${getApiBaseUrl()}/upload-media`,
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
    `${getApiBaseUrl()}/analyze-media`,
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
