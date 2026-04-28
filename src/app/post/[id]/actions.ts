'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addComment(postId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to comment');
  }

  const commentText = formData.get('comment_text') as string;

  if (!commentText || commentText.trim() === '') {
    throw new Error('Comment cannot be empty');
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      comment_text: commentText.trim(),
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/post/${postId}`);
}
