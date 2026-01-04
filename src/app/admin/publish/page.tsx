"use client";
import ImageUpload from '@/components/ImageUpload';
import SEOOptimizer from '@/components/SEOOptimizer';
import { notifyPublish } from '@/lib/google-indexing';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { calculateReadingTime, extractExcerpt, generateSlug } from '@/lib/utils';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Eye,
    FileText,
    Image as ImageIcon,
    Loader2,
    Plus,
    Save, Send,
    Sparkles,
    Tag,
    X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useState } from 'react';

// Dynamic import for the rich editor (client-side only)
const RichEditor = dynamic(() => import('@/components/RichEditor'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-[var(--background-secondary)] rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-[var(--foreground-muted)]">Loading SkyAuthor Editor...</span>
    </div>
  )
});

// Import categories from shared config
import { categories } from '@/lib/categories';

export default function PublishPage() {
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(['']);
  const [newKeyword, setNewKeyword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-generate excerpt and meta from content
  const autoGenerate = useCallback(() => {
    if (content) {
      const autoExcerpt = extractExcerpt(content, 160);
      setExcerpt(autoExcerpt);
      setMetaDescription(autoExcerpt);
    }
  }, [content]);

  // Add keyword
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  // Remove keyword
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  // Add key takeaway
  const addTakeaway = () => {
    setKeyTakeaways([...keyTakeaways, '']);
  };

  // Update key takeaway
  const updateTakeaway = (index: number, value: string) => {
    const updated = [...keyTakeaways];
    updated[index] = value;
    setKeyTakeaways(updated);
  };

  // Remove key takeaway
  const removeTakeaway = (index: number) => {
    setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!title) {
      setErrorMessage('Please add a title first');
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    const supabase = createBrowserSupabaseClient();
    
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);
    
    const { error } = await supabase.from('articles').upsert([{
      title,
      slug,
      content,
      excerpt: excerpt || extractExcerpt(content),
      category,
      image_url: imageUrl,
      meta_description: metaDescription,
      keywords,
      key_takeaways: keyTakeaways.filter(t => t.trim()),
      reading_time: readingTime,
      is_published: false,
      updated_at: new Date().toISOString(),
    }], { onConflict: 'slug' });

    if (error) {
      setSaveStatus('error');
      setErrorMessage(error.message);
    } else {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Publish article
  const handlePublish = async () => {
    if (!title || !content) {
      setErrorMessage('Please fill in both title and content.');
      setSaveStatus('error');
      return;
    }

    if (keyTakeaways.filter(t => t.trim()).length === 0) {
      setErrorMessage('Add at least one key takeaway for SEO optimization.');
      setSaveStatus('error');
      return;
    }

    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    
    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);

    const { error } = await supabase.from('articles').insert([{
      title,
      slug,
      content,
      excerpt: excerpt || extractExcerpt(content),
      category,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      meta_description: metaDescription || extractExcerpt(content),
      keywords,
      key_takeaways: keyTakeaways.filter(t => t.trim()),
      reading_time: readingTime,
      is_published: true,
      is_featured: false,
      view_count: 0,
      published_at: new Date().toISOString(),
    }]);

    if (error) {
      setErrorMessage(error.message);
      setSaveStatus('error');
    } else {
      // Ping search engines for indexing
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const articleUrl = `${siteUrl}/article/${slug}`;
      notifyPublish(articleUrl).catch(console.error);
      
      window.location.href = `/article/${slug}`;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top Bar */}
      <div className="sticky top-16 z-40 bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="p-2 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-bold">Create Article</h1>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {calculateReadingTime(content)} min read • {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Save Status */}
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  Error
                </span>
              )}

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary flex items-center gap-2 text-sm py-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={handleSaveDraft}
                className="btn-secondary flex items-center gap-2 text-sm py-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              
              <button
                onClick={handlePublish}
                disabled={loading}
                className="btn-primary flex items-center gap-2 text-sm py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
            <button onClick={() => setErrorMessage('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <input 
              type="text" 
              placeholder="Write a compelling headline..." 
              className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-[var(--foreground-muted)]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Featured Image */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <ImageIcon className="w-4 h-4" />
                Featured Image
              </label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
              <p className="text-xs text-[var(--foreground-muted)] mt-2">
                Drag & drop or click to upload to Cloudinary
              </p>
            </div>

            {/* Rich Text Editor */}
            <RichEditor content={content} onChange={setContent} />

            {/* Key Takeaways (for AI/SEO) */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <label className="flex items-center gap-2 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
                Key Takeaways (AI Search Optimization)
              </label>
              <p className="text-xs text-[var(--foreground-muted)] mb-4">
                Add 3-5 key points. AI search engines use these to feature your content.
              </p>
              <div className="space-y-3">
                {keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[var(--accent-green)] font-bold">✓</span>
                    <input
                      type="text"
                      placeholder={`Key point ${index + 1}...`}
                      className="input flex-1"
                      value={takeaway}
                      onChange={(e) => updateTakeaway(index, e.target.value)}
                    />
                    {keyTakeaways.length > 1 && (
                      <button
                        onClick={() => removeTakeaway(index)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addTakeaway}
                  className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Add another key point
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <label className="block text-sm font-medium mb-3">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`p-3 rounded-lg text-left text-sm font-medium transition-all ${
                      category === cat.value
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background-tertiary)] hover:bg-[var(--background)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  SEO Settings
                </label>
                <button
                  onClick={autoGenerate}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  Auto-generate
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-1">
                    Excerpt
                  </label>
                  <textarea
                    placeholder="Brief summary for article cards..."
                    className="input resize-none h-20"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    maxLength={200}
                  />
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    {excerpt.length}/200
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    placeholder="SEO description for search engines..."
                    className="input resize-none h-20"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    maxLength={160}
                  />
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    {metaDescription.length}/160
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Tag className="w-4 h-4" />
                Keywords / Tags
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {keywords.map((keyword) => (
                  <span 
                    key={keyword}
                    className="badge badge-primary flex items-center gap-1"
                  >
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add keyword..."
                  className="input flex-1"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <button onClick={addKeyword} className="btn-secondary px-3">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI SEO Optimizer */}
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
              <label className="flex items-center gap-2 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI SEO Optimizer
              </label>
              <SEOOptimizer
                title={title}
                content={content}
                category={category}
                onOptimize={(data) => {
                  setMetaDescription(data.metaDescription);
                  setKeywords(data.keywords);
                  setKeyTakeaways(data.keyTakeaways.length > 0 ? data.keyTakeaways : keyTakeaways);
                  if (data.optimizedTitle && data.optimizedTitle !== title) {
                    // Optional: show suggestion but don't auto-replace title
                    console.log('Suggested title:', data.optimizedTitle);
                  }
                }}
              />
            </div>

            {/* Publishing Tips */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-[var(--primary)]/20 rounded-xl p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
                Pro Tips
              </h3>
              <ul className="text-sm text-[var(--foreground-muted)] space-y-2">
                <li>• Add 3-5 key takeaways for AI search visibility</li>
                <li>• Include at least one image and video</li>
                <li>• Use H2 headings every 300 words</li>
                <li>• Keep meta description under 160 chars</li>
                <li>• Add 5-8 relevant keywords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--background)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-4 flex items-center justify-between">
              <h2 className="font-bold">Preview</h2>
              <button onClick={() => setShowPreview(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <article className="p-8">
              {imageUrl && (
                <img src={imageUrl} alt={title} className="w-full h-64 object-cover rounded-xl mb-6" />
              )}
              <span className="badge badge-primary mb-4">{category}</span>
              <h1 className="text-3xl font-black mb-4">{title || 'Untitled Article'}</h1>
              <p className="text-[var(--foreground-muted)] mb-6">
                {calculateReadingTime(content)} min read • {new Date().toLocaleDateString()}
              </p>
              {keyTakeaways.filter(t => t.trim()).length > 0 && (
                <div className="key-takeaways mb-8">
                  <h3>🔑 Key Takeaways</h3>
                  <ul>
                    {keyTakeaways.filter(t => t.trim()).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div 
                className="prose-sky"
                dangerouslySetInnerHTML={{ __html: content || '<p>Start writing to see preview...</p>' }} 
              />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}