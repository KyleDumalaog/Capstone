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

// 🔹 Fetch Users and Populate Table
async function fetchUsers() {
    console.log("🔄 Fetching all users...");

    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, phone, providers, created_at, last_login, status'); // ✅ Ensured all fields exist

    if (error) {
        console.error("❌ Error fetching users:", error);
        alert("Error fetching users: " + error.message);
        return;
    }

    console.log("✅ Users fetched:", users);
    displayUsers(users);
}

// 🔹 Display Users in Table
function displayUsers(users) {
    const tableBody = document.getElementById('user-table');
    tableBody.innerHTML = ""; // Clear table before inserting new rows

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.providers || 'N/A'}</td>
            <td>${new Date(user.created_at).toLocaleString()}</td>
            <td>${user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</td>
            <td>${user.status || 'Active'}</td>
            <td>
                <button onclick="removeUser('${user.id}')">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 🔹 Change Super Admin Password
async function changeSuperAdminPassword() {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

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
document.getElementById('refresh')?.addEventListener('click', fetchUsers);  // ✅ Added event listener
document.getElementById('add-user')?.addEventListener('click', () => window.location.href = "add_user.html");
document.getElementById('add-admin')?.addEventListener('click', () => window.location.href = "add_admin.html");
document.getElementById('change-password')?.addEventListener('click', changeSuperAdminPassword);
document.getElementById('logout')?.addEventListener('click', logout);

// 🔹 Load Users on Page Load
document.addEventListener('DOMContentLoaded', async () => {
    await checkSuperAdmin();
    await fetchUsers();
});
