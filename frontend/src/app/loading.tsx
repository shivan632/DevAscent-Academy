import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[80vh] bg-[#07090E] flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulsing aura */}
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
        <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin absolute" />
      </div>
      <div className="mt-6 text-center space-y-1">
        <p className="text-sm font-bold text-white tracking-wide">Loading DevAscent Academy...</p>
        <p className="text-[11px] text-slate-500">Preparing high-performance classroom interface</p>
      </div>
    </div>
  );
}
