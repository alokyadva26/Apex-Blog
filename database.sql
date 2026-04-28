-- Run this in your Supabase SQL Editor

-- 0. Drop existing tables/types to ensure a clean slate (optional but helps avoid "already exists" errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 1. Create custom enum for roles
CREATE TYPE user_role AS ENUM ('Viewer', 'Author', 'Admin');

-- 2. Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  role user_role DEFAULT 'Viewer'::user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create posts table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  summary TEXT,
  domain TEXT NOT NULL DEFAULT 'Uncategorized',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.5. Create likes table
CREATE TABLE public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 4.6. Create saved_posts table
CREATE TABLE public.saved_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- 4.7. Create follows table
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  followed_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(follower_id, followed_id)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies

-- Users: Anyone can read users
CREATE POLICY "Users are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- Posts: Anyone can read posts
CREATE POLICY "Posts are viewable by everyone." ON public.posts FOR SELECT USING (true);
-- Posts: Only Authors and Admins can insert
CREATE POLICY "Authors and Admins can insert posts." ON public.posts FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND (users.role = 'Author' OR users.role = 'Admin')
  )
);
-- Posts: Authors can update their own posts, Admins can update any
CREATE POLICY "Authors can update own posts, Admins any." ON public.posts FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND (users.role = 'Admin' OR (users.role = 'Author' AND auth.uid() = posts.author_id))
  )
);
-- Posts: Delete (optional but good)
CREATE POLICY "Authors can delete own posts, Admins any." ON public.posts FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND (users.role = 'Admin' OR (users.role = 'Author' AND auth.uid() = posts.author_id))
  )
);

-- Comments: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
-- Comments: Any authenticated user can insert
CREATE POLICY "Authenticated users can insert comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Comments: Users can update their own
CREATE POLICY "Users can update own comments." ON public.comments FOR UPDATE USING (auth.uid() = user_id);
-- Comments: Admins can delete any, users their own
CREATE POLICY "Users can delete own comments, Admins any." ON public.comments FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND (users.role = 'Admin' OR auth.uid() = comments.user_id)
  )
);

-- Likes: Anyone can read likes
CREATE POLICY "Likes are viewable by everyone." ON public.likes FOR SELECT USING (true);
-- Likes: Any authenticated user can insert
CREATE POLICY "Authenticated users can insert likes." ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Likes: Users can delete their own
CREATE POLICY "Users can delete own likes." ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Saved Posts: Users can read their own
CREATE POLICY "Users can view own saved posts." ON public.saved_posts FOR SELECT USING (auth.uid() = user_id);
-- Saved Posts: Users can insert their own
CREATE POLICY "Users can insert own saved posts." ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Saved Posts: Users can delete their own
CREATE POLICY "Users can delete own saved posts." ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);

-- Follows: Anyone can read follows
CREATE POLICY "Follows are viewable by everyone." ON public.follows FOR SELECT USING (true);
-- Follows: Users can insert their own follows
CREATE POLICY "Users can insert own follows." ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
-- Follows: Users can delete their own follows
CREATE POLICY "Users can delete own follows." ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 7. Trigger to automatically create a user profile when signing up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, split_part(new.email, '@', 1), 'Viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
