import { BarChart3, Eye, Mail, Megaphone, Target, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise With Us',
  description: 'Reach thousands of tech-savvy readers by advertising on SkyAuthor Labs. Premium placements available.',
};

export default function AdvertisePage() {
  const adFormats = [
    {
      name: 'Banner Ads',
      description: 'High-visibility placements at the top of articles and homepage',
      icon: Megaphone,
    },
    {
      name: 'Sponsored Content',
      description: 'Native articles that blend seamlessly with our editorial content',
      icon: Target,
    },
    {
      name: 'Newsletter Sponsorship',
      description: 'Reach our engaged email subscribers directly',
      icon: Mail,
    },
  ];

  const stats = [
    { value: '50K+', label: 'Monthly Visitors', icon: Users },
    { value: '100K+', label: 'Page Views', icon: Eye },
    { value: '70%', label: 'Tech Professionals', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full px-4 py-2 mb-6">
            <Megaphone className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">Partner With Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Advertise on <span className="gradient-text">SkyAuthor Labs</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Connect with a highly engaged audience of tech enthusiasts, developers, and decision-makers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
                <p className="text-4xl font-black gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Advertising Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {adFormats.map((format) => (
              <div
                key={format.name}
                className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6 text-center card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <format.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{format.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{format.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
            Contact us to discuss advertising opportunities and get a custom quote for your campaign.
          </p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact for Rates
          </Link>
        </div>
      </section>
    </div>
  );
}
