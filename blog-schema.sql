-- Blog System Tables
-- Run this in Supabase SQL Editor

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Comments Table
CREATE TABLE blog_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
CREATE POLICY "Published posts viewable by everyone" ON blog_posts FOR SELECT USING (status = 'published' OR author_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can create posts" ON blog_posts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update posts" ON blog_posts FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete posts" ON blog_posts FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Blog Comments Policies
CREATE POLICY "Comments viewable by everyone" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON blog_comments FOR DELETE USING (auth.uid() = user_id);

-- Function to update views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
