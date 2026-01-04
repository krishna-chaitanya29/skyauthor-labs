import { categories } from '@/lib/categories';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Browse all article categories on SkyAuthor Labs - Tech, AI, Programming, Business, and more.',
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="py-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Explore <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)]">
            Discover content across {categories.length}+ topics
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.value}
                href={`/category/${category.value.toLowerCase()}`}
                className="group bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--primary)]/50 transition-all card-hover"
              >
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold">{category.value.charAt(0)}</span>
                </div>
                <h3 className="font-medium text-sm group-hover:text-[var(--primary)] transition-colors">
                  {category.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
