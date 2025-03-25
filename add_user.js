import { supabase } from './supabaseClient.js';

document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const role = "user"; // This page is only for users

    if (!email || !name || !password) {
        alert("All fields are required!");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { email_confirm: true }
    });

    if (error) {
        alert("Error adding user: " + error.message);
        return;
    }

    const userId = data?.user?.id;
    if (!userId) {
        alert("User creation failed.");
        return;
    }

    const { error: insertError } = await supabase.from('users').insert([
        { id: userId, email, name, role, points: 0 }
    ]);

    if (insertError) {
        alert("Failed to add user: " + insertError.message);
    } else {
        alert("User added successfully!");
        window.location.href = "superadmin_dashboard.html";
    }
});
