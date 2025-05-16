import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"; // Import for Realtime DB

const firebaseConfig = {
  apiKey: "AIzaSyCr4RNyFNu3Mxiepdj1on-PkwA-Gcm-xm8",
  authDomain: "recharge-16ace.firebaseapp.com",
  projectId: "recharge-16ace",
  storageBucket: "recharge-16ace.firebasestorage.app",
  messagingSenderId: "105729325400",
  appId: "1:105729325400:web:0864e6728d575f3dcf8d2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // Initialize Realtime Database

export { auth, db, rtdb, ref, onValue }; // Export for Realtime Database as well
