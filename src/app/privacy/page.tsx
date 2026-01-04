import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for SkyAuthor Labs - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-[var(--foreground-muted)] mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-[var(--foreground-muted)]">
              We collect information you provide directly to us, such as when you subscribe to our newsletter, 
              create an account, or contact us. This may include your name, email address, and any other 
              information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
              <li>To send you newsletters and updates (with your consent)</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To analyze usage patterns and improve our services</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Cookies and Tracking</h2>
            <p className="text-[var(--foreground-muted)]">
              We use cookies and similar tracking technologies to track activity on our website and hold 
              certain information. You can instruct your browser to refuse all cookies or to indicate when 
              a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
            <p className="text-[var(--foreground-muted)]">
              We may use third-party services such as Google Analytics to help us understand how our 
              website is used. These services may collect information about your use of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-[var(--foreground-muted)]">
              We implement appropriate security measures to protect your personal information. However, 
              no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-[var(--foreground-muted)]">
              You have the right to access, update, or delete your personal information at any time. 
              To exercise these rights, please contact us at contact@skyauthor.labs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="text-[var(--foreground-muted)]">
              If you have any questions about this Privacy Policy, please contact us at contact@skyauthor.labs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
