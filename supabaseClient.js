import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://jixmkwoddokkwbztayta.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTY1NDUsImV4cCI6MjA1ODQ5MjU0NX0.owRlb1xnhYfm6jMLQMZ8bV9dsXL_ILckFKX2tM49FMw"; // ✅ Use your actual ANON key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
