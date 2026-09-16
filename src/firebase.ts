import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || "YOUR_API_KEY",
  authDomain: "navi-freight-ai.firebaseapp.com",
  projectId: "navi-freight-ai",
  storageBucket: "navi-freight-ai.firebasestorage.app",
  messagingSenderId: "461208259978",
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || "YOUR_APP_ID"
};

// Initialize Firebase safely (avoid duplicate initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
