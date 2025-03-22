import { supabase } from './supabaseClient.js';

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

    alert("Registration successful! You can now log in.");
}

async function loginUser(email, password) {
    console.log("Logging in with:", email, password);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error);
        alert(`Error: ${error.message}`);
        return;
    }

    console.log("Login Success:", data);
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
