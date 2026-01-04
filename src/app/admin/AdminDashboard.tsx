'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';
import {
    BarChart3,
    Eye,
    FileText,
    LogOut,
    PenSquare,
    Plus,
    Settings,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AdminDashboardProps {
  user: User;
}

interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  thisMonthViews: number;
  subscribers: number;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalViews: 0,
    thisMonthViews: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch published articles count and total views
      const { data: articles } = await supabase
        .from('articles')
        .select('view_count, created_at')
        .eq('is_published', true);

      const totalArticles = articles?.length || 0;
      const totalViews = articles?.reduce((sum, a) => sum + (a.view_count || 0), 0) || 0;

      // Calculate this month's articles views (articles created this month)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthViews = articles
        ?.filter(a => new Date(a.created_at) >= thisMonth)
        .reduce((sum, a) => sum + (a.view_count || 0), 0) || 0;

      // Fetch subscribers count
      const { count: subscribersCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalArticles,
        totalViews,
        thisMonthViews,
        subscribers: subscribersCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const statsDisplay = [
    { label: 'Total Articles', value: loading ? '...' : stats.totalArticles.toString(), icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Views', value: loading ? '...' : formatNumber(stats.totalViews), icon: Eye, color: 'bg-green-500' },
    { label: 'This Month', value: loading ? '...' : '+' + formatNumber(stats.thisMonthViews), icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Subscribers', value: loading ? '...' : formatNumber(stats.subscribers), icon: Users, color: 'bg-pink-500' },
  ];

  const quickActions = [
    { label: 'New Article', href: '/admin/publish', icon: Plus, primary: true },
    { label: 'All Articles', href: '/admin/articles', icon: FileText },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Admin Header */}
      <div className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Welcome back, {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--foreground-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsDisplay.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                  action.primary
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white hover:opacity-90'
                    : 'bg-[var(--background-secondary)] border-[var(--border)] card-hover'
                }`}
              >
                <action.icon className="w-6 h-6" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Create Article CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-[var(--primary)]/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
            <PenSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ready to Create?</h2>
          <p className="text-[var(--foreground-muted)] mb-6 max-w-md mx-auto">
            Write your next viral article with our powerful editor featuring images, 
            videos, code blocks, and more.
          </p>
          <Link href="/admin/publish" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Article
          </Link>
        </div>
      </div>
    </div>
  );
}
