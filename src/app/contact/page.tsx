'use client';

import { CheckCircle, Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'contact@skyauthor.labs',
      href: 'mailto:contact@skyauthor.labs',
    },
    {
      icon: MessageSquare,
      title: 'Social Media',
      description: '@skyauthorlabs',
      href: 'https://twitter.com/skyauthorlabs',
    },
    {
      icon: MapPin,
      title: 'Location',
      description: 'Remote - Worldwide',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)]">
            Have a question, feedback, or business inquiry? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.href}
                  className="flex items-start gap-4 p-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)]/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-medium">{info.title}</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">{info.description}</p>
                  </div>
                </a>
              ))}

              {/* FAQ Quick Links */}
              <div className="mt-8 p-6 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl">
                <h3 className="font-bold mb-4">Common Topics</h3>
                <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                  <li>• Advertising & Sponsorships</li>
                  <li>• Content Partnerships</li>
                  <li>• Technical Issues</li>
                  <li>• Guest Writing</li>
                  <li>• General Feedback</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                {status === 'sent' ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-[var(--foreground-muted)]">
                      Thank you for reaching out. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Name</label>
                        <input
                          type="text"
                          required
                          className="input w-full"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          className="input w-full"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <select
                        required
                        className="input w-full"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="advertising">Advertising & Sponsorship</option>
                        <option value="partnership">Content Partnership</option>
                        <option value="technical">Technical Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        required
                        rows={6}
                        className="input w-full resize-none"
                        placeholder="Tell us what's on your mind..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {status === 'sending' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
