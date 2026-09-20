'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  const [enrollments, setEnrollments] = useState<any[]>([]);
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

  // 4. Load dashboard datasets
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [certsRes, subsRes, coursesRes, profileRes, enrollRes] = await Promise.allSettled([
          api.getMyCertificates(),
          api.getMySubmissions(),
          api.getCourses(),
          api.getProfile(),
          api.getMyEnrollments(),
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
          if (Array.isArray(val?.courses)) {
            setCourses(val.courses);
          } else if (Array.isArray(val)) {
            setCourses(val);
          } else {
            setCourses([]);
          }
        }

        if (enrollRes.status === 'fulfilled' && enrollRes.value) {
          const val = enrollRes.value;
          if (Array.isArray(val?.enrollments)) {
            setEnrollments(val.enrollments);
          } else if (Array.isArray(val)) {
            setEnrollments(val);
          } else {
            setEnrollments([]);
          }
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

  // Derived calculations
  const displayEnrollments = safeEnrollments.length > 0 
    ? safeEnrollments 
    : [
        {
          id: 'free-default',
          courseSlug: 'react-foundations-free',
          courseTitle: 'Modern React & TypeScript Foundations',
          progressPct: 100,
          enrolledAt: user?.createdAt || new Date().toISOString(),
          status: 'ACTIVE',
        }
      ];

  const primarySlug = displayEnrollments[0]?.courseSlug || 'react-foundations-free';

  const avgProgress = safeEnrollments.length > 0
    ? Math.round(safeEnrollments.reduce((acc, e) => acc + (Number(e.progressPct) || 0), 0) / safeEnrollments.length)
    : 100;

  const studentName = user?.name || profileName || 'Student';
  const studentEmail = user?.email || 'student@devascent.io';

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
      setRefundMsg({ type: 'error', text: err?.message || 'Failed to submit refund request. Please contact support@devascent.io.' });
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

  if (loading && authLoading) {
    return <DashboardSkeleton />;
  }

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
                  
                  {/* Welcome Banner */}
                  <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-indigo-800/30">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
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
                      
                      {/* Active Enrolled Tracks Cards */}
                      {displayEnrollments.map((enr, idx) => (
                        <div
                          key={enr.id || idx}
                          className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-7 text-white space-y-4 shadow-md border border-emerald-800/40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                              {enr.courseSlug.includes('free') ? 'Instant Free Track' : 'Live Cohort Track'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {enr.progressPct !== undefined ? `${enr.progressPct}% Lessons Finished` : 'Active'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{enr.courseTitle}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                              <span>Enrolled: {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'Active'}</span>
                              <span>•</span>
                              <span>Status: <strong className="text-emerald-400">{enr.status || 'Active'}</strong></span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/60">
                            <div
                              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(enr.progressPct || 0, 100)}%` }}
                            />
                          </div>

                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link
                              href={`/learn/${enr.courseSlug}`}
                              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Continue Course Lessons</span>
                            </Link>
                            <Link
                              href={`/learn/${enr.courseSlug}/complete`}
                              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>Submit Capstone Form</span>
                            </Link>
                          </div>
                        </div>
                      ))}

                      {/* Interactive Curriculum Modules Breakdown */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Curriculum Breakdown</span>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                              {displayEnrollments[0]?.courseTitle || 'Modern React & TypeScript Foundations'}
                            </h3>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl">
                            4 / 4 Core Modules
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Module 1: React 19 Core & Hooks</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">useState, useEffect, useMemo, custom hooks & TypeScript props.</p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Module 2: TypeScript & Async APIs</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict typing, generics, TanStack Query, and error boundaries.</p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Module 3: Global State & Architecture</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Zustand stores, persistent auth, and Context API patterns.</p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>Module 4: Graduation Capstone Project</span>
                            </div>
                            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">Deploy full-stack app, submit GitHub link for official certificate.</p>
                          </div>
                        </div>
                      </div>

                      {/* Capstone Submissions Queue */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>My Capstone Project Submissions</span>
                          </h3>
                          <Link
                            href={`/learn/${primarySlug}/complete`}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            + Submit Capstone Form
                          </Link>
                        </div>

                        {safeSubmissions.length === 0 ? (
                          <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
                            <FolderGit2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No project submissions yet</p>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                              Ready to graduate? Submit your GitHub capstone repository to trigger instant instructor review.
                            </p>
                            <div className="pt-2">
                              <Link
                                href={`/learn/${primarySlug}/complete`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
                              >
                                <span>Submit Capstone Now</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {safeSubmissions.map((sub) => {
                              const badge = getStatusBadge(sub.status);
                              return (
                                <div
                                  key={sub.id}
                                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                >
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{sub.projectName}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                      Course: {sub.course?.title || 'React Foundations'} ({sub.batch})
                                    </p>
                                    <div className="flex items-center gap-3 pt-1">
                                      <a
                                        href={sub.gitRepoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                      >
                                        <span>GitHub Repo ↗</span>
                                      </a>
                                      <a
                                        href={sub.linkedinPostUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                                      >
                                        <span>LinkedIn Post ↗</span>
                                      </a>
                                    </div>
                                  </div>
                                  <span className={`font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider self-start sm:self-auto ${badge.classes}`}>
                                    {badge.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right Column (4 cols): Live Mentorship, Guarantees & Resources */}
                    <div className="xl:col-span-4 space-y-6">
                      
                      {/* Live Code Reviews & Mentorship Schedule */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Live Instructor Desk</span>
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Weekly
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Live portfolio code reviews and architecture teardowns conducted personally by <strong>Shivan Mishra</strong>.
                        </p>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                          <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Next Live Session:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">Saturday, 8:00 PM</span>
                          </div>
                          <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Turnaround Time:</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">24 – 48 Hours</span>
                          </div>
                        </div>
                      </div>

                      {/* Graduation Milestone Roadmap (Dynamic) */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Graduation Pathway</h4>
                        <div className="space-y-2.5 text-xs">
                          {/* Step 1 */}
                          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">1. OTP Email Identity Verified</span>
                          </div>

                          {/* Step 2 */}
                          <div className={`flex items-center gap-2.5 ${avgProgress >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                            {avgProgress >= 100 ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                            )}
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              2. Complete Curriculum ({avgProgress}%)
                            </span>
                          </div>

                          {/* Step 3 */}
                          <div className={`flex items-center gap-2.5 ${safeSubmissions.length > 0 ? 'text-emerald-600 dark:text-emerald-400' : (avgProgress >= 100 ? 'text-amber-500' : 'text-slate-400')}`}>
                            {safeSubmissions.length > 0 ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : avgProgress >= 100 ? (
                              <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                            ) : (
                              <FolderGit2 className="w-4 h-4 shrink-0" />
                            )}
                            <span className={avgProgress >= 100 && safeSubmissions.length === 0 ? 'font-bold text-slate-900 dark:text-white' : ''}>
                              3. Submit GitHub Capstone Link
                            </span>
                          </div>

                          {/* Step 4 */}
                          <div className={`flex items-center gap-2.5 ${safeCertificates.length > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                            {safeCertificates.length > 0 ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : (
                              <Award className="w-4 h-4 shrink-0" />
                            )}
                            <span className={safeCertificates.length > 0 ? 'font-bold' : ''}>
                              4. Mint Verifiable SHA-256 Certificate
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 7-Day Money-Back Guarantee Status Card */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">7-Day Guarantee Protection</h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Your enrollment is protected by our 100% money-back guarantee. If you are not satisfied, request a full refund to your original payment method.
                        </p>
                        {refundRequested ? (
                          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-semibold">
                            Refund request submitted. Processing within 24–48 hours.
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowRefundModal(true)}
                            className="w-full text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-red-50/40 dark:hover:bg-red-950/30 transition-colors"
                          >
                            Request 7-Day Full Refund
                          </button>
                        )}
                      </div>

                      {/* Quick Developer Resources & Community */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Resources</h4>
                        <div className="space-y-2 text-xs">
                          <Link
                            href="/ai-studio"
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>AI Study Notes & Interview Copilot</span>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>

                          <Link
                            href="/verify/DEVASCENT-2025-VALID"
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Public Ledger Verifier</span>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
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
                          href="mailto:support@devascent.io"
                          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>support@devascent.io</span>
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
