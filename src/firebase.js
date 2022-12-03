import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRab0d7U8sIaOOGp9-BOKC6eKe04Ok0Do",
  authDomain: "demo1-b32d2.firebaseapp.com",
  projectId: "demo1-b32d2",
  storageBucket: "demo1-b32d2.appspot.com",
  messagingSenderId: "285532714466",
  appId: "1:285532714466:web:b602c7ce380739cecf35bb",
  measurementId: "G-XMZQJWEPXY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
const analytics = getAnalytics(app);