import { supabase } from "./supabaseClient.js";

// User Registration
async function registerUser(email, password, name) {
    let { user, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error("Registration Error:", error.message);
        alert(error.message);
        return;
    }

    // Save additional user details
    await supabase.from('users').insert([
        { id: user.id, email: email, name: name, role: 'user', points: 0 }
    ]);

    alert("Registration successful! Please check your email.");
}

// User Login with Role-Based Redirection
async function loginUser(email, password) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
        return;
    }

    // Fetch user details to check role
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

    if (userError) {
        console.error("User Fetch Error:", userError.message);
        alert("Failed to fetch user data.");
        return;
    }

    const userRole = userData.role;

    // Redirect based on user role
    if (userRole === 'user') {
        window.location.href = "user_dashboard.html";
    } else if (userRole === 'admin') {
        window.location.href = "admin_dashboard.html";
    } else if (userRole === 'superadmin') {
        window.location.href = "superadmin_dashboard.html";
    } else {
        alert("Invalid role detected!");
    }
}

// Event Listeners
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;

    await registerUser(email, password, name);
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    await loginUser(email, password);
});
