'use client';

import { useState } from 'react';
import { createPost } from './actions';

export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await createPost(formData);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            name="title"
            required
            className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
            placeholder="Enter an engaging title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Domain</label>
          <select
            name="domainSelect"
            className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
            onChange={(e) => {
              if (e.target.value === 'Others') {
                document.getElementById('customDomainContainer')?.classList.remove('hidden');
                document.getElementById('customDomainInput')?.setAttribute('required', 'true');
              } else {
                document.getElementById('customDomainContainer')?.classList.add('hidden');
                document.getElementById('customDomainInput')?.removeAttribute('required');
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

        <div id="customDomainContainer" className="hidden transition-all duration-300">
          <label className="block text-sm font-medium text-slate-700 mb-1">Specify Domain</label>
          <input
            id="customDomainInput"
            name="customDomain"
            className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
            placeholder="Enter custom domain"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image URL (Optional)</label>
          <input
            name="image_url"
            type="url"
            className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Post Content</label>
          <textarea
            name="body"
            required
            rows={12}
            className="w-full px-4 py-2 border border-slate-200 rounded text-slate-900 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow resize-y"
            placeholder="Write your amazing content here..."
          ></textarea>
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
            {loading ? 'Generating AI Summary & Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
