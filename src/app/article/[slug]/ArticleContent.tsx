'use client';

import NewsletterPopup from '@/components/NewsletterPopup';
import { formatDate, formatNumber } from '@/lib/utils';
import type { Article } from '@/types';
import {
    BookmarkPlus,
    Calendar,
    ChevronUp,
    Clock, Eye,
    Facebook,
    Linkedin,
    Link as LinkIcon,
    Mail,
    Share2,
    Sparkles,
    Twitter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ArticleContentProps {
  post: Article;
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const articleRef = useRef<HTMLDivElement>(null);
  
  // Set share URL on client side
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Reading Progress Bar Logic
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const element = articleRef.current;
      const totalHeight = element.clientHeight - window.innerHeight;
      const windowScrollTop = window.scrollY - element.offsetTop;
      
      if (windowScrollTop < 0) {
        setReadingProgress(0);
      } else if (windowScrollTop > totalHeight) {
        setReadingProgress(100);
      } else {
        setReadingProgress((windowScrollTop / totalHeight) * 100);
      }

      // Show back to top button
      setShowBackToTop(window.scrollY > 500);

      // Show newsletter popup at 70% read (only once per session)
      if (readingProgress >= 70 && !hasShownPopup) {
        setShowNewsletterPopup(true);
        setHasShownPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [readingProgress, hasShownPopup]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareText = `Check out this article: ${post.title}`;

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}` },
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Email', icon: Mail, href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}` },
  ];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress" 
        style={{ width: `${readingProgress}%` }}
      />

      <article ref={articleRef} className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-primary">{post.category}</span>
            {post.is_featured && (
              <span className="badge badge-cyan">Featured</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time || 5} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatNumber(post.view_count || 0)} views
            </span>
          </div>

          {/* Share & Save Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="btn-secondary py-2 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-2 shadow-lg z-20 min-w-[160px]">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      <span className="text-sm">{link.name}</span>
                    </a>
                  ))}
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors w-full"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm">Copy Link</span>
                  </button>
                </div>
              )}
            </div>

            <button className="btn-secondary py-2 flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4" />
              Save
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {post.image_url && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Key Takeaways Box (AI Search Optimization) */}
        {post.key_takeaways && post.key_takeaways.length > 0 && (
          <div className="key-takeaways">
            <h3>
              <Sparkles className="w-4 h-4" />
              Key Takeaways
            </h3>
            <ul>
              {post.key_takeaways.map((takeaway: string, index: number) => (
                <li key={index}>{takeaway}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Ad Zone */}
        <div className="my-8 p-6 bg-[var(--background-secondary)] border border-dashed border-[var(--border)] rounded-xl text-center">
          <span className="text-xs text-[var(--foreground-muted)]">Advertisement</span>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[var(--foreground-muted)]">Top Banner Ad (728x90)</span>
          </div>
        </div>

        {/* Article Content */}
        <div 
          className="prose-sky"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Tags */}
        {post.keywords && post.keywords.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm bg-[var(--background-tertiary)] hover:bg-[var(--primary)] hover:text-white rounded-full transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-[var(--primary)]/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Enjoyed this insight?</h3>
          <p className="text-[var(--foreground-muted)] mb-6">
            Share it with your network to help others discover SkyAuthor Labs!
          </p>
          <div className="flex justify-center gap-3">
            {shareLinks.slice(0, 3).map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--background-secondary)] hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] transition-all"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Ad Zone */}
        <div className="mt-8 p-6 bg-[var(--background-secondary)] border border-dashed border-[var(--border)] rounded-xl text-center">
          <span className="text-xs text-[var(--foreground-muted)]">Advertisement</span>
          <div className="h-24 flex items-center justify-center">
            <span className="text-[var(--foreground-muted)]">Bottom Banner Ad (728x90)</span>
          </div>
        </div>
      </article>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[var(--primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Newsletter Popup (appears at 70% read) */}
      {showNewsletterPopup && (
        <NewsletterPopup onClose={() => setShowNewsletterPopup(false)} />
      )}
    </>
  );
}
