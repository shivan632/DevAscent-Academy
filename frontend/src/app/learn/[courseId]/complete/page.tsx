'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function CompletionFormPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const { user } = useAuthStore();

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);

  const [batch, setBatch] = useState('Cohort 14');
  const [projectName, setProjectName] = useState('');
  const [gitRepoUrl, setGitRepoUrl] = useState('');
  const [linkedinPostUrl, setLinkedinPostUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        router.push(`/login?redirect=/learn/${courseId}/complete`);
        return;
      }

      setLoading(true);
      try {
        const res = await api.getCourseBySlug(courseId);
        if (res?.course) {
          setCourse(res.course);
          setEnrollment(res.enrollment);
          setExistingSubmission(res.submission);
          if (res.submission) {
            setBatch(res.submission.batch || 'Cohort 14');
            setProjectName(res.submission.projectName || '');
            setGitRepoUrl(res.submission.gitRepoUrl || '');
            setLinkedinPostUrl(res.submission.linkedinPostUrl || '');
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side regex check for GitHub Repo URL
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
    if (!githubRegex.test(gitRepoUrl.trim())) {
      setError('Please provide a valid public GitHub repository URL (format: https://github.com/username/repository).');
      return;
    }

    // Client-side check for LinkedIn URL
    if (!linkedinPostUrl.trim().startsWith('https://www.linkedin.com/')) {
      setError('Please provide a valid LinkedIn post URL starting with https://www.linkedin.com/');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitCompletion({
        courseId: course?.id,
        batch,
        projectName: projectName.trim(),
        gitRepoUrl: gitRepoUrl.trim(),
        linkedinPostUrl: linkedinPostUrl.trim(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit completion form.');
    } finally {
      setSubmitting(false);
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

  const isApproved = existingSubmission?.status === 'APPROVED';
  const isPending = existingSubmission?.status === 'PENDING';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <span>/</span>
            <Link href={`/learn/${courseId}`} className="hover:text-indigo-600">{course?.title || 'Course'}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Graduation & Certification Form</span>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Graduation Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Project Review & Certificate Application
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-1.5 max-w-xl">
                Submit your public capstone repository and LinkedIn completion post. Upon instructor review, your official tamper-proof certificate will be emailed and added to your dashboard.
              </p>
            </div>

            {/* Submission Status Alert */}
            {isApproved && (
              <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-sm">🎉 Congratulations! Your Project was Approved!</p>
                  <p>Your official verifiable certificate has been issued and emailed. You can view or download it from your dashboard.</p>
                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                    >
                      <span>Go to My Certificates →</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {isPending && !success && (
              <div className="m-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-sm">⏳ Submission Under Review</p>
                  <p>You have already submitted this project. Lead instructor Shivan Mishra is reviewing your code. You can update your links below if needed.</p>
                </div>
              </div>
            )}

            {success ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Project Submitted Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Your graduation project has been registered in the DevAscent review queue. You will receive an email as soon as your certificate is verified and approved.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Auto-picked details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Student Name (Auto-picked)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || ''}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Verified Email (Auto-picked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Batch & Project Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Batch / Cohort
                    </label>
                    <select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                    >
                      <option value="Cohort 14">Cohort #14 (Current)</option>
                      <option value="Cohort 13">Cohort #13</option>
                      <option value="Cohort 12">Cohort #12</option>
                      <option value="Self-Paced">Self-Paced Track</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Capstone Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Scalable Microservices Billing Engine"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* GitHub Repo Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FolderGit2 className="w-4 h-4 text-slate-900" />
                      <span>Public GitHub Repository Link</span>
                    </span>
                    <span className="text-[10px] text-indigo-600 font-normal">Must be Public</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={gitRepoUrl}
                    onChange={(e) => setGitRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/your-capstone-repo"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ensure your repo has a detailed README.md explaining architecture, setup, and screenshots.
                  </p>
                </div>

                {/* LinkedIn Post Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>LinkedIn Completion / Learning Post Link</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={linkedinPostUrl}
                    onChange={(e) => setLinkedinPostUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/posts/your-name_post-activity-id"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-900"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Post your project demo or learning journey on LinkedIn tagging DevAscent Academy.
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting || isApproved}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {submitting
                        ? 'Submitting for Review...'
                        : isPending
                        ? 'Update Project Submission'
                        : 'Submit Project & Claim Certificate'}
                    </span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
