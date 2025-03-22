import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// history.js (Displays User History)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading history...');
    // Fetch and display history from Supabase
});