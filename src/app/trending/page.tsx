import ArticleCard from '@/components/ArticleCard';
import { supabase } from '@/lib/supabase';
import { Clock, Flame, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trending Articles',
  description: 'Discover the most popular and trending articles on SkyAuthor Labs',
};

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function TrendingPage() {
  // Fetch trending articles by view count
  const { data: trending } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('view_count', { ascending: false })
    .limit(12);

  // Fetch this week's top articles
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const { data: thisWeek } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .gte('created_at', oneWeekAgo.toISOString())
    .order('view_count', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-pink)]/10 border border-[var(--accent-pink)]/20 mb-4">
          <Flame className="w-4 h-4 text-[var(--accent-pink)]" />
          <span className="text-sm font-medium text-[var(--accent-pink)]">Hot Right Now</span>
        </div>
        <h1 className="text-4xl font-black mb-4">Trending Articles</h1>
        <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
          Discover what the SkyAuthor Labs community is reading and sharing
        </p>
      </header>

      {/* This Week's Top */}
      {thisWeek && thisWeek.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">This Week&apos;s Top</h2>
              <p className="text-sm text-[var(--foreground-muted)]">Most read in the last 7 days</p>
            </div>
          </div>

          <div className="space-y-4">
            {thisWeek.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group flex items-center gap-6 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl card-hover"
              >
                <span className="text-5xl font-black text-[var(--primary)]/20 group-hover:text-[var(--primary)] transition-colors w-16 text-center">
                  {index + 1}
                </span>
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-[var(--accent-cyan)]">{article.category}</span>
                  <h3 className="text-lg font-bold mt-1 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--foreground-muted)]">
                    <span>{article.view_count || 0} views</span>
                    <span>•</span>
                    <span>{article.reading_time || 5} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Trending */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-pink)] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">All Time Popular</h2>
            <p className="text-sm text-[var(--foreground-muted)]">Our most read articles ever</p>
          </div>
        </div>

        {trending && trending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
            <TrendingUp className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No trending articles yet</h3>
            <p className="text-[var(--foreground-muted)]">
              Check back soon as our content gains traction!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
