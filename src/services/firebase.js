import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIu_lzxpDVR0sPXNzbdkariOmuxxHHRRQ",
  authDomain: "ai-civic-voice.firebaseapp.com",
  projectId: "ai-civic-voice",
  storageBucket: "ai-civic-voice.firebasestorage.app",
  messagingSenderId: "207855789486",
  appId: "1:207855789486:web:f673c2ba23446a65da543f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔥 CONNECT TO EMULATORS (LOCAL DEVELOPMENT ONLY)
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
