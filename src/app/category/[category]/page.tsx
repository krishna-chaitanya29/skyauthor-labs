import ArticleCard from '@/components/ArticleCard';
import { categories } from '@/lib/categories';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Build category info from shared config
const categoryInfo: Record<string, { title: string; description: string; color: string }> = {};
categories.forEach(cat => {
  categoryInfo[cat.value.toLowerCase()] = {
    title: cat.label,
    description: `Explore ${cat.label} articles - latest news, insights, and guides`,
    color: cat.color,
  };
});

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const info = categoryInfo[category.toLowerCase()];
  
  if (!info) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${info.title} Articles`,
    description: info.description,
    openGraph: {
      title: `${info.title} | SkyAuthor Labs`,
      description: info.description,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(categoryInfo).map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const info = categoryInfo[category.toLowerCase()];
  
  if (!info) notFound();

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .ilike('category', category)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12">
        <div className={`inline-block ${info.color} text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4`}>
          {info.title}
        </div>
        <h1 className="text-4xl font-black mb-4">{info.title}</h1>
        <p className="text-lg text-[var(--foreground-muted)]">{info.description}</p>
      </header>

      {/* Articles Grid */}
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
          <h3 className="text-xl font-bold mb-2">No articles yet</h3>
          <p className="text-[var(--foreground-muted)]">
            Check back soon for {info.title.toLowerCase()} content!
          </p>
        </div>
      )}
    </div>
  );
}
