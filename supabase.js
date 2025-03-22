import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://jixmkwoddokkwbztayta.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzgzOTYsImV4cCI6MjA1ODE1NDM5Nn0.4TrgLwww0iTKA-ix9jEB9sp4_GO3bcV3vdhxmLPQlRM";  // Replace with your Supabase public anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
