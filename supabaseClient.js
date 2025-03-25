import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://jixmkwoddokkwbztayta.supabase.co";  
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjU4MTQsImV4cCI6MjA1ODIwMTgxNH0.sUZmp9u-Q8l1yP62GJgmQazcvX7attJ9E9lkekxf9zc";  // 🔹 Replace this!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY); 
const { data, error } = await supabase
    .from("users")
    .insert([{ 
        id: userId, 
        email, 
        name, 
        role: "user", 
        points: 0 
    }], { 
        headers: { 
            Authorization: `Bearer ${supabase.auth.session()?.access_token}` 
        }
    });

if (error) {
    console.error("Insert Error:", error.message);
}
