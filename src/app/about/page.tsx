import { Mail, MessageSquare, Send, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SkyAuthor Labs - your premier source for tech insights, AI news, and digital innovation.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'SkyAuthor Labs Team',
      role: 'Content & Technology',
      description: 'A passionate team of tech enthusiasts, writers, and developers dedicated to bringing you the latest in technology.',
    },
  ];

  const values = [
    {
      title: 'Quality Content',
      description: 'We believe in delivering well-researched, accurate, and engaging content that adds value to our readers.',
      icon: MessageSquare,
    },
    {
      title: 'Innovation First',
      description: 'We stay ahead of the curve, covering emerging technologies and trends before they go mainstream.',
      icon: Zap,
    },
    {
      title: 'Community Driven',
      description: 'Our readers are at the heart of everything we do. We listen, engage, and grow together.',
      icon: Send,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">About SkyAuthor Labs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Empowering the World with{' '}
            <span className="gradient-text">Tech Knowledge</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
            We&apos;re on a mission to make technology accessible, understandable, and exciting for everyone.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-invert max-w-none space-y-4 text-[var(--foreground-muted)]">
              <p>
                SkyAuthor Labs was founded with a simple yet powerful vision: to create a platform where technology meets storytelling. In an era of information overload, we saw the need for a curated space that delivers quality over quantity.
              </p>
              <p>
                What started as a passion project has grown into a thriving community of tech enthusiasts, developers, entrepreneurs, and curious minds. Every article we publish is crafted with care, backed by research, and designed to provide real value.
              </p>
              <p>
                We cover everything from artificial intelligence and web development to startups, cybersecurity, and emerging technologies. Our goal is to keep you informed, inspired, and ahead of the curve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-[var(--foreground-muted)]">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 text-center card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '100+', label: 'Articles Published' },
              { value: '50K+', label: 'Monthly Readers' },
              { value: '30+', label: 'Categories' },
              { value: '24/7', label: 'Fresh Content' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black gradient-text mb-2">{stat.value}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Connect?</h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Have questions, feedback, or collaboration ideas? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary inline-flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
            <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
              Explore Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
