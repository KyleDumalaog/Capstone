import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient.js';

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// user_dashboard.js (User Dashboard Functionality)
document.getElementById('start-charging')?.addEventListener('click', function() {
    console.log('Charging started');
    // Implement charging logic with Supabase
});

document.getElementById('stop-charging')?.addEventListener('click', function() {
    console.log('Charging stopped');
    // Implement stop charging logic
});