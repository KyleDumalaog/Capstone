import { auth, db } from "./firebase-config.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Safely attach event listener after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
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
    }
});
