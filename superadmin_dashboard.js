import { supabase } from './supabaseClient.js';

// 🔹 Ensure Super Admin is Authenticated
async function checkSuperAdmin() {
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user || !user.user) {
        alert("Unauthorized access! Redirecting...");
        window.location.href = "index.html";
        return;
    }

    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.user.id)
        .maybeSingle();

    if (roleError || !userData || userData.role !== 'superadmin') {
        alert("Unauthorized access! Redirecting...");
        window.location.href = "index.html";
    }
}

// 🔹 Redirect to Add User Page
document.getElementById('add-user')?.addEventListener('click', () => {
    window.location.href = "add_user.html";
});

// 🔹 Redirect to Add Admin Page
document.getElementById('add-admin')?.addEventListener('click', () => {
    window.location.href = "add_admin.html";
});

// 🔹 Remove User Function
async function removeUser() {
    const email = prompt("Enter the email of the user to remove:");
    if (!email) return;

    // Fetch user by email
    const { data: userData, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (error || !userData) {
        alert("User not found!");
        return;
    }

    // 🔹 Instead of deleting, mark user as 'inactive' (safer method)
    const { error: dbError } = await supabase
        .from('users')
        .update({ status: 'inactive' }) // Ensure you have a 'status' column
        .eq('email', email);

    if (dbError) {
        alert("Failed to deactivate user: " + dbError.message);
    } else {
        alert("User removed (deactivated) successfully!");
    }
}


// 🔹 Change Super Admin Password
async function changeSuperAdminPassword() {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        alert("Error updating password: " + error.message);
    } else {
        alert("Password updated successfully!");
    }
}

// 🔹 Logout Function
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("Logout failed!");
    } else {
        alert("Logged out successfully!");
        window.location.href = "index.html";
    }
}

// 🔹 Event Listeners
document.getElementById('remove-user')?.addEventListener('click', removeUser);
document.getElementById('change-password')?.addEventListener('click', changeSuperAdminPassword);
document.getElementById('logout')?.addEventListener('click', logout);

// Check if user is superadmin on page load
document.addEventListener('DOMContentLoaded', checkSuperAdmin);
