'use client';

import { useState } from 'react';
import { editPost } from './actions';

export default function EditPostForm({ post, postId }: { post: any, postId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const editPostAction = editPost.bind(null, postId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await editPostAction(formData);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          name="title"
          required
          defaultValue={post.title}
          className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
        <select
          name="domainSelect"
          defaultValue={['Sports', 'Technology', 'AI', 'Web3', 'Lifestyle'].includes(post.domain) ? post.domain : 'Others'}
          className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
          onChange={(e) => {
            if (e.target.value === 'Others') {
              document.getElementById('customDomainContainerEdit')?.classList.remove('hidden');
              document.getElementById('customDomainInputEdit')?.setAttribute('required', 'true');
            } else {
              document.getElementById('customDomainContainerEdit')?.classList.add('hidden');
              document.getElementById('customDomainInputEdit')?.removeAttribute('required');
            }
          }}
        >
          <option value="Sports">Sports</option>
          <option value="Technology">Technology</option>
          <option value="AI">AI</option>
          <option value="Web3">Web3</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div 
        id="customDomainContainerEdit" 
        className={`${['Sports', 'Technology', 'AI', 'Web3', 'Lifestyle'].includes(post.domain) ? 'hidden' : ''} transition-all duration-300`}
      >
        <label className="block text-sm font-medium text-slate-700 mb-1">Specify Domain</label>
        <input
          id="customDomainInputEdit"
          name="customDomain"
          defaultValue={['Sports', 'Technology', 'AI', 'Web3', 'Lifestyle'].includes(post.domain) ? '' : post.domain}
          className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
          placeholder="Enter custom domain"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image URL</label>
        <input
          name="image_url"
          type="url"
          defaultValue={post.image_url || ''}
          className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Post Content</label>
        <textarea
          name="body"
          required
          rows={12}
          defaultValue={post.body}
          className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow resize-y"
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="regenerate_summary"
          name="regenerate_summary"
          value="true"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="regenerate_summary" className="ml-2 block text-sm text-slate-900">
          Regenerate AI Summary
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
