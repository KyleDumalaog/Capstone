import { supabase } from "./supabaseClient.js";

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

// User Dashboard Functionality
document.getElementById('start-charging')?.addEventListener('click', function() {
    console.log('Charging started');
    // Implement charging logic with Supabase
});

document.getElementById('stop-charging')?.addEventListener('click', function() {
    console.log('Charging stopped');
    // Implement stop charging logic
});
