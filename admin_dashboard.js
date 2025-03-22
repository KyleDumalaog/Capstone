import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient.js';


const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// admin_dashboard.js (Admin Controls)
document.getElementById('update-status')?.addEventListener('click', function() {
    console.log('Updating machine status');
    // Update machine status in Supabase
});