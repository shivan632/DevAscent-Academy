'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetchApi } from '@/lib/api';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { PdfEmbed } from '@/components/PdfEmbed';
import {
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  FolderGit2,
  Share2,
  ExternalLink,
  Code2,
  Check,
  ShieldCheck,
  Menu,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetchApi(url).then((res) => res?.data || res);

const CAPSTONE_BLUEPRINTS = [
  {
    id: 1,
    title: 'DevAscent Collaborative Workspace & Cloud Editor',
    description: 'Real-time collaborative markdown editor and kanban workspace with WebSockets, optimistic UI updates, and user activity streams.',
    techStack: ['React 19', 'Next.js App Router', 'Tailwind CSS', 'WebSockets / Socket.io', 'PostgreSQL'],
    features: [
      'Multi-user live cursor and document sync engine',
      'Drag-and-drop kanban task board with persistence',
      'Granular permission sharing with read/write link generation',
    ],
    githubRepoSuggestion: 'devascent-collaborative-workspace',
  },
  {
    id: 2,
    title: 'Multi-Tenant SaaS Subscription Billing Engine',
    description: 'SaaS billing dashboard supporting organization tenant isolation, Stripe recurring subscriptions, invoice PDFs, and webhooks.',
    techStack: ['React', 'NestJS', 'Prisma ORM', 'Stripe API / Razorpay', 'Neon DB'],
    features: [
      'Tiered pricing subscription checkout with auto-proration',
      'Secure webhook signature verification & idempotency guards',
      'Automated PDF invoice generation and transaction auditing',
    ],
    githubRepoSuggestion: 'saas-multitenant-billing-engine',
  },
  {
    id: 3,
    title: 'High-Performance E-Commerce REST & GraphQL API',
    description: 'Scalable backend service with Redis caching, compound indexing in PostgreSQL, role-based authorization, and order state machine.',
    techStack: ['Node.js', 'NestJS', 'Redis', 'PostgreSQL', 'Docker'],
    features: [
      'Redis cache layer with sub-5ms query response times',
      'Atomic inventory decrement with database row locking',
      'Automated order confirmation email worker via BullMQ',
    ],
    githubRepoSuggestion: 'enterprise-ecommerce-backend-api',
  },
  {
    id: 4,
    title: 'DevAscent Virtual Cloud File Storage & Media Pipeline',
    description: 'Cloud file management system with presigned S3 uploads, image compression workers, folder hierarchies, and access control.',
    techStack: ['Next.js App Router', 'AWS S3 / Cloudflare R2', 'Sharp.js', 'TypeScript', 'PostgreSQL'],
    features: [
      'Direct browser-to-S3 multi-part presigned upload flows',
      'Background thumbnail generation and EXIF metadata extraction',
      'Time-expiring public shareable links with password protection',
    ],
    githubRepoSuggestion: 'cloud-file-vault-s3-pipeline',
  },
  {
    id: 5,
    title: 'AI-Powered Resume & Portfolio Analyzer with ATS Score',
    description: 'AI assistant that evaluates developer resumes against job descriptions, analyzes GitHub repositories, and scores ATS compatibility.',
    techStack: ['React 19', 'Tailwind CSS', 'OpenAI API / Gemini SDK', 'Next.js App Router'],
    features: [
      'PDF parser extracting skills, projects, and work experience',
      'Keyword density analysis matching top tech job descriptions',
      'Actionable bullet-point revision suggestions with instant export',
    ],
    githubRepoSuggestion: 'ai-resume-ats-analyzer',
  },
];

export default function CapstoneProjectPage() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawCourseId).toLowerCase().trim().replace(/\s+/g, '-');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState(1);

  // Fast single SWR fetch
  const { data, error, isLoading } = useSWR(
    courseSlug ? `/courses/${courseSlug}/capstone/full` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
      keepPreviousData: true,
    }
  );

  const capstone = data?.capstone;
  const curriculum = data?.curriculum;
  const isUnlocked = capstone?.isUnlocked;

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-sm font-medium animate-pulse">Loading Capstone Brief...</p>
      </div>
    );
  }

  if (error || !capstone) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Course Notice</h2>
          <p className="text-sm text-slate-400">{error?.message || 'Could not load Capstone guidelines.'}</p>
          <div className="pt-2">
            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <div className="hidden md:block w-80 shrink-0 h-full">
        {curriculum && (
          <LearnSidebar
            curriculum={curriculum}
            currentPath={`/learn/${courseSlug}/project`}
            courseSlug={courseSlug}
          />
        )}
      </div>

      {/* ─── MOBILE DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10">
            {curriculum && (
              <LearnSidebar
                curriculum={curriculum}
                currentPath={`/learn/${courseSlug}/project`}
                courseSlug={courseSlug}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT STAGE ─── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Curriculum</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Final Capstone Phase
            </span>
          </div>
        </header>

        {/* Scrollable Stage */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 pb-24">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800/80 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>Capstone Project Specification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {curriculum?.course?.title || 'Web Development'} — Capstone Portfolio
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Build a production-grade web application to demonstrate mastery of modern web architecture. Submit your public GitHub repository and LinkedIn showcase post to claim your verified certificate.
              </p>
            </div>

            {/* 🔒 Locked Alert (If not all topics + quizzes completed) */}
            {!isUnlocked ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-300 space-y-3">
                <div className="flex items-center gap-3 text-amber-400 font-bold text-sm">
                  <Lock className="w-5 h-5" />
                  <span>Capstone Project is Locked</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You must complete all <span className="text-white font-semibold">15 topics</span> and pass all <span className="text-white font-semibold">15 quizzes (60%+)</span> before unlocking the Capstone Submission phase.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/learn/${courseSlug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                  >
                    <span>Continue Course Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 📄 Course Project PDF Embed */}
                <PdfEmbed
                  url={capstone?.projectPdfUrl || capstone?.exercisePdfUrl}
                  title={capstone?.projectPdfTitle || capstone?.exercisePdfTitle || `${curriculum?.course?.title || 'Capstone'} — Official Specification & Rubric`}
                  emptyMessage="Course project PDF not uploaded yet"
                />

                {/* Project Blueprints Selection (from DB or default benchmarks) */}
                {(() => {
                  const projectsList =
                    Array.isArray(capstone?.projects) && capstone.projects.length > 0
                      ? capstone.projects
                      : CAPSTONE_BLUEPRINTS;

                  const currentBp =
                    projectsList.find((b: any) => (b.id || b.title) === selectedBlueprint) ||
                    projectsList[0] ||
                    CAPSTONE_BLUEPRINTS[0];

                  return (
                    <>
                      <div className="space-y-3">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-indigo-400" />
                          <span>Capstone Project Blueprints & Options ({projectsList.length})</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {projectsList.map((bp: any, idx: number) => {
                            const bpId = bp.id || idx + 1;
                            const isSelected = (currentBp.id || currentBp.title) === (bp.id || bp.title);

                            return (
                              <button
                                key={bpId}
                                type="button"
                                onClick={() => setSelectedBlueprint(bp.id || bp.title)}
                                className={`text-left p-4 rounded-xl border transition-all ${
                                  isSelected
                                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                }`}
                              >
                                <span className="text-[10px] font-bold text-indigo-400">Blueprint #{idx + 1}</span>
                                <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">
                                  {typeof bp === 'string' ? bp : bp.title}
                                </h3>
                                {bp.description && (
                                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{bp.description}</p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Blueprint Detail */}
                      {currentBp && (
                        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                              Selected Project Architecture
                            </span>
                            <h3 className="text-lg font-bold text-white">
                              {typeof currentBp === 'string' ? currentBp : currentBp.title}
                            </h3>
                            {currentBp.description && (
                              <p className="text-xs text-slate-300 leading-relaxed">{currentBp.description}</p>
                            )}
                          </div>

                          {/* Tech Stack Chips (if available) */}
                          {Array.isArray(currentBp.techStack) && currentBp.techStack.length > 0 && (
                            <div className="space-y-1.5 pt-2">
                              <span className="text-[11px] font-bold text-slate-400">Recommended Tech Stack:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {currentBp.techStack.map((tech: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md bg-slate-850 border border-slate-700/60 text-[11px] font-mono text-slate-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Features Required (if available) */}
                          {Array.isArray(currentBp.features) && currentBp.features.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <span className="text-[11px] font-bold text-slate-400">Core Engineering Features:</span>
                              <ul className="space-y-1.5 text-xs text-slate-300">
                                {currentBp.features.map((feat: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Repo Name Hint */}
                          {currentBp.githubRepoSuggestion && (
                            <div className="pt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                              <span className="text-slate-400 font-mono">Suggested GitHub Repo Name:</span>
                              <code className="text-indigo-300 font-bold">{currentBp.githubRepoSuggestion}</code>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* 📋 Deliverables & Verification Checklist */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Submission Deliverables Checklist</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Public GitHub Repository:</strong> Clean code, modular component hierarchy, no secrets committed.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Professional README.md:</strong> Architecture decisions, feature list, setup instructions, and demo GIF.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>LinkedIn Showcase Post:</strong> Post tag with #DevAscentAcademy and proof-of-work demonstration.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── FIXED BOTTOM SUBMIT BAR ─── */}
        <footer className="border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-8 py-3 shrink-0 flex items-center justify-between gap-2">
          <Link
            href={`/learn/${courseSlug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Curriculum</span>
          </Link>

          {isUnlocked ? (
            <Link
              href={`/learn/${courseSlug}/submit`}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>Submit Capstone Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs sm:text-sm cursor-not-allowed opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>Complete All 15 Topics to Unlock</span>
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
