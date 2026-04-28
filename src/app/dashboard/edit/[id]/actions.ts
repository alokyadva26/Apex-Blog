'use server';

import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redirect } from 'next/navigation';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function editPost(postId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!profile || profile.role === 'Viewer') throw new Error('Not authorized');

  // Verify ownership or Admin
  if (profile.role !== 'Admin') {
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (post?.author_id !== user.id) throw new Error('Not your post');
  }

  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const image_url = formData.get('image_url') as string;
  const regenerateSummary = formData.get('regenerate_summary') === 'true';

  let updates: any = { title, body, image_url };

  if (regenerateSummary) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Summarize the following blog post in approximately 200 words. Keep it engaging and scannable.\n\nTitle: ${title}\nBody:\n${body}`;
      const result = await model.generateContent(prompt);
      updates.summary = result.response.text();
    } catch (error) {
      console.error('Failed to regenerate summary', error);
      updates.summary = 'Summary generation failed. Please edit to try again.';
    }
  }

  const { error } = await supabase.from('posts').update(updates).eq('id', postId);

  if (error) throw new Error(error.message);

  redirect('/dashboard');
}
