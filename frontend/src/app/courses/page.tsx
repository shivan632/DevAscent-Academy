'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';
import {
  Code2,
  Server,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Briefcase,
  Award,
  Terminal,
  Cpu,
  Smartphone,
  Database,
  Bot,
  Palette,
  Check,
  Search,
  Sparkles,
  BookOpen,
} from 'lucide-react';

import { ALL_COURSES_CATALOG } from '../../lib/courseCatalogData';
import { useAuthStore } from '../../lib/store/authStore';
export { ALL_COURSES_CATALOG };

export default function CourseDirectoryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [courses, setCourses] = useState<any[]>(ALL_COURSES_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.getCourses();
        const apiCourses: any[] =
          res?.data?.courses || res?.courses || (Array.isArray(res?.data) ? res.data : []);

        if (apiCourses && apiCourses.length > 0) {
          const dbCourseMap = new Map(apiCourses.map((c: any) => [c.slug, c]));

          // Merge live DB prices into ALL_COURSES_CATALOG cards
          const merged = ALL_COURSES_CATALOG.map((catalogItem) => {
            const dbCourse = dbCourseMap.get(catalogItem.slug);
            if (!dbCourse) return catalogItem;
            return {
              ...catalogItem,
              ...dbCourse,
              priceInPaise: dbCourse.priceInPaise ?? catalogItem.priceInPaise,
              earlyBirdPriceInPaise:
                dbCourse.earlyBirdPriceInPaise ?? catalogItem.earlyBirdPriceInPaise,
              icon: catalogItem.icon,
              tasks: catalogItem.tasks,
              badge: catalogItem.badge,
              color: catalogItem.color,
            };
          });

          // Also include any newly added DB courses not in catalog
          const catalogSlugs = new Set(ALL_COURSES_CATALOG.map((c) => c.slug));
          const extraCourses = apiCourses.filter((c: any) => !catalogSlugs.has(c.slug));

          setCourses([...merged, ...extraCourses]);
        }
      } catch (e) {
        // Fallback to full catalog if API is unreachable
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase().trim();
    return courses.filter((c) => 
      c.title?.toLowerCase().includes(q) || 
      c.description?.toLowerCase().includes(q) ||
      c.domain?.toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* ─── Hero Header ─── */}
          <div suppressHydrationWarning className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>4-Week Cohorts & Applied Engineering Programs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Virtual{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Course&amp;Programs
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Build practical skills through structured learning, hands-on projects, and industry-focused programs. Learn modern technologies. Build real projects. Earn verifiable credentials.
            </p>

            {/* Quick Search Bar */}
            <div className="pt-2 max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs by technology (React, Python, Java...)"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-xl shadow-lg transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ─── Guarantee Strip ─── */}
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white">Batch #04 Registrations Open</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified SHA-256 Certificates</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Hands-on Capstone Projects</span>
              </span>
            </div>
          </div>

          {/* ─── Programs Grid ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => {
              const isInternship = course.type === 'INTERNSHIP';
              const price = `₹${((course.earlyBirdPriceInPaise || 19900) / 100).toLocaleString()}`;
              const origPrice = `₹${((course.priceInPaise || 79900) / 100).toLocaleString()}`;
              const IconComp = course.icon || Briefcase;

              return (
                <div
                  key={course.id || course.slug}
                  className="bg-slate-900/70 border border-slate-800/90 rounded-3xl backdrop-blur-xl shadow-xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {course.badge || (isInternship ? 'Virtual Internship' : 'Program')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {course.durationWeeks || 4} Weeks
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Milestone Tasks Preview */}
                    {course.tasks && course.tasks.length > 0 && (
                      <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                          3 Milestone Tasks:
                        </span>
                        {course.tasks.map((task: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{task}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{course.level || 'Beginner to Intermediate'}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-emerald-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>Verifiable Certificate</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-6 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white">{price}</span>
                        <span className="text-xs text-slate-500 line-through">{origPrice}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block">
                        One-Time Fee • No Hidden Costs
                      </span>
                    </div>

                    <Link
                      href={
                        isAuthenticated && user
                          ? `/checkout?course=${course.slug}&price=${course.earlyBirdPriceInPaise / 100}`
                          : `/login?redirect=${encodeURIComponent(`/checkout?course=${course.slug}&price=${course.earlyBirdPriceInPaise / 100}`)}`
                      }
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Enroll ({price})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── Bottom Trust Section ─── */}
          <div className="mt-16 p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl text-center space-y-4 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why DevAscent Virtual Course&amp;Programs?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every candidate builds practical real-world milestones, submits capstone pull requests, passes curriculum evaluations, and is awarded a tamper-proof SHA-256 certificate verifiable by recruiters worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Self-Paced Schedule</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Permanent Public Registry ID</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hands-on Capstone Projects</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
