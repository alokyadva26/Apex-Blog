'use client';

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return user ? (
    <div className="flex items-center gap-4">
      <button
        onClick={handleSignOut}
        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <Link
      href="/auth"
      className="px-4 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-700 rounded-md hover:bg-blue-50 transition-colors"
    >
      Login
    </Link>
  );
}
