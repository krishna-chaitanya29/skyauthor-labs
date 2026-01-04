import { ArrowLeft, ShieldX } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-black mb-3">Access Denied</h1>
        <p className="text-[var(--foreground-muted)] mb-8">
          You don&apos;t have permission to access the admin area. 
          Only authorized administrators can view this content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/admin/login" className="btn-secondary inline-flex items-center justify-center">
            Try Different Account
          </Link>
        </div>
      </div>
    </div>
  );
}
