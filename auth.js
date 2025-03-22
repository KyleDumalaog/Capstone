import { supabase } from './supabaseClient.js';

// 🔹 Prevent Back Navigation & Show Message
function preventBack() {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        alert("Session expired! Please log in again."); // ✅ Show message
        window.location.href = "index.html"; // Redirect to login
    };
}

// 🔹 Logout User (Clears Session Immediately)
async function logoutUser() {
    await supabase.auth.signOut(); // Supabase logout
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage
    document.cookie = ""; // Clear cookies (if used)
    
    console.log("✅ Logout successful, session cleared.");
    alert("You have been logged out.");

    window.location.href = "index.html"; // Redirect to login
}

// 🔹 Protect Pages: Allow Only Authenticated Users
async function checkAuth() {
    const { data: user, error } = await supabase.auth.getUser();
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (error || !user || !user.user) {
        console.log("❌ Not authenticated, redirecting to login...");
        if (protectedPages.includes(currentPage)) {
            alert("Session expired! Please log in again."); // ✅ Alert before redirect
            window.location.href = "index.html"; 
        }
        return;
    }

    // 🔹 Fetch user role
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.user.id)
        .maybeSingle();

    if (roleError || !userData) {
        console.log("❌ User not found, redirecting...");
        alert("Session expired! Please log in again."); // ✅ Alert before redirect
        window.location.href = "index.html";
        return;
    }

    // 🔹 Define allowed roles per page
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
    console.log("✅ DOM fully loaded");

    // Apply back-button prevention
    preventBack();

    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }

    // 🔹 Logout Button Event Listener
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
