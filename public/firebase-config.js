// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT97uL0B3d3jF2ZIDVQnfxgWWYhfDO-QE",
  authDomain: "recharge-ba143.firebaseapp.com",
  databaseURL: "https://recharge-ba143-default-rtdb.firebaseio.com",
  projectId: "recharge-ba143",
  storageBucket: "recharge-ba143.firebasestorage.app",
  messagingSenderId: "846673751772",
  appId: "1:846673751772:web:47f8d111e447f14859ce19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };