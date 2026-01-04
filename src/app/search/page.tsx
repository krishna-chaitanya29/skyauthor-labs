import ArticleCard from '@/components/ArticleCard';
import { supabase } from '@/lib/supabase';
import { Search, SearchX } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Articles',
  description: 'Search through SkyAuthor Labs articles',
};

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q: query } = await searchParams;

  let results: any[] = [];

  if (query) {
    // Try to use the search function, fallback to basic search
    const { data, error } = await supabase
      .rpc('search_articles', { search_query: query });
    
    if (error || !data) {
      // Fallback: basic search
      const { data: fallbackData } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
        .order('view_count', { ascending: false })
        .limit(20);
      
      results = fallbackData || [];
    } else {
      results = data;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <header className="mb-12">
        <div className="max-w-2xl mx-auto">
          <form action="/search" method="GET" className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
            <input
              type="text"
              name="q"
              defaultValue={query || ''}
              placeholder="Search articles, topics, keywords..."
              className="input pl-12 py-4 text-lg"
              autoFocus
            />
          </form>

          {query && (
            <p className="text-center text-[var(--foreground-muted)]">
              {results.length > 0 ? (
                <>Found <span className="text-[var(--foreground)] font-bold">{results.length}</span> results for &quot;<span className="text-[var(--primary)]">{query}</span>&quot;</>
              ) : (
                <>No results found for &quot;<span className="text-[var(--primary)]">{query}</span>&quot;</>
              )}
            </p>
          )}
        </div>
      </header>

      {/* Results */}
      {query ? (
        results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
            <SearchX className="w-16 h-16 text-[var(--foreground-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No matches found</h3>
            <p className="text-[var(--foreground-muted)] mb-6 max-w-md mx-auto">
              Try searching with different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Tech', 'AI', 'Money', 'News', 'Tutorial'].map((cat) => (
                <a
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="px-4 py-2 bg-[var(--background-tertiary)] hover:bg-[var(--primary)] hover:text-white rounded-full text-sm font-medium transition-colors"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
          <Search className="w-16 h-16 text-[var(--foreground-muted)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Start your search</h3>
          <p className="text-[var(--foreground-muted)]">
            Enter a keyword to find articles on SkyAuthor Labs
          </p>
        </div>
      )}
    </div>
  );
}