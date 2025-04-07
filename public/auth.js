import { signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./firebase-config.js";
import { updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Listen for Authentication Changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User logged in:", user.email);
        console.log("Email Verified Status:", user.emailVerified);

        if (user.emailVerified) {
            // ✅ Update Firestore "verified" field to true
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { verified: true });
            console.log("✅ Firestore updated: User is verified.");
        } else {
            console.log("❌ User email is still NOT verified.");
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
            window.location.replace("superadmin_dashboard.html");
        } else if (userData.role === "admin") {
            window.location.replace("admin_dashboard.html");
        } else {
            window.location.replace("user_dashboard.html");
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
    }
}

// 🔹 Wrap login & logout in DOMContentLoaded to prevent early DOM or storage errors
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            await loginUser(email, password);
        });
    }

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await logoutUser();
        });
    }
});

// 🔹 Logout Function (Prevents Back Button Navigation)
async function logoutUser() {
    try {
        await signOut(auth);
        alert("Logged out successfully!");

        // ✅ Prevent Back Button Navigation After Logout
        sessionStorage.clear();
        localStorage.clear();
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Redirect and remove previous session history
        window.location.replace("index.html");
        setTimeout(() => {
            history.replaceState(null, null, "index.html");
        }, 0);
    } catch (error) {
        console.error("Logout Error:", error.message);
        alert(error.message);
    }
}

// 🔹 Attach Logout Event
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent default link behavior
            await logoutUser();
        });
    }
});

// 🔹 Prevent User from Going Back After Logout
window.addEventListener("popstate", function () {
    window.history.forward();
});
