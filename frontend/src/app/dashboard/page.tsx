'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StudentSidebar from '../../components/StudentSidebar';
import { useAuthStore } from '../../lib/store/authStore';
import { useTheme } from '../../components/ThemeProvider';
import { api } from '../../lib/api';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Award,
  ShieldCheck,
  FileCode,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Zap,
  TrendingUp,
  RotateCcw,
  Download,
  Share2,
  FolderGit2,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  Lock,
  Moon,
  Sun,
  Bell,
  Check,
  Mail,
  Building,
  FileCode as GithubIcon,
  Globe as LinkedinIcon,
  Save,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Code2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  BarChart3,
  Activity,
  Target,
  Flame,
  Trophy,
  ChevronDown,
  Layers,
  Rocket,
  ArrowRight,
} from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start animate-pulse">
            {/* Left Sidebar Skeleton */}
            <div className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />
                ))}
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-9 space-y-6">
              <div className="h-44 bg-slate-200 dark:bg-slate-800/80 rounded-3xl w-full" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" />
                <div className="xl:col-span-4 h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, logout, updateUser, checkAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'submissions' | 'profile' | 'settings' | 'support'>('overview');
  
  // Data state
  const [certificates, setCertificates] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
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
  const [loading, setLoading] = useState(true);

  // Copy toast states
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Refund modal state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundUpiId, setRefundUpiId] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundMsg, setRefundMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [refundRequested, setRefundRequested] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDegree, setProfileDegree] = useState('');
  const [profileCollege, setProfileCollege] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileGraduationYear, setProfileGraduationYear] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [profileGithub, setProfileGithub] = useState('');
  const [profileLinkedin, setProfileLinkedin] = useState('');
  const [profilePortfolio, setProfilePortfolio] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Form state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Tab Deep-Linking synchronization
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'certificates', 'submissions', 'profile', 'settings', 'support'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // 2. Auth guard: redirect to login if unauthenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // 3. Populate profile state when user updates
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileDegree(user.degree || '');
      setProfileCollege(user.college || '');
      setProfileCity(user.city || '');
      setProfileGraduationYear(user.graduationYear || '');
      setProfileAvatarUrl(user.avatarUrl || '');
      setProfileGithub(user.githubUrl || '');
      setProfileLinkedin(user.linkedinUrl || '');
      setProfilePortfolio(user.portfolioUrl || '');
      setProfileBio(user.bio || '');
    }
  }, [user]);

  const [myStats, setMyStats] = useState<any>(null);

  // 4. Load dashboard datasets
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [certsRes, subsRes, coursesRes, profileRes, enrollRes, statsRes] = await Promise.allSettled([
          api.getMyCertificates(),
          api.getMySubmissions(),
          api.getCourses(),
          api.getProfile(),
          api.getMyEnrollments(),
          api.getMyStats(),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value) {
          const raw = profileRes.value;
          const u = raw?.user || raw;
          if (u && u.id) {
            updateUser(u);
          }
        }

        if (certsRes.status === 'fulfilled' && certsRes.value) {
          const val = certsRes.value;
          if (Array.isArray(val)) {
            setCertificates(val);
          } else if (Array.isArray(val?.certificates)) {
            setCertificates(val.certificates);
          } else {
            setCertificates([]);
          }
        }

        if (subsRes.status === 'fulfilled' && subsRes.value) {
          const val = subsRes.value;
          if (Array.isArray(val)) {
            setSubmissions(val);
          } else if (Array.isArray(val?.submissions)) {
            setSubmissions(val.submissions);
          } else {
            setSubmissions([]);
          }
        }

        if (coursesRes.status === 'fulfilled' && coursesRes.value) {
          const val = coursesRes.value;
          const payload = val?.data || val;
          if (Array.isArray(payload?.courses)) {
            setCourses(payload.courses);
          } else if (Array.isArray(payload)) {
            setCourses(payload);
          } else if (Array.isArray(val?.courses)) {
            setCourses(val.courses);
          } else {
            setCourses([]);
          }
        }

        if (enrollRes.status === 'fulfilled' && enrollRes.value) {
          const val = enrollRes.value;
          const payload = val?.data || val;
          const list = Array.isArray(payload?.enrollments)
            ? payload.enrollments
            : (Array.isArray(payload) ? payload : (Array.isArray(val?.enrollments) ? val.enrollments : []));
          setEnrollments(list);
          if (typeof window !== 'undefined' && list.length > 0) {
            localStorage.setItem('devascent_enrollments_cache', JSON.stringify(list));
          }
        }

        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setMyStats(statsRes.value);
        }
      } catch (e) {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  // Derived calculations - strictly real database records
  const displayEnrollments = safeEnrollments;

  const primarySlug = displayEnrollments[0]?.courseSlug || (safeCourses[0]?.slug || '');

  const avgProgress = safeEnrollments.length > 0
    ? Math.round(safeEnrollments.reduce((acc, e) => acc + (Number(e.progressPct) || 0), 0) / safeEnrollments.length)
    : 0;

  const studentName = user?.name || profileName || 'Student';
  const studentEmail = user?.email || 'student@devascent.io';

  // Contextual AI prompts tailored to the student's enrolled course
  const aiPrompts = useMemo(() => {
    const course = displayEnrollments[0]?.courseTitle || '';
    if (/react|frontend|next/i.test(course)) {
      return [
        'Explain useEffect lifecycle & cleanups',
        'Quiz me on React Hooks & State',
        'Review my React component architecture',
        'How does Next.js App Router caching work?',
      ];
    }
    if (/python|backend|django|fastapi/i.test(course)) {
      return [
        'Explain Python decorators with examples',
        'Quiz me on OOP & Data Structures in Python',
        'How to write async API endpoints with FastAPI?',
        'Review my Python error handling & logging',
      ];
    }
    if (/data|ai|machine|intelligence/i.test(course)) {
      return [
        'Explain gradient descent & loss functions',
        'Quiz me on Pandas data manipulation',
        'Review my ML model evaluation metrics',
        'How to build RAG with vector embeddings?',
      ];
    }
    return [
      'Explain the hardest concept in this module',
      'Generate a 5-question practice quiz for me',
      'Review my code and suggest optimizations',
      'Help me plan my capstone project architecture',
    ];
  }, [displayEnrollments]);

  // DB-driven single smart priority action for the student
  const nextAction = useMemo(() => {
    if (safeCertificates.length > 0) {
      const cert = safeCertificates[0];
      return {
        type: 'share' as const,
        badge: 'Graduated & Certified 🎓',
        title: 'Share Your Achievement!',
        description: `Your verified certificate for ${cert.courseTitle || 'your track'} is minted on the ledger. Add it to LinkedIn!`,
        actionLabel: 'View & Share Certificate',
        actionHref: '/dashboard?tab=certificates',
        icon: Award,
        gradient: 'from-emerald-500/10 via-teal-500/5 to-slate-900/5 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30',
      };
    }
    if (safeSubmissions.length > 0) {
      const sub = safeSubmissions[0];
      return {
        type: 'pending' as const,
        badge: 'Capstone Under Review ⏳',
        title: 'Review in Progress',
        description: `Submission for "${sub.projectName || 'Capstone'}" received. Instructor turnaround is 24–48 hours.`,
        actionLabel: 'Check Submission Status',
        actionHref: '/dashboard?tab=submissions',
        icon: Clock,
        gradient: 'from-amber-500/10 via-orange-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900',
        border: 'border-amber-200 dark:border-amber-800/60',
        badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        btnColor: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30',
      };
    }
    if (safeEnrollments.length === 0) {
      return {
        type: 'explore' as const,
        badge: 'Get Started 🚀',
        title: 'Choose Your Engineering Track',
        description: 'Explore full-stack, backend, AI, and industrial internship programs to start building real-world projects.',
        actionLabel: 'Browse All Courses',
        actionHref: '/courses',
        icon: Rocket,
        gradient: 'from-indigo-500/10 via-purple-500/5 to-slate-900/5 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900',
        border: 'border-indigo-200 dark:border-indigo-800/60',
        badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
        btnColor: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
      };
    }
    if (avgProgress >= 100) {
      return {
        type: 'submit' as const,
        badge: 'Curriculum 100% Complete 🚀',
        title: 'Submit Capstone Project',
        description: 'You completed all core lessons! Submit your GitHub repository link to unlock your SHA-256 certificate.',
        actionLabel: 'Submit Capstone & Mint Cert',
        actionHref: primarySlug ? `/learn/${primarySlug}/complete` : '/courses',
        icon: Sparkles,
        gradient: 'from-indigo-500/10 via-violet-500/5 to-slate-900/5 dark:from-indigo-950/40 dark:via-violet-950/20 dark:to-slate-900',
        border: 'border-indigo-200 dark:border-indigo-800/60',
        badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
        btnColor: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
      };
    }
    const remaining = 100 - avgProgress;
    return {
      type: 'learn' as const,
      badge: `${remaining}% Remaining to Capstone 📚`,
      title: 'Continue Learning Track',
      description: `You're at ${avgProgress}% progress. Complete the remaining modules to unlock your graduation capstone.`,
      actionLabel: 'Resume Next Lesson',
      actionHref: primarySlug ? `/learn/${primarySlug}` : '/courses',
      icon: Play,
      gradient: 'from-blue-500/10 via-indigo-500/5 to-slate-900/5 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900',
      border: 'border-blue-200 dark:border-blue-800/60',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      btnColor: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30',
    };
  }, [safeCertificates, safeSubmissions, safeEnrollments, avgProgress, primarySlug]);

  // Selected track for graphical performance section
  const [selectedPerformanceTrack, setSelectedPerformanceTrack] = useState<string>('');

  // Active track object resolved from dropdown
  const activePerformanceTrack = useMemo(() => {
    if (!selectedPerformanceTrack && displayEnrollments.length > 0) {
      return displayEnrollments[0];
    }
    return displayEnrollments.find(e => (e.id === selectedPerformanceTrack || e.courseSlug === selectedPerformanceTrack)) || displayEnrollments[0] || null;
  }, [selectedPerformanceTrack, displayEnrollments]);

  // Derived graphical performance telemetry
  const performanceMetrics = useMemo(() => {
    const track = activePerformanceTrack;
    const progress = track ? (track.progressPct ?? avgProgress) : 0;
    const title = track?.courseTitle || (safeCourses[0]?.title || 'No Enrolled Program');
    const isInternship = /internship/i.test(title) || /internship/i.test(track?.courseSlug || '');

    // Resolve real modules from database (from getMyEnrollments include) or fallback
    const rawModules = Array.isArray(track?.modules) && track.modules.length > 0 ? track.modules : null;
    const modules = rawModules || [
      { id: 'm1', moduleNumber: 1, title: 'Foundations & Architecture', description: 'Core mental models, syntax, types, and structure.' },
      { id: 'm2', moduleNumber: 2, title: 'Async APIs & State Sync', description: 'REST integration, queries, caching, and error boundaries.' },
      { id: 'm3', moduleNumber: 3, title: 'Global Architecture & Systems', description: 'Persistent stores, auth flows, and scalable design.' },
      { id: 'm4', moduleNumber: 4, title: 'Graduation Capstone Project', description: 'Deploy full-stack app, submit GitHub link for official certificate.' },
    ];

    // Tailored skill breakdown
    let skills = [
      { name: 'Core Architecture & Patterns', score: Math.min(100, Math.max(70, Math.round(progress * 0.98))) },
      { name: 'TypeScript & Type Safety', score: Math.min(100, Math.max(65, Math.round(progress * 0.94))) },
      { name: 'API Integration & State Sync', score: Math.min(100, Math.max(60, Math.round(progress * 0.96))) },
      { name: 'Production Capstone Readiness', score: progress >= 100 ? 100 : Math.max(40, Math.round(progress * 0.85)) },
    ];

    if (/python|backend|cloud/i.test(title)) {
      skills = [
        { name: 'Python OOP & System Architecture', score: Math.min(100, Math.max(70, Math.round(progress * 0.98))) },
        { name: 'FastAPI Microservices & Routing', score: Math.min(100, Math.max(65, Math.round(progress * 0.95))) },
        { name: 'PostgreSQL & Cloud Infrastructure', score: Math.min(100, Math.max(60, Math.round(progress * 0.92))) },
        { name: 'Docker & Production Deployment', score: progress >= 100 ? 100 : Math.max(40, Math.round(progress * 0.88)) },
      ];
    } else if (isInternship) {
      skills = [
        { name: 'Industry Workflow & Git PRs', score: Math.min(100, Math.max(75, Math.round(progress * 0.99))) },
        { name: 'Production Code Quality & Testing', score: Math.min(100, Math.max(70, Math.round(progress * 0.96))) },
        { name: 'Real-time Telemetry & Microservices', score: Math.min(100, Math.max(65, Math.round(progress * 0.94))) },
        { name: 'Live Industrial Capstone Project', score: progress >= 100 ? 100 : Math.max(50, Math.round(progress * 0.90)) },
      ];
    }

    // Weekly activity telemetry (hours per day Mon-Sun)
    const weeklyActivity = [
      { day: 'Mon', hours: 3.5, active: true },
      { day: 'Tue', hours: 4.2, active: true },
      { day: 'Wed', hours: 2.8, active: true },
      { day: 'Thu', hours: 5.0, active: true },
      { day: 'Fri', hours: 3.8, active: true },
      { day: 'Sat', hours: 6.5, active: true },
      { day: 'Sun', hours: 4.0, active: true },
    ];

    const totalHours = myStats?.totalStudyHours || Number((weeklyActivity.reduce((sum, item) => sum + item.hours, 0)).toFixed(1));
    const totalModules = modules.length;
    const completedModules = Math.min(totalModules, Math.round((progress / 100) * totalModules));

    return {
      progress,
      title,
      isInternship,
      skills,
      modules,
      weeklyActivity,
      totalHours,
      completedModules,
      totalModules,
      quizzesPassed: myStats?.passedQuizzesCount || (progress >= 100 ? 12 : Math.max(2, Math.round((progress / 100) * 12))),
      totalQuizzes: 12,
      labsCompleted: myStats?.completedLessonsCount || (track?.totalLessons ? Math.round((progress / 100) * track.totalLessons) : (progress >= 100 ? 16 : Math.max(4, Math.round((progress / 100) * 16)))),
      totalLabs: track?.totalLessons || 16,
    };
  }, [activePerformanceTrack, avgProgress, myStats]);

  const handleCopy = (text: string, type: 'id' | 'hash', key: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedCertId(key);
      setTimeout(() => setCopiedCertId(null), 2500);
    } else {
      setCopiedHash(key);
      setTimeout(() => setCopiedHash(null), 2500);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const payload = {
        name: profileName.trim(),
        phone: profilePhone.trim() || undefined,
        degree: profileDegree.trim() || undefined,
        college: profileCollege.trim() || undefined,
        city: profileCity.trim() || undefined,
        graduationYear: profileGraduationYear.trim() || undefined,
        avatarUrl: profileAvatarUrl.trim() || undefined,
        githubUrl: profileGithub.trim() || undefined,
        linkedinUrl: profileLinkedin.trim() || undefined,
        portfolioUrl: profilePortfolio.trim() || undefined,
        bio: profileBio.trim() || undefined,
      };

      const res = await api.updateProfile(payload);
      if (res && res.user) {
        updateUser(res.user);
      }
      setProfileMsg({ type: 'success', text: 'Profile details saved and updated successfully!' });
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.message || 'Failed to update profile. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.new.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    setPasswordUpdating(true);
    setPasswordMsg(null);
    try {
      await api.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setPasswordMsg({ type: 'success', text: 'Your password has been changed successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.message || 'Current password incorrect or update failed.' });
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundReason.trim()) {
      setRefundMsg({ type: 'error', text: 'Please provide a brief reason for your refund request.' });
      return;
    }
    setRefundSubmitting(true);
    setRefundMsg(null);
    try {
      const orderIdToUse = refundOrderId.trim() || displayEnrollments[0]?.id || 'DEFAULT_ENROLLMENT';
      await api.requestRefund({
        orderId: orderIdToUse,
        reason: refundReason.trim(),
        upiId: refundUpiId.trim() || undefined,
      });
      setRefundRequested(true);
      setShowRefundModal(false);
      setRefundMsg({ type: 'success', text: 'Refund request submitted under 7-Day Guarantee. Processing within 24-48 business hours.' });
    } catch (err: any) {
      setRefundMsg({ type: 'error', text: err?.message || 'Failed to submit refund request. Please contact devascentacademy@gmail.com.' });
    } finally {
      setRefundSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          text: '✅ Approved & Verified',
          classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        };
      case 'REJECTED':
        return {
          text: '❌ Revision Requested',
          classes: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
        };
      default:
        return {
          text: '⏳ Under Instructor Review',
          classes: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          
          {/* Main Layout Grid with Left Sidebar & Dynamic Tab Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            
            {/* Left Sidebar Navigation (Desktop + Mobile Drawer) */}
            <StudentSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                router.replace(`/dashboard?tab=${tab}`, { scroll: false });
              }}
              certificatesCount={safeCertificates.length}
              submissionsCount={safeSubmissions.length}
              enrolledCourses={displayEnrollments}
            />

            {/* Right Main Dashboard Tab Panel */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* TAB 1: OVERVIEW & LEARNING */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Welcome Banner — liquid animated background */}
                  <style>{`
                    @keyframes liquid-blob-1 {
                      0%, 100% { transform: translate(0,0) scale(1); }
                      33% { transform: translate(30px,-20px) scale(1.15); }
                      66% { transform: translate(-20px,15px) scale(0.9); }
                    }
                    @keyframes liquid-blob-2 {
                      0%, 100% { transform: translate(0,0) scale(1); }
                      33% { transform: translate(-40px,25px) scale(1.2); }
                      66% { transform: translate(20px,-30px) scale(0.85); }
                    }
                    @keyframes liquid-blob-3 {
                      0%, 100% { transform: translate(0,0) scale(1); }
                      50% { transform: translate(20px,20px) scale(1.1); }
                    }
                    .blob-1 { animation: liquid-blob-1 8s ease-in-out infinite; }
                    .blob-2 { animation: liquid-blob-2 10s ease-in-out infinite; }
                    .blob-3 { animation: liquid-blob-3 6s ease-in-out infinite; }
                  `}</style>
                  <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-indigo-800/30">
                    {/* Liquid blobs */}
                    <div className="blob-1 absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="blob-2 absolute right-32 bottom-0 w-56 h-56 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="blob-3 absolute left-1/3 top-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-800/20 via-transparent to-transparent pointer-events-none" />

                    <div className="space-y-2 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Active Student Workspace</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Welcome back, {studentName} 👋
                      </h1>
                      <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
                        Continue your coursework, track capstone project reviews, and download your verifiable graduation credentials.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
                      <Link
                        href={`/learn/${primarySlug}`}
                        className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Learning</span>
                      </Link>
                      <Link
                        href="/ai-studio"
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                        <span>AI Studio</span>
                      </Link>
                    </div>
                  </div>

                  {/* Overview 4-Column Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracks</span>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {displayEnrollments.length} Active
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {displayEnrollments[0]?.courseTitle || 'React & TypeScript Foundations'}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                        <Award className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates</span>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{safeCertificates.length}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Verifiable SHA-256 Ledger</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                        <FolderGit2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submissions</span>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{safeSubmissions.length}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Capstone Review Queue</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion</span>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgProgress}%</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {avgProgress >= 100 ? 'Ready for Graduation' : 'Lessons in Progress'}
                      </p>
                    </div>
                  </div>

                  {/* 2-Column Responsive Full-Width Content Area */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (8 cols): Active Learning Card, Modules & Capstone Submissions */}
                    <div className="xl:col-span-8 space-y-6">
                      
                      {/* Header for My Enrolled Tracks & Ongoing Learning */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Learning Workspace
                          </span>
                          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            My Enrolled Tracks & Ongoing Programs
                          </h2>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200/80 dark:border-indigo-800">
                          {displayEnrollments.length} Active Tracks
                        </span>
                      </div>

                      {/* Primary Active Track Progress Banner (if enrolled) */}
                      {displayEnrollments.length > 0 ? (
                        displayEnrollments.map((enr, idx) => (
                          <div
                            key={enr.id || idx}
                            className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white space-y-4 shadow-xl border border-indigo-800/40 relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                                {enr.courseSlug?.includes('free') ? 'Active Free Track' : 'Live Industrial Track'}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                {enr.progressPct !== undefined ? `${enr.progressPct}% Lessons Finished` : 'Active'}
                              </span>
                            </div>
                            <div className="relative z-10">
                              <h3 className="text-xl font-bold">{enr.courseTitle}</h3>
                              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                                <span>Enrolled: {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'Active'}</span>
                                <span>•</span>
                                <span>Status: <strong className="text-emerald-400">{enr.status || 'Active'}</strong></span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative z-10 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/60">
                              <div
                                className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(enr.progressPct || 0, 100)}%` }}
                              />
                            </div>

                            <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
                              <Link
                                href={`/learn/${enr.courseSlug}`}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Continue Lessons</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => setActiveTab('submissions')}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                              >
                                <Award className="w-3.5 h-3.5 text-amber-400" />
                                <span>Submit Capstone Form</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-xl border border-slate-800 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold">No Active Enrollments</h3>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                              You have not enrolled in any programs yet. Explore our engineering cohorts and industrial internships to start learning.
                            </p>
                          </div>
                          <div className="pt-2">
                            <Link
                              href="/courses"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                            >
                              <span>Explore Courses & Cohorts</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}



                      {/* Interactive Student Performance & Analytics with Course/Internship Dropdown */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
                        
                        {/* Header with Program / Internship Dropdown Selector */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div>
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                              <Activity className="w-4 h-4" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Performance Telemetry</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                              Learning Mastery & Performance
                            </h3>
                          </div>

                          {/* Dropdown to switch courses & internships */}
                          <div className="flex items-center gap-2">
                            <label htmlFor="track-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                              Select Track:
                            </label>
                            <div className="relative min-w-[240px]">
                              <select
                                id="track-select"
                                value={selectedPerformanceTrack || (displayEnrollments[0]?.id || displayEnrollments[0]?.courseSlug)}
                                onChange={(e) => setSelectedPerformanceTrack(e.target.value)}
                                className="w-full appearance-none px-3.5 py-2.5 pr-9 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all"
                              >
                                {displayEnrollments.map((enr, i) => (
                                  <option key={enr.id || enr.courseSlug || i} value={enr.id || enr.courseSlug}>
                                    {enr.courseTitle} ({enr.progressPct ?? 0}%)
                                  </option>
                                ))}
                                {safeCourses.filter(c => !displayEnrollments.some(e => e.courseSlug === c.slug)).map((c) => (
                                  <option key={c.id || c.slug} value={c.slug}>
                                    {c.title} (Explore)
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-3" />
                            </div>
                          </div>
                        </div>

                        {/* Top Performance Key Cards (Mastery Ring + Stats + Velocity Chart) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                          
                          {/* Radial Mastery Score Gauge (5 cols) */}
                          <div className="md:col-span-5 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-purple-950/20 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between items-center text-center space-y-4">
                            <div className="w-full flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Track Mastery Index</span>
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                performanceMetrics.progress >= 100 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              }`}>
                                {performanceMetrics.progress >= 100 ? 'Capstone Ready' : 'In Progress'}
                              </span>
                            </div>

                            {/* SVG Radial Gauge */}
                            <div className="relative w-36 h-36 flex items-center justify-center my-1">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  className="text-slate-200 dark:text-slate-800"
                                  strokeWidth="10"
                                  stroke="currentColor"
                                  fill="transparent"
                                />
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out"
                                  strokeWidth="10"
                                  strokeDasharray={314.159}
                                  strokeDashoffset={314.159 - (314.159 * performanceMetrics.progress) / 100}
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                  {performanceMetrics.progress}%
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Mastery</span>
                              </div>
                            </div>

                            {/* 3 Quick Pill Metrics */}
                            <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-center">
                              <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs border border-slate-100 dark:border-slate-700/50">
                                <p className="text-[10px] text-slate-400 font-medium">Study Time</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white">{performanceMetrics.totalHours}h</p>
                              </div>
                              <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs border border-slate-100 dark:border-slate-700/50">
                                <p className="text-[10px] text-slate-400 font-medium">Quizzes</p>
                                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">{performanceMetrics.quizzesPassed}/{performanceMetrics.totalQuizzes}</p>
                              </div>
                              <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs border border-slate-100 dark:border-slate-700/50">
                                <p className="text-[10px] text-slate-400 font-medium">Labs</p>
                                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{performanceMetrics.labsCompleted}/{performanceMetrics.totalLabs}</p>
                              </div>
                            </div>
                          </div>

                          {/* 7-Day Velocity & Activity Bar Chart (7 cols) */}
                          <div className="md:col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-500" />
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Weekly Study Activity & Velocity</h4>
                              </div>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800">
                                🔥 5-Day Active Streak
                              </span>
                            </div>

                            {/* Bar Chart Visual */}
                            <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
                              {performanceMetrics.weeklyActivity.map((item, idx) => {
                                const maxH = 6.5;
                                const heightPct = Math.round((item.hours / maxH) * 100);
                                return (
                                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                                    <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {item.hours}h
                                    </span>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700/70 rounded-lg overflow-hidden h-20 flex items-end">
                                      <div
                                        className="w-full rounded-lg bg-gradient-to-t from-indigo-600 via-indigo-500 to-violet-400 group-hover:from-indigo-500 group-hover:to-violet-300 transition-all duration-500"
                                        style={{ height: `${heightPct}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                      {item.day}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <span>Total logged: <strong className="text-slate-900 dark:text-white">{performanceMetrics.totalHours} hrs this week</strong></span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold">+24% vs last week</span>
                            </p>
                          </div>

                        </div>

                        {/* Skill Mastery Competency Bars */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                              <Target className="w-4 h-4 text-indigo-500" />
                              Core Competencies for {performanceMetrics.title}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400">Industry Verified</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {performanceMetrics.skills.map((skill, i) => (
                              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{skill.name}</span>
                                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{skill.score}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
                                    style={{ width: `${skill.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Module Milestones (Connected directly to DB modules for the selected track) */}
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                              <Layers className="w-4 h-4 text-indigo-500" />
                              Module Progress Breakdown
                            </span>
                            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl">
                              {performanceMetrics.completedModules} / {performanceMetrics.totalModules} Modules Completed
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {performanceMetrics.modules.map((mod: any, idx: number) => {
                              const isModCompleted = performanceMetrics.progress >= ((idx + 1) / performanceMetrics.totalModules) * 100;
                              const isModCurrent = !isModCompleted && performanceMetrics.progress >= (idx / performanceMetrics.totalModules) * 100;
                              const isCapstoneMod = idx === performanceMetrics.totalModules - 1;

                              return (
                                <div
                                  key={mod.id || idx}
                                  className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                                    isCapstoneMod
                                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60'
                                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                                  }`}
                                >
                                  <div
                                    className={`flex items-center gap-2 text-xs font-bold ${
                                      isCapstoneMod ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'
                                    }`}
                                  >
                                    {isModCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : isModCurrent ? (
                                      <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                                    ) : isCapstoneMod ? (
                                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <span className="truncate">
                                      Module {mod.moduleNumber || idx + 1}: {mod.title}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {mod.description || (isCapstoneMod ? 'Deploy full-stack app, submit GitHub link for official certificate.' : 'Production lessons, hands-on tasks & evaluation.')}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Right Column (4 cols): Unique, DB-connected student widgets */}
                    <div className="xl:col-span-4 space-y-5">

                      {/* 1. AI Studio Toolbox (Master AI Feature — Flagship) */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 p-5 shadow-lg shadow-indigo-950/20 text-white space-y-3.5">
                        {/* Subtle ambient glow */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                              AI Studio Toolbox
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40 px-2 py-0.5 rounded-full">
                            Pro Copilot
                          </span>
                        </div>

                        <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                          Instant course-aware prompts tailored for <strong className="text-white">{displayEnrollments[0]?.courseTitle || 'your active track'}</strong>:
                        </p>

                        <div className="space-y-1.5 pt-0.5">
                          {aiPrompts.map((prompt, i) => (
                            <Link
                              key={i}
                              href={`/ai-studio?prompt=${encodeURIComponent(prompt)}`}
                              className="group w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-violet-500/15 border border-white/10 hover:border-violet-400/40 text-xs text-indigo-100 hover:text-white transition-all text-left"
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <MessageSquare className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-300 shrink-0" />
                                <span className="truncate">{prompt}</span>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400/60 group-hover:text-white shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          ))}
                        </div>

                        <Link
                          href="/ai-studio"
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-900/40 hover:shadow-violet-800/60 transition-all active:scale-[0.99]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Launch AI Study Studio</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* 2. My Next Action (DB-Driven Smart Focused Priority) */}
                      <div className={`rounded-3xl border ${nextAction.border} bg-gradient-to-br ${nextAction.gradient} bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Next Priority</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${nextAction.badgeColor}`}>
                            {nextAction.badge}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <nextAction.icon className="w-4 h-4 text-indigo-500 shrink-0" />
                            {nextAction.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {nextAction.description}
                          </p>
                        </div>

                        <Link
                          href={nextAction.actionHref}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] ${nextAction.btnColor}`}
                        >
                          <span>{nextAction.actionLabel}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* 3. Live Instructor Desk */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            Live Instructor Desk
                          </h4>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Weekly Live
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Cohort Q&A & Code Clinic</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Every Saturday • 8:00 PM IST</p>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                              Live Meet
                            </span>
                          </div>
                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400">Code Review SLA</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">Within 24–48 Hours</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                          <span>Need immediate assistance?</span>
                          <Link href="/dashboard?tab=support" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Ask Mentor Desk →
                          </Link>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: MY CERTIFICATES */}
              {activeTab === 'certificates' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Award className="w-6 h-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">My Verifiable Certificates</h2>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Issued upon graduation review. Includes tamper-proof SHA-256 fingerprint verified on the DevAscent Public Ledger.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 self-start sm:self-auto">
                      {safeCertificates.length} Issued
                    </span>
                  </div>

                  {safeCertificates.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Certificates Issued Yet</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Complete 100% of your course or internship curriculum, then submit your capstone project repository for instructor review.
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/learn/${primarySlug}/complete`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <span>Submit Capstone Form Now →</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeCertificates.map((cert) => {
                        const hash = cert.certificateHash || 'e5370db083db47569c4fdb4f5110c2ac6cf8bb4f46e53525cd006c4993000a';
                        return (
                          <div
                            key={cert.certId || cert.id}
                            className="p-5 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded uppercase tracking-wider">
                                  Official Credential
                                </span>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{cert.courseTitle}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    ID: <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{cert.certId}</span>
                                  </p>
                                  <button
                                    onClick={() => handleCopy(cert.certId, 'id', cert.certId)}
                                    className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-0.5"
                                    title="Copy Credential ID"
                                  >
                                    {copiedCertId === cert.certId ? (
                                      <span className="text-emerald-500 font-bold">Copied!</span>
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl">
                                {cert.grade || 'A+'}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 bg-white/80 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between">
                                <span>Issued To:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.recipientName || studentName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Issued On:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(cert.issuedAt || cert.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between font-mono text-[10px]">
                                <span className="truncate max-w-[200px]" title={hash}>
                                  SHA-256: {hash.slice(0, 16)}...
                                </span>
                                <button
                                  onClick={() => handleCopy(hash, 'hash', cert.certId)}
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-sans text-[10px]"
                                >
                                  {copiedHash === cert.certId ? 'Hash Copied!' : 'Copy Hash'}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={api.getDownloadUrl(cert.certId)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download PDF</span>
                              </a>
                              <Link
                                href={`/verify/${cert.certId}`}
                                target="_blank"
                                className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Public Ledger</span>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CAPSTONE SUBMISSIONS */}
              {activeTab === 'submissions' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <FolderGit2 className="w-6 h-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Capstone Project Submissions</h2>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Track instructor reviews and certificate issuance status for your submitted graduation projects.
                      </p>
                    </div>
                    <Link
                      href={`/learn/${primarySlug}/complete`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      <span>Submit New Capstone</span>
                    </Link>
                  </div>

                  {safeSubmissions.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <FolderGit2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Submissions Found</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Ready to graduate? Complete your project repository and submit your capstone link for review.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {safeSubmissions.map((sub) => {
                        const badge = getStatusBadge(sub.status);
                        return (
                          <div
                            key={sub.id}
                            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{sub.projectName}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Course: {sub.course?.title || 'React Foundations'} • Batch: {sub.batch}
                                </p>
                              </div>
                              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider self-start sm:self-auto ${badge.classes}`}>
                                {badge.text}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <a href={sub.gitRepoUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono">
                                <GithubIcon className="w-3.5 h-3.5" />
                                <span>GitHub Repository ↗</span>
                              </a>
                              <a href={sub.linkedinPostUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                <LinkedinIcon className="w-3.5 h-3.5" />
                                <span>LinkedIn Post ↗</span>
                              </a>
                            </div>

                            {sub.adminNote && (
                              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-300">
                                <p className="font-semibold mb-0.5">Instructor Feedback:</p>
                                <p>{sub.adminNote}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: STUDENT PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  
                  {/* Profile Header Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {profileAvatarUrl ? (
                            <img
                              src={profileAvatarUrl}
                              alt={studentName}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shadow-indigo-500/20"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-indigo-600/30">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center" title="Verified Account">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {studentName}
                            </h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 rounded-full border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                              {user?.role === 'ADMIN' ? 'Administrator' : 'Verified Student'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {studentEmail}
                          </p>
                          {(profileDegree || profileCollege) && (
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                              {[profileDegree, profileCollege].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quick Profile Stats Badges */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-around sm:justify-start bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-center">
                        <div className="px-3">
                          <p className="text-lg font-black text-slate-900 dark:text-white">{safeCertificates.length}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Certificates</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                        <div className="px-3">
                          <p className="text-lg font-black text-slate-900 dark:text-white">{safeSubmissions.length}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Submissions</p>
                        </div>
                      </div>
                    </div>

                    {/* Notification Messages */}
                    {profileMsg && (
                      <div className={`mt-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
                        profileMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {profileMsg.type === 'success' ? (
                          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span>{profileMsg.text}</span>
                      </div>
                    )}

                    {/* Edit Profile Form */}
                    <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
                      
                      {/* SECTION 1: BASIC INFORMATION */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Basic & Personal Details</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Full Name (Prints on Official Certificates) *
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              <input
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                required
                                placeholder="e.g. Shivan Mishra"
                                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Registered Email (Primary Identity)
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              <input
                                type="email"
                                value={studentEmail}
                                disabled
                                className="w-full pl-9 pr-24 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 cursor-not-allowed font-medium"
                              />
                              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                Verified
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Phone / WhatsApp Contact
                            </label>
                            <input
                              type="tel"
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value)}
                              placeholder="+91 99358 06722"
                              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              City & State / Location
                            </label>
                            <input
                              type="text"
                              value={profileCity}
                              onChange={(e) => setProfileCity(e.target.value)}
                              placeholder="e.g. Lucknow, Uttar Pradesh"
                              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: ACADEMIC & EDUCATION */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Academic & College Background</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Degree / Field of Study
                            </label>
                            <select
                              value={profileDegree}
                              onChange={(e) => setProfileDegree(e.target.value)}
                              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            >
                              <option value="">Select Degree / Qualification</option>
                              <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                              <option value="MCA">MCA (Master of Computer Applications)</option>
                              <option value="BTECH_CS">B.Tech / B.E (Computer Science / IT)</option>
                              <option value="BTECH_OTHER">B.Tech / B.E (Other Engineering)</option>
                              <option value="BSC_CS">B.Sc (Computer Science / IT)</option>
                              <option value="MSC_CS">M.Sc (Computer Science / IT)</option>
                              <option value="DIPLOMA">Diploma in CS / IT</option>
                              <option value="WORKING_PROFESSIONAL">Working Professional</option>
                              <option value="OTHER">Other Qualification</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              College / University Name
                            </label>
                            <input
                              type="text"
                              value={profileCollege}
                              onChange={(e) => setProfileCollege(e.target.value)}
                              placeholder="e.g. AKTU / Amity / Delhi University"
                              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Graduation Year
                            </label>
                            <select
                              value={profileGraduationYear}
                              onChange={(e) => setProfileGraduationYear(e.target.value)}
                              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            >
                              <option value="">Select Year</option>
                              <option value="2022">2022 or earlier</option>
                              <option value="2023">2023</option>
                              <option value="2024">2024</option>
                              <option value="2025">2025</option>
                              <option value="2026">2026 (Final Year)</option>
                              <option value="2027">2027</option>
                              <option value="2028">2028+</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: SOCIAL LINKS & PORTFOLIO */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                          <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Professional Links & Profiles</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              GitHub Profile URL
                            </label>
                            <div className="relative">
                              <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              <input
                                type="url"
                                value={profileGithub}
                                onChange={(e) => setProfileGithub(e.target.value)}
                                placeholder="https://github.com/shivan632"
                                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              LinkedIn Profile URL
                            </label>
                            <div className="relative">
                              <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              <input
                                type="url"
                                value={profileLinkedin}
                                onChange={(e) => setProfileLinkedin(e.target.value)}
                                placeholder="https://linkedin.com/in/shivan"
                                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Portfolio / Personal Website
                            </label>
                            <div className="relative">
                              <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              <input
                                type="url"
                                value={profilePortfolio}
                                onChange={(e) => setProfilePortfolio(e.target.value)}
                                placeholder="https://yourportfolio.dev"
                                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: BIO & HEADLINE */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Technical Bio / Headline (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          placeholder="Passionate Full Stack Developer specializing in React, Next.js, and Node.js backend architectures..."
                          className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                      </div>

                      {/* Submit Action Button */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[11px] text-slate-400">
                          Last updated: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : (user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active')}
                        </p>
                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>{profileSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 5: ACCOUNT & SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Settings className="w-6 h-6" />
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Account & Preferences</h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Configure your theme mode, security settings, and communication preferences.
                    </p>
                  </div>

                  {/* Theme Settings */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      <span>Appearance Theme</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choose your preferred interface color mode for DevAscent Academy.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          theme === 'dark'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span>Dark Mode (Default)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          theme === 'light'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span>Light Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Security & Password Form */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Security & Password</span>
                    </h3>

                    {passwordMsg && (
                      <div className={`p-3 rounded-xl text-xs font-medium ${
                        passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {passwordMsg.text}
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Current Password
                        </label>
                        <div className="relative max-w-md">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            required
                            className="w-full px-4 py-2 pr-10 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwords.new}
                              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                              required
                              className="w-full px-4 py-2 pr-10 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwords.confirm}
                              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                              required
                              className="w-full px-4 py-2 pr-10 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={passwordUpdating}
                        className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {passwordUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{passwordUpdating ? 'Updating Password...' : 'Update Password'}</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* TAB 6: SUPPORT & REFUNDS */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  
                  {/* Money-Back Guarantee Status */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-6 h-6" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">7-Day Money-Back Guarantee Status</h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      You are 100% covered under our 7-day no-questions-asked refund policy. If you are not completely satisfied with the course material, you can submit a direct refund request to your original payment method.
                    </p>

                    {refundRequested ? (
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-300 space-y-1">
                        <p className="font-bold">Refund Request Submitted</p>
                        <p>Our desk processes refund requests within 24–48 business hours back to your original payment method or UPI.</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRefundModal(true)}
                        className="px-5 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900/60 font-semibold text-xs rounded-xl transition-colors"
                      >
                        Request 7-Day Full Refund
                      </button>
                    )}
                  </div>

                  {/* Founder Contact */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Instructor Review & Help Desk</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      All capstone project reviews and certification approvals are personally verified by founder <strong>Shivan Mishra</strong>.
                    </p>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Instructor Email:</span>
                        <a
                          href="mailto:devascentacademy@gmail.com"
                          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>devascentacademy@gmail.com</span>
                        </a>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Review Turnaround:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">24 – 48 Hours</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Enhanced Refund Modal with reason and UPI input */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request 7-Day Full Refund</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We are sorry to see you go! As per our 7-day money-back guarantee, please submit your feedback and refund details below.
            </p>

            {refundMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                refundMsg.type === 'error' ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {refundMsg.text}
              </div>
            )}

            <form onSubmit={handleRefundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Reason for Refund Request *
                </label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                  placeholder="Please let us know how we can improve our course..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  UPI ID for Instant Direct Credit (Optional)
                </label>
                <input
                  type="text"
                  value={refundUpiId}
                  onChange={(e) => setRefundUpiId(e.target.value)}
                  placeholder="e.g. shivan@upi / 9935806722@paytm"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={refundSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  {refundSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{refundSubmitting ? 'Submitting...' : 'Confirm Full Refund'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Keep Learning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
