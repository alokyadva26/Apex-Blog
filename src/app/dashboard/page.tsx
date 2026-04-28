import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Edit } from 'lucide-react';
import DeleteButton from './DeleteButton';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role === 'Viewer') {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-8">You need Author or Admin permissions to view the dashboard.</p>
        <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const isAdmin = profile.role === 'Admin';
  
  let dbQuery = supabase
    .from('posts')
    .select('*, users(name)')
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    dbQuery = dbQuery.eq('author_id', user.id);
  }

  const { data: posts, error } = await dbQuery;

  // Fetch recent comments for the sidebar
  const { data: recentComments } = await supabase
    .from('comments')
    .select('*, users(name)')
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch real metrics for the dashboard
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
  const totalWords = posts?.reduce((acc, p) => acc + (p.body?.split(' ').length || 0), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2 tracking-tight">Administrative Overview</h1>
          <p className="text-slate-500 max-w-lg text-sm">
            High-density command center for platform operations, editorial control, and engagement monitoring.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded shadow-sm border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Export Reports
          </button>
          <Link
            href="/dashboard/create"
            className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded shadow-sm hover:bg-blue-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Create New Post
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Published Posts</p>
            <h3 className="text-3xl font-bold font-serif text-slate-900">{posts?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Platform Users</p>
            <h3 className="text-3xl font-bold font-serif text-slate-900">{usersCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Active Discussions (Comments)</p>
            <h3 className="text-3xl font-bold font-serif text-slate-900">{commentsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Words Written</p>
            <h3 className="text-3xl font-bold font-serif text-slate-900">{totalWords.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Table Area */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold font-serif text-slate-900">View All Posts</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 border border-slate-200 px-3 py-1.5 rounded cursor-pointer hover:bg-slate-50">
              All Status
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-sm text-slate-900">Post Details</th>
                {isAdmin && <th className="px-6 py-4 font-bold text-sm text-slate-900">Author</th>}
                <th className="px-6 py-4 font-bold text-sm text-slate-900">Date</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-900">Status</th>
                <th className="px-6 py-4 font-bold text-sm text-slate-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100">
                          {post.image_url ? (
                            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-100"></div>
                          )}
                        </div>
                        <div>
                          <Link href={`/post/${post.id}`} className="font-serif font-bold text-slate-900 hover:text-blue-700 block mb-0.5">
                            {post.title}
                          </Link>
                          <div className="text-xs text-slate-500">
                            Blog • {post.body?.split(' ').length || 0} words
                          </div>
                        </div>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-slate-600 text-sm">{post.users?.name || 'Unknown'}</td>
                    )}
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 rounded">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <Link
                          href={`/dashboard/edit/${post.id}`}
                          className="p-1.5 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded transition-colors"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-slate-500">
                    No posts found. Start writing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 h-full">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold font-serif text-slate-900">Monitor Comments</h2>
              {recentComments && recentComments.length > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">{recentComments.length} New</span>
              )}
            </div>

            <div className="space-y-6">
              {recentComments && recentComments.length > 0 ? (
                recentComments.map((comment, i) => (
                  <div key={comment.id} className="pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.users?.name}`} alt="" />
                      </div>
                      <div className="flex-grow flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900">{comment.users?.name || 'Unknown'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic mb-3">
                      "{comment.comment_text}"
                    </p>
                    <div className="flex space-x-4">
                      <button className="text-[10px] font-bold text-blue-700 uppercase tracking-widest hover:text-blue-800">Approve</button>
                      <button className="text-[10px] font-bold text-red-600 uppercase tracking-widest hover:text-red-700">Reject</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-slate-500 italic">No recent comments to review.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
