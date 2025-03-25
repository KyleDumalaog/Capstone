import { supabase } from './supabaseClient.js';

// 🔹 Handle User Submission
document.getElementById('add-user-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!email || !password || !name || !role) {
        alert("All fields are required!");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        alert("Error adding user: " + error.message);
        return;
    }

    const { error: dbError } = await supabase.from('users').insert([
        { id: data.user.id, email, name, role, status: "active" }
    ]);

    if (dbError) {
        alert("Failed to add user: " + dbError.message);
    } else {
        alert("User added successfully!");
        window.location.href = "superadmin_dashboard.html";
    }
});
