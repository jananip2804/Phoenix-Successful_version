import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBt0Lu8S93y2ME6Xo8Qh2MOTWFSh2tv9mU",
  authDomain: "phoenix-successful-version.firebaseapp.com",
  databaseURL: "https://phoenix-successful-version-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phoenix-successful-version",
  storageBucket: "phoenix-successful-version.firebasestorage.app",
  messagingSenderId: "990102881512",
  appId: "1:990102881512:web:94bbfa14e169834670355d",
  measurementId: "G-6W6MSV1HEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
