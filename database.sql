-- Run this in your Supabase SQL Editor

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

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

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
