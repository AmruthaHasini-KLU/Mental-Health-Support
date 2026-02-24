import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings at https://supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create client if credentials are provided, otherwise use null
// This allows the app to work with mock data during development
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database schema for reference:
// 
// Create these tables in your Supabase SQL Editor:
// 
// -- Posts table
// CREATE TABLE posts (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
//   title TEXT NOT NULL,
//   content TEXT NOT NULL,
//   category TEXT NOT NULL,
//   author_id UUID REFERENCES auth.users(id),
//   author_name TEXT,
//   is_anonymous BOOLEAN DEFAULT false,
//   likes_count INTEGER DEFAULT 0
// );
// 
// -- Replies table
// CREATE TABLE replies (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
//   post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   author_id UUID REFERENCES auth.users(id),
//   author_name TEXT,
//   is_anonymous BOOLEAN DEFAULT false
// );
// 
// -- Likes table
// CREATE TABLE post_likes (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
//   post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
//   user_id UUID REFERENCES auth.users(id),
//   UNIQUE(post_id, user_id)
// );
// 
// -- Enable Row Level Security
// ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
// ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
// ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
// 
// -- Create policies (allow authenticated users to read all and write their own)
// CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
// CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
// CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
// CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = author_id);
// 
// CREATE POLICY "Anyone can view replies" ON replies FOR SELECT USING (true);
// CREATE POLICY "Authenticated users can create replies" ON replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
// 
// CREATE POLICY "Anyone can view likes" ON post_likes FOR SELECT USING (true);
// CREATE POLICY "Authenticated users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
// CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);
