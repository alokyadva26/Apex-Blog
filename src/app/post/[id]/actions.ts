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

export async function toggleLike(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to like a post');
  }

  // Check if liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    await supabase.from('likes').delete().eq('id', existingLike.id);
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath(`/post/${postId}`);
}

export async function toggleSavePost(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to save a post');
  }

  const { data: existingSave } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existingSave) {
    await supabase.from('saved_posts').delete().eq('id', existingSave.id);
  } else {
    await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath(`/post/${postId}`);
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to delete a comment');
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/post/${postId}`);
}

export async function toggleFollowAuthor(authorId: string, postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to follow an author');
  }

  // Prevent following oneself
  if (user.id === authorId) return;

  const { data: existingFollow } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('followed_id', authorId)
    .single();

  if (existingFollow) {
    await supabase.from('follows').delete().eq('id', existingFollow.id);
  } else {
    await supabase.from('follows').insert({ follower_id: user.id, followed_id: authorId });
  }

  revalidatePath(`/post/${postId}`);
}
