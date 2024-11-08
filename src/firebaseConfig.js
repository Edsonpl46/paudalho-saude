// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA2_upwJIigitzp521_rq00ovKs0MsnSQo",
    authDomain: "saude-paudalho.firebaseapp.com",
    projectId: "saude-paudalho",
    storageBucket: "saude-paudalho.firebasestorage.app",
    messagingSenderId: "50351405957",
    appId: "1:50351405957:web:23d76589a79b9d89cf22ec",
    measurementId: "G-Z4QKVGL91Q"
  };

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Exporte os serviços que você deseja usar
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };