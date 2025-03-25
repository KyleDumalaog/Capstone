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

// 🔹 Fetch and Display Users in Table
async function fetchUsers() {
    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    const userTable = document.getElementById('user-table');
    userTable.innerHTML = ""; // Clear table

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name || '-'}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.providers || 'Email'}</td>
            <td>${new Date(user.created_at).toLocaleString()}</td>
            <td>${user.last_login ? new Date(user.last_login).toLocaleString() : '-'}</td>
            <td>
                <button class="remove-btn" data-id="${user.id}">❌ Remove</button>
            </td>
        `;
        userTable.appendChild(row);
    });

    // Add event listeners to all "Remove" buttons
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            removeUser(userId);
        });
    });
}

// 🔹 Remove User (Deactivate Instead of Delete)
async function removeUser(userId) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    const { error } = await supabase
        .from('users')
        .update({ status: 'inactive' }) // Ensure you have a 'status' column
        .eq('id', userId);

    if (error) {
        alert("Failed to deactivate user: " + error.message);
    } else {
        alert("User deactivated successfully!");
        fetchUsers(); // Refresh table
    }
}

// 🔹 Search Users in Table
document.getElementById('search')?.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const rows = document.querySelectorAll("#user-table tr");

    rows.forEach(row => {
        const email = row.children[2].textContent.toLowerCase();
        row.style.display = email.includes(query) ? "" : "none";
    });
});

// 🔹 Redirect to Add User & Add Admin Pages
document.getElementById('add-user')?.addEventListener('click', () => {
    window.location.href = "add_user.html";
});

document.getElementById('add-admin')?.addEventListener('click', () => {
    window.location.href = "add_admin.html";
});

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
document.getElementById('change-password')?.addEventListener('click', changeSuperAdminPassword);
document.getElementById('logout')?.addEventListener('click', logout);

// 🔹 Load Users & Check Superadmin Access on Page Load
document.addEventListener('DOMContentLoaded', () => {
    checkSuperAdmin();
    fetchUsers();
});
