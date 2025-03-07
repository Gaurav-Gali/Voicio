// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNWXpJza-hCLaraW5Jbt_bGc2o4S1EFNk",
    authDomain: "voicia-65f6d.firebaseapp.com",
    projectId: "voicia-65f6d",
    storageBucket: "voicia-65f6d.firebasestorage.app",
    messagingSenderId: "510127852620",
    appId: "1:510127852620:web:be4844451731ad58eff8e9",
    measurementId: "G-35VBY9TNGE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
