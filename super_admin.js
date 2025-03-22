import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient.js';

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// super_admin.js (Super Admin Controls)
document.getElementById('add-user')?.addEventListener('click', function() {
    console.log('Adding user...');
    // Implement add user logic
});

document.getElementById('remove-user')?.addEventListener('click', function() {
    console.log('Removing user...');
    // Implement remove user logic
});