import { supabase } from './supabaseClient.js';

async function registerUser(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // 🔹 Get user ID from the correct data structure
    const userId = data?.user?.id;

    if (!userId) {
        console.error("Error: User ID is undefined");
        return;
    }

    // 🔹 Correct insert request
    const { error: insertError } = await supabase.from('users').insert([
        { id: userId, email: email, name: name, role: 'user', points: 0 }
    ]);
    
    if (insertError) {
        console.error("Insert Error:", insertError);
        alert(`Insert failed: ${insertError.message}`);
        return;
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
    console.log("DOM fully loaded");

    // Check for Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Registering:", name, email); // Debugging check
            await registerUser(email, password, name);
        });
    }

    // Check for Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Logging in:", email); // Debugging check
            await loginUser(email, password);
        });
    }
});
