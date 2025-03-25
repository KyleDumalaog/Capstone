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
async function fetchUsers() {
    console.log("🔄 Fetching all users...");

    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, phone, created_at');

    if (error) {
        console.error("❌ Error fetching users:", error);
        alert("Error fetching users: " + error.message);
        return;
    }

    console.log("✅ Users fetched:", users);

    // Call a function to update the UI
    displayUsers(users);
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
function displayUsers(users) {
    const userTable = document.getElementById('user-table');
    userTable.innerHTML = ""; // Clear previous rows

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.created_at}</td>
            <td><button onclick="removeUser('${user.id}')">Remove</button></td>
        `;

        userTable.appendChild(row);
    });
}

// 🔹 Event Listeners
document.getElementById('remove-user')?.addEventListener('click', removeUser);
document.getElementById('change-password')?.addEventListener('click', changeSuperAdminPassword);
document.getElementById('logout')?.addEventListener('click', logout);

// Check if user is superadmin on page load
document.addEventListener('DOMContentLoaded', () => {
    checkSuperAdmin(); // Check if user is a superadmin
    fetchUsers(); // Fetch and display users
});

