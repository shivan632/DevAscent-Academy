'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi, api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import confetti from 'canvas-confetti';
import { getEmbedUrl, isDirectVideoUrl } from '@/lib/utils';
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  FileCode,
  Terminal,
  Download,
  Award,
  ArrowLeft,
  Sparkles,
  Lock,
  Loader2,
  FileText,
  HelpCircle,
  Send,
  Video,
  Clock,
  Check,
  X,
  Copy,
  ExternalLink,
  Layers,
  GraduationCap,
  RefreshCw,
  AlertTriangle,
  Mail,
  Maximize2
} from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

interface Question {
  id: string;
  question: string;
  options: string[];
  codeSnippet?: string;
  explanation?: string;
  correctOptionIndex?: number;
}

interface QuizData {
  id: string;
  title: string;
  passingScore: number;
  maxAttempts?: number;
  attemptsCount?: number;
  attemptsExhausted?: boolean;
  supportEmail?: string;
  isPassed?: boolean;
  questions: Question[];
}

interface Doubt {
  id: string;
  question: string;
  answer?: string;
  status: string;
  createdAt: string;
  userName: string;
  userAvatar?: string | null;
}

interface CapstoneProject {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  githubRepoSuggestion: string;
  linkedinTag: string;
}

const DEFAULT_CAPSTONE_PROJECTS: CapstoneProject[] = [
  {
    id: 1,
    title: 'Real-Time Collaborative Code & Markdown Workspace',
    description: 'A full-stack collaborative editor with WebSockets, syntax highlighting, multi-cursor presence, and live markdown preview.',
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Socket.io', 'PostgreSQL'],
    features: [
      'Real-time multi-user document synchronization',
      'Syntax highlighting with copy-to-clipboard code snippets',
      'GitHub OAuth and granular workspace sharing links',
    ],
    githubRepoSuggestion: 'devascent-collaborative-workspace',
    linkedinTag: '#DevAscentProject #FullStack #WebSockets #Nextjs',
  },
  {
    id: 2,
    title: 'Multi-Tenant SaaS Subscription Billing Engine',
    description: 'SaaS billing dashboard supporting organization tenant isolation, Stripe recurring subscriptions, invoice PDFs, and webhooks.',
    techStack: ['React', 'NestJS', 'Prisma ORM', 'Stripe API', 'Neon DB'],
    features: [
      'Tiered pricing subscription checkout with auto-proration',
      'Secure webhook signature verification & idempotency guards',
      'Automated PDF invoice generation and transaction auditing',
    ],
    githubRepoSuggestion: 'saas-multitenant-billing-engine',
    linkedinTag: '#DevAscent #BackendEngineering #Stripe #NestJS',
  },
  {
    id: 3,
    title: 'High-Performance E-Commerce REST & GraphQL API',
    description: 'Scalable backend service with Redis caching, compound indexing in PostgreSQL, role-based authorization, and order state machine.',
    techStack: ['Node.js', 'Express/NestJS', 'Redis', 'PostgreSQL', 'Docker'],
    features: [
      'Redis cache layer with sub-5ms query response times',
      'Atomic inventory decrement with database row locking',
      'Automated order confirmation email worker via BullMQ',
    ],
    githubRepoSuggestion: 'enterprise-ecommerce-backend-api',
    linkedinTag: '#DevAscentAcademy #PostgreSQL #Redis #Docker',
  },
  {
    id: 4,
    title: 'DevAscent Virtual Cloud File Storage & Media Pipeline',
    description: 'Cloud file management system with presigned S3 uploads, image compression workers, folder hierarchies, and access control.',
    techStack: ['Next.js App Router', 'AWS S3', 'Sharp.js', 'TypeScript', 'PostgreSQL'],
    features: [
      'Direct browser-to-S3 multi-part presigned upload flows',
      'Background thumbnail generation and EXIF metadata extraction',
      'Time-expiring public shareable links with password protection',
    ],
    githubRepoSuggestion: 'cloud-file-vault-s3-pipeline',
    linkedinTag: '#DevAscent #CloudArchitecture #AWSS3 #NextJS',
  },
  {
    id: 5,
    title: 'AI-Powered Resume & Portfolio Analyzer with ATS Score',
    description: 'AI assistant that evaluates developer resumes against job descriptions, analyzes GitHub repositories, and scores ATS compatibility.',
    techStack: ['React', 'Tailwind CSS', 'OpenAI API / Gemini', 'FastAPI/NestJS'],
    features: [
      'PDF parser extracting skills, projects, and work experience',
      'Keyword density analysis matching top tech job descriptions',
      'Actionable bullet-point revision suggestions with instant export',
    ],
    githubRepoSuggestion: 'ai-ats-resume-portfolio-scanner',
    linkedinTag: '#DevAscentInternship #AIEngineering #ResumeBuilder',
  },
];

export default function CourseLearningRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseSlug = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [curriculumItems, setCurriculumItems] = useState<any[]>([]);
  const [aiVideos, setAiVideos] = useState<any[]>([]);
  const [navigation, setNavigation] = useState<any>(null);

  // Active AI Overview Video modal / theater state
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);
  const [markingVideoWatched, setMarkingVideoWatched] = useState(false);

  // Interaction states
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'exercise'>('notes');
  const [isCompleted, setIsCompleted] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);

  // Doubt states
  const [doubtText, setDoubtText] = useState('');
  const [submittingDoubt, setSubmittingDoubt] = useState(false);
  const [doubtsList, setDoubtsList] = useState<Doubt[]>([]);

  // Quiz interactive states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [attemptsExhausted, setAttemptsExhausted] = useState<boolean>(false);

  // Load lesson and curriculum data
  const loadLessonData = useCallback(async () => {
    if (!courseSlug || !lessonId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetchApi(`/courses/${courseSlug}/lessons/${lessonId}`);
      const data = res?.data || res;

      if (!data?.lesson) {
        throw new Error('Lesson details not found');
      }

      setLessonData(data.lesson);
      setCourseData(data.course);
      setNavigation(data.navigation || null);
      setCurriculumItems(data.interleavedCurriculum || []);
      setAiVideos(data.aiVideos || []);
      setIsCompleted(data.lesson.isCompleted || false);
      setDoubtsList(data.lesson.doubts || []);

      if (data.lesson.quiz) {
        setAttemptsCount(data.lesson.quiz.attemptsCount || 0);
        setAttemptsExhausted(data.lesson.quiz.attemptsExhausted || false);
      }

      // Check if URL requested a specific AI Video modal (e.g. ?showVideo=1)
      const requestedVideoOrder = searchParams.get('showVideo');
      if (requestedVideoOrder && data.aiVideos) {
        const targetVideo = data.aiVideos.find((v: any) => String(v.order) === requestedVideoOrder);
        if (targetVideo) {
          setActiveVideoModal(targetVideo);
        }
      }

      // Reset quiz local selection
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);

    } catch (err: any) {
      setError(err?.message || 'Could not load lesson. Please check enrollment status.');
    } finally {
      setLoading(false);
    }
  }, [courseSlug, lessonId, searchParams]);

  useEffect(() => {
    loadLessonData();
  }, [loadLessonData]);

  // Handle Mark AI Overview Video as Watched
  const handleMarkVideoWatched = async (videoId: string) => {
    try {
      setMarkingVideoWatched(true);
      await api.markAiVideoWatched(videoId);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Update local AI video state
      setAiVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, isWatched: true } : v))
      );

      // Close modal and reload curriculum progression
      setActiveVideoModal(null);
      await loadLessonData();

    } catch (err: any) {
      alert(err?.message || 'Failed to mark video as watched.');
    } finally {
      setMarkingVideoWatched(false);
    }
  };

  // Handle Mark Complete toggle
  const handleToggleComplete = async () => {
    try {
      setTogglingComplete(true);
      const res = await fetchApi(`/courses/${courseSlug}/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ forceStatus: !isCompleted }),
      });
      const data = res?.data || res;

      setIsCompleted(data?.isCompleted ?? !isCompleted);

      if (data?.isCompleted) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }

      await loadLessonData();
    } catch (err: any) {
      console.error('Error toggling completion:', err);
    } finally {
      setTogglingComplete(false);
    }
  };

  // Handle Submit Doubt
  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || submittingDoubt) return;

    try {
      setSubmittingDoubt(true);
      const res = await fetchApi(`/courses/${courseSlug}/lessons/${lessonId}/doubt`, {
        method: 'POST',
        body: JSON.stringify({ question: doubtText }),
      });
      const data = res?.data || res;

      if (data?.doubt) {
        setDoubtsList((prev) => [data.doubt, ...prev]);
        setDoubtText('');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to submit your question. Please make sure you are logged in.');
    } finally {
      setSubmittingDoubt(false);
    }
  };

  // Handle Quiz Answer Selection
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted || attemptsExhausted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const currentQuiz: QuizData | null = lessonData?.quiz || null;

  // Handle Quiz Submit
  const handleQuizSubmit = async () => {
    if (!currentQuiz || submittingQuiz || attemptsExhausted) return;

    const answersArray = currentQuiz.questions.map((q: Question) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
    }));

    try {
      setSubmittingQuiz(true);

      const res = await fetchApi(`/courses/${courseSlug}/lessons/${lessonId}/quiz-submit`, {
        method: 'POST',
        body: JSON.stringify({
          quizId: currentQuiz.id,
          answers: answersArray,
        }),
      });
      const data = res?.data || res;
      setQuizResult(data);
      setQuizSubmitted(true);
      setAttemptsCount(data.attemptNum || attemptsCount + 1);
      setAttemptsExhausted(data.attemptsExhausted || false);

      if (data?.passed) {
        setIsCompleted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        await loadLessonData();
      }
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      alert(err?.message || 'Failed to submit quiz.');
      if (err?.message?.includes('exceeded') || err?.message?.includes('used all')) {
        setAttemptsExhausted(true);
      }
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSnippet(code);
    setTimeout(() => setCopiedCodeSnippet(null), 2000);
  };

  // Skeleton Loader for smooth page transitions
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-400">
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-24 h-8 bg-slate-800 rounded-lg animate-pulse" />
            <div className="w-48 h-5 bg-slate-800 rounded-md animate-pulse" />
          </div>
          <div className="w-32 h-8 bg-slate-800 rounded-lg animate-pulse" />
        </header>
        <div className="flex-1 flex flex-col lg:flex-row">
          <main className="flex-1 p-8 space-y-6">
            <div className="w-3/4 h-8 bg-slate-800 rounded-lg animate-pulse" />
            <div className="w-1/2 h-4 bg-slate-800 rounded-md animate-pulse" />
            <div className="w-full h-64 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
            <div className="space-y-3">
              <div className="w-full h-4 bg-slate-800/80 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-slate-800/80 rounded animate-pulse" />
              <div className="w-4/6 h-4 bg-slate-800/80 rounded animate-pulse" />
            </div>
          </main>
          <aside className="w-full lg:w-88 bg-slate-900 border-l border-slate-800 p-4 space-y-3 hidden lg:block">
            <div className="w-1/2 h-5 bg-slate-800 rounded animate-pulse" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-full h-10 bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Access Notice</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{error || 'Lesson unavailable.'}</p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/enrolled-courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>My Enrolled Courses</span>
            </Link>
            <Link
              href={`/courses/${courseSlug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Course Overview</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* ─── TOP CLASSROOM NAVIGATION BAR ─── */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <Link
            href="/enrolled-courses"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Courses</span>
          </Link>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider shrink-0">
                Lesson {lessonData.globalSeq || lessonData.lessonNumber} of {navigation?.totalLessons || '15'}
              </span>
              <span className="hidden md:inline-block text-slate-600 text-xs">•</span>
              <span className="hidden md:inline-block text-xs text-slate-400 truncate max-w-xs">
                {courseData?.title}
              </span>
            </div>
            <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
              {lessonData.title}
            </span>
          </div>
        </div>

        {/* Top Actions: Progress & Completion */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <div className="w-20 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${navigation?.overallProgressPct || 0}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              {navigation?.overallProgressPct || 0}%
            </span>
          </div>

          {!lessonData.isLocked && (
            <button
              onClick={handleToggleComplete}
              disabled={togglingComplete}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isCompleted
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              {togglingComplete ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
            </button>
          )}
        </div>
      </header>

      {/* ─── MAIN WORKSPACE LAYOUT ─── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Center Main Stage */}
        <div className="flex-1 flex flex-col overflow-y-auto border-r border-slate-800/80">
          
          {/* Locked Lesson State Overlay */}
          {lessonData.isLocked ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Progression Locked
                </span>
                <h2 className="text-xl font-bold text-white">
                  {lessonData.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lessonData.lockReason || 'Please complete prior milestone overview videos and pass quizzes (70%+) to unlock this lesson.'}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                {aiVideos && aiVideos.length > 0 && (
                  <button
                    onClick={() => setActiveVideoModal(aiVideos[0])}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    <span>Watch AI Overview Video</span>
                  </button>
                )}
                {navigation?.prevLesson?.isUnlocked && (
                  <Link
                    href={`/learn/${courseSlug}/${navigation.prevLesson.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Lesson</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Clean Lecture Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Lesson #{lessonData.globalSeq || lessonData.lessonNumber}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lessonData.durationMinutes || 15} mins study</span>
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {lessonData.title}
                  </h1>
                  {lessonData.summary && (
                    <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                      {lessonData.summary}
                    </p>
                  )}
                </div>

                {/* Action Buttons: Milestone AI Video & Mark Complete */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {aiVideos && aiVideos.length > 0 && (
                    <button
                      onClick={() => {
                        const relevantVideo = aiVideos.find(
                          (v) => (lessonData.globalSeq || 1) >= v.unlocksFromLesson && (lessonData.globalSeq || 1) <= v.unlocksToLesson
                        ) || aiVideos[0];
                        setActiveVideoModal(relevantVideo);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-indigo-300 text-xs font-semibold flex items-center gap-2 transition-all hover:border-indigo-500/40"
                    >
                      <Video className="w-4 h-4 text-indigo-400" />
                      <span>Milestone Video</span>
                    </button>
                  )}

                  <button
                    onClick={handleToggleComplete}
                    disabled={togglingComplete}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    }`}
                  >
                    {togglingComplete ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{isCompleted ? 'Marked Complete ✓' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>

              {/* 3 Main Studio Tabs: Notes, Quiz, Exercise */}
              <div className="bg-slate-900/90 border-b border-slate-800 flex items-center px-4 sm:px-6 sticky top-0 z-20 overflow-x-auto backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-3.5 px-4 border-b-2 text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'notes'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>1. Study Notes (Markdown)</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`py-3.5 px-4 border-b-2 text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'quiz'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>2. Skill Quiz {isCompleted || lessonData?.quiz?.isPassed ? '✓' : ''}</span>
                </button>

                <button
                  onClick={() => setActiveTab('exercise')}
                  className={`py-3.5 px-4 border-b-2 text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'exercise'
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>3. Exercise & PDF</span>
                </button>
              </div>

              {/* ─── TAB CONTENT DISPLAY ─── */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-300 max-w-4xl text-sm leading-relaxed">
                
                {/* TAB 1: STUDY NOTES (MARKDOWN WITH SYNTAX HIGHLIGHTING) */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    {lessonData.writtenContent ? (
                      <div className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              const rawCode = String(children).replace(/\n$/, '');
                              return !inline ? (
                                <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                                    <span>{match ? match[1] : 'code'}</span>
                                    <button
                                      onClick={() => handleCopyCode(rawCode)}
                                      className="flex items-center gap-1 hover:text-white text-[11px] transition-colors"
                                    >
                                      {copiedCodeSnippet === rawCode ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span className="text-emerald-400">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Copy Code</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-4 overflow-x-auto text-xs font-mono">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                </div>
                              ) : (
                                <code className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs" {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {lessonData.writtenContent}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <span>Core Engineering Architecture & Patterns</span>
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Master this topic by practicing real-world code architecture. Review the key production standards below and test your knowledge in the <strong>Skill Quiz</strong> tab.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                            <p className="font-semibold text-white">1. Strict Type Safety</p>
                            <p className="text-slate-400">
                              Define exhaustive TypeScript interfaces and DTOs to catch regression bugs at compile-time.
                            </p>
                          </div>
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                            <p className="font-semibold text-white">2. Atomic Transactions</p>
                            <p className="text-slate-400">
                              Wrap multi-step database mutations with Prisma <code className="text-indigo-300">$transaction</code> to prevent orphan records.
                            </p>
                          </div>
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                            <p className="font-semibold text-white">3. Query Optimization</p>
                            <p className="text-slate-400">
                              Use targeted compound indexes for sub-10ms response times on frequently filtered columns.
                            </p>
                          </div>
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                            <p className="font-semibold text-white">4. Secure Authorization</p>
                            <p className="text-slate-400">
                              Guard endpoints with JWT middleware and role checks before accessing sensitive business logic.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: SKILL QUIZ (70% THRESHOLD & 3 ATTEMPTS) */}
                {activeTab === 'quiz' && (
                  <div className="space-y-6">
                    {currentQuiz && currentQuiz.questions && currentQuiz.questions.length > 0 ? (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                          <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                              <Award className="w-5 h-5 text-indigo-400" />
                              <span>{currentQuiz.title}</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                              Passing score is <strong className="text-emerald-400">{currentQuiz.passingScore}%</strong>. Max {currentQuiz.maxAttempts || 3} attempts per assessment.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                            <span className="text-slate-400">Attempt Counter:</span>
                            <span className={`font-mono ${attemptsExhausted ? 'text-red-400' : 'text-indigo-400'}`}>
                              Attempt {Math.min(attemptsCount + 1, currentQuiz.maxAttempts || 3)} of {currentQuiz.maxAttempts || 3}
                            </span>
                          </div>
                        </div>

                        {/* Exhausted Attempts Warning Banner */}
                        {attemptsExhausted && (
                          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-sm font-bold text-white">Assessment Attempts Exhausted</h4>
                                <p className="text-xs text-slate-300">
                                  You have used all 3 attempts. Please reach out to <a href="mailto:support@devascentacademy.me" className="text-indigo-400 underline font-semibold">support@devascentacademy.me</a> to request an attempt reset.
                                </p>
                              </div>
                            </div>

                            <a
                              href="mailto:support@devascentacademy.me?subject=Assessment%20Reset%20Request"
                              className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Contact Support</span>
                            </a>
                          </div>
                        )}

                        {/* Questions List */}
                        <div className="space-y-5">
                          {currentQuiz.questions.map((q: Question, qIdx: number) => {
                            const userSelected = selectedAnswers[q.id];
                            const feedbackItem = quizResult?.feedback?.find((f: any) => f.questionId === q.id);

                            return (
                              <div
                                key={q.id}
                                className={`p-5 rounded-2xl border transition-all ${
                                  quizSubmitted
                                    ? feedbackItem?.isCorrect
                                      ? 'bg-emerald-950/20 border-emerald-800/40'
                                      : 'bg-red-950/20 border-red-800/40'
                                    : 'bg-slate-900/70 border-slate-800'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold flex items-center justify-center shrink-0 text-indigo-400">
                                    {qIdx + 1}
                                  </span>
                                  <div className="space-y-3 flex-1">
                                    <h4 className="text-sm font-semibold text-white leading-snug">
                                      {q.question}
                                    </h4>

                                    {q.codeSnippet && (
                                      <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                                        {q.codeSnippet}
                                      </pre>
                                    )}

                                    {/* Options List */}
                                    <div className="space-y-2 pt-1">
                                      {q.options.map((opt: string, optIdx: number) => {
                                        const isSelected = userSelected === optIdx;
                                        const isCorrectOption = feedbackItem?.correctOptionIndex === optIdx;

                                        let optionStyle = 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/80 text-slate-300';
                                        if (quizSubmitted) {
                                          if (isCorrectOption) {
                                            optionStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold';
                                          } else if (isSelected && !feedbackItem?.isCorrect) {
                                            optionStyle = 'border-red-500/60 bg-red-500/10 text-red-300';
                                          } else {
                                            optionStyle = 'border-slate-800/50 opacity-60 text-slate-500';
                                          }
                                        } else if (isSelected) {
                                          optionStyle = 'border-indigo-500 bg-indigo-600/20 text-indigo-200 font-medium';
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            type="button"
                                            onClick={() => handleSelectOption(q.id, optIdx)}
                                            disabled={quizSubmitted || attemptsExhausted}
                                            className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all ${optionStyle}`}
                                          >
                                            <div className="flex items-center gap-2.5">
                                              <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] shrink-0 font-mono">
                                                {String.fromCharCode(65 + optIdx)}
                                              </span>
                                              <span>{opt}</span>
                                            </div>
                                            {quizSubmitted && isCorrectOption && (
                                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            )}
                                            {quizSubmitted && isSelected && !feedbackItem?.isCorrect && (
                                              <X className="w-4 h-4 text-red-400 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Explanation on Submit */}
                                    {quizSubmitted && feedbackItem?.explanation && (
                                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                                        <p className="font-bold text-indigo-400 flex items-center gap-1.5">
                                          <Sparkles className="w-3.5 h-3.5" />
                                          <span>Explanation:</span>
                                        </p>
                                        <p className="text-slate-400 leading-relaxed">{feedbackItem.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Quiz Controls & Score Result */}
                        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                          {quizSubmitted ? (
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${
                                quizResult?.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {quizResult?.scorePct}%
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white">
                                  {quizResult?.passed ? '🎉 Passed! Lesson marked as completed.' : 'Score below 70%. Review notes and retry.'}
                                </h4>
                                <p className="text-xs text-slate-400">
                                  {quizResult?.correctCount || 0} of {quizResult?.totalQuestions || currentQuiz.questions.length} questions correct
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400">
                              Answered: {Object.keys(selectedAnswers).length} of {currentQuiz.questions.length}
                            </div>
                          )}

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            {quizSubmitted ? (
                              <button
                                onClick={() => {
                                  if (!attemptsExhausted) {
                                    setQuizSubmitted(false);
                                    setQuizResult(null);
                                    setSelectedAnswers({});
                                  }
                                }}
                                disabled={attemptsExhausted}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                              >
                                Retake Quiz
                              </button>
                            ) : (
                              <button
                                onClick={handleQuizSubmit}
                                disabled={submittingQuiz || attemptsExhausted || Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                              >
                                {submittingQuiz ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Grading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Award className="w-4 h-4" />
                                    <span>Submit Quiz & Validate</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                        <Award className="w-8 h-8 text-indigo-400 mx-auto" />
                        <h4 className="text-sm font-bold text-white">No Quiz Required For This Lesson</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          You can mark this lesson complete directly using the top completion button or continue to the Exercise tab.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: EXERCISE FILES & PDF VIEWER */}
                {activeTab === 'exercise' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                      <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-indigo-400" />
                        <span>Exercise File & Capstone Projects</span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        Official exercise PDF materials and 5 capstone project blueprints for GitHub & LinkedIn proof-of-work.
                      </p>
                    </div>

                    {/* PDF Download + Embedded iframe Viewer Section */}
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {lessonData.exercisePdfTitle || `${lessonData.title} - Exercise Guide`}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {lessonData.exercisePdfUrl
                                ? 'Includes step-by-step instructions, starter schema, and verification rubrics.'
                                : 'PDF guide not attached for this lesson. Work on the 5 blueprints below.'}
                            </p>
                          </div>
                        </div>

                        {lessonData.exercisePdfUrl ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={lessonData.exercisePdfUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download PDF</span>
                            </a>
                            <a
                              href={lessonData.exercisePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
                              title="Open in new tab"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </a>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-medium shrink-0">
                            Self-Study Mode
                          </span>
                        )}
                      </div>

                      {/* Embedded PDF iframe Viewer */}
                      {lessonData.exercisePdfUrl && (
                        <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] sm:h-[600px] shadow-2xl">
                          <iframe
                            src={`${lessonData.exercisePdfUrl}#toolbar=1`}
                            title={lessonData.exercisePdfTitle || 'Exercise PDF'}
                            className="w-full h-full border-0"
                          />
                        </div>
                      )}
                    </div>

                    {/* 5 Essential Capstones */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                        <GithubIcon className="w-4 h-4" />
                        <span>5 Essential Portfolio Projects</span>
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        {DEFAULT_CAPSTONE_PROJECTS.map((proj) => (
                          <div
                            key={proj.id}
                            className="p-5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 rounded-2xl space-y-3 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-mono">
                                  #{proj.id}
                                </span>
                                <span>{proj.title}</span>
                              </h4>
                              
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {proj.techStack.map((tech, tidx) => (
                                  <span
                                    key={tidx}
                                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                              {proj.description}
                            </p>

                            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                              <div className="flex items-center gap-1.5 font-mono text-slate-400">
                                <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                                <span>Repo: <strong className="text-slate-200">{proj.githubRepoSuggestion}</strong></span>
                              </div>
                              <div className="flex items-center gap-1.5 text-indigo-400 font-mono">
                                <LinkedinIcon className="w-3.5 h-3.5" />
                                <span>{proj.linkedinTag}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons (Prev / Next) */}
                <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
                  {navigation?.prevLesson ? (
                    <Link
                      href={`/learn/${courseSlug}/${navigation.prevLesson.id}`}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all ${
                        !navigation.prevLesson.isUnlocked ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous:</span>
                      <span className="truncate max-w-[140px]">{navigation.prevLesson.title}</span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {/* Center: Mark Complete status / toggle */}
                  <button
                    onClick={handleToggleComplete}
                    disabled={togglingComplete}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {togglingComplete ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{isCompleted ? 'Lesson Completed' : 'Mark Lesson Complete'}</span>
                  </button>

                  {navigation?.nextLesson ? (
                    <Link
                      href={`/learn/${courseSlug}/${navigation.nextLesson.id}`}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all ${
                        !navigation.nextLesson.isUnlocked ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <span className="hidden sm:inline">Next Lesson:</span>
                      <span className="truncate max-w-[140px]">{navigation.nextLesson.title}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <span>Complete Course</span>
                      <Award className="w-4 h-4" />
                    </Link>
                  )}
                </div>

              </div>
            </>
          )}

        </div>

        {/* ─── RIGHT SIDEBAR: INTERLEAVED CURRICULUM TREE & ASK DOUBT ─── */}
        <aside className="w-full lg:w-88 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
          
          {/* Syllabus Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="space-y-0.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Course Progression
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                {courseData?.title}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              {navigation?.overallProgressPct || 0}% Done
            </span>
          </div>

          {/* Scrollable Interleaved Curriculum List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 text-xs">
            {curriculumItems.map((entry, idx) => {
              if (entry.type === 'ai-video') {
                const video = entry.item;
                return (
                  <div
                    key={`ai-video-${video.id || idx}`}
                    onClick={() => {
                      if (video.isUnlocked) {
                        setActiveVideoModal(video);
                      }
                    }}
                    className={`p-3.5 transition-all cursor-pointer ${
                      video.isWatched
                        ? 'bg-emerald-950/20 hover:bg-emerald-950/30 border-l-4 border-emerald-500'
                        : video.isUnlocked
                        ? 'bg-indigo-950/30 hover:bg-indigo-950/50 border-l-4 border-indigo-500'
                        : 'bg-slate-950/40 opacity-60 border-l-4 border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        <Video className="w-3.5 h-3.5" />
                        <span>Milestone {video.order} Overview</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {video.durationSec ? `${video.durationSec}s` : 'Intro'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-xs text-white truncate">
                        {video.title}
                      </p>
                      {video.isWatched ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Watched</span>
                        </span>
                      ) : video.isUnlocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full shrink-0">
                          <Play className="w-3 h-3" />
                          <span>Watch</span>
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              }

              // Standard Lesson item
              const lesson = entry.item;
              const isCurrent = lesson.id === lessonId;

              return (
                <button
                  key={`lesson-${lesson.id}`}
                  onClick={() => {
                    if (lesson.isUnlocked) {
                      router.push(`/learn/${courseSlug}/${lesson.id}`);
                    }
                  }}
                  disabled={!lesson.isUnlocked}
                  className={`w-full text-left p-3 flex items-center justify-between gap-2.5 transition-all ${
                    isCurrent
                      ? 'bg-indigo-600/20 text-indigo-300 border-l-4 border-indigo-500 font-semibold shadow-sm'
                      : lesson.isUnlocked
                      ? 'hover:bg-slate-800/60 text-slate-300'
                      : 'opacity-50 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                      </div>
                    ) : lesson.isUnlocked ? (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{lesson.globalSeq}. {lesson.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {lesson.hasQuiz && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-800 text-slate-400">
                        Quiz
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{lesson.durationMinutes || 15}m</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ask a Doubt / Mentor Support */}
          <div className="border-t border-slate-800 bg-slate-950/90 p-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask a Doubt</span>
              </h4>
              <span className="text-[10px] text-slate-400">Lead Mentor Support</span>
            </div>

            <form onSubmit={handleSubmitDoubt} className="space-y-2">
              <input
                type="text"
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="Ask any question about this lesson..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={submittingDoubt || !doubtText.trim()}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none text-slate-200 text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                {submittingDoubt ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Submit Question</span>
                  </>
                )}
              </button>
            </form>

            {/* Recent doubts */}
            {doubtsList.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1 text-xs">
                {doubtsList.slice(0, 2).map((d) => (
                  <div key={d.id} className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-300">{d.userName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                        d.status === 'ANSWERED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{d.question}</p>
                    {d.answer && (
                      <div className="pt-1 border-t border-slate-800 text-[10px] text-indigo-300">
                        <strong>Mentor:</strong> {d.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>

      </div>

      {/* ─── AI OVERVIEW VIDEO THEATER MODAL ─── */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 my-auto animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Milestone {activeVideoModal.order} AI Overview Video
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                    {activeVideoModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
              {activeVideoModal.videoUrl ? (
                isDirectVideoUrl(activeVideoModal.videoUrl) ? (
                  <video
                    src={activeVideoModal.videoUrl}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(activeVideoModal.videoUrl)}
                    title={activeVideoModal.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Video URL not configured yet.
                </div>
              )}
            </div>

            {/* Modal Footer / Completion Action */}
            <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-left w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-300">
                  Unlocks Lessons {activeVideoModal.unlocksFromLesson}–{activeVideoModal.unlocksToLesson}
                </span>
                <p className="text-[11px] text-slate-500">
                  {activeVideoModal.isWatched
                    ? '✅ You have marked this overview video as watched.'
                    : 'Watch this overview, then click below to unlock the lesson batch.'}
                </p>
              </div>

              <button
                onClick={() => handleMarkVideoWatched(activeVideoModal.id)}
                disabled={markingVideoWatched}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
              >
                {markingVideoWatched ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Unlocking Lessons...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I&apos;ve Watched This Intro — Unlock Next Lessons</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
