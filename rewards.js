import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// rewards.js (Handles Reward Redemption)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading rewards...');
    // Fetch and display rewards from Supabase
});