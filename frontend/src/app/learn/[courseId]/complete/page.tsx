'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { useAuthStore } from '../../../../lib/store/authStore';
import { api } from '../../../../lib/api';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Share2,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Check,
  Clock,
  Loader2,
} from 'lucide-react';

export default function CompletionFormPage() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseId = decodeURIComponent(rawCourseId).trim();
  const { user, isLoading: authLoading, checkAuth } = useAuthStore();

  // Instant synchronous hydration from localStorage & active auth store
  const cachedUser = useMemo(() => {
    if (user) return user;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('devascent_user');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
    }
    return null;
  }, [user]);

  const [allEnrollments, setAllEnrollments] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('devascent_enrollments_cache');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
    }
    return [];
  });

  const [course, setCourse] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('devascent_enrollments_cache');
        if (raw) {
          const list = JSON.parse(raw);
          const matched = list.find((e: any) =>
            e.courseSlug?.toLowerCase() === courseId.toLowerCase() ||
            e.courseId === courseId
          ) || list[0];
          if (matched) {
            return {
              id: matched.courseId,
              title: matched.courseTitle,
              slug: matched.courseSlug || courseId,
            };
          }
        }
      } catch (e) {}
    }
    return {
      id: courseId,
      title: courseId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      slug: courseId,
    };
  });

  const [enrollment, setEnrollment] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('devascent_enrollments_cache');
        if (raw) {
          const list = JSON.parse(raw);
          return list.find((e: any) =>
            e.courseSlug?.toLowerCase() === courseId.toLowerCase() ||
            e.courseId === courseId
          ) || list[0] || null;
        }
      } catch (e) {}
    }
    return null;
  });

  const [existingSubmission, setExistingSubmission] = useState<any>(null);

  const [batch, setBatch] = useState('Cohort 14');
  const [projectName, setProjectName] = useState('');
  const [gitRepoUrl, setGitRepoUrl] = useState('');
  const [linkedinPostUrl, setLinkedinPostUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [revalidating, setRevalidating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Non-blocking parallel background sync
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (authLoading) return;
      if (!user && !cachedUser) {
        router.push(`/login?redirect=/learn/${courseId}/complete`);
        return;
      }

      setRevalidating(true);
      try {
        // Parallel fetch of enrollments and course details
        const [enrollRes, courseRes] = await Promise.allSettled([
          api.getMyEnrollments().catch(() => null),
          api.getCourseBySlug(courseId).catch(() => null),
        ]);

        if (!isMounted) return;

        let list: any[] = [];
        if (enrollRes.status === 'fulfilled' && enrollRes.value) {
          const rawEnroll = enrollRes.value?.data !== undefined ? enrollRes.value.data : enrollRes.value;
          list = Array.isArray(rawEnroll?.enrollments)
            ? rawEnroll.enrollments
            : Array.isArray(rawEnroll)
            ? rawEnroll
            : [];
          if (list.length > 0) {
            setAllEnrollments(list);
            try {
              localStorage.setItem('devascent_enrollments_cache', JSON.stringify(list));
            } catch (e) {}
          }
        }

        const matchedEnroll = list.find((e: any) =>
          e.courseSlug?.toLowerCase() === courseId.toLowerCase() ||
          e.courseId === courseId
        ) || (list.length > 0 ? list[0] : null);

        if (matchedEnroll) {
          setEnrollment(matchedEnroll);
        }

        let courseData = courseRes.status === 'fulfilled' ? courseRes.value : null;

        // If direct course fetch didn't return course details, try with matched enrollment's courseSlug
        if (!courseData?.course && matchedEnroll?.courseSlug && matchedEnroll.courseSlug !== courseId) {
          courseData = await api.getCourseBySlug(matchedEnroll.courseSlug).catch(() => null);
        }

        if (!isMounted) return;

        if (courseData?.course) {
          setCourse(courseData.course);
          if (courseData.enrollment) setEnrollment(courseData.enrollment);
          if (courseData.submission) {
            setExistingSubmission(courseData.submission);
            setBatch(courseData.submission.batch || 'Cohort 14');
            setProjectName(courseData.submission.projectName || '');
            setGitRepoUrl(courseData.submission.gitRepoUrl || '');
            setLinkedinPostUrl(courseData.submission.linkedinPostUrl || '');
          }
        } else if (matchedEnroll) {
          setCourse((prev: any) => ({
            ...prev,
            id: matchedEnroll.courseId,
            title: matchedEnroll.courseTitle,
            slug: matchedEnroll.courseSlug || courseId,
          }));
        }
      } catch (err: any) {
        console.warn('Background sync error in completion portal:', err);
      } finally {
        if (isMounted) {
          setRevalidating(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [courseId, user, cachedUser, authLoading, router]);

  // Real-time URL validation flags
  const isGitValid = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/.test(gitRepoUrl.trim());
  const isLinkedinValid =
    linkedinPostUrl.trim().startsWith('https://www.linkedin.com/') ||
    linkedinPostUrl.trim().startsWith('https://linkedin.com/');

  const activeUser = user || cachedUser;
  const progressPct = Number(enrollment?.progressPct) || 0;
  const isUnder100 = progressPct < 100 && activeUser?.role !== 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isGitValid) {
      setError('Please provide a valid public GitHub repository URL (format: https://github.com/username/repository).');
      return;
    }

    if (!isLinkedinValid) {
      setError('Please provide a valid LinkedIn post link starting with https://www.linkedin.com/');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitCompletion({
        courseId: course?.id || enrollment?.courseId || courseId,
        batch,
        projectName: projectName.trim(),
        gitRepoUrl: gitRepoUrl.trim(),
        linkedinPostUrl: linkedinPostUrl.trim(),
      });

      setSuccess(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err: any) {
      const msg = err?.message;
      setError(
        Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to submit completion form.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isApproved = existingSubmission?.status === 'APPROVED';
  const isPending = existingSubmission?.status === 'PENDING';
  const activeCourseSlug = course?.slug || enrollment?.courseSlug || courseId;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Navigation Bar / Direct Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Link
                href="/dashboard?tab=submissions"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="text-slate-900 dark:text-white font-bold">Graduation &amp; Certification</span>
            </div>

            <div className="flex items-center gap-2">
              {revalidating && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                  <span>Syncing...</span>
                </span>
              )}
              <Link
                href={`/learn/${activeCourseSlug}`}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/90 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-300/40 dark:border-slate-700/60"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Course Syllabus</span>
              </Link>
            </div>
          </div>

          {/* Main Container */}
          <div className="bg-white/95 dark:bg-[#0C101F]/90 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-indigo-950/20 overflow-hidden">
            
            {/* Header Banner */}
            <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-950/90 text-white border-b border-indigo-500/20">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Graduation &amp; Certification Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Project Review &amp; Certificate Application
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Submit your public capstone repository and LinkedIn completion post. Upon instructor review, your official tamper-proof SHA-256 certificate will be minted to your dashboard.
                </p>
              </div>

              {/* Course Selection & Target Track Header */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-300 font-medium">Target Track:</span>
                  <span className="font-bold text-white bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                    {course?.title || 'Selected Program'}
                  </span>
                </div>
                {allEnrollments.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-300 text-[11px]">Switch Program:</span>
                    <select
                      value={activeCourseSlug}
                      onChange={(e) => router.push(`/learn/${e.target.value}/complete`)}
                      className="bg-[#10142D] border border-indigo-500/30 rounded-lg px-2.5 py-1 text-xs text-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      {allEnrollments.map((en) => (
                        <option key={en.courseSlug || en.courseId} value={en.courseSlug || en.courseId}>
                          {en.courseTitle} ({en.progressPct || 0}%)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Curriculum Progress Gate Notice */}
            {isUnder100 && (
              <div className="m-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Curriculum Progress: {progressPct}% / 100% Required</span>
                  </div>
                  <p className="text-amber-700/90 dark:text-amber-300/80 text-[11px]">
                    Complete all lessons and quizzes to reach 100% progress before applying for certification review.
                  </p>
                </div>
                <Link
                  href={`/learn/${activeCourseSlug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1 shrink-0 self-start sm:self-center shadow-md shadow-amber-500/20"
                >
                  <span>Continue Lessons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Submission Status Alerts */}
            {isApproved && (
              <div className="m-6 p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 rounded-2xl flex items-start gap-3.5 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1.5">
                  <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    🎉 Congratulations! Your Project Was Approved!
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    Your official verifiable certificate has been issued with tamper-proof SHA-256 seal. You can view, download, or share it directly from your dashboard.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/dashboard?tab=certificates"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <Award className="w-4 h-4" />
                      <span>View My Certificate →</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {isPending && !success && (
              <div className="m-6 p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-3.5 text-amber-800 dark:text-amber-300">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1.5">
                  <p className="font-bold text-sm text-amber-900 dark:text-amber-200">
                    ⏳ Submission Under Instructor Review
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    Your submission for <span className="font-semibold">{existingSubmission?.projectName || 'Capstone'}</span> is currently in the review queue. Standard instructor turnaround is 24–48 hours. You can update your links below anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Form / Success Views */}
            {success ? (
              <div className="p-8 sm:p-12 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Project Submitted Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Your capstone project has been placed in the DevAscent priority review queue. You will receive an email confirmation and immediate dashboard notification upon certificate approval.
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/dashboard?tab=submissions"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>View in Dashboard Submissions</span>
                  </Link>

                  <Link
                    href={`/learn/${activeCourseSlug}`}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                  >
                    Back to Course Syllabus
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                
                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Identity Verification Slate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Student Name</span>
                      <span className="text-emerald-500 flex items-center gap-1 font-semibold text-[10px]">
                        <Check className="w-3 h-3" /> Auto-Verified
                      </span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={activeUser?.name || ''}
                      placeholder="Loading student name..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Verified Email</span>
                      <span className="text-emerald-500 flex items-center gap-1 font-semibold text-[10px]">
                        <Check className="w-3 h-3" /> Ledger Account
                      </span>
                    </label>
                    <input
                      type="email"
                      disabled
                      value={activeUser?.email || ''}
                      placeholder="Loading verified email..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Cohort & Project Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Batch / Cohort
                    </label>
                    <select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white"
                    >
                      <option value="Cohort 14">Cohort #14 (Current)</option>
                      <option value="Cohort 13">Cohort #13</option>
                      <option value="Cohort 12">Cohort #12</option>
                      <option value="Self-Paced">Self-Paced Track</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Capstone Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Scalable Microservices Billing Engine"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* GitHub Repository Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FolderGit2 className="w-4 h-4 text-indigo-500" />
                      <span>Public GitHub Repository Link</span>
                    </span>
                    {gitRepoUrl.length > 0 && (
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${isGitValid ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isGitValid ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isGitValid ? 'Valid GitHub URL' : 'Must be github.com/user/repo'}
                      </span>
                    )}
                  </label>
                  <input
                    type="url"
                    required
                    value={gitRepoUrl}
                    onChange={(e) => setGitRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/your-capstone-repo"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Repository must contain a detailed README.md explaining architecture, setup instructions, and screenshots.
                  </p>
                </div>

                {/* LinkedIn Completion Post Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-blue-500" />
                      <span>LinkedIn Completion Post Link</span>
                    </span>
                    {linkedinPostUrl.length > 0 && (
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${isLinkedinValid ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isLinkedinValid ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isLinkedinValid ? 'Valid LinkedIn URL' : 'Must start with https://www.linkedin.com/'}
                      </span>
                    )}
                  </label>
                  <input
                    type="url"
                    required
                    value={linkedinPostUrl}
                    onChange={(e) => setLinkedinPostUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/posts/your-name_post-activity-id"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Post your project demo or learning journey on LinkedIn tagging DevAscent Academy.
                  </p>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting || isApproved}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {submitting
                        ? 'Submitting for Review...'
                        : isPending
                        ? 'Update Project Submission'
                        : 'Submit Project & Apply for Certificate'}
                    </span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Cryptographic Assurance Footnote */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 px-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>DevAscent Public Ledger Cryptographic Verification Standard</span>
            </div>
            <Link href="/verify" className="hover:underline text-indigo-600 dark:hover:text-indigo-400 font-semibold">
              Public Ledger Portal ↗
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
