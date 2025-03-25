import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jixmkwoddokkwbztayta.supabase.co";  // Replace with your actual URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTY1NDUsImV4cCI6MjA1ODQ5MjU0NX0.owRlb1xnhYfm6jMLQMZ8bV9dsXL_ILckFKX2tM49FMw";  // Replace with your actual key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
