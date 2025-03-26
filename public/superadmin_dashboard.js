import { supabase } from './supabaseClient.js';

async function checkUserAuthenticated() {
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log("User not authenticated. Redirecting...");
        if (window.location.pathname !== "/index.html") {
            window.location.href = "index.html";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkUserAuthenticated(); // Ensure user is authenticated before running any script
});

// super_admin.js (Super Admin Controls)
document.getElementById('add-user')?.addEventListener('click', function() {
    console.log('Adding user...');
    // Implement add user logic
});

document.getElementById('remove-user')?.addEventListener('click', function() {
    console.log('Removing user...');
    // Implement remove user logic
});