import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for SkyAuthor Labs - Learn about how we use cookies on our website.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black mb-8">Cookie Policy</h1>
        <p className="text-[var(--foreground-muted)] mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
            <p className="text-[var(--foreground-muted)]">
              Cookies are small text files that are stored on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide a better user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
            <p className="text-[var(--foreground-muted)] mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Preference Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (if applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
            <p className="text-[var(--foreground-muted)]">
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2 mt-4">
              <li>Google Analytics - for website analytics</li>
              <li>Supabase - for authentication and data storage</li>
              <li>Cloudinary - for image hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
            <p className="text-[var(--foreground-muted)]">
              You can control and manage cookies in your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2 mt-4">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-[var(--foreground-muted)]">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-[var(--foreground-muted)]">
              If you have any questions about our use of cookies, please contact us at contact@skyauthor.labs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
