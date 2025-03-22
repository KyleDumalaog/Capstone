import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// auth.js (Handles Login & Registration)
document.getElementById('login-form')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Logging in:', email);
    // Implement Supabase authentication here
});

document.getElementById('register-form')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Registering:', name, email);
    // Implement Supabase registration here
});

(async () => {
    let { data, error } = await supabase.from("users").select("*");
    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log("Supabase Data:", data);
    }
})();
