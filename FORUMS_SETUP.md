# Forums Setup Guide

## Overview
The Forums page is a peer support platform where students can share experiences, ask questions, and support each other. It includes real-time updates, anonymous posting, likes, and replies.

## Features
✅ **Three Categories:**
- Exam Anxiety - Share tips for managing exam stress
- Backlog Support - Strategies for catching up on coursework
- General Wellness - Discuss self-care and mental health

✅ **Real-time Updates:**
- Posts appear instantly for all users
- Automatic subscription to new posts

✅ **Engagement Features:**
- Like/Unlike posts
- Reply to posts
- View reply threads

✅ **Privacy:**
- Post anonymously option
- User identity protected when enabled

✅ **Accessible Design:**
- Calming color palette (primary, sage, calm blues)
- Smooth animations with Framer Motion
- Responsive layout for all devices

## Setup Instructions

### 1. Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Set Up Database Tables
Go to your Supabase project dashboard → SQL Editor and run the following SQL:

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0
);

-- Create replies table
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  is_anonymous BOOLEAN DEFAULT false
);

-- Create post_likes table
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  UNIQUE(post_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for posts
CREATE POLICY "Anyone can view posts" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = author_id);

-- Create policies for replies
CREATE POLICY "Anyone can view replies" 
  ON replies FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create replies" 
  ON replies FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policies for likes
CREATE POLICY "Anyone can view likes" 
  ON post_likes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can like posts" 
  ON post_likes FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can unlike posts" 
  ON post_likes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_replies_post_id ON replies(post_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

### 3. Get Your Supabase Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (under Project API keys)

### 4. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Start the Development Server
```bash
npm run dev
```

### 6. Access the Forums
Navigate to `http://localhost:5173/forums` in your browser.

## Testing Without Supabase

The Forums component includes mock data, so you can test the UI without setting up Supabase:

1. The page will display 3 sample posts
2. UI interactions (like, reply) will work locally
3. Data won't persist or sync across users

When you're ready to add real-time features, just follow the setup steps above!

## Usage

### Creating a Post
1. Click "New Post" button
2. Select a category
3. Enter title and content
4. Toggle "Post Anonymously" if desired
5. Click "Post to Forum"

### Interacting with Posts
- **Like**: Click the heart icon
- **Reply**: Click "Reply" button, type your response, and click "Post Reply"
- **View Replies**: Click the reply count to expand/collapse replies

### Filtering by Category
Click any category in the sidebar to filter posts, or click "All Topics" to see everything.

## Customization

### Adding New Categories
Edit `CATEGORIES` array in [src/pages/Forums.jsx](src/pages/Forums.jsx):

```javascript
const CATEGORIES = [
  {
    id: 'your-category-id',
    name: 'Your Category Name',
    description: 'Description here',
    icon: YourIcon, // from lucide-react
    color: 'bg-color-100 text-color-700'
  },
  // ... existing categories
]
```

### Changing Colors
The Forums page uses your existing Tailwind theme:
- Primary colors for buttons and highlights
- Sage colors for wellness elements
- Calm blues for calming elements

Update these in [tailwind.config.js](tailwind.config.js) if needed.

## Troubleshooting

### Posts not appearing
- Check browser console for errors
- Verify Supabase credentials in `.env`
- Confirm database tables were created correctly

### Real-time updates not working
- Ensure Row Level Security policies are set correctly
- Check if real-time is enabled in Supabase dashboard:
  - Go to Database → Replication
  - Enable replication for `posts` table

### Authentication issues
- The component works with or without authentication
- For full features (like/reply), users should be logged in
- Anonymous posting works regardless of auth state

## Next Steps

Consider adding:
- [ ] Moderation tools for admins
- [ ] Report/flag inappropriate content
- [ ] Search functionality
- [ ] Pinned/featured posts
- [ ] User profiles with post history
- [ ] Email notifications for replies
- [ ] Rich text editor for posts
- [ ] Image/file attachments

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all setup steps were completed
3. Review Supabase dashboard for database issues
4. Check that environment variables are loaded correctly

---

**Built with:** React, Supabase, Tailwind CSS, Framer Motion, Lucide React
