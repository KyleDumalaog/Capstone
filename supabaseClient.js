import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://acdgzxkoppybixmhbxlj.supabase.co";  
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZGd6eGtvcHB5Yml4bWhieGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjI2ODQsImV4cCI6MjA1ODQ5ODY4NH0.nGuoJuTN_B71SKiKMvgUpVlZ1FIUqK_y92m7LTZsVhg";  // 🔹 Replace this!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY); /*{
    fetch: (url, options) => {
        options.headers = {
            ...options.headers,
            'Accept': 'application/json',  // ✅ Ensure JSON response
        };
        return fetch(url, options);
    }
});*/