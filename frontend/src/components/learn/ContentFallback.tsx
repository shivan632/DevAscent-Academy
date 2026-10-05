'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Award,
  Video,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface ContentFallbackProps {
  type: 'notes' | 'quiz' | 'video' | 'capstone';
  title?: string;
  courseSlug?: string;
  nextUrl?: string;
  nextLabel?: string;
  topicTitle?: string;
}

export default function ContentFallback({
  type,
  title,
  courseSlug,
  nextUrl,
  nextLabel,
  topicTitle,
}: ContentFallbackProps) {
  if (type === 'notes') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto space-y-5 my-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Curriculum Update in Progress</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title || 'Lecture Notes in Preparation'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The instructor is finalizing the detailed notes, diagrams, and code blueprints for <span className="text-slate-200 font-semibold">{topicTitle || 'this topic'}</span>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-left max-w-md mx-auto space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>What you can do right now:</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            You can proceed to take the topic skill assessment quiz, review the attached exercise document (if available), or mark this topic complete.
          </p>
        </div>

        {nextUrl && (
          <div className="pt-2">
            <Link
              href={nextUrl}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <span>{nextLabel || 'Proceed to Topic Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (type === 'quiz') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto space-y-5 my-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assessment Being Configured</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title || 'Quiz Questions Coming Soon'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The instructor has not added MCQ assessment questions for this quiz yet. You can proceed to the next curriculum lesson in the meantime.
          </p>
        </div>

        {nextUrl && (
          <div className="pt-2">
            <Link
              href={nextUrl}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>{nextLabel || 'Continue to Next Topic'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-2xl mx-auto space-y-5 my-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
          <Video className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold border border-violet-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Video In Production</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title || 'Milestone Video Coming Soon'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            This AI summary overview video is being rendered. You can skip straight to the topic notes.
          </p>
        </div>

        {nextUrl && (
          <div className="pt-2">
            <Link
              href={nextUrl}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all active:scale-95"
            >
              <span>{nextLabel || 'Continue to Lesson Notes'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  return null;
}
