import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Handle User Registration
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        // Store user in Firestore
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            email,
            name,
            role: "user",  // Default role
            verified: false
        });

        alert("Registration successful! A verification email has been sent. Please verify before logging in.");
    } catch (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
    }
    
});
