import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeG1rd29kZG9ra3dienRheXRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU3ODM5NiwiZXhwIjoyMDU4MTU0Mzk2fQ.y9185WLXpkVcb7mOZvke-79wYROn-tnbGKGS41lyh2o'; // ⚠️ Use Service Role Key
export const supabase = createClient(supabaseUrl, supabaseKey);
