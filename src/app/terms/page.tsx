import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for SkyAuthor Labs - Please read these terms carefully before using our website.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-[var(--foreground-muted)] mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-[var(--foreground-muted)]">
              By accessing and using SkyAuthor Labs, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use of Content</h2>
            <p className="text-[var(--foreground-muted)]">
              All content published on SkyAuthor Labs is for informational purposes only. You may read, 
              share, and link to our content, but you may not reproduce, distribute, or create derivative 
              works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
            <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
              <li>Do not use the website for any unlawful purpose</li>
              <li>Do not attempt to gain unauthorized access to our systems</li>
              <li>Do not post spam, malicious content, or harmful links</li>
              <li>Respect other users and our community guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
            <p className="text-[var(--foreground-muted)]">
              All content, trademarks, and other intellectual property on this website are owned by 
              SkyAuthor Labs or its content suppliers. You may not use our intellectual property without 
              prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Disclaimer</h2>
            <p className="text-[var(--foreground-muted)]">
              The information provided on this website is for general informational purposes only. 
              We make no representations or warranties of any kind, express or implied, about the 
              completeness, accuracy, reliability, or availability of the information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-[var(--foreground-muted)]">
              In no event shall SkyAuthor Labs be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising out of your use of the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
            <p className="text-[var(--foreground-muted)]">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the website constitutes acceptance of 
              the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
            <p className="text-[var(--foreground-muted)]">
              For any questions about these Terms of Service, please contact us at contact@skyauthor.labs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
