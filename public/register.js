import { auth, db, rtdb, ref, onValue } from "./firebase-config.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
                // Create user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Send email verification
                await sendEmailVerification(user);
            
                // Create a document for the new user in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    id: user.uid,
                    email,
                    name,
                    role: "user", // Default role for new users
                    verified: false, // Set as false until they verify their email
                    totalBottlesInserted: 0, // Initialize bottle count to 0
                    bottleHistory: {} // Initialize bottle history as an empty object
                });

                // Set initial user data in Realtime Database
                await set(ref(rtdb, 'users/' + user.uid), {
                    bottleCount: 0,  // Initialize bottle count in Realtime DB
                    chargingTimeLeft: 0 // Initialize charging time for the user
                });

                // Clear form fields
                registerForm.reset();

                // Redirect to email verification page
                window.location.href = "verify.html";
            } catch (error) {
                console.error("Registration Error:", error.message);
                alert(error.message);
            }
        });
    }
});
