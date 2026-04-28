import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function UserProfileSidebar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-24">
        <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">Join the Community</h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Create an account to track your reading history, save bookmarks, and participate in high-density intellectual discourse.
        </p>
        <Link href="/auth" className="block w-full text-center px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded shadow-sm hover:bg-blue-800 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
  const name = profile?.name || user.email?.split('@')[0] || 'User';
  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
  const { count: likesCount } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

  return (
    <aside className="w-full">
      {/* Mobile view uses details/summary for an accordion-style slide panel */}
      <details className="lg:hidden group bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <summary className="p-4 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img loading="lazy" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-slate-900">{name}&apos;s Profile</span>
          </div>
          <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div className="p-6 border-t border-slate-100">
          <ProfileContent name={name} joinDate={joinDate} likesCount={likesCount} commentsCount={commentsCount} />
        </div>
      </details>

      {/* Desktop view */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
        <ProfileContent name={name} joinDate={joinDate} likesCount={likesCount} commentsCount={commentsCount} />
      </div>
    </aside>
  );
}

function ProfileContent({ name, joinDate, likesCount, commentsCount }: any) {
  return (
    <>
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
        <div className="w-14 h-14 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
          <img loading="lazy" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif text-slate-900 leading-tight">{name}</h3>
          <p className="text-xs text-slate-500 font-medium">Joined {joinDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
          <div className="text-xl font-bold text-slate-900">{likesCount || 0}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Interactions</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
          <div className="text-xl font-bold text-slate-900">0</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Bookmarks</div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Activity & Interests</h4>
        <ul className="space-y-3">
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Reading Streak</span>
            <span className="font-semibold text-slate-900">1 Day</span>
          </li>
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Contributions</span>
            <span className="font-semibold text-slate-900">{commentsCount || 0}</span>
          </li>
          <li className="flex flex-col gap-1 mt-2">
            <span className="text-xs text-slate-500">Followed Topics</span>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">Technology</span>
              <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">Culture</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded transition-colors flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Continue Reading
        </button>
        <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded transition-colors flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          View Bookmarks
        </button>
        <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded transition-colors flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Edit Profile
        </button>
      </div>
    </>
  );
}
