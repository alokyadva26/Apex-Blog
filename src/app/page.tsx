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

  const featuredPost = (!query && page === 1 && posts && posts.length > 0) ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : (posts || []);

  return (
    <div className="pb-12">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-4 tracking-tight">Lately on Apex</h1>
        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
          High-density intellectual consumption curated for the modern thinker. <br className="hidden md:block" />
          Explore deep dives into technology, culture, and the future of work.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error loading posts.</div>
      ) : posts && posts.length > 0 ? (
        <>
          {featuredPost && (
            <Link href={`/post/${featuredPost.id}`} className="block mb-16 group">
              <article className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="order-2 md:order-1 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 tracking-wider uppercase mb-4">
                    <span className="bg-slate-100 px-2 py-1 rounded">Analysis</span>
                    <span>•</span>
                    <span>{Math.ceil((featuredPost.body?.split(' ').length || 0) / 200) || 5} min read</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-600 text-lg line-clamp-3 mb-6">
                    {featuredPost.summary || 'No summary available.'}
                  </p>
                  <div className="text-sm font-medium text-blue-700">Read full analysis &rarr;</div>
                </div>
                <div className="order-1 md:order-2 h-64 md:h-[400px]">
                  {featuredPost.image_url ? (
                    <img src={featuredPost.image_url} alt={featuredPost.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>
              </article>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {gridPosts.map((post, i) => (
              <Link key={post.id} href={`/post/${post.id}`} className="group block h-full">
                <article className="flex flex-col h-full border border-slate-100 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square mb-6 overflow-hidden rounded-lg bg-slate-100">
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col px-2">
                    <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">
                      <span className="bg-slate-100 px-2 py-1 rounded">{['CULTURE', 'WORK', 'INSIGHTS', 'TECH'][i % 4]}</span>
                    </div>
                    <h3 className="text-xl font-bold font-serif text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                      {post.summary || 'No summary available.'}
                    </p>
                    <div className="text-sm font-medium text-blue-700 mt-auto">Read full analysis &rarr;</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No posts found. Check back later!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-20">
          {page > 1 ? (
            <Link href={`/?page=${page - 1}${query ? `&q=${query}` : ''}`} className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors">&lt;</Link>
          ) : (
            <span className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded text-slate-300 cursor-not-allowed">&lt;</span>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/?page=${p}${query ? `&q=${query}` : ''}`} className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium ${page === p ? 'bg-blue-700 text-white border-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors'}`}>
              {p}
            </Link>
          ))}

          {page < totalPages ? (
            <Link href={`/?page=${page + 1}${query ? `&q=${query}` : ''}`} className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors">&gt;</Link>
          ) : (
            <span className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded text-slate-300 cursor-not-allowed">&gt;</span>
          )}
        </div>
      )}
    </div>
  );
}
