import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Prevent Back Navigation After Logout
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    alert("Session expired! Please log in again.");
    window.location.replace("index.html");
};

// 🔹 Fix for Safari & Mobile: Force Reload on Back Button
window.addEventListener("pageshow", function (event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        location.reload(true);
    }
});

// 🔹 Register User
async function registerUser(email, password, name) {
    try {
        const predefinedAdmins = {
            "admin@example.com": "admin",
            "superadmin@example.com": "superadmin"
        };

        let role = predefinedAdmins[email] || "user";

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // ✅ Save User Data in Firestore
        await setDoc(doc(db, "users", userId), {
            id: userId,
            email,
            name,
            role,
            points: 0
        });

        alert("Registration successful! Please check your email for confirmation.");
    } catch (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
    }
}

// 🔹 Login User
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) {
            alert("User not found!");
            return;
        }

        const userData = userDoc.data();
        alert("Login successful!");

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

// 🔹 Logout User
async function logoutUser() {
    try {
        await signOut(auth);
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "";

        alert("You have been logged out.");
        setTimeout(() => {
            window.location.replace("index.html");
        }, 100);
    } catch (error) {
        console.error("Logout Error:", error.message);
        alert("Logout failed. Try again.");
    }
}

// 🔹 Protect Pages: Allow Only Authenticated Users
async function checkAuth() {
    onAuthStateChanged(auth, async (user) => {
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

        if (!user) {
            console.log("Not authenticated, redirecting to login...");
            if (protectedPages.includes(currentPage)) {
                alert("Session expired! Please log in again.");
                window.location.href = "index.html";
            }
            return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            console.log("User not found, redirecting...");
            alert("Session expired! Please log in again.");
            window.location.href = "index.html";
            return;
        }

        const userData = userDoc.data();
        const allowedRoles = {
            "superadmin_dashboard.html": "superadmin",
            "admin_dashboard.html": "admin",
            "user_dashboard.html": "user",
            "history.html": "user",
            "rewards.html": "user"
        };

        if (allowedRoles[currentPage] && userData.role !== allowedRoles[currentPage]) {
            alert("Unauthorized access!");
            window.location.href = "index.html";
        }
    });
}

// 🔹 Run Authentication Checks on Page Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    const currentPage = window.location.pathname.split("/").pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }

    // 🔹 Logout Button Event Listener
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    // 🔹 Register Form Submission
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Registering:", name, email);
            await registerUser(email, password, name);
        });
    }

    // 🔹 Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Logging in:", email);
            await loginUser(email, password);
        });
    }
});
