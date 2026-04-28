import Link from 'next/link';

export const metadata = {
  title: 'About | Apex Blog',
  description: 'Engineered for high-density intellectual consumption.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <header className="mb-16">
          <div className="flex items-center space-x-4 text-sm font-bold text-blue-700 uppercase tracking-widest mb-6">
            <span>Manifesto</span>
            <span className="w-12 h-px bg-blue-200"></span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-900 mb-8 leading-tight tracking-tight">
            Engineered for High-Density Intellectual Consumption.
          </h1>
          <p className="text-2xl text-slate-500 leading-relaxed font-serif italic border-l-4 border-blue-600 pl-6 bg-slate-50 py-4 rounded-r-lg">
            "The density of information has created a paradoxical insulation—a barrier composed of sheer volume. We are here to dismantle that."
          </p>
        </header>

        <div className="prose prose-lg md:prose-xl prose-slate prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-blue-600 max-w-none">
          <p>
            Welcome to <strong>Apex Blog</strong>. We believe that in an era dominated by rapid-fire content and fleeting attention spans, there remains a profound need for rigorous, structural awareness. 
          </p>
          
          <h2 className="mt-12 mb-6 text-3xl font-bold">The Density Paradox</h2>
          <p>
            High-density intellectual consumption is not merely about reading more; it is about reading with greater intent. As we navigate through the sea of digital signals, the capacity to identify "signal from noise" becomes the ultimate currency of the enlightened mind. 
          </p>
          <p>
            Just as a city requires gutters and margins to function effectively, our digital layouts require <em>Negative Space</em> to prevent the clutter of the cognitive field. The design system of our collective discourse must mirror this necessity.
          </p>

          <h2 className="mt-12 mb-6 text-3xl font-bold">Our Structural Grid</h2>
          <p>
            We curate deep dives into technology, culture, philosophy, and the future of work. Our platform is a collaborative act between the producer and the consumer. It requires a rigid structural grid to ensure content remains the focal point, stripping away superfluous decoration to foster an environment of professional authority.
          </p>
          
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-2xl font-bold font-serif mb-6">Join the Discourse</h3>
            <p className="mb-8">
              We invite scholars, theorists, and modern thinkers to contribute to our growing repository of essays. Become an author or engage with our community through thoughtful discussion.
            </p>
            <div className="flex gap-4">
              <Link href="/auth" className="px-6 py-3 bg-blue-700 text-white font-medium rounded shadow-sm hover:bg-blue-800 transition-colors">
                Create an Account
              </Link>
              <Link href="/topics" className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded shadow-sm hover:bg-slate-200 transition-colors">
                Explore Topics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
