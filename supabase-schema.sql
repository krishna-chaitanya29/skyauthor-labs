-- SkyAuthor Labs Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  key_takeaways TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Tech',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT DEFAULT 'SkyAuthor Labs',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Categories Table (optional, for dynamic categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(view_count DESC);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET view_count = view_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full-text search function
CREATE OR REPLACE FUNCTION search_articles(query_text TEXT)
RETURNS SETOF articles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM articles
  WHERE is_published = true
    AND (
      title ILIKE '%' || query_text || '%'
      OR content ILIKE '%' || query_text || '%'
      OR category ILIKE '%' || query_text || '%'
      OR query_text = ANY(keywords)
      OR query_text = ANY(tags)
    )
  ORDER BY view_count DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate slug from title (trigger)
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_slug
  BEFORE INSERT ON articles
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can insert articles
CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can update their own articles
CREATE POLICY "Users can update own articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR author_id IS NULL);

-- Policy: Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Technology', 'tech', 'Latest tech news and reviews', '#3b82f6'),
  ('Finance & Money', 'money', 'Financial insights and strategies', '#22c55e'),
  ('Breaking News', 'news', 'Latest headlines and updates', '#ef4444'),
  ('Artificial Intelligence', 'ai', 'AI trends and breakthroughs', '#a855f7'),
  ('Startups & Business', 'startup', 'Entrepreneurship insights', '#f97316'),
  ('Tutorials & Guides', 'tutorial', 'Step-by-step guides', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;
