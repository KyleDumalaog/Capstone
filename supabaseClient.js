// Import from the Supabase CDN (no need for npm)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase project details (replace with your actual credentials)
const supabaseUrl = "https://jixmkwoddokkwbztayta.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzgzOTYsImV4cCI6MjA1ODE1NDM5Nn0.4TrgLwww0iTKA-ix9jEB9sp4_GO3bcV3vdhxmLPQlRM"; 

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
