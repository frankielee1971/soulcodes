import { supabase, isSupabaseConfigured } from './supabase_config.js';

// --- User Profile Management ---

export async function getOrCreateUserProfile(user) {
    if (!isSupabaseConfigured() || !user) return null;

    try {
        // Try to fetch existing profile
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching profile:', error);
            throw error;
        }

        if (data) {
            return data;
        } else {
            // Create new profile if not exists
            const { data: newProfile, error: createError } = await supabase
                .from('users')
                .insert([{
                    id: user.id,
                    email: user.email,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (createError) throw createError;
            return newProfile;
        }
    } catch (error) {
        console.error('Error in getOrCreateUserProfile:', error);
        return null;
    }
}

export async function updateUserProfile(userId, updates) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
    return data;
}

// --- Authentication Helpers ---

export async function signInAnonymously() {
    if (!isSupabaseConfigured()) return { user: { id: 'local-user' }, error: null }; // Fallback

    const { data, error } = await supabase.auth.signInAnonymously();
    return { data, error };
}

export async function getCurrentUser() {
    if (!isSupabaseConfigured()) return { id: 'local-user' }; // Fallback

    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Listen for auth state changes
export function onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
        callback('SIGNED_IN', { id: 'local-user' });
        return { data: { subscription: { unsubscribe: () => { } } } };
    }

    return supabase.auth.onAuthStateChange(callback);
}
