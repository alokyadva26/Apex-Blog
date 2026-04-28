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
    .select('id, title, created_at, users(name)')
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    dbQuery = dbQuery.eq('author_id', user.id);
  }

  const { data: posts, error } = await dbQuery;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Logged in as <span className="font-semibold text-blue-600">{profile.role}</span></p>
        </div>
        <Link
          href="/dashboard/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
              {isAdmin && <th className="px-6 py-4 font-semibold text-slate-700">Author</th>}
              <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/post/${post.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                      {post.title}
                    </Link>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-slate-600">{post.users?.name || 'Unknown'}</td>
                  )}
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/edit/${post.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <DeleteButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-6 py-12 text-center text-slate-500">
                  No posts found. Start writing!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
