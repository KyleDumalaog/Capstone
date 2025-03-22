import { supabase } from './supabaseClient.js';

// Register User
async function registerUser(email, password, name) {
    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // Save user info in database
    await supabase.from('users').insert([
        { id: user.id, email: email, name: name, role: 'user', points: 0 }
    ]);

    alert("Registration successful! Please check your email.");
}

// Login User
async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
        return;
    }

    // Get user role and redirect accordingly
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

    if (roleError) {
        console.error("Role Fetch Error:", roleError.message);
        return;
    }

    alert("Login successful!");

    if (userData.role === 'admin') {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded"); // Debugging check

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Registering:", name, email); // Debugging check
            await registerUser(email, password, name);
        });
    } else {
        console.error("❌ Register form not found! Check your HTML file.");
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Logging in:", email); // Debugging check
            await loginUser(email, password);
        });
    } else {
        console.error("❌ Login form not found! Check your HTML file.");
    }
});
