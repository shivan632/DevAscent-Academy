'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuthStore } from '../../../lib/store/authStore';
import { api } from '../../../lib/api';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Lock,
  ChevronDown,
  Play,
  FileCode,
  Zap,
  Users,
  Star,
  Check,
  CreditCard,
  Layers,
  ArrowRight,
  Briefcase,
  ExternalLink,
  BookOpen,
  FolderGit2,
  ListTodo,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'full-stack-accelerator';
  const { user } = useAuthStore();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number>(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      try {
        const res = await api.getCourseBySlug(slug);
        if (res?.course) {
          setCourse(res.course);
          setModules(res.modules || []);
          setIsEnrolled(res.isEnrolled || false);
          setEnrollment(res.enrollment || null);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const handleEnrollFree = async () => {
    if (!user) {
      router.push('/login?redirect=/courses/' + slug);
      return;
    }
    setEnrolling(true);
    try {
      await api.enrollFree(slug);
      router.push(`/learn/${slug}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push('/login?redirect=/courses/' + slug);
      return;
    }
    setEnrolling(true);
    try {
      await api.applyCohort(slug);
      alert('Application submitted! Admin will review your profile shortly.');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit application.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFree = course?.isFree;
  const isInternship = course?.type === 'INTERNSHIP';
  const priceDisplay = isFree ? 'Free' : `₹${((course?.earlyBirdPriceInPaise || 149900) / 100).toLocaleString()}`;
  const originalPriceDisplay = isFree ? '' : `₹${((course?.priceInPaise || 499900) / 100).toLocaleString()}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-indigo-600">{isInternship ? 'Internships' : 'Cohorts'}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{course?.title || 'Program Details'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 border border-indigo-900/50 shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isInternship ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'}`}>
                      {isInternship ? '💼 Virtual Internship' : '🚀 Engineering Cohort'}
                    </span>
                    {isFree && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        100% Free
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90">
                      Cohort #{course?.cohortNumber || 14}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    {course?.title}
                  </h1>

                  <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed max-w-2xl">
                    {course?.description}
                  </p>

                  {isInternship && course?.stipendDetails && (
                    <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Stipend & Perks:</strong> {course.stipendDetails}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-indigo-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{course?.durationWeeks || 8} Weeks Duration</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>{modules.length} Modules & Capstones</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>Verifiable Certificate + QR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You'll Learn (Objectives) */}
              {course?.objectives && course.objectives.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span>What You Will Master</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.objectives.map((obj: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <span>Curriculum & Topics for Study</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Practical, code-first engineering modules</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {modules.length} Modules
                  </span>
                </div>

                <div className="space-y-3">
                  {modules.map((mod: any, mIdx: number) => {
                    const isOpen = openModuleIndex === mIdx;
                    return (
                      <div key={mod.id || mIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenModuleIndex(isOpen ? -1 : mIdx)}
                          className="w-full px-5 py-4 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                              {mod.moduleNumber || mIdx + 1}
                            </span>
                            <span className="font-semibold text-sm text-slate-900">{mod.title}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                        </button>

                        {isOpen && (
                          <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                            {mod.description && (
                              <p className="text-xs text-slate-500 mb-3 italic">{mod.description}</p>
                            )}
                            {mod.lessons?.map((lesson: any) => (
                              <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs sm:text-sm text-slate-700">
                                <div className="flex items-center gap-2.5">
                                  <Play className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{lesson.durationMinutes} mins</span>
                                  {lesson.isFreePreview ? (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                      PREVIEW
                                    </span>
                                  ) : !isEnrolled && (
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects to Build */}
              {course?.projects && course.projects.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-indigo-600" />
                    <span>Real-World Portfolio Projects</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.projects.map((proj: string, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                          <span>Project #{idx + 1}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{proj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments & Graduation Criteria */}
              {course?.assignments && course.assignments.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-indigo-600" />
                    <span>Assignments & Certification Criteria</span>
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    To receive your official verifiable certificate and offer letter, you must complete the lessons and submit a public GitHub repository with your capstone project.
                  </p>
                  <ul className="space-y-2">
                    {course.assignments.map((asg: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{asg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Right Sticky Conversion Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border-2 border-indigo-600 p-6 sm:p-8 shadow-xl space-y-6">
                
                {/* Pricing Block */}
                <div className="text-center space-y-2">
                  {isFree ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                      🎉 Free Enrollment Open
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full inline-block">
                      ⚡ Early Bird Price
                    </span>
                  )}
                  
                  <div className="flex items-baseline justify-center gap-3 pt-2">
                    <span className="text-4xl font-extrabold text-slate-900">{priceDisplay}</span>
                    {originalPriceDisplay && (
                      <span className="text-base text-slate-400 line-through">{originalPriceDisplay}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isFree ? 'Zero payment required. Lifetime access.' : 'All-inclusive: Mentorship, Project Review & Certificate'}
                  </p>
                </div>

                {/* Status / Enrollment State */}
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-medium">
                      ✅ You are enrolled in this track!
                    </div>
                    <Link
                      href={`/learn/${slug}`}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-sm"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : isFree ? (
                  <button
                    onClick={handleEnrollFree}
                    disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-sm disabled:opacity-50"
                  >
                    <span>{enrolling ? 'Enrolling...' : 'Enroll in Free Track Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : course?.requiresApproval ? (
                  <div className="space-y-2">
                    <Link
                      href={`/checkout?course=${slug}`}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm"
                    >
                      <span>Reserve Seat & Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleApply}
                      disabled={enrolling}
                      className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs transition-all"
                    >
                      Apply for Admin Review First
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/checkout?course=${slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm"
                  >
                    <span>Enroll in Cohort #{course?.cohortNumber || 14}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {/* Details List */}
                <div className="space-y-3 text-xs text-slate-700 border-y border-slate-100 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-semibold text-slate-900">{course?.durationWeeks || 8} Weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Credential:</span>
                    <span className="font-semibold text-slate-900">QR-Verifiable Certificate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Seats Remaining:</span>
                    <span className="font-semibold text-emerald-600">{course?.seatsRemaining || 9} of {course?.totalSeats || 40}</span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-slate-500 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>7-Day Money-Back Guarantee</span>
                  </div>
                  <p>100% full refund policy if not satisfied within 7 days.</p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
