export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  key_takeaways: string[];
  category: string;
  tags: string[];
  image_url: string;
  meta_description: string;
  keywords: string[];
  author_id: string;
  author_name: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface AdPlacement {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'in-article' | 'footer';
  code: string;
  is_active: boolean;
}

export interface TrendingTopic {
  id: string;
  keyword: string;
  search_volume: number;
  region: string;
  fetched_at: string;
}
