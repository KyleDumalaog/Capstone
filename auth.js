import { supabase } from './supabaseClient.js';

// 🔹 Prevent Back Navigation After Logout
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
};

// 🔹 Register User
async function registerUser(email, password, name) {
    const predefinedAdmins = {
        "admin@example.com": "admin",
        "superadmin@example.com": "superadmin"
    };

    let role = "user"; // Default role
    if (predefinedAdmins[email]) {
        role = predefinedAdmins[email]; // Assign correct role
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { email_confirm: true } 
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    const userId = data?.user?.id;
    if (!userId) {
        console.error("Error: User ID is undefined");
        return;
    }

    const { error: insertError } = await supabase.from('users').insert([
        { id: userId, email, name, role, points: 0 }
    ]);

    if (insertError) {
        console.error("Insert Error:", insertError.message);
        alert(`Insert failed: ${insertError.message}`);
        return;
    }

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

    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .maybeSingle();

    if (roleError || !userData) {
        console.error("Role Fetch Error:", roleError?.message);
        alert("Error fetching user role or user does not exist.");
        return;
    }

    console.log("Login Success:", data);
    alert("Login successful!");

    // 🔹 Redirect based on role
    if (userData.role === 'superadmin') {
        window.location.href = "superadmin_dashboard.html";
    } else if (userData.role === 'admin') {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}

// 🔹 Logout User (Works for All Roles)
async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout Error:", error.message);
        alert("Logout failed. Try again.");
    } else {
        console.log("Logout successful");
        window.location.href = "index.html";
    }
}

// 🔹 Protect Pages: Only Allow Authenticated Users
async function checkAuth() {
    const { data: user, error } = await supabase.auth.getUser();
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (error || !user || !user.user) {
        console.log("Not authenticated, redirecting to login...");
        if (protectedPages.includes(currentPage)) {
            window.location.href = "index.html"; 
        }
        return;
    }

    // Fetch user role from database
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.user.id)
        .maybeSingle();

    if (roleError || !userData) {
        console.log("User not found, redirecting...");
        window.location.href = "index.html";
        return;
    }

    // 🔹 Check if user is allowed on this page
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

// 🔹 Check Auth & Handle Page Access on Load
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html", "history.html", "rewards.html"];

    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }

    // 🔹 Remove Infinite Logout Loop (Only Logout When User Clicks Logout)
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    // 🔹 Register Form Submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Registering:", name, email);
            await registerUser(email, password, name);
        });
    }

    // 🔹 Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Logging in:", email);
            await loginUser(email, password);
        });
    }
});
