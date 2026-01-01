import React, { useState, useRef, useEffect } from "react";
import "./RaiseComplaint.css";
import { submitComplaint, uploadComplaintMedia, analyzeComplaintMedia } from "../../services/geminiService";
import { uploadMedia } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";


const RaiseComplaint = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en-US"); // Add language state

  // Remove priority state - user doesn't see analysis results

  /* CAMERA */
  const [cameraOpen, setCameraOpen] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [videoRecording, setVideoRecording] = useState(false);

  /* VOICE */
  const [audioRecording, setAudioRecording] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState(null);

  /* LOCATION */
  const [location, setLocation] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const audioRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /* CAMERA PREVIEW */
  useEffect(() => {
    if (cameraOpen && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [cameraOpen, mediaStream]);

  /* FILE PREVIEW */
  useEffect(() => {
    const urls = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setPreviews(urls);
    return () => urls.forEach(p => URL.revokeObjectURL(p.url));
  }, [files]);

  const handleFileChange = e => {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = index => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  /* CAMERA */
  const openCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMediaStream(stream);
    setCameraOpen(true);
  };

  const closeCamera = () => {
    mediaStream?.getTracks().forEach(t => t.stop());
    setCameraOpen(false);
    setVideoRecording(false);
  };

  const capturePhoto = () => {
  const video = videoRef.current;
  if (!video || video.videoWidth === 0) {
    alert("Camera not ready");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    if (!blob) return;
    setFiles(prev => [...prev, new File([blob], "photo.png", { type: "image/png" })]);
    closeCamera();
  });
};

  const startRecording = () => {
  if (!mediaStream) return alert("Camera not ready");

  recordedChunks.current = [];
  const recorder = new MediaRecorder(mediaStream);
  mediaRecorderRef.current = recorder;

  recorder.ondataavailable = e => recordedChunks.current.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    setFiles(prev => [...prev, new File([blob], "video.webm")]);
    closeCamera();
  };

  recorder.start();
  setVideoRecording(true);
};


  const stopRecording = () => mediaRecorderRef.current.stop();

  /* VOICE */
  const startVoiceRecording = async () => {
    // Try browser Speech Recognition first
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language; // Use selected language
      
      recognition.onstart = () => {
        setAudioRecording(true);
        console.log('🎙️ Speech recognition started');
      };
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Update description with transcribed text
        if (transcript.trim()) {
          setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setAudioRecording(false);
      };
      
      recognition.onend = () => {
        setAudioRecording(false);
        console.log('🎙️ Speech recognition ended');
      };
      
      recognition.start();
      
    } else {
      // Fallback to audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setAudioRecording(true);
    }
  };

  const stopVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Stop speech recognition (it stops automatically)
      setAudioRecording(false);
    } else {
      // Stop audio recording
      audioRecorderRef.current.stop();
      setAudioRecording(false);
    }
  };

  /* LOCATION */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(pos =>
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    );
  };

  /* 🚀 SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please provide a description");
      return;
    }

    try {
      // Submit complaint with all data
      const result = await submitComplaint({
        description: description.trim(),
        category,
        customCategory,
        location,
        userId: user?.uid || "anonymous"
      });

      // Upload media files and analyze them
      if (files.length > 0) {
        const mediaUrls = await uploadMedia(files, result.id);
        await uploadComplaintMedia(result.id, mediaUrls);
        
        // Trigger media analysis
        await analyzeComplaintMedia(result.id, mediaUrls);
      }

      // Show success message
      alert(result.message || "Complaint submitted successfully");
      
      // Reset form
      setDescription("");
      setCategory("");
      setCustomCategory("");
      setFiles([]);
      setLocation(null);
      setVoiceBlob(null);

    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
        console.log("🎙️ Base64 conversion complete, length:", base64 ? base64.length : 0);
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error("🔥 Base64 conversion failed:", error);
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  };


  return (
    <div className="raise-page">
      <div className="raise-container">
        <h2 className="raise-title">Raise Complaint</h2>

        <form className="raise-form" onSubmit={handleSubmit}>
          <select value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option>Road</option>
            <option>Water</option>
            <option>Electricity</option>
            <option>Garbage</option>
            <option>Other</option>
          </select>

          {category === "Other" && (
            <input
              placeholder="Specify problem"
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
            />
          )}

          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="hi-IN">🇮🇳 Hindi</option>
            <option value="te-IN">🇮🇳 Telugu</option>
            <option value="ta-IN">🇮🇳 Tamil</option>
            <option value="kn-IN">🇮🇳 Kannada</option>
            <option value="ml-IN">🇮🇳 Malayalam</option>
            <option value="bn-IN">🇮🇳 Bengali</option>
            <option value="gu-IN">🇮🇳 Gujarati</option>
            <option value="mr-IN">🇮🇳 Marathi</option>
            <option value="pa-IN">🇮🇳 Punjabi</option>
            <option value="ur-IN">🇮🇳 Urdu</option>
            <option value="es-ES">🇪🇸 Spanish</option>
            <option value="fr-FR">🇫🇷 French</option>
            <option value="de-DE">🇩🇪 German</option>
            <option value="ja-JP">🇯🇵 Japanese</option>
            <option value="ko-KR">🇰🇷 Korean</option>
            <option value="zh-CN">🇨🇳 Chinese</option>
            <option value="ar-SA">🇸🇦 Arabic</option>
          </select>

          <textarea
            placeholder="Describe issue"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          {!audioRecording ? (
            <button type="button" onClick={startVoiceRecording}>🎙 Start Voice</button>
          ) : (
            <button type="button" onClick={stopVoiceRecording}>⏹ Stop Voice</button>
          )}

          {voiceBlob && <audio controls src={URL.createObjectURL(voiceBlob)} />}

          <button type="button" onClick={getLocation}>📍 Get Location</button>

          <input type="file" multiple onChange={handleFileChange} />
          <button type="button" onClick={openCamera}>📷 Open Camera</button>

          {previews.map((p, i) => (
            <div key={i}>
              {p.type.startsWith("image") && <img src={p.url} alt="" />}
              {p.type.startsWith("video") && <video controls src={p.url} />}
              {p.type.startsWith("audio") && <audio controls src={p.url} />}
              <button type="button" onClick={() => removeFile(i)}>✕</button>
            </div>
          ))}

          <button className="submit-btn">Submit Complaint</button>
        </form>

        {/* Remove priority display - user doesn't see analysis results */}
        {cameraOpen && (
  <div className="modal-overlay">
    <div className="modal camera-modal">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%" }}
      />

      <button type="button" onClick={capturePhoto}>
        📸 Take Photo
      </button>

      {!videoRecording ? (
        <button type="button" onClick={startRecording}>
          🎥 Start Video
        </button>
      ) : (
        <button type="button" onClick={stopRecording}>
          ⏹ Stop Video
        </button>
      )}

      <button type="button" onClick={closeCamera}>
        ❌ Close Camera
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default RaiseComplaint;
