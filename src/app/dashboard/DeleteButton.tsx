'use client';

import { Trash2 } from 'lucide-react';
import { deletePost } from './actions';

export default function DeleteButton({ postId }: { postId: string }) {
  return (
    <form action={deletePost.bind(null, postId)}>
      <button
        type="submit"
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Delete Post"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete this post?')) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
}
