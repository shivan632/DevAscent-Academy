'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, logout, updateUser } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'submissions' | 'profile' | 'settings' | 'support'>('overview');
  const [refundRequested, setRefundRequested] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Dynamic user data & certificates
  const [certificates, setCertificates] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [certsRes, subsRes, coursesRes, profileRes] = await Promise.allSettled([
          api.getMyCertificates(),
          api.getMySubmissions(),
          api.getCourses(),
          api.getProfile(),
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
        } else {
          setCertificates([]);
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
        } else {
          setSubmissions([]);
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
        } else {
          setCourses([]);
        }
      } catch (e) {
        setCertificates([]);
        setSubmissions([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const safeCertificates = Array.isArray(certificates) ? certificates : [];
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  const studentName = user?.name || profileName || 'Student';
  const studentEmail = user?.email || 'student@devascent.io';

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
              onSelectTab={(tab) => setActiveTab(tab)}
              certificatesCount={safeCertificates.length}
              submissionsCount={safeSubmissions.length}
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
                        Continue your coursework, inspect capstone project reviews, and download your verifiable graduation credentials.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
                      <Link
                        href="/learn/react-foundations-free"
                        className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Learning</span>
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
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">1 Active</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">React & TypeScript Foundations</p>
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
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">100%</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Ready for Graduation</p>
                    </div>
                  </div>

                  {/* 2-Column Responsive Full-Width Content Area */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (8 cols): Active Learning Card, Modules & Capstone Submissions */}
                    <div className="xl:col-span-8 space-y-6">
                      
                      {/* Active Free Track Quick Launch Card */}
                      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-7 text-white space-y-4 shadow-md border border-emerald-800/40">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                            Instant Free Track
                          </span>
                          <span className="text-xs text-slate-400 font-medium">100% Lessons Finished</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Modern React & TypeScript Foundations</h3>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Your curriculum lessons are completed! Apply for your graduation certificate now with your GitHub capstone project repository.
                          </p>
                        </div>
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <Link
                            href="/learn/react-foundations-free/complete"
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                          >
                            <Award className="w-4 h-4" />
                            <span>Submit Capstone Form & Claim Certificate</span>
                          </Link>
                          <Link
                            href="/courses/react-foundations-free"
                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-colors"
                          >
                            View Syllabus
                          </Link>
                        </div>
                      </div>

                      {/* Interactive Curriculum Modules Completed */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Curriculum Breakdown</span>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">Modern React & TypeScript Foundations</h3>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl">
                            4 / 4 Modules Complete
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
                            href="/learn/react-foundations-free/complete"
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            + Submit Capstone
                          </Link>
                        </div>

                        {safeSubmissions.length === 0 ? (
                          <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
                            <FolderGit2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No project submissions yet</p>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                              Ready to graduate? Submit your GitHub capstone repository to trigger instant instructor review.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {safeSubmissions.map((sub) => (
                              <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white">{sub.projectName}</p>
                                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Course: {sub.course?.title || 'React Foundations'} ({sub.batch})</p>
                                  <div className="flex items-center gap-3 pt-1">
                                    <a href={sub.gitRepoUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[11px]">
                                      <span>GitHub Repo ↗</span>
                                    </a>
                                    <a href={sub.linkedinPostUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]">
                                      <span>LinkedIn Post ↗</span>
                                    </a>
                                  </div>
                                </div>
                                <span className={`font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider self-start sm:self-auto ${
                                  sub.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : sub.status === 'REJECTED'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}>
                                  {sub.status}
                                </span>
                              </div>
                            ))}
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

                      {/* Graduation Milestone Roadmap */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Graduation Pathway</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">1. OTP Email Verification</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">2. Interactive React Curriculum (100%)</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-amber-500">
                            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                            <span className="font-bold text-slate-900 dark:text-white">3. Submit GitHub Capstone Link</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-slate-400">
                            <Award className="w-4 h-4 shrink-0" />
                            <span>4. Mint Verifiable SHA-256 Certificate</span>
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
                          Your learning is backed by our 100% money-back guarantee. If you are not satisfied, request an instant full refund.
                        </p>
                        {refundRequested ? (
                          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-semibold">
                            Refund request submitted. Processing within 24h.
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
                            href="/certificate"
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Certificate Generator Demo</span>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>

                          <Link
                            href="/verify/DEV-2026-A1B2C3"
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
                        Issued upon graduation review. Includes QR code and tamper-proof SHA-256 fingerprint on the DevAscent Public Ledger.
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
                        Complete 100% of your course or internship curriculum, then submit your capstone project for instructor review.
                      </p>
                      <div className="pt-2">
                        <Link
                          href="/learn/react-foundations-free/complete"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <span>Submit Capstone Form Now →</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {safeCertificates.map((cert) => (
                        <div
                          key={cert.certId}
                          className="p-5 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded uppercase tracking-wider">
                                Official Credential
                              </span>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{cert.courseTitle}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Credential ID: <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{cert.certId}</span></p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl">
                              {cert.grade || 'A+'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-white/80 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between">
                              <span>Issued To:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.recipientName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Issued On:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(cert.issuedAt).toLocaleDateString()}</span>
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
                      ))}
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
                      href="/learn/react-foundations-free/complete"
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
                      {safeSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{sub.projectName}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Course: {sub.course?.title || 'React Foundations'} • Batch: {sub.batch}</p>
                            </div>
                            <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider self-start sm:self-auto ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : sub.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}>
                              {sub.status}
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
                      ))}
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
                          Last updated: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
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
                        <input
                          type="password"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          required
                          className="w-full max-w-md px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            required
                            className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            required
                            className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        Update Password
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
                      You are 100% covered under our 7-day no-questions-asked refund policy. If you are not completely satisfied with the course material, you can request a full refund to your original payment method.
                    </p>

                    {refundRequested ? (
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-300 space-y-1">
                        <p className="font-bold">Refund Request Submitted</p>
                        <p>Our desk will process your refund to your original payment method within 24 hours.</p>
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
                      <div className="flex justify-between">
                        <span className="text-slate-500">Instructor Email:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">support@devascent.io</span>
                      </div>
                      <div className="flex justify-between">
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

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request 7-Day Full Refund</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We are sorry to see you go! As per our 7-day policy, your payment will be credited back via Razorpay.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setRefundRequested(true);
                  setShowRefundModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
              >
                Confirm Full Refund
              </button>
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl text-xs"
              >
                Keep Learning
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
