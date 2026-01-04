'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import {
    ArrowDown,
    ArrowUp,
    BarChart3,
    Eye,
    FileText,
    Loader2,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  totalSubscribers: number;
  topArticles: Array<{
    id: string;
    title: string;
    slug: string;
    view_count: number;
    category: string;
  }>;
  recentArticles: Array<{
    id: string;
    title: string;
    slug: string;
    created_at: string;
    is_published: boolean;
  }>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createBrowserSupabaseClient();

    // Fetch all stats in parallel
    const [articlesRes, subscribersRes, topRes, recentRes] = await Promise.all([
      supabase.from('articles').select('id, is_published, view_count'),
      supabase.from('subscribers').select('id', { count: 'exact' }),
      supabase
        .from('articles')
        .select('id, title, slug, view_count, category')
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(5),
      supabase
        .from('articles')
        .select('id, title, slug, created_at, is_published')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const articles = articlesRes.data || [];
    const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0);

    setStats({
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.is_published).length,
      totalViews,
      totalSubscribers: subscribersRes.count || 0,
      topArticles: topRes.data || [],
      recentArticles: recentRes.data || [],
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Articles',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      positive: true,
    },
    {
      label: 'Published',
      value: stats?.publishedArticles || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%',
      positive: true,
    },
    {
      label: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+24%',
      positive: true,
    },
    {
      label: 'Subscribers',
      value: stats?.totalSubscribers || 0,
      icon: Users,
      color: 'bg-pink-500',
      change: '+5%',
      positive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Track your content performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Articles */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Top Performing Articles</h2>
            {stats?.topArticles && stats.topArticles.length > 0 ? (
              <div className="space-y-4">
                {stats.topArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex items-center gap-4 p-3 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
                  >
                    <span className="text-2xl font-bold text-[var(--primary)]/30 w-8">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{article.title}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{article.category}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                      <Eye className="w-4 h-4" />
                      {article.view_count || 0}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[var(--foreground-muted)] text-center py-8">
                No articles yet. <Link href="/admin/publish" className="text-[var(--primary)]">Create one!</Link>
              </p>
            )}
          </div>

          {/* Recent Articles */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Recent Articles</h2>
            {stats?.recentArticles && stats.recentArticles.length > 0 ? (
              <div className="space-y-4">
                {stats.recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex items-center justify-between p-3 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{article.title}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      article.is_published 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {article.is_published ? 'Published' : 'Draft'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[var(--foreground-muted)] text-center py-8">
                No articles yet.
              </p>
            )}
          </div>
        </div>

        {/* Note about GA4 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-[var(--primary)]/20 rounded-xl">
          <h3 className="font-bold mb-2">📊 Want More Detailed Analytics?</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Google Analytics 4 is integrated. Add your GA4 Measurement ID to <code className="bg-[var(--background)] px-2 py-1 rounded">.env.local</code> as <code className="bg-[var(--background)] px-2 py-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> to track detailed user behavior, traffic sources, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
