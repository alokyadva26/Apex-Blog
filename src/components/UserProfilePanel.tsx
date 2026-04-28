'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserProfilePanel({ user, profileData, savedPosts, followedAuthors, stats }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!user) {
    return (
      <Link
        href="/auth"
        className="px-4 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-700 rounded-md hover:bg-blue-50 transition-colors"
      >
        Login
      </Link>
    );
  }

  const name = profileData?.name || user.email?.split('@')[0] || 'User';
  const joinDate = profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none"
      >
        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Slide-over Panel */}
      {isOpen && (
        <div 
          ref={panelRef}
          className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200 transform transition-transform duration-300 ease-in-out sm:w-96"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 leading-tight">{name}</h3>
                  <p className="text-sm text-slate-500 font-medium">Joined {joinDate}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-2xl font-bold text-slate-900">{stats.likesCount || 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Interactions</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-2xl font-bold text-slate-900">{savedPosts?.length || 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Saved Posts</div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 pb-2">Saved Reading</h4>
              {savedPosts && savedPosts.length > 0 ? (
                <ul className="space-y-4">
                  {savedPosts.map((sp: any) => (
                    <li key={sp.id} className="group">
                      <Link href={`/post/${sp.posts.id}`} onClick={() => setIsOpen(false)}>
                        <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">{sp.posts.title}</h5>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{sp.posts.summary}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No saved posts yet.</p>
              )}
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 pb-2">Following Authors</h4>
              {followedAuthors && followedAuthors.length > 0 ? (
                <ul className="space-y-4">
                  {followedAuthors.map((fa: any) => (
                    <li key={fa.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${fa.users.name}`} alt={fa.users.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{fa.users.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">Not following anyone yet.</p>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-auto">
              <button 
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
