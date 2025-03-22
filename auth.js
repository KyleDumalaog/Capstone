import { supabase } from './supabaseClient.js';

async function registerUser(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Get user ID from the correct structure
    const userId = data?.user?.id || data?.id;
    if (!userId) {
        console.error("Error: User ID is undefined");
        return;
    }

    // 🔹 Insert into users table (without password)
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
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
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
    .limit(1)  // ✅ Ensures only one result is returned
    .maybeSingle();  // ✅ Prevents errors if no user is found

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
