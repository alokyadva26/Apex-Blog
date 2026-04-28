'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserProfilePanel({ user, profileData, savedPosts, followedAuthors, stats }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit state
  const [editName, setEditName] = useState(profileData?.name || '');
  const [editAge, setEditAge] = useState(profileData?.age || '');
  const [editGender, setEditGender] = useState(profileData?.gender || '');
  const [editMobile, setEditMobile] = useState(profileData?.mobile_number || '');
  const [isSaving, setIsSaving] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase
      .from('users')
      .update({
        name: editName,
        age: editAge ? parseInt(editAge) : null,
        gender: editGender,
        mobile_number: editMobile
      })
      .eq('id', user.id);

    setIsSaving(false);
    if (error) {
      alert("Failed to update profile: " + error.message);
    } else {
      setIsEditing(false);
      router.refresh();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
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

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <div 
          ref={panelRef}
          className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200 transform transition-transform duration-300 ease-in-out sm:w-96 flex flex-col"
        >
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 leading-tight">{name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                  <p className="text-xs text-slate-400 font-medium">Joined {joinDate}</p>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); setIsEditing(false); }} className="text-slate-400 hover:text-slate-600 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 mb-8 flex-grow">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Full Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Age</label>
                    <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Gender</label>
                    <select value={editGender} onChange={e => setEditGender(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Mobile Number</label>
                  <input type="tel" value={editMobile} onChange={e => setEditMobile(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50">Save</button>
                </div>
              </form>
            ) : (
              <>
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

                <div className="mb-8 flex-grow">
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
              </>
            )}

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
