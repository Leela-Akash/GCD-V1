import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIu_lzxpDVR0sPXNzbdkariOmuxxHHRRQ",
  authDomain: "ai-civic-voice.firebaseapp.com",
  projectId: "ai-civic-voice",
  storageBucket: "ai-civic-voice.firebasestorage.app",
  messagingSenderId: "207855789486",
  appId: "1:207855789486:web:f673c2ba23446a65da543f"
};

// Initialize Firebase for server
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);