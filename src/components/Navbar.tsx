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
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-700 font-serif tracking-tight">
              Apex Blog
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-1">
                Explore
              </Link>
              <Link href="/topics" className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-1">
                Topics
              </Link>
              <Link href="/about" className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-1">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <form className="hidden md:block relative" action="/">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search insights..."
                className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-sm bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>

            <AuthButton user={user} />
            
            {user && (role === 'Author' || role === 'Admin') ? (
              <Link
                href="/dashboard"
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
