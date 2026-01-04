'use client';

import { trackNewsletterSignup } from '@/lib/analytics';
import { CheckCircle, Loader2, Mail, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface NewsletterPopupProps {
  onClose: () => void;
}

export default function NewsletterPopup({ onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        trackNewsletterSignup('popup');
        setTimeout(onClose, 3000);
      } else {
        setError(data.error || data.message || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="newsletter-popup">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {success ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">You&apos;re In!</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Welcome to the SkyAuthor Labs community. Check your inbox for a welcome email!
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Stay in the loop</h3>
              <p className="text-xs text-[var(--foreground-muted)]">Get weekly insights</p>
            </div>
          </div>

          <p className="text-sm text-[var(--foreground-muted)] mb-4">
            Join 2,000+ developers and tech enthusiasts. Get the best articles delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                required
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe for Free'
              )}
            </button>
          </form>

          <p className="text-xs text-[var(--foreground-muted)] text-center mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </>
      )}
    </div>
  );
}
