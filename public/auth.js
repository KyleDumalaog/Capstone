import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (user.emailVerified) {
            // ✅ Update Firestore if user is verified
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { verified: true });
            console.log("✅ User verification status updated in Firestore.");
        } else {
            console.log("❌ User email is NOT verified yet.");
        }
    }
});

// 🔹 Login User & Check Email Verification
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ❌ Prevent login if email is NOT verified
        if (!user.emailVerified) {
            alert("Please verify your email before logging in.");
            return;
        }

        // ✅ Get user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            alert("User not found!");
            return;
        }

        const userData = userDoc.data();
        alert("Login successful!");

        // 🔹 Redirect Based on Role
        if (userData.role === "superadmin") {
            window.location.href = "superadmin_dashboard.html";
        } else if (userData.role === "admin") {
            window.location.href = "admin_dashboard.html";
        } else {
            window.location.href = "user_dashboard.html";
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
    }
}
// 🔹 Attach Login Event
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await loginUser(email, password);
});

// 🔹 Logout Function
async function logoutUser() {
    try {
        await signOut(auth);
        alert("Logged out successfully!");

        // ✅ Prevent Back Button Navigation After Logout
        sessionStorage.clear();
        window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
        console.error("Logout Error:", error.message);
        alert(error.message);
    }
}

// 🔹 Attach Logout Event (Make sure the logout button exists in the dashboard)
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent default link behavior
            await logoutUser();
        });
    }
});



// 🔹 Resend Verification Email
async function resendVerificationEmail() {
    try {
        const user = auth.currentUser;
        if (user) {
            await sendEmailVerification(user);
            alert("Verification email sent! Check your inbox.");
        } else {
            alert("No user logged in.");
        }
    } catch (error) {
        console.error("Resend Email Error:", error.message);
        alert(error.message);
    }
}

// Attach event to "Resend Email" button
document.getElementById("resend-email").addEventListener("click", resendVerificationEmail);


onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // ✅ Redirect based on role if already logged in
        window.location.href = "user_dashboard.html"; // Change for admin/superadmin
    }
});

