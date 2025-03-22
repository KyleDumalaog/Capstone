import { supabase } from './supabaseClient.js';

// Prevent Back Navigation After Logout
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
};

// Register User
async function registerUser(email, password, name) {
    const predefinedAdmins = {
        "admin@example.com": "admin",
        "superadmin@example.com": "superadmin"
    };

    let role = "user"; // Default role

    if (predefinedAdmins[email]) {
        role = predefinedAdmins[email]; // Assign correct role
    }

    // 🔹 Register in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { email_confirm: true } // Auto-confirm email
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Get User ID
    const userId = data?.user?.id;
    if (!userId) {
        console.error("Error: User ID is undefined");
        return;
    }

    // 🔹 Insert user into `users` table
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

// Login User
async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error);
        alert(`Error: ${error.message}`);
        return;
    }

    // 🔹 Fetch user role
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

// Logout User (Works for All Roles)
async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout Error:", error.message);
        alert("Logout failed. Try again.");
    } else {
        console.log("Logout successful");
        window.location.href = "index.html"; // Redirect to login page
    }
}

// Protect Pages: Only Authenticated Users Can Access Dashboards
async function checkAuth() {
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log("Not authenticated, redirecting to login...");
        window.location.href = "index.html"; // Redirect to login page
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

    // Check if the user is allowed on this page
    const allowedRoles = {
        "superadmin_dashboard.html": "superadmin",
        "admin_dashboard.html": "admin",
        "user_dashboard.html": "user"
    };

    const currentPage = window.location.pathname.split('/').pop(); // Get current file name
    if (userData.role !== allowedRoles[currentPage]) {
        alert("Unauthorized access!");
        window.location.href = "index.html"; // Redirect unauthorized users
    }
}

// Attach event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    // 🔐 Check authentication on page load (Only for dashboards)
    const dashboardPages = ["superadmin_dashboard.html", "admin_dashboard.html", "user_dashboard.html"];
    if (dashboardPages.includes(window.location.pathname.split('/').pop())) {
        checkAuth();
    }

    // Force logout on `index.html`
    if (window.location.pathname === "/index.html") {
        supabase.auth.signOut();
    }

    // Register event
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

    // Login event
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

    // Logout event for all dashboards
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent instant navigation
            logoutUser();
        });
    }
});
