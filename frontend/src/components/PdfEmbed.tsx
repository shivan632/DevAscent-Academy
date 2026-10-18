'use client';

import React from 'react';
import { FileText, ExternalLink, Sparkles } from 'lucide-react';

export function PdfEmbed({
  url,
  title,
  emptyMessage = 'Lesson notes not uploaded yet',
  emptyDescription = 'The instructor is preparing this content. Please check back soon.',
}: {
  url: string | null | undefined;
  title?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}) {
  if (!url || !url.trim()) {
    return (
      <div className="w-full min-h-[420px] aspect-[4/3] bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3 backdrop-blur-xl shadow-inner">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/5">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <p className="text-white font-bold text-sm sm:text-base">{emptyMessage}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  // Ensure /preview URL for Google Drive embedding
  let embedSrc = url.trim();
  if (embedSrc.includes('drive.google.com') && !embedSrc.endsWith('/preview')) {
    embedSrc = embedSrc.replace(/\/view(\?.*)?$/, '/preview');
  }

  const directViewUrl = embedSrc.includes('drive.google.com')
    ? embedSrc.replace('/preview', '/view')
    : embedSrc;

  return (
    <div className="space-y-3 w-full">
      <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative group">
        <iframe
          src={embedSrc}
          className="w-full h-full border-0 bg-slate-950"
          loading="lazy"
          allow="autoplay; encrypted-media"
          title={title || 'Document Viewer'}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Document &amp; Notes Viewer • Scroll within frame</span>
        </span>
        <a
          href={directViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Fullscreen in New Tab</span>
        </a>
      </div>
    </div>
  );
}

export default PdfEmbed;
