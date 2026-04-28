import Link from 'next/link';

export const metadata = {
  title: 'Topics | Apex Blog',
  description: 'Explore high-density intellectual discourse by category.',
};

const topics = [
  { name: 'Architecture', count: 12, desc: 'Structural dynamics and urban spatiality in the modern era.' },
  { name: 'Philosophy', count: 34, desc: 'Dismantling prevailing myths and exploring the modern condition.' },
  { name: 'Sociology', count: 28, desc: 'The collective discourse, cultural shifts, and human networks.' },
  { name: 'Technology', count: 45, desc: 'Deep dives into AI, Web3, and the foundational shifts in computation.' },
  { name: 'Future of Work', count: 19, desc: 'Remote topologies, the density paradox, and economic paradigms.' },
  { name: 'Urban Planning', count: 8, desc: 'Architectural grids, negative space, and city design systems.' },
];

export default function TopicsPage() {
  return (
    <div className="bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-900 mb-6 tracking-tight">
            Curated Disciplines
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-serif italic">
            Navigate through our sea of digital signals. High-density categories designed to help you identify signal from noise.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <Link 
              key={topic.name} 
              href={`/?query=${topic.name.toLowerCase()}`}
              className="group block p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold font-serif text-slate-900 group-hover:text-blue-700 transition-colors">
                  {topic.name}
                </h3>
                <span className="bg-white text-xs font-bold text-slate-500 px-3 py-1 rounded-full border border-slate-200 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
                  {topic.count} Essays
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                {topic.desc}
              </p>
              <div className="mt-6 flex items-center text-sm font-bold text-blue-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Explore <span className="ml-2">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
