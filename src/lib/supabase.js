import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your-project-url' && 
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey !== 'your-anon-key'
) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('Supabase URL or Key missing or default. Database features disabled (Guest Mode enabled).');
}

export { supabase };
