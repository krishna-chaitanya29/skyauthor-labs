'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { formatDate } from '@/lib/utils';
import {
  AlertCircle,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  image_url: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, category, is_published, view_count, created_at, image_url')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', deleteId);

    if (!error) {
      setArticles(articles.filter(a => a.id !== deleteId));
    }
    setDeleting(false);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('articles')
      .update({ is_published: !currentStatus })
      .eq('id', id);

    if (!error) {
      setArticles(articles.map(a => 
        a.id === id ? { ...a, is_published: !currentStatus } : a
      ));
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">All Articles</h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Manage your published and draft articles
              </p>
            </div>
            <Link href="/admin/publish" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 w-full max-w-md"
          />
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
            <AlertCircle className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">No articles found</h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first article to get started'}
            </p>
            <Link href="/admin/publish" className="btn-primary">
              Create Article
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 font-medium text-sm text-[var(--foreground-muted)]">Article</th>
                  <th className="text-left p-4 font-medium text-sm text-[var(--foreground-muted)] hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-medium text-sm text-[var(--foreground-muted)] hidden sm:table-cell">Status</th>
                  <th className="text-left p-4 font-medium text-sm text-[var(--foreground-muted)] hidden lg:table-cell">Views</th>
                  <th className="text-left p-4 font-medium text-sm text-[var(--foreground-muted)] hidden lg:table-cell">Date</th>
                  <th className="text-right p-4 font-medium text-sm text-[var(--foreground-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-tertiary)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {article.image_url && (
                          <img 
                            src={article.image_url} 
                            alt="" 
                            className="w-12 h-12 rounded-lg object-cover hidden sm:block"
                          />
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{article.title}</p>
                          <p className="text-xs text-[var(--foreground-muted)] md:hidden">{article.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="badge badge-primary">{article.category}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <button
                        onClick={() => togglePublish(article.id, article.is_published)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.is_published
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {article.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                        <Eye className="w-4 h-4" />
                        {article.view_count || 0}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-[var(--foreground-muted)]">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/article/${article.slug}`}
                          className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/edit/${article.slug}`}
                          className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteId(article.id);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Article?</h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              This action cannot be undone. The article will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
