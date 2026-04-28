import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { addComment } from './actions';
import Link from 'next/link';

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*, users(name)')
    .eq('id', params.id)
    .single();

  if (postError || !post) {
    notFound();
  }

  // Fetch comments
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*, users(name)')
    .eq('post_id', params.id)
    .order('created_at', { ascending: true });

  // Add Comment Action bound to this post
  const addCommentAction = addComment.bind(null, params.id);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover bg-slate-100"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-slate-500 mb-8 border-b border-slate-100 pb-8">
            <span className="font-medium text-slate-700">{post.users?.name || 'Unknown Author'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          {post.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-md text-slate-700 italic">
              <span className="font-semibold not-italic text-blue-800 block mb-1">AI Summary</span>
              {post.summary}
            </div>
          )}

          <div className="prose max-w-none text-slate-800 whitespace-pre-wrap">
            {post.body}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({comments?.length || 0})</h2>

        {user ? (
          <form action={addCommentAction} className="mb-8">
            <textarea
              name="comment_text"
              required
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3 resize-none"
              placeholder="Add to the discussion..."
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 text-center">
            <p className="text-slate-600 mb-4">You must be logged in to participate in the discussion.</p>
            <Link
              href="/auth"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log in to Comment
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                  {(comment.users?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{comment.users?.name || 'Unknown User'}</span>
                    <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700">{comment.comment_text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </div>
  );
}
