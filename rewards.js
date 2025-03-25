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

// rewards.js (Handles Reward Redemption)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading rewards...');
    // Fetch and display rewards from Supabase
});