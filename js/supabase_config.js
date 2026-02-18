// Supabase Configuration
// This file centralizes the Supabase client creation
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// NOTE: In a production environment, these should come from environment variables.
// For this static site prototype, we will look for them in a global config object 
// injected by the server or fall back to placeholders for now.
const SUPABASE_URL = window.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
};
