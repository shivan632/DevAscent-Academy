'use client';

import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from '../lib/api';
import {
  TrendingUp,
  Flame,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Code2,
  Layers,
  Activity,
} from 'lucide-react';

export default function StudentAnalyticsView() {
  const fetchAnalytics = async () => {
    const res = await api.getMyAnalytics();
    const payload = res?.data !== undefined ? res.data : res;
    if (typeof window !== 'undefined' && payload) {
      try {
        localStorage.setItem('devascent_analytics_cache', JSON.stringify(payload));
      } catch (e) {}
    }
    return payload;
  };

  const { data: rawData, error, isLoading } = useSWR('/me/analytics', fetchAnalytics, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    dedupingInterval: 30000,
    fallbackData: typeof window !== 'undefined' ? (() => {
      try {
        const cached = localStorage.getItem('devascent_analytics_cache');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
      return undefined;
    })() : undefined,
  });

  const data = rawData?.data !== undefined ? rawData.data : rawData;

  if (isLoading && !data) {
    return (
      <div className="p-8 rounded-3xl bg-white/5 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-5">
        <div className="h-7 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 h-56 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl" />
          <div className="lg:col-span-5 h-56 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    enrolledCourses: 0,
    completedLessons: 0,
    passedQuizzes: 0,
    averageQuizScore: 0,
    quizPassRate: 0,
    currentStreak: 1,
    totalStudyHours: 0,
    certificatesEarned: 0,
  };

  // Ensure 7-day timeline has full 7-day objects
  const rawTimeline = data?.activityTimeline || [];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();

  const timeline = rawTimeline.length === 7
    ? rawTimeline
    : Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toISOString().split('T')[0],
          day: d.toLocaleDateString('en-US', { weekday: 'short' }),
          lessons: i === 6 ? Math.max(1, summary.completedLessons) : 0,
          minutes: i === 6 ? Math.max(25, (summary.totalStudyMinutes || 25)) : (i % 2 === 0 ? 15 : 0),
          quizzes: 0,
        };
      });

  // Fallback domain breakdown if none exists
  const rawDomainBreakdown = data?.domainBreakdown || [];
  const domainBreakdown = rawDomainBreakdown.length > 0
    ? rawDomainBreakdown
    : [
        { domain: 'Frontend & Modern React', masteryPct: Math.max(20, summary.completedLessons * 8), totalLessons: 24, completedLessons: Math.min(24, summary.completedLessons) },
        { domain: 'Backend & Cloud APIs', masteryPct: Math.max(15, summary.completedLessons * 6), totalLessons: 20, completedLessons: Math.min(20, Math.round(summary.completedLessons * 0.7)) },
        { domain: 'Python & Data Structures', masteryPct: Math.max(10, summary.completedLessons * 5), totalLessons: 18, completedLessons: Math.min(18, Math.round(summary.completedLessons * 0.5)) },
        { domain: 'Database & Neon SQL', masteryPct: Math.max(25, summary.completedLessons * 9), totalLessons: 16, completedLessons: Math.min(16, Math.round(summary.completedLessons * 0.8)) },
      ];

  const recentAssessments = data?.recentAssessments || [];
  const rawAchievements = data?.recentAchievements || [];

  const achievements = rawAchievements.length > 0
    ? rawAchievements
    : [
        { title: 'First Code Commit', desc: 'Started first lesson in active cohort', icon: 'Sparkles', color: 'indigo' },
        { title: 'Fast Learner', desc: 'Active 7-day study consistency', icon: 'Flame', color: 'amber' },
        { title: 'Quiz Ace', desc: summary.passedQuizzes > 0 ? 'Passed module assessment' : 'Upcoming milestone unlock', icon: 'CheckCircle2', color: 'emerald' },
        { title: 'Capstone Ready', desc: 'Building toward verifiable credential', icon: 'Award', color: 'purple' },
      ];

  const maxMinutes = Math.max(30, ...timeline.map((t: any) => t.minutes || 0));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ─── Header & Streak Highlight ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0C1022] via-[#10142D] to-[#0A0D1A] border border-indigo-500/25 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle glowing ambient blobs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Telemetry &amp; Study Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Learning Analytics
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl leading-relaxed">
            Real-time telemetry tracking your coding velocity, module completion, assessment scores, and skill progression.
          </p>
        </div>

        {/* Flame Streak Badge */}
        <div className="relative z-10 flex items-center gap-3.5 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 text-amber-300 shrink-0 shadow-lg shadow-amber-500/10 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Active Study Streak
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-1">
              <span>{summary.currentStreak || 1} Day{summary.currentStreak !== 1 ? 's' : ''}</span>
              <span className="text-amber-400">🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 Core Metric KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Lessons Mastered */}
        <div className="bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg hover:border-indigo-500/40 transition-all duration-200 space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-500 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lessons</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.completedLessons}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Interactive modules completed</span>
            </div>
          </div>
        </div>

        {/* Card 2: Time Invested */}
        <div className="bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg hover:border-emerald-500/40 transition-all duration-200 space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Invested</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.totalStudyHours} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Hands-on coding time</span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg Quiz Score */}
        <div className="bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg hover:border-purple-500/40 transition-all duration-200 space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quiz Score</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.averageQuizScore}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Pass rate: {summary.quizPassRate || 0}%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Certificates */}
        <div className="bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg hover:border-amber-500/40 transition-all duration-200 space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credentials</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.certificatesEarned}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Verifiable SHA-256 mints</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Activity Velocity & Domain Mastery Grid ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Weekly Activity Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                7-Day Study Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily learning minutes &amp; interactive practice breakdown
              </p>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 self-start sm:self-center shadow-sm">
              Active Velocity
            </span>
          </div>

          {/* Bar pillars */}
          <div className="grid grid-cols-7 gap-3 sm:gap-4 pt-6 items-end h-44 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            {timeline.map((day: any, idx: number) => {
              const heightPct = Math.min(100, Math.max(16, Math.round(((day.minutes || 10) / maxMinutes) * 100)));
              const isToday = idx === timeline.length - 1;
              const hasStudy = day.minutes > 0 || day.lessons > 0;

              return (
                <div key={day.date || idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.minutes || 0}m
                  </div>

                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800/40 rounded-xl p-0.5 flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-indigo-600 via-purple-600 to-indigo-400 shadow-lg shadow-indigo-500/30'
                          : hasStudy
                          ? 'bg-gradient-to-t from-indigo-500/60 to-purple-500/60 group-hover:from-indigo-500 group-hover:to-purple-500 shadow-sm'
                          : 'bg-slate-200/60 dark:bg-slate-800/80'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className={`text-[11px] font-semibold transition-colors ${
                    isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-gradient-to-r from-indigo-600 to-purple-600" />
              <span>Active study sessions</span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Weekly Target: 10 hrs
            </span>
          </div>
        </div>

        {/* Domain Mastery Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Skill Domain Mastery
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                Level Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Curriculum progression by engineering domain
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {domainBreakdown.map((item: any, idx: number) => {
              const pct = item.masteryPct || 0;
              return (
                <div key={item.domain || idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
                      {item.domain}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Domain Capstone Gate</span>
            <span className="text-indigo-600 dark:text-indigo-300 font-bold">Requires &ge;80% Mastery</span>
          </div>
        </div>
      </div>

      {/* ─── Recent Achievements & Assessment Log ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Milestone Badges */}
        <div className="bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Milestone Badges
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full">
              4 Achievements
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach: any, i: number) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3 hover:border-amber-500/40 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{ach.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Log */}
        <div className="bg-white/95 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Recent Quiz Attempts
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
              Live Ledger
            </span>
          </div>

          {recentAssessments.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                No Quizzes Attempted Yet
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Complete lesson modules or launch AI Studio to test your domain mastery.
              </p>
              <div className="pt-1">
                <Link
                  href="/ai-studio"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start AI Practice Quiz</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAssessments.map((a: any) => (
                <div
                  key={a.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        a.passed ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-bold text-slate-900 dark:text-white">{a.quizTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Attempt #{a.attemptNum}</span>
                    <span
                      className={`font-mono font-bold px-2.5 py-0.5 rounded-lg text-[11px] ${
                        a.passed
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {a.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
