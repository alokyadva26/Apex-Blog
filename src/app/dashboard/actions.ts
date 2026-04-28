'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deletePost(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not logged in');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || profile.role === 'Viewer') throw new Error('Unauthorized');

  // Verify ownership or admin
  if (profile.role !== 'Admin') {
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (post?.author_id !== user.id) throw new Error('Not your post');
  }

  await supabase.from('posts').delete().eq('id', postId);
  
  revalidatePath('/dashboard');
  revalidatePath('/');
}
