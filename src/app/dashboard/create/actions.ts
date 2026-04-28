'use server';

import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redirect } from 'next/navigation';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function createPost(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'Author' && profile.role !== 'Admin')) {
    throw new Error('Not authorized to create posts');
  }

  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const image_url = formData.get('image_url') as string;

  if (!title || !body) {
    throw new Error('Title and body are required');
  }

  // Generate AI Summary
  let summary = '';
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Summarize the following blog post in approximately 200 words. Keep it engaging and scannable.\n\nTitle: ${title}\nBody:\n${body}`;
    const result = await model.generateContent(prompt);
    summary = result.response.text();
  } catch (error) {
    console.error('Failed to generate summary', error);
    // If AI generation fails, we store a fallback or leave it empty, as per PRD:
    // "flag the summary for manual retry... or empty"
    summary = 'Summary generation failed. Please edit to try again.';
  }

  // Save to DB
  const { error } = await supabase
    .from('posts')
    .insert({
      title,
      body,
      image_url,
      summary,
      author_id: user.id
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/');
}
