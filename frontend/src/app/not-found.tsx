'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, BookOpen, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Background Shimmer */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full text-center space-y-8 relative z-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
        
        {/* Animated 404 Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            <span>404 • Page Not Found</span>
          </div>
          
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 font-mono">
            404
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Lost in Cyberspace?
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page or curriculum track you are looking for does not exist, has been moved, or the URL might have changed.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Explore Courses</span>
          </Link>
        </div>

        {/* Helpful Shortcut Links */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-indigo-300 transition-colors">
            Student Dashboard
          </Link>
          <span>•</span>
          <Link href="/support" className="hover:text-indigo-300 transition-colors">
            Help Desk
          </Link>
          <span>•</span>
          <Link href="/verify/DEVASCENT-2025-VALID" className="hover:text-indigo-300 transition-colors">
            Verify Certificate
          </Link>
        </div>

      </div>
    </div>
  );
}
