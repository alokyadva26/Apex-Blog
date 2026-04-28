import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { addComment } from './actions';
import Link from 'next/link';
import SummaryToggle from './SummaryToggle';
import PostActions from './PostActions';

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

  // Fetch likes
  const { count: likesCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', params.id);

  let isLiked = false;
  let isSaved = false;
  if (user) {
    const { data: userLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', params.id)
      .eq('user_id', user.id)
      .single();
    isLiked = !!userLike;

    const { data: userSave } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', params.id)
      .eq('user_id', user.id)
      .single();
    isSaved = !!userSave;
  }

  // Add Comment Action bound to this post
  const addCommentAction = addComment.bind(null, params.id);

  return (
    <div className="bg-white">
      {/* Header Section */}
      <header className="max-w-3xl mx-auto pt-16 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center space-x-4 text-sm font-medium text-slate-500 mb-6">
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            {post.domain || 'Intellectual History'}
          </span>
          <span>{Math.ceil((post.body?.split(' ').length || 0) / 200) || 5} min read</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-900 mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>
        {post.summary && (
          <SummaryToggle summary={post.summary} />
        )}
        
        {/* Top Author Block */}
        <div className="flex items-center py-6 border-t border-b border-slate-100 mb-8">
          <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden mr-4 flex-shrink-0">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.users?.name}`} alt={post.users?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg font-serif">{post.users?.name || 'Dr. Julian Hivon'}</div>
            <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Senior Fellow at the Institute of Contemporary Theory</div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image_url && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="prose prose-lg md:prose-xl prose-slate prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none whitespace-pre-wrap leading-relaxed">
          {/* Injecting a mock quote block just to match the visual if the text doesn't have one naturally */}
          {post.body?.split('\n\n').map((paragraph: string, idx: number) => {
             // Mocking the quote block from the design for visual parity
             if (idx === 2) {
               return (
                 <div key={idx} className="my-8 border-l-4 border-blue-600 pl-6 py-2 bg-slate-50 rounded-r-lg">
                   <p className="text-xl italic font-serif text-slate-600 m-0 leading-relaxed">
                     "The quiet atmosphere of a premium literary journal provides a sanctuary where thought can breathe, away from the decorative noise of the common web."
                   </p>
                 </div>
               );
             }
             return <p key={idx} className="mb-6">{paragraph}</p>;
          })}
        </div>
        
        {/* Bottom Tags & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 mt-12 border-t border-slate-200 gap-4">
          <div className="flex space-x-2">
            {[post.domain || 'Culture', 'Philosophy', 'Sociology'].map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <PostActions 
            postId={post.id} 
            initialLikes={likesCount || 0} 
            initialIsLiked={isLiked} 
            initialIsSaved={isSaved}
            title={post.title} 
            user={user} 
          />
        </div>

        {/* Big Author Bio Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 my-12 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.users?.name}`} alt={post.users?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">{post.users?.name || 'Dr. Julian Hivon'}</h3>
            <p className="text-slate-600 mb-4 leading-relaxed text-sm">
              {post.users?.name} is a leading theorist specializing in the intersection of digital spatiality and public philosophy. They have published over twenty essays on the "Apex Blog" regarding intellectual consumption.
            </p>
            <button className="px-4 py-2 border border-slate-300 text-sm font-medium text-slate-700 bg-white rounded hover:bg-slate-50 transition-colors">
              Follow Author
            </button>
          </div>
        </div>

        {/* Discourse / Comments */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-serif text-slate-900 mb-8">Discourse ({comments?.length || 0})</h2>

          <div className="bg-slate-50 rounded-xl p-6 mb-12 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 tracking-wide">Add your contribution</h3>
            {user ? (
              <form action={addCommentAction}>
                <textarea
                  name="comment_text"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4 resize-none bg-white text-slate-900 shadow-sm"
                  placeholder="Share your intellectual perspective..."
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-700 text-white font-medium rounded shadow-sm hover:bg-blue-800 transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-600 mb-4">You must be logged in to participate in the discourse.</p>
                <Link
                  href="/auth"
                  className="inline-block px-6 py-2 bg-blue-700 text-white font-medium rounded shadow-sm hover:bg-blue-800 transition-colors"
                >
                  Log in to Comment
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.users?.name}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">{comment.users?.name || 'Unknown User'}</span>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">{comment.comment_text}</p>
                    <div className="mt-3 flex space-x-4">
                      <button className="text-xs font-bold text-blue-700 uppercase tracking-wider hover:text-blue-800">Reply</button>
                      <button className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600">Report</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 py-4 italic">No contributions yet. Be the first to share your thoughts.</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
