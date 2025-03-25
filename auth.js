import { supabase } from './supabaseClient.js';

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

// 🔹 Validate Email Function  
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}



// 🔹 Register User  
async function registerUser(email, password, name) {
    email = email.trim();
    password = password.trim();
    name = name.trim();

    if (!isValidEmail(email)) {
        alert("Invalid email format! Please enter a valid email.");
        return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Supabase Signup Error:", error);
        alert("Error: " + error.message); // Show exact error message
        return;
    }

    console.log("Signup Success:", data);
    alert("Registration successful! Check your email for confirmation.");
}



// 🔹 Login User
async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error);
        alert(`Error: ${error.message}`);
        return;
    }

    // 🔹 Fetch authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Auth Error:", authError?.message || "User not found.");
        alert("Authentication failed. Please try again.");
        return;
    }

    // 🔹 Fetch user role using ID (not email)
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (roleError) {
        console.error("Role Fetch Error:", roleError.message);
        alert("Error fetching user role.");
        return;
    }

    if (!userData || !userData.role) {
        console.error("User role not found");
        alert("User role not found.");
        return;
    }

    console.log("Login Success:", data);
    alert("Login successful!");

    // 🔹 Redirect Based on Role
    if (userData.role === 'superadmin') {
        window.location.href = "superadmin_dashboard.html";
    } else if (userData.role === 'admin') {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}

// 🔹 Logout User (Force Session Expiration)
async function logoutUser() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout Error:", error.message);
        alert("Logout failed. Try again.");
        return;
    }

    // 🔹 Clear session storage
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = ""; // Clear cookies if used

    console.log("Logout successful, session cleared.");
    alert("You have been logged out.");

    // 🔹 Redirect and prevent back button access
    setTimeout(() => {
        window.location.replace("index.html");
    }, 100);
    history.pushState(null, "", "index.html");
}

// 🔹 Protect Pages: Allow Only Authenticated Users
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (error || !user) {
        console.log("Not authenticated, redirecting...");
        if (protectedPages.includes(currentPage)) {
            alert("Session expired! Please log in again.");
            window.location.href = "index.html";
        }
        return;
    }

    // 🔹 Fetch user role
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (roleError) {
        console.error("Role Fetch Error:", roleError.message);
        alert("Error fetching user role.");
        window.location.href = "index.html";
        return;
    }

    if (!userData || !userData.role) {
        console.log("User role missing, redirecting...");
        alert("Session expired! Please log in again.");
        window.location.href = "index.html";
        return;
    }

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
}

// 🔹 Run Authentication Checks on Page Load
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }

    document.getElementById('logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });

    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await registerUser(
            document.getElementById('name').value,
            document.getElementById('email').value,
            document.getElementById('password').value
        );
    });

    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await loginUser(
            document.getElementById('email').value,
            document.getElementById('password').value
        );
    });
});
