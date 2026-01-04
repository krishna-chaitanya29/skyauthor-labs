'use client';

import { CheckCircle, Mail, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const benefits = [
    'Weekly curated tech news and insights',
    'Early access to new articles',
    'Exclusive content and guides',
    'No spam, unsubscribe anytime',
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="py-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">Stay Informed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Join Our <span className="gradient-text">Newsletter</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Get the latest tech insights, tutorials, and news delivered straight to your inbox every week.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {status === 'success' ? (
            <div className="bg-[var(--background-secondary)] border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You&apos;re Subscribed!</h2>
              <p className="text-[var(--foreground-muted)]">
                Welcome to the SkyAuthor Labs community. Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="input w-full"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-[var(--border)]">
                <h3 className="font-bold mb-4">What You&apos;ll Get:</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                      <Zap className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
