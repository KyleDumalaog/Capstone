import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzgzOTYsImV4cCI6MjA1ODE1NDM5Nn0.4TrgLwww0iTKA-ix9jEB9sp4_GO3bcV3vdhxmLPQlRM'; // ⚠️ Use Service Role Key
export const supabase = createClient(supabaseUrl, supabaseKey);
