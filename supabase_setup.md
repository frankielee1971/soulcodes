# Supabase Setup for Soulcodes

## Overview
This document outlines the Supabase integration for Soulcodes to handle user profiles, angel number tracking, and other features.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  birthdate DATE,
  goal VARCHAR,
  numbers VARCHAR,
  life_path_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Angel Sightings Table
```sql
CREATE TABLE angel_sightings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  number VARCHAR NOT NULL,
  datetime TIMESTAMP NOT NULL,
  location VARCHAR,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Journal Entries Table
```sql
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  entry TEXT,
  prompt VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Affirmation Cards Table
```sql
CREATE TABLE affirmation_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  affirmation TEXT NOT NULL,
  drawn_at TIMESTAMP DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT FALSE
);
```

## RLS Policies
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE angel_sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmation_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own angel sightings" ON angel_sightings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own angel sightings" ON angel_sightings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own angel sightings" ON angel_sightings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own angel sightings" ON angel_sightings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own journal entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own affirmation cards" ON affirmation_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own affirmation cards" ON affirmation_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own affirmation cards" ON affirmation_cards FOR UPDATE USING (auth.uid() = user_id);
```