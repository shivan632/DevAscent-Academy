'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime errors
    console.error('Next.js Client Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10 p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
        
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            An unexpected error occurred while rendering this view. Our engineering team has been notified.
          </p>
          {error?.digest && (
            <span className="text-[10px] font-mono text-slate-500 block pt-1">
              Error Digest: {error.digest}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again / Refresh Component</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Safe Home</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Need help?</span>
          <a href="mailto:devascentacademy@gmail.com" className="text-indigo-400 hover:underline font-medium">
            Contact Support Desk
          </a>
        </div>

      </div>
    </div>
  );
}
