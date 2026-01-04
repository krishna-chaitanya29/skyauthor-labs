import { getUser, isAdmin } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const user = await getUser();
  
  // If not logged in, redirect to login
  if (!user) {
    redirect('/admin/login');
  }

  // Check if user is admin
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    redirect('/admin/unauthorized');
  }

  return <AdminDashboard user={user} />;
}
