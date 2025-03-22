import { supabase } from './supabaseClient.js';

async function checkUserAuthenticated() {
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        console.log("User not authenticated. Redirecting...");
        window.location.href = "index.html"; // Redirect to login page
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkUserAuthenticated(); // Ensure user is authenticated before running any script
});
// admin_dashboard.js (Admin Controls)
document.getElementById('update-status')?.addEventListener('click', function() {
    console.log('Updating machine status');
    // Update machine status in Supabase
});