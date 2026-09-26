'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

export default function EnrolledCoursesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('devascent_enrollments_cache');
        return cached ? JSON.parse(cached) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('devascent_enrollments_cache');
      return !cached;
    }
    return true;
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'courses' | 'internships' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    checkAuth();

    const token = typeof window !== 'undefined' ? localStorage.getItem('devascent_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchEnrollments() {
      try {
        const res = await api.getMyEnrollments();
        const payload = res?.data || res;
        const list = Array.isArray(payload?.enrollments)
          ? payload.enrollments
          : (Array.isArray(payload) ? payload : (Array.isArray(res?.enrollments) ? res.enrollments : []));
        setEnrollments(list);
        if (typeof window !== 'undefined') {
          localStorage.setItem('devascent_enrollments_cache', JSON.stringify(list));
        }
      } catch (err) {
        // Keep existing cached data
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollments();
  }, [checkAuth]);

  const filteredEnrollments = enrollments.filter((item) => {
    const title = (item.courseTitle || item.title || '').toLowerCase();
    const domain = (item.domain || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || domain.includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'courses') return item.courseType !== 'INTERNSHIP';
    if (activeFilter === 'internships') return item.courseType === 'INTERNSHIP';
    if (activeFilter === 'completed') return (item.progressPct ?? 0) >= 100 || item.certificate;
    return true;
  });

  const totalCompleted = enrollments.filter((e) => (e.progressPct ?? 0) >= 100 || e.certificate).length;
  const totalCourses = enrollments.filter((e) => e.courseType !== 'INTERNSHIP').length;
  const totalInternships = enrollments.filter((e) => e.courseType === 'INTERNSHIP').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Breadcrumb & User Context Badge */}
          {mounted && user && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-indigo-400 font-mono">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Student: {user.name}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-[11px] text-slate-500">ID: {user.id ? `#${user.id.slice(-6).toUpperCase()}` : 'ACTIVE'}</span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Neon DB Session</span>
              </span>
            </div>
          )}

          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Active Programs & Internships</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Enrolled Courses & Internships
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Access your real-time curriculum, stream lessons, track project milestones, and access verifiable graduation certificates.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 border border-slate-800 p-2 rounded-2xl">
              <div className="px-3 py-1.5 text-center border-r border-slate-800">
                <div className="text-base font-black text-white">{mounted ? enrollments.length : 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Enrolled</div>
              </div>
              <div className="px-3 py-1.5 text-center border-r border-slate-800">
                <div className="text-base font-black text-emerald-400">{mounted ? totalCompleted : 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Certificates</div>
              </div>
              <div className="px-3 py-1.5 text-center">
                <div className="text-base font-black text-indigo-400">{mounted ? totalInternships : 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Internships</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                All Programs ({mounted ? enrollments.length : 0})
              </button>
              <button
                onClick={() => setActiveFilter('courses')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeFilter === 'courses'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Courses ({mounted ? totalCourses : 0})
              </button>
              <button
                onClick={() => setActiveFilter('internships')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeFilter === 'internships'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Internships ({mounted ? totalInternships : 0})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeFilter === 'completed'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Certified ({mounted ? totalCompleted : 0})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs..."
                className="w-full sm:w-56 pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Dynamic Content: Skeleton until mounted, then exact auth state */}
          {!mounted || (loading && isAuthenticated) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-72 bg-slate-900/60 border border-slate-800 rounded-3xl p-6" />
              ))}
            </div>
          ) : !isAuthenticated ? (
            /* Unauthenticated Prompt */
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto my-12 space-y-4">
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
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : filteredEnrollments.length > 0 ? (
            /* Enrolled Tracks Grid from Live DB */
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
                    className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 backdrop-blur-sm relative overflow-hidden group"
                  >
                    {/* Subtle top glow */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isInternship
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {isInternship ? '💼 Industrial Internship' : item.isFree ? '📚 Free Starter Track' : '🚀 Pro Accelerator'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isCertified ? (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
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
                        <h2 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                          {item.courseTitle || 'Enrolled Program'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description || 'Comprehensive curriculum with practical module exercises, code assignments, and verifiable portfolio builds.'}
                        </p>
                      </div>

                      {/* Relational Student Verification Line */}
                      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
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
                        <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-800/40 px-3 py-2 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-emerald-300">
                            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="font-semibold">Grade: {item.certificate.grade || 'A+'} Certificate Issued</span>
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
                        <div className="flex items-center justify-between bg-amber-950/30 border border-amber-800/40 px-3 py-2 rounded-xl text-xs">
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
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{progress > 0 ? 'Resume Lessons' : 'Start Course'}</span>
                      </Link>

                      <Link
                        href={`/learn/${slug}/complete`}
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
                          href="/dashboard?tab=certificates"
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
            /* Empty State: 0 Enrollments in DB */
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">No Programs Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {searchQuery
                  ? `No enrolled courses matched "${searchQuery}". Try clearing your search.`
                  : 'You have not enrolled in any programs yet. Browse our engineering cohorts and internships.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    Clear Filter
                  </button>
                ) : (
                  <Link
                    href="/courses"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2"
                  >
                    <span>Explore All Courses</span>
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
