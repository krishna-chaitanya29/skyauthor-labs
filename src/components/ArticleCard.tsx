import { formatDate, formatNumber } from '@/lib/utils';
import type { Article } from '@/types';
import { Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'compact') {
    return (
      <Link 
        href={`/article/${article.slug}`} 
        className="group flex gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl card-hover"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image 
            src={article.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'} 
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-[var(--accent-cyan)]">{article.category}</span>
          <h3 className="font-bold mt-1 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            {article.reading_time || 5} min read
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/article/${article.slug}`} 
      className="group block overflow-hidden rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] card-hover"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={article.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'} 
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="badge badge-primary">{article.category}</span>
        </div>
        {/* Featured Badge */}
        {article.is_featured && (
          <div className="absolute top-4 right-4">
            <span className="badge badge-cyan">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-4">
          {article.excerpt || article.meta_description || "Discover the latest insights from SkyAuthor Labs..."}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.reading_time || 5} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(article.view_count || 0)}
            </span>
          </div>
          <span>{formatDate(article.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}