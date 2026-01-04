'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { calculateReadingTime, extractExcerpt, generateSlug } from '@/lib/utils';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Loader2,
    Save,
    Send,
    Trash2,
    X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const RichEditor = dynamic(() => import('@/components/RichEditor'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-[var(--background-secondary)] rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-[var(--foreground-muted)]">Loading Editor...</span>
    </div>
  )
});

const categories = [
  { value: 'Tech', label: 'Technology' },
  { value: 'Money', label: 'Finance & Money' },
  { value: 'News', label: 'Breaking News' },
  { value: 'AI', label: 'Artificial Intelligence' },
  { value: 'Startup', label: 'Startups & Business' },
  { value: 'Tutorial', label: 'Tutorials & Guides' },
];

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Article state
  const [articleId, setArticleId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(['']);
  const [isPublished, setIsPublished] = useState(false);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      setError('Article not found');
      setLoading(false);
      return;
    }

    setArticleId(data.id);
    setTitle(data.title);
    setContent(data.content || '');
    setCategory(data.category || 'Tech');
    setExcerpt(data.excerpt || '');
    setImageUrl(data.image_url || '');
    setMetaDescription(data.meta_description || '');
    setKeywords(data.keywords || []);
    setKeyTakeaways(data.key_takeaways?.length ? data.key_takeaways : ['']);
    setIsPublished(data.is_published);
    setLoading(false);
  };

  const handleSave = async (publish = false) => {
    if (!title) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    const newSlug = generateSlug(title);
    const readingTime = calculateReadingTime(content);

    const { error: updateError } = await supabase
      .from('articles')
      .update({
        title,
        slug: newSlug,
        content,
        excerpt: excerpt || extractExcerpt(content),
        category,
        image_url: imageUrl,
        meta_description: metaDescription || extractExcerpt(content),
        keywords,
        key_takeaways: keyTakeaways.filter(t => t.trim()),
        reading_time: readingTime,
        is_published: publish ? true : isPublished,
        updated_at: new Date().toISOString(),
        ...(publish && !isPublished ? { published_at: new Date().toISOString() } : {}),
      })
      .eq('id', articleId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(publish ? 'Published!' : 'Saved!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Redirect if slug changed
      if (newSlug !== slug) {
        router.push(`/admin/edit/${newSlug}`);
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (!error) {
      router.push('/admin/articles');
    } else {
      setError('Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
          <Link href="/admin/articles" className="text-[var(--primary)] hover:underline">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/articles" 
                className="p-2 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-bold">Edit Article</h1>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isPublished ? '🟢 Published' : '🟡 Draft'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {success && (
                <span className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </span>
              )}
              
              <button
                onClick={handleDelete}
                className="btn-secondary text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="btn-secondary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              
              {!isPublished && (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <input 
              type="text" 
              placeholder="Article title..." 
              className="w-full text-2xl font-bold bg-transparent border-none outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <RichEditor content={content} onChange={setContent} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4">
              <label className="block text-sm font-medium mb-3">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4">
              <label className="block text-sm font-medium mb-3">Excerpt</label>
              <textarea
                placeholder="Brief summary..."
                className="input resize-none h-24"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={200}
              />
            </div>

            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4">
              <label className="block text-sm font-medium mb-3">Meta Description</label>
              <textarea
                placeholder="SEO description..."
                className="input resize-none h-24"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160}
              />
            </div>

            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4">
              <label className="block text-sm font-medium mb-3">
                View Article
              </label>
              <Link
                href={`/article/${slug}`}
                target="_blank"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                Open in New Tab →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
