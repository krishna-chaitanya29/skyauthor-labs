'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import {
  Check,
  Globe,
  Key,
  Loader2,
  Mail,
  Palette,
  Save,
  Settings,
  Shield,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Settings state
  const [siteName, setSiteName] = useState('SkyAuthor Labs');
  const [siteDescription, setSiteDescription] = useState('Premium tech insights & viral news');
  const [twitterHandle, setTwitterHandle] = useState('@skyauthorlabs');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save - in production, save to database or config
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/admin/settings`,
    });
    
    if (!error) {
      alert('Password reset email sent! Check your inbox.');
    } else {
      alert('Error sending reset email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-500 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Manage your account and site settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Account Settings */}
        <section className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input bg-[var(--background-tertiary)] cursor-not-allowed"
              />
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Account Created</label>
              <p className="text-[var(--foreground-muted)]">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <button
                onClick={handlePasswordReset}
                className="btn-secondary"
              >
                <Key className="w-4 h-4 mr-2" />
                Send Password Reset Email
              </button>
            </div>
          </div>
        </section>

        {/* Site Settings */}
        <section className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold">Site Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="input resize-none h-20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Twitter Handle</label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="input"
                placeholder="@yourusername"
              />
            </div>
          </div>
        </section>

        {/* Environment Variables Info */}
        <section className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold">API Configuration</h2>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-[var(--background-tertiary)] rounded-lg">
              <span>Supabase</span>
              <span className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--background-tertiary)] rounded-lg">
              <span>Cloudinary</span>
              <span className={`flex items-center gap-2 ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'text-green-400' : 'text-yellow-400'}`}>
                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                  <><Check className="w-4 h-4" /> Connected</>
                ) : (
                  'Not configured'
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--background-tertiary)] rounded-lg">
              <span>Google Analytics</span>
              <span className={`flex items-center gap-2 ${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'text-green-400' : 'text-yellow-400'}`}>
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
                  <><Check className="w-4 h-4" /> Connected</>
                ) : (
                  'Not configured'
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--background-tertiary)] rounded-lg">
              <span>Gemini AI</span>
              <span className="text-[var(--foreground-muted)]">
                Server-side only
              </span>
            </div>
          </div>
          
          <p className="text-xs text-[var(--foreground-muted)] mt-4">
            Configure these in your <code className="bg-[var(--background)] px-2 py-1 rounded">.env.local</code> file.
          </p>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
