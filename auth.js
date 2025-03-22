import { supabase } from './supabaseClient.js';

async function registerUser(email, password, name) {
    // Prevent predefined admin/superadmin from registering again
    const predefinedAdmins = ["admin@example.com", "superadmin@example.com"];
    if (predefinedAdmins.includes(email)) {
        alert("This email is reserved. Please contact support.");
        return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Get user ID from Supabase response
    const userId = data?.user?.id || data?.id;
    if (!userId) {
        console.error("Error: User ID is undefined");
        return;
    }

    // Check if email already exists in `users` table
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (fetchError) {
        console.error("Error checking existing user:", fetchError.message);
        alert("Error checking existing user.");
        return;
    }

    if (existingUser) {
        console.error("User already exists in database.");
        alert("User already exists. Please log in instead.");
        return;
    }

    // 🔹 Insert user into `users` table with default role
    const { error: insertError } = await supabase.from('users').insert([
        { id: userId, email, name, role: 'user', points: 0 }
    ]);

    if (insertError) {
        console.error("Insert Error:", insertError);
        alert(`Insert failed: ${insertError.message}`);
        return;
    }

    alert("Registration successful! Please check your email.");
}

// Login User
async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Fetch user role from `users` table
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

    alert("Login successful!");
    
    await loginUser('admin@example.com', 'AdminPassword123'); 
    await loginUser('superadmin@example.com', 'SuperAdminPassword123');


    // 🔹 Redirect users based on their role
    if (userData.role === 'superadmin') {
        window.location.href = "superadmin_dashboard.html";
    } else if (userData.role === 'admin') {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

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
