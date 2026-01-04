import ArticleCard from '@/components/ArticleCard';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

// Revalidate every hour for fresh content
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  // Fetch featured/trending articles
  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('view_count', { ascending: false })
    .limit(3);

  const featuredArticle = featured?.[0];
  const trendingArticles = featured?.slice(1, 4) || [];
  const latestArticles = articles?.slice(0, 9) || [];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] mb-6">
              <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span className="text-sm font-medium">Your Source for Tech Excellence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="gradient-text">Premium Insights</span>
              <br />
              for the Digital Age
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Cutting-edge technology coverage, in-depth analysis, and viral news 
              that shapes the future. Built for developers, founders, and innovators.
            </p>
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <Link 
              href={`/article/${featuredArticle.slug}`}
              className="block group relative overflow-hidden rounded-3xl bg-[var(--background-secondary)] border border-[var(--border)] card-hover"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={featuredArticle.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-primary">Featured</span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                  <span className="badge badge-cyan w-fit mb-4">{featuredArticle.category}</span>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-[var(--primary)] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-[var(--foreground-muted)] mb-6 line-clamp-3">
                    {featuredArticle.excerpt || featuredArticle.meta_description || 'Click to read the latest from SkyAuthor Labs...'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                    <span>{featuredArticle.reading_time || 5} min read</span>
                    <span>•</span>
                    <span>{featuredArticle.view_count || 0} views</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Ad Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[var(--background-secondary)] border border-dashed border-[var(--border)] rounded-xl p-4 text-center">
          <span className="text-xs text-[var(--foreground-muted)]">Advertisement</span>
          <div className="h-16 flex items-center justify-center">
            <span className="text-[var(--foreground-muted)]">Top Leaderboard Ad (728x90)</span>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {trendingArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-pink)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Trending Now</h2>
                <p className="text-sm text-[var(--foreground-muted)]">Most read this week</p>
              </div>
            </div>
            <Link 
              href="/trending" 
              className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group flex gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl card-hover"
              >
                <span className="text-4xl font-black text-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <span className="text-xs font-medium text-[var(--accent-cyan)]">{article.category}</span>
                  <h3 className="font-bold mt-1 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-2">
                    {article.view_count || 0} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Latest Stories</h2>
              <p className="text-sm text-[var(--foreground-muted)]">Fresh from the lab</p>
            </div>
          </div>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No articles yet</h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              Be the first to publish an article on SkyAuthor Labs!
            </p>
            <Link href="/admin/publish" className="btn-primary">
              Create Your First Article
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Never Miss an Insight
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join 2,000+ developers and tech enthusiasts. Get the best articles delivered weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder:text-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button type="submit" className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[var(--background-secondary)] border border-dashed border-[var(--border)] rounded-xl p-4 text-center">
          <span className="text-xs text-[var(--foreground-muted)]">Advertisement</span>
          <div className="h-24 flex items-center justify-center">
            <span className="text-[var(--foreground-muted)]">Bottom Banner Ad (728x90)</span>
          </div>
        </div>
      </section>
    </main>
  );
}