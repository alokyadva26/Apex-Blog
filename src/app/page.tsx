import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const supabase = createClient();
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let dbQuery = supabase
    .from('posts')
    .select('*, users(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }

  const { data: posts, count, error } = await dbQuery;

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
        
        {/* Search Form */}
        <form className="relative max-w-md w-full" action="/">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts by title..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </form>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error loading posts.</div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="group block h-full">
              <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover bg-slate-100"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 font-medium">No Image</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4">
                    By {post.users?.name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                    {post.summary || 'No summary available.'}
                  </p>
                  <span className="text-blue-600 font-medium text-sm mt-auto inline-flex items-center">
                    Read more →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No posts found. Check back later!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${query ? `&q=${query}` : ''}`}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/?page=${page + 1}${query ? `&q=${query}` : ''}`}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
