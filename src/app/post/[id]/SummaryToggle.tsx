'use client';

import { useState } from 'react';

export default function SummaryToggle({ summary }: { summary: string }) {
  const [show, setShow] = useState(false);
  
  if (!show) {
    return (
      <div className="mb-8">
        <button 
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Read AI Summary
        </button>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Generated Summary</span>
      </div>
      <p className="text-xl md:text-2xl text-slate-500 italic leading-relaxed font-serif border-l-4 border-blue-600 pl-4 bg-slate-50 py-3 pr-4 rounded-r-lg">
        {summary}
      </p>
    </div>
  );
}
