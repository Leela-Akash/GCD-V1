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
    // Prioritize browser Speech Recognition for better accuracy
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; // Changed to false for better control
      recognition.interimResults = false; // Changed to false to avoid repetition
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      let finalTranscript = '';
      
      recognition.onstart = () => {
        setAudioRecording(true);
        console.log('🎙️ Speech recognition started');
      };
      
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        // Clean and update description
        if (finalTranscript.trim()) {
          const cleanedText = cleanTranscriptText(finalTranscript.trim());
          setDescription(prev => {
            const newText = prev ? `${prev} ${cleanedText}` : cleanedText;
            return newText.length > 500 ? newText.substring(0, 500) : newText;
          });
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setAudioRecording(false);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'network') {
          alert('Network error. Please check your connection.');
        }
      };
      
      recognition.onend = () => {
        setAudioRecording(false);
        console.log('🎙️ Speech recognition ended');
      };
      
      recognition.start();
      
    } else {
      // Fallback to audio recording with improved Gemini transcription
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });

        audioRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        
        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64 and transcribe
          try {
            const base64Audio = await blobToBase64(blob);
            const response = await fetch('/api/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioData: base64Audio })
            });
            
            const result = await response.json();
            if (result.success && result.transcription) {
              const cleanedText = cleanTranscriptText(result.transcription);
              setDescription(prev => {
                const newText = prev ? `${prev} ${cleanedText}` : cleanedText;
                return newText.length > 500 ? newText.substring(0, 500) : newText;
              });
            }
          } catch (error) {
            console.error('Transcription failed:', error);
            alert('Voice transcription failed. Please type your complaint.');
          }
          
          stream.getTracks().forEach(t => t.stop());
        };

        recorder.start();
        setAudioRecording(true);
        
        // Auto-stop after 30 seconds to prevent long recordings
        setTimeout(() => {
          if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
            audioRecorderRef.current.stop();
          }
        }, 30000);
        
      } catch (error) {
        console.error('Microphone access failed:', error);
        alert('Microphone access denied. Please allow microphone access and try again.');
      }
    }
  };

  const stopVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setAudioRecording(false);
    } else if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
      audioRecorderRef.current.stop();
      setAudioRecording(false);
    }
  };
  
  // Helper function to clean transcript text
  const cleanTranscriptText = (text) => {
    if (!text) return '';
    
    // Remove excessive repetition
    const words = text.split(' ');
    const cleanWords = [];
    let lastWord = '';
    let repeatCount = 0;
    
    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const lastCleanWord = lastWord.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (cleanWord === lastCleanWord && cleanWord.length > 2) {
        repeatCount++;
        if (repeatCount < 2) {
          cleanWords.push(word);
        }
      } else {
        cleanWords.push(word);
        repeatCount = 0;
      }
      lastWord = word;
    }
    
    return cleanWords.join(' ').trim();
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
      // Show loading state
      const submitBtn = e.target.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // Submit complaint first (fast)
      const result = await submitComplaint({
        description: description.trim(),
        category,
        customCategory,
        location,
        userId: user?.uid || "anonymous"
      });

      // Handle media upload in background if files exist
      if (files.length > 0) {
        // Don't wait for media upload - do it in background
        uploadMediaInBackground(result.id, files);
      }

      // Show success immediately
      alert(result.message || "Complaint submitted successfully");
      
      // Reset form
      setDescription("");
      setCategory("");
      setCustomCategory("");
      setFiles([]);
      setLocation(null);
      setVoiceBlob(null);

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint. Please try again.");
      
      // Reset button on error
      const submitBtn = e.target.querySelector('.submit-btn');
      submitBtn.textContent = 'Submit Complaint';
      submitBtn.disabled = false;
    }
  };

  // Background media upload function
  const uploadMediaInBackground = async (complaintId, mediaFiles) => {
    try {
      console.log('📸 Uploading media in background...');
      const mediaUrls = await uploadMedia(mediaFiles, complaintId);
      await uploadComplaintMedia(complaintId, mediaUrls);
      
      // Optional: Trigger media analysis in background
      analyzeComplaintMedia(complaintId, mediaUrls).catch(err => 
        console.log('Media analysis failed (non-critical):', err)
      );
      
      console.log('✅ Media upload completed in background');
    } catch (error) {
      console.error('Background media upload failed:', error);
      // Don't show error to user since complaint was already submitted
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
