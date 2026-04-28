import Link from 'next/link';
import AuthButton from './AuthButton';
import { createClient } from '@/utils/supabase/server';

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'Viewer';
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) role = profile.role;
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Apex Blog
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (role === 'Author' || role === 'Admin') && (
              <Link
                href="/dashboard/create"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Write a Post
              </Link>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <AuthButton user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
