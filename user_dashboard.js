import { supabase } from './supabaseClient.js'; // ✅ Just import, no redeclaration

// User Dashboard Functionality
document.getElementById('start-charging')?.addEventListener('click', function() {
    console.log('Charging started');
    // Implement charging logic with Supabase
});

document.getElementById('stop-charging')?.addEventListener('click', function() {
    console.log('Charging stopped');
    // Implement stop charging logic
});
