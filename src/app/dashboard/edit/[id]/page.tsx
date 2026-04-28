import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import EditPostForm from './EditPostForm';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || profile.role === 'Viewer') redirect('/');

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !post) notFound();

  if (profile.role !== 'Admin' && post.author_id !== user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <EditPostForm post={post} postId={params.id} />
    </div>
  );
}
