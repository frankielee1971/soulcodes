// Supabase Client Setup
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// User profile functions
export const createUserProfile = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Angel sightings functions
export const createAngelSighting = async (sightingData) => {
  const { data, error } = await supabase
    .from('angel_sightings')
    .insert([sightingData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getAngelSightings = async (userId) => {
  const { data, error } = await supabase
    .from('angel_sightings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deleteAngelSighting = async (sightingId, userId) => {
  const { error } = await supabase
    .from('angel_sightings')
    .delete()
    .eq('id', sightingId)
    .eq('user_id', userId);
  
  if (error) throw error;
  return true;
};

// Journal entries functions
export const createJournalEntry = async (entryData) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entryData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getJournalEntry = async (userId) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateJournalEntry = async (userId, entryData) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .upsert([{
      user_id: userId,
      ...entryData
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Affirmation cards functions
export const createAffirmationCard = async (cardData) => {
  const { data, error } = await supabase
    .from('affirmation_cards')
    .insert([cardData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getAffirmationCards = async (userId) => {
  const { data, error } = await supabase
    .from('affirmation_cards')
    .select('*')
    .eq('user_id', userId)
    .order('drawn_at', { ascending: false });
  
  if (error) throw error;
  return data;
};