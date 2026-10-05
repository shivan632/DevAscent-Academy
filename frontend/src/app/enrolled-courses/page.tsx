'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import {
  BookOpen,
  Award,
  Play,
  CheckCircle2,
  Clock,
  Briefcase,
  Sparkles,
  ArrowRight,
  FolderGit2,
  Lock,
  ExternalLink,
  Zap,
  GraduationCap,
  Layers,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Search,
  Check,
} from 'lucide-react';

export default function EnrolledCoursesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'courses' | 'internships' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ⚡ High-speed instant SWR fetch with stale-while-revalidate & cache hydration
  const { data: enrollmentsData, isLoading: loadingEnrollments } = useSWR(
    isAuthenticated ? '/enrollments/my' : null,
    async () => {
      const res = await api.getMyEnrollments();
      const payload = res?.data || res;
      const list = Array.isArray(payload?.enrollments)
        ? payload.enrollments
        : Array.isArray(payload)
        ? payload
        : Array.isArray(res?.enrollments)
        ? res.enrollments
        : [];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('devascent_enrollments_cache', JSON.stringify(list));
        } catch (e) {}
      }
      return list;
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
      fallbackData: (() => {
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem('devascent_enrollments_cache');
            return cached ? JSON.parse(cached) : [];
          } catch (e) {
            return [];
          }
        }
        return [];
      })(),
    }
  );

  const enrollments: any[] = enrollmentsData || [];

  // Metrics & Stats
  const { totalCompleted, totalCourses, totalInternships } = useMemo(() => {
    let completed = 0;
    let courses = 0;
    let internships = 0;

    enrollments.forEach((e) => {
      if ((e.progressPct ?? 0) >= 100 || e.certificate) completed++;
      if (e.courseType === 'INTERNSHIP') internships++;
      else courses++;
    });

    return { totalCompleted: completed, totalCourses: courses, totalInternships: internships };
  }, [enrollments]);

  // Instant In-Memory Filter
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const title = (item.courseTitle || item.title || '').toLowerCase();
      const domain = (item.domain || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || title.includes(q) || domain.includes(q);
      if (!matchesSearch) return false;

      if (activeFilter === 'courses') return item.courseType !== 'INTERNSHIP';
      if (activeFilter === 'internships') return item.courseType === 'INTERNSHIP';
      if (activeFilter === 'completed') return (item.progressPct ?? 0) >= 100 || item.certificate;
      return true;
    });
  }, [enrollments, activeFilter, searchQuery]);

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Decorative Ambient Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* ─── Student Session Verification Line ─── */}
          {user && (
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-indigo-300 font-mono shadow-sm">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Student: {user.name}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-[11px] text-slate-400">
                ID: {user.id ? `#${user.id.slice(-6).toUpperCase()}` : 'ACTIVE'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted Session</span>
              </span>
            </div>
          )}

          {/* ─── Header Banner & Metrics Strip ─── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>My Active Programs &amp; Internships</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Enrolled Courses &amp; Internships
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Access your real-time curriculum, stream lessons, track project milestones, and access verifiable graduation certificates.
              </p>
            </div>

            {/* Metrics Counter Badge */}
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/90 p-2.5 rounded-2xl backdrop-blur-xl shadow-xl self-start md:self-auto">
              <div className="px-4 py-1.5 text-center border-r border-slate-800">
                <div className="text-lg font-black text-white">{enrollments.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Enrolled</div>
              </div>
              <div className="px-4 py-1.5 text-center border-r border-slate-800">
                <div className="text-lg font-black text-emerald-400">{totalCompleted}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Certificates</div>
              </div>
              <div className="px-4 py-1.5 text-center">
                <div className="text-lg font-black text-indigo-400">{totalInternships}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Internships</div>
              </div>
            </div>
          </div>

          {/* ─── Filter Tabs & Search Bar ─── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
              {[
                { id: 'all', label: `All Programs (${enrollments.length})` },
                { id: 'courses', label: `Courses (${totalCourses})` },
                { id: 'internships', label: `Internships (${totalInternships})` },
                { id: 'completed', label: `Certified (${totalCompleted})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs..."
                className="w-full sm:w-60 pl-9 pr-8 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-xl transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ─── Main Program Tracks Grid ─── */}
          {!isAuthenticated && !authLoading ? (
            /* Unauthenticated Prompt */
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-10 text-center max-w-xl mx-auto my-12 space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Sign In to View Your Enrolled Courses
              </h2>
              <p className="text-xs text-slate-400">
                Log in with your registered student account to continue learning where you left off.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : filteredEnrollments.length > 0 ? (
            /* Enrolled Tracks Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEnrollments.map((item) => {
                const slug = item.courseSlug || item.courseId || '';
                const isInternship = item.courseType === 'INTERNSHIP';
                const progress = item.progressPct ?? (item.certificate ? 100 : 0);
                const isCertified = progress >= 100 || !!item.certificate;
                const studentName = item.studentName || user?.name || 'Enrolled Student';
                const studentId = item.userId || user?.id || '';

                return (
                  <div
                    key={item.id || slug}
                    className="bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/50 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between space-y-5 backdrop-blur-xl group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isInternship
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                        }`}>
                          {isInternship ? '💼 Industrial Internship' : item.isFree ? '📚 Free Starter Track' : '🚀 Pro Program'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isCertified ? (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{progress}% In Progress</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Title & Domain */}
                      <div>
                        <div className="text-[11px] font-mono text-indigo-400 font-semibold mb-1 flex items-center gap-1.5">
                          <span>{item.domain || (isInternship ? 'Backend & Cloud Systems' : 'Full-Stack Engineering')}</span>
                          {item.durationWeeks && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{item.durationWeeks} Weeks</span>
                            </>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.courseTitle || 'Enrolled Program'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description || 'Comprehensive curriculum with practical module exercises, code assignments, and verifiable portfolio builds.'}
                        </p>
                      </div>

                      {/* Student ID & Session Badge */}
                      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Student: <strong className="text-slate-200 font-medium">{studentName}</strong></span>
                        </div>
                        {studentId && (
                          <div className="font-mono text-[10px] text-slate-500">
                            #{studentId.slice(-6).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Progress Bar & Telemetry */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-indigo-400" />
                            <span>{item.totalModules ? `${item.totalModules} Modules` : 'Curriculum Modules'}</span>
                          </span>
                          <span className="text-indigo-400 font-mono">{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Capstone / Certificate Status Pill */}
                      {item.certificate ? (
                        <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-800/40 px-3.5 py-2 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-emerald-300">
                            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="font-semibold">Grade: {item.certificate.grade || 'Distinction (A+)'} Certificate Issued</span>
                          </div>
                          <Link
                            href={item.certificate.verifyUrl || `/verify/${item.certificate.certId}`}
                            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
                          >
                            <span>Verify ID</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      ) : item.submission ? (
                        <div className="flex items-center justify-between bg-amber-950/30 border border-amber-800/40 px-3.5 py-2 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-amber-300">
                            <FolderGit2 className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="font-semibold">Capstone: {item.submission.status || 'Under Review'}</span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400">Evaluating</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
                      <Link
                        href={`/learn/${slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{progress > 0 ? 'Resume Lessons' : 'Start Course'}</span>
                      </Link>

                      <Link
                        href={`/learn/${slug}/project`}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-colors"
                        title="Submit Capstone Project"
                      >
                        <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Submit Capstone</span>
                      </Link>

                      {item.certificate ? (
                        <Link
                          href={item.certificate.verifyUrl || `/verify/${item.certificate.certId}`}
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs transition-colors"
                          title="View Certificate"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Certificate</span>
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors"
                          title="Certificates Dashboard"
                        >
                          <Award className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden sm:inline">Badges</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 space-y-4 backdrop-blur-xl shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">No Programs Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? `No enrolled courses matched "${searchQuery}". Try clearing your search.`
                  : 'You have not enrolled in any programs yet. Browse our engineering cohorts and programs.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href="/courses"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all inline-flex items-center gap-2"
                  >
                    <span>Explore Virtual Course&amp;Programs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
