import { Briefcase, Code, Globe, Heart, Rocket, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the SkyAuthor Labs team - We are always looking for talented writers, developers, and creators.',
};

export default function CareersPage() {
  const benefits = [
    { icon: Globe, title: 'Remote First', description: 'Work from anywhere in the world' },
    { icon: Rocket, title: 'Growth', description: 'Learn and grow with industry experts' },
    { icon: Heart, title: 'Flexibility', description: 'Flexible hours that work for you' },
    { icon: Users, title: 'Community', description: 'Be part of a passionate team' },
  ];

  const openPositions = [
    {
      title: 'Freelance Tech Writer',
      type: 'Contract',
      location: 'Remote',
      description: 'Write engaging articles about technology, AI, programming, and startups.',
    },
    {
      title: 'Content Editor',
      type: 'Part-time',
      location: 'Remote',
      description: 'Review and edit articles for quality, accuracy, and SEO optimization.',
    },
    {
      title: 'Full-Stack Developer',
      type: 'Contract',
      location: 'Remote',
      description: 'Help build and improve our publishing platform using Next.js and Supabase.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full px-4 py-2 mb-6">
            <Briefcase className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">Join Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Build the Future of <span className="gradient-text">Tech Media</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
            We&apos;re looking for passionate individuals who want to shape how people discover and consume tech content.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Work With Us?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="font-bold mb-1">{benefit.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <div
                key={position.title}
                className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{position.title}</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-2">{position.description}</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded">
                        {position.type}
                      </span>
                      <span className="text-xs bg-[var(--background-tertiary)] px-2 py-1 rounded">
                        {position.location}
                      </span>
                    </div>
                  </div>
                  <Link href="/contact" className="btn-primary whitespace-nowrap">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application */}
      <section className="py-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Code className="w-12 h-12 text-[var(--primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Don&apos;t See Your Role?</h2>
          <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
            We&apos;re always interested in meeting talented people. Send us your portfolio and let us know how you&apos;d like to contribute.
          </p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Send General Application
          </Link>
        </div>
      </section>
    </div>
  );
}
