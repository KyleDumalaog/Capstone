import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jixmkwoddokkwbztayta.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
