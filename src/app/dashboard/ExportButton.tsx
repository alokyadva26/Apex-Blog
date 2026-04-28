'use client';

import { Printer } from 'lucide-react';

export default function ExportButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded shadow-sm border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-2"
    >
      <Printer className="w-4 h-4" />
      Export Reports
    </button>
  );
}
