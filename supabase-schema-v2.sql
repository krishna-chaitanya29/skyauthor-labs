-- =====================================================
-- SKYAUTHOR LABS - COMPLETE DATABASE SCHEMA (CORRECTED)
-- =====================================================
-- This schema matches the actual code in your application
-- Run this in Supabase SQL Editor: supabase.com → SQL Editor → New Query
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ARTICLES TABLE (matches code exactly)
-- =====================================================
DROP TABLE IF EXISTS articles CASCADE;

CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'Tech',
  
  -- Image field (code uses image_url)
  image_url TEXT,
  
  -- SEO fields
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  key_takeaways TEXT[] DEFAULT '{}',
  
  -- Author info (code uses author_name, not author_id reference)
  author_name TEXT DEFAULT 'SkyAuthor Labs',
  
  -- Status fields
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metrics
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 5,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- =====================================================
-- 2. NEWSLETTER SUBSCRIBERS TABLE (code uses newsletter_subscribers)
-- =====================================================
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- =====================================================
-- 3. CATEGORIES TABLE (optional - for dynamic categories)
-- =====================================================
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Technology', 'tech', 'Latest tech news and reviews', '#3b82f6'),
  ('Finance & Money', 'money', 'Financial insights and strategies', '#22c55e'),
  ('Breaking News', 'news', 'Latest headlines and updates', '#ef4444'),
  ('Artificial Intelligence', 'ai', 'AI trends and breakthroughs', '#a855f7'),
  ('Startups & Business', 'startup', 'Entrepreneurship insights', '#f97316'),
  ('Tutorials & Guides', 'tutorial', 'Step-by-step guides', '#06b6d4'),
  ('Programming', 'programming', 'Coding and development', '#8b5cf6'),
  ('Crypto & Web3', 'crypto', 'Blockchain and cryptocurrency', '#f59e0b'),
  ('Lifestyle', 'lifestyle', 'Life tips and wellness', '#ec4899'),
  ('Science', 'science', 'Scientific discoveries', '#14b8a6'),
  ('Gaming', 'gaming', 'Gaming news and reviews', '#6366f1'),
  ('Entertainment', 'entertainment', 'Movies, music, and pop culture', '#f43f5e')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Anyone can update articles" ON articles;
DROP POLICY IF EXISTS "Anyone can delete articles" ON articles;
DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can read categories" ON categories;

-- ARTICLES POLICIES
-- Anyone can read published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Authenticated users can insert articles
CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update articles
CREATE POLICY "Anyone can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete articles
CREATE POLICY "Anyone can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- NEWSLETTER POLICIES
-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- CATEGORIES POLICIES
-- Anyone can read categories
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

-- =====================================================
-- 6. FUNCTIONS (matching code exactly)
-- =====================================================

-- Function to increment view count by SLUG (this is what code uses!)
CREATE OR REPLACE FUNCTION increment_view_count(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1 
  WHERE slug = article_slug AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search articles
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
      OR excerpt ILIKE '%' || query_text || '%'
      OR category ILIKE '%' || query_text || '%'
      OR query_text = ANY(keywords)
    )
  ORDER BY view_count DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_timestamp ON articles;
CREATE TRIGGER trigger_update_timestamp
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- After running this:
-- 1. Go to Settings → API in Supabase
-- 2. Copy the anon (public) key → NEXT_PUBLIC_SUPABASE_ANON_KEY
-- 3. Copy the service_role key → SUPABASE_SERVICE_ROLE_KEY
-- 4. Make sure these are in .env.local AND Vercel environment variables
-- =====================================================
