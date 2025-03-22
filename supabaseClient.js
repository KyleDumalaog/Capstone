//import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://jixmkwoddokkwbztayta.supabase.co";  
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjU4MTQsImV4cCI6MjA1ODIwMTgxNH0.sUZmp9u-Q8l1yP62GJgmQazcvX7attJ9E9lkekxf9zc";  // 🔹 Replace this!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY); /*{
    fetch: (url, options) => {
        options.headers = {
            ...options.headers,
            'Accept': 'application/json',  // ✅ Ensure JSON response
        };
        return fetch(url, options);
    }
});*/