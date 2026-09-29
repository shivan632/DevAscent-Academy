'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { getEmbedUrl, isDirectVideoUrl } from '@/lib/utils';
import {
  Play,
  Pause,
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
  MessageSquare,
  Lock,
  Loader2,
  AlertCircle,
  FileText,
  HelpCircle,
  Send,
  VideoOff,
  Clock,
  Code2,
  ExternalLink,
  Check,
  X,
  Share2
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

interface LessonItem {
  id: string;
  lessonNumber: number;
  title: string;
  durationMinutes: number;
  isFreePreview: boolean;
  isCompleted: boolean;
  isActive: boolean;
  hasQuiz: boolean;
  quizPassed?: boolean;
}

interface ModuleItem {
  id: string;
  moduleNumber: number;
  title: string;
  description?: string;
  lessons: LessonItem[];
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

// 5 Capstone Projects for GitHub Portfolio & LinkedIn Proof of Work
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

const DEFAULT_FALLBACK_QUIZ: QuizData = {
  id: 'fallback-lesson-quiz',
  title: 'Lesson Knowledge Check & Skill Validation',
  passingScore: 60,
  questions: [
    {
      id: 'q1',
      question: 'What is the primary architectural benefit of separating modular services in full-stack applications?',
      options: [
        'Ensures tight coupling between all components',
        'Enhances maintainability, testability, and clear separation of concerns',
        'Allows skipping database index optimization',
        'Eliminates the need for API validation guards',
      ],
      correctOptionIndex: 1,
      explanation: 'Modular architecture separates business logic from routing, making systems maintainable, reusable, and easy to unit-test.',
    },
    {
      id: 'q2',
      question: 'Why should database operations involving multiple dependent records be wrapped in a transaction?',
      options: [
        'To increase query execution time artificially',
        'To ensure ACID properties and prevent inconsistent or orphan database states',
        'To bypass Prisma ORM type safety checks',
        'To disable foreign key constraints globally',
      ],
      correctOptionIndex: 1,
      explanation: 'Database transactions guarantee atomicity: either all changes succeed together, or all are rolled back on error.',
    },
    {
      id: 'q3',
      question: 'How do compound indexes like @@index([userId, courseId]) improve PostgreSQL query performance?',
      options: [
        'They compress the entire database onto disk',
        'They allow the query planner to quickly locate specific user records in O(log N) time without scanning all rows',
        'They automatically encrypt stored passwords',
        'They convert SQL queries to NoSQL documents',
      ],
      correctOptionIndex: 1,
      explanation: 'Compound indexes create a B-tree search structure on multiple columns, drastically speeding up queries that filter on both keys.',
    },
  ],
};

export default function CourseLearningRoom() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [navigation, setNavigation] = useState<any>(null);

  // Interaction states
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'exercise'>('notes');
  const [isCompleted, setIsCompleted] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);

  // Doubt states
  const [doubtText, setDoubtText] = useState('');
  const [submittingDoubt, setSubmittingDoubt] = useState(false);
  const [doubtsList, setDoubtsList] = useState<Doubt[]>([]);

  // Quiz interactive states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Load lesson data from API
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
      setModules(data.modules || []);
      setNavigation(data.navigation || null);
      setIsCompleted(data.lesson.isCompleted || false);
      setDoubtsList(data.lesson.doubts || []);

      // Reset quiz local selection
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);

    } catch (err: any) {
      setError(err?.message || 'Could not load lesson. Please check enrollment status.');
    } finally {
      setLoading(false);
    }
  }, [courseSlug, lessonId]);

  useEffect(() => {
    loadLessonData();
  }, [loadLessonData]);

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
      
      // Update local sidebar list
      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) =>
            l.id === lessonId ? { ...l, isCompleted: data?.isCompleted ?? !isCompleted } : l
          ),
        }))
      );

      if (data?.isCompleted) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
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
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const currentQuiz: QuizData = lessonData?.quiz || DEFAULT_FALLBACK_QUIZ;

  // Handle Quiz Submit
  const handleQuizSubmit = async () => {
    if (!currentQuiz || submittingQuiz) return;

    const answersArray = currentQuiz.questions.map((q: Question) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
    }));

    try {
      setSubmittingQuiz(true);

      if (lessonData?.quiz?.id) {
        const res = await fetchApi(`/courses/${courseSlug}/lessons/${lessonId}/quiz-submit`, {
          method: 'POST',
          body: JSON.stringify({
            quizId: lessonData.quiz.id,
            answers: answersArray,
          }),
        });
        const data = res?.data || res;
        setQuizResult(data);
        setQuizSubmitted(true);

        if (data?.passed) {
          setIsCompleted(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        let correct = 0;
        const feedback = currentQuiz.questions.map((q: Question) => {
          const userSel = selectedAnswers[q.id];
          const isCorrect = userSel === q.correctOptionIndex;
          if (isCorrect) correct++;
          return {
            questionId: q.id,
            isCorrect,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
          };
        });

        const scorePct = Math.round((correct / currentQuiz.questions.length) * 100);
        const passed = scorePct >= currentQuiz.passingScore;

        setQuizResult({
          scorePct,
          passed,
          passingScore: currentQuiz.passingScore,
          feedback,
          correctCount: correct,
          totalQuestions: currentQuiz.questions.length,
        });
        setQuizSubmitted(true);

        if (passed) {
          handleToggleComplete();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err: any) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">Loading DevAscent Virtual Classroom...</p>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Access Notice</h2>
          <p className="text-sm text-slate-400">{error || 'Lesson unavailable.'}</p>
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
      
      {/* Top Classroom Bar */}
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
                Lesson {navigation?.currentIndex || lessonData.lessonNumber} of {navigation?.totalLessons || '15'}
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
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center Area: Video Area & Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto border-r border-slate-800/80">
          
          {/* Video Player Canvas / AI Video Notice */}
          <div className="bg-slate-950 relative aspect-video max-h-[480px] w-full flex items-center justify-center border-b border-slate-800 overflow-hidden">
            {lessonData.videoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                {isDirectVideoUrl(lessonData.videoUrl) ? (
                  <video
                    src={lessonData.videoUrl}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-contain bg-black"
                    playsInline
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(lessonData.videoUrl)}
                    title={lessonData.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              // AI Video Coming Soon State
              <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950">
                <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10 max-w-lg space-y-3.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>AI Video Generation Pipeline</span>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-500/10">
                    <VideoOff className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white">AI Video Lecture in Production</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                      The AI Video Lecture for this topic will be uploaded soon by the Course Instructor / Admin. 
                      You can continue learning seamlessly with the comprehensive <strong className="text-indigo-300">Written Notes</strong> and test your skills in the <strong className="text-emerald-300">Quiz tab</strong> below!
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('notes')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Read Written Notes</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Take Skill Quiz</span>
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Est. Duration: {lessonData.durationMinutes || 15} mins
                  </span>
                  <span className="text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-400/20">
                    Admin Video Upload Pending
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3 Main Tabs: Notes, Quiz, Exercise */}
          <div className="bg-slate-900/90 border-b border-slate-800 flex items-center px-4 sm:px-6 sticky top-0 z-20 overflow-x-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3.5 px-4 border-b-2 text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 Lecture Notes</span>
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
              <span>🧠 Skill Quiz {quizResult?.passed ? '✓' : ''}</span>
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
              <span>📁 Exercise & Projects</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-300 max-w-4xl text-sm leading-relaxed">
            
            {/* TAB 1: LECTURE NOTES (GeeksforGeeks Style) */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {lessonData.title}
                  </h1>
                  <p className="text-xs text-slate-400">
                    Comprehensive study notes, architectural rules, and implementation patterns for {courseData?.title}.
                  </p>
                </div>

                {lessonData.writtenContent ? (
                  <div className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4">
                    <ReactMarkdown>{lessonData.writtenContent}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-indigo-400" />
                        <span>Core Engineering Concepts & Architecture</span>
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        In this module, we focus on high-throughput backend architecture, resilient data modeling, and clean full-stack integrations. Applying production patterns right from the start ensures code maintainability, type safety, and scalability.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
                        Key Production Standards
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1.5">
                          <p className="font-semibold text-white">1. Strict Type Safety</p>
                          <p className="text-slate-400">
                            Always define rigorous DTOs and interfaces. Prevent runtime failures by validating incoming payloads with Zod or class-validator.
                          </p>
                        </div>
                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1.5">
                          <p className="font-semibold text-white">2. Relational Database Indexing</p>
                          <p className="text-slate-400">
                            Apply compound indexes on foreign keys and frequently queried filter columns to maintain sub-10ms query execution times.
                          </p>
                        </div>
                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1.5">
                          <p className="font-semibold text-white">3. Atomic Transactions</p>
                          <p className="text-slate-400">
                            Use database transactions whenever mutating multiple linked models (e.g. creating enrollments and decrementing course seats).
                          </p>
                        </div>
                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1.5">
                          <p className="font-semibold text-white">4. Secure Authorization Layers</p>
                          <p className="text-slate-400">
                            Enforce JWT validation guards and role-based permissions (RBAC) on all protected mutation endpoints.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Implementation Pattern Example</span>
                        </span>
                        <span className="text-emerald-400 text-[11px]">TypeScript</span>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-1.5">
                        <p className="text-slate-500">// Service layer execution with transaction safety</p>
                        <p className="text-purple-400">async function <span className="text-amber-300">executeEnrollment</span>(userId: <span className="text-emerald-400">string</span>, courseId: <span className="text-emerald-400">string</span>) {'{'}</p>
                        <p className="pl-4 text-slate-300">return await prisma.<span className="text-indigo-400">$transaction</span>(async (tx) =&gt; {'{'}</p>
                        <p className="pl-8 text-slate-400">// 1. Verify seat availability</p>
                        <p className="pl-8">const course = await tx.course.findUnique({'{'} where: {'{'} id: courseId {'}'} {'}'});</p>
                        <p className="pl-8 text-slate-400">// 2. Create active enrollment record</p>
                        <p className="pl-8">const enrollment = await tx.enrollment.create({'{'}</p>
                        <p className="pl-12">data: {'{'} userId, courseId, status: <span className="text-amber-300">'ACTIVE'</span>, progressPct: 0 {'}'}</p>
                        <p className="pl-8">{'}'});</p>
                        <p className="pl-8">return enrollment;</p>
                        <p className="pl-4">{'}'});</p>
                        <p className="text-purple-400">{'}'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SKILL QUIZ */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-400" />
                      <span>{currentQuiz.title}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Answer all questions correctly. Score 60% or above to pass and mark this lesson complete.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                    <span className="text-slate-400">Passing Threshold:</span>
                    <span className="text-emerald-400">{currentQuiz.passingScore}%</span>
                  </div>
                </div>

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
                                    disabled={quizSubmitted}
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

                            {/* Explanation Box on Submit */}
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

                {/* Quiz Result Banner & Submit Controls */}
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {quizSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        quizResult?.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {quizResult?.scorePct}%
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {quizResult?.passed ? '🎉 Congratulations! You Passed!' : 'Review the concepts and try again'}
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
                          setQuizSubmitted(false);
                          setQuizResult(null);
                          setSelectedAnswers({});
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                      >
                        Retake Quiz
                      </button>
                    ) : (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={submittingQuiz || Object.keys(selectedAnswers).length < currentQuiz.questions.length}
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
              </div>
            )}

            {/* TAB 3: EXERCISE FILES & 5 CAPSTONE PROJECTS */}
            {activeTab === 'exercise' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-indigo-400" />
                    <span>Exercise Files & GitHub Portfolio Projects</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Official exercise materials and 5 capstone project blueprints to build your GitHub repositories and showcase your proof-of-work on LinkedIn.
                  </p>
                </div>

                {/* PDF Download Section / Notice */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {lessonData.exercisePdfUrl ? lessonData.exercisePdfTitle : 'Official Course Capstone Exercise PDF'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {lessonData.exercisePdfUrl
                          ? 'Includes starter codebase, test cases, and deployment checklist.'
                          : 'PDF not uploaded yet by Admin. In the meantime, build the 5 project blueprints below!'}
                      </p>
                    </div>
                  </div>

                  {lessonData.exercisePdfUrl ? (
                    <a
                      href={lessonData.exercisePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-800/90 text-amber-400 text-xs font-medium border border-amber-400/20 shrink-0">
                      Admin PDF Upload Pending
                    </span>
                  )}
                </div>

                {/* 5 Basic Projects For GitHub & LinkedIn */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                      <GithubIcon className="w-4 h-4" />
                      <span>5 Essential Capstone Projects for GitHub & LinkedIn</span>
                    </h3>
                  </div>

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

                        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                          <p className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider text-emerald-400">
                            Key Deliverables:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                            {proj.features.map((feat, fidx) => (
                              <li key={fidx}>{feat}</li>
                            ))}
                          </ul>
                        </div>

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

            {/* Bottom Navigation Buttons (Prev / Next Lesson) */}
            <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
              {navigation?.prevLesson ? (
                <Link
                  href={`/learn/${courseSlug}/${navigation.prevLesson.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous:</span>
                  <span className="truncate max-w-[140px]">{navigation.prevLesson.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {navigation?.nextLesson ? (
                <Link
                  href={`/learn/${courseSlug}/${navigation.nextLesson.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
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
        </div>

        {/* Right Sidebar: Curriculum Tree & Ask Doubt */}
        <aside className="w-full lg:w-88 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
          
          {/* Syllabus Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="space-y-0.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Cohort Curriculum
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                {courseData?.title}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              {navigation?.overallProgressPct || 0}% Done
            </span>
          </div>

          {/* Scrollable Curriculum Tree */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 text-xs">
            {modules.map((mod) => (
              <div key={mod.id} className="p-3 space-y-2">
                <div className="px-1 flex items-center justify-between">
                  <h4 className="font-bold text-slate-300 text-[11px]">
                    Module {mod.moduleNumber}: {mod.title}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {mod.lessons.length} {mod.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>

                <div className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isCurrent = lesson.id === lessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => router.push(`/learn/${courseSlug}/${lesson.id}`)}
                        className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2.5 transition-all ${
                          isCurrent
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold shadow-sm'
                            : 'hover:bg-slate-800/60 text-slate-400 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <div className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {lesson.isFreePreview && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Preview
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">{lesson.durationMinutes || 15}m</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Ask a Doubt / Mentor Q&A Section */}
          <div className="border-t border-slate-800 bg-slate-950/90 p-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask a Doubt</span>
              </h4>
              <span className="text-[10px] text-slate-400">Lead Mentor Support</span>
            </div>

            <form onSubmit={handleSubmitDoubt} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  placeholder="Ask any question about this lesson..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
                />
              </div>
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

            {/* List Recent Doubts */}
            {doubtsList.length > 0 && (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
                {doubtsList.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-300">{d.userName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                        d.status === 'ANSWERED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{d.question}</p>
                    {d.answer && (
                      <div className="pt-1 border-t border-slate-800 text-[10px] text-indigo-300">
                        <strong>Mentor:</strong> {d.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="text-[10px] text-slate-500 text-center">
              Direct Mentor Support: <a href="mailto:devascentacademy@gmail.com" className="text-indigo-400 hover:underline">devascentacademy@gmail.com</a>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
