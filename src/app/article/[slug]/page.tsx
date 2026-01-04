import { supabase } from '@/lib/supabase';
import { injectAdsInContent } from '@/lib/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';

// Revalidate every 60 seconds to pick up deletions/updates faster
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  if (!post) {
    return { 
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords?.join(', '),
    authors: [{ name: post.author_name || 'SkyAuthor Labs' }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.meta_description || post.excerpt,
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      section: post.category,
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description || post.excerpt,
      images: [post.image_url],
    },
    alternates: {
      canonical: `/article/${slug}`,
    },
  };
}

// Static generation for published articles
export async function generateStaticParams() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug')
    .eq('is_published', true);

  return articles?.map((article) => ({ slug: article.slug })) || [];
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch article data - only published articles
  const { data: post } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  // Return 404 if article doesn't exist OR is unpublished/deleted
  if (!post) notFound();

  // Increment view count (non-blocking)
  supabase.rpc('increment_view_count', { article_slug: slug }).then(() => {});

  // Inject ads at paragraphs 3, 7, 12
  const adCode = `
    <div class="ad-injection">
      <span class="text-xs text-[var(--foreground-muted)]">Advertisement</span>
      <div class="h-24 flex items-center justify-center border border-dashed border-[var(--border)] rounded-lg mt-2">
        <span class="text-[var(--foreground-muted)]">Ad Placement (In-Article)</span>
      </div>
    </div>
  `;
  const contentWithAds = injectAdsInContent(post.content, adCode, [3, 7, 12]);

  // JSON-LD Structured Data for AI Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.image_url,
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": {
      "@type": "Person",
      "name": post.author_name || "SkyAuthor Labs",
    },
    "publisher": {
      "@type": "Organization",
      "name": "SkyAuthor Labs",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/article/${slug}`,
    },
    "keywords": post.keywords?.join(', '),
    "articleSection": post.category,
    "wordCount": post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0,
  };

  return (
    <>
      {/* JSON-LD for AI/Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleContent 
        post={{
          ...post,
          content: contentWithAds,
        }}
      />
    </>
  );
}