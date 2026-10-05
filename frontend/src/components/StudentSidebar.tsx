'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';
import { useSidebarStore } from '../lib/store/sidebarStore';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  FolderGit2,
  User,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
  X,
  Sparkles,
  BarChart3,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface StudentSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: 'overview' | 'analytics' | 'certificates' | 'submissions' | 'profile' | 'settings' | 'support') => void;
  certificatesCount?: number;
  submissionsCount?: number;
  enrolledCourses?: Array<{
    id?: string;
    courseId?: string;
    courseSlug: string;
    courseTitle: string;
    progressPct?: number;
  }>;
}

export default function StudentSidebar({
  activeTab = 'overview',
  onSelectTab,
  certificatesCount = 0,
  submissionsCount = 0,
  enrolledCourses = [],
}: StudentSidebarProps) {
  const { user, logout } = useAuthStore();
  const { isOpen, close } = useSidebarStore();
  const pathname = usePathname();

  // Hydration guard: defer client-only state reads until after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const studentName = mounted ? (user?.name || 'Student') : 'Student';
  const studentEmail = mounted ? (user?.email || 'student@devascent.io') : 'student@devascent.io';

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview & Learning',
      icon: LayoutDashboard,
      iconColor: 'text-indigo-400',
    },
    {
      id: 'analytics',
      label: 'Progress Analytics',
      icon: BarChart3,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'certificates',
      label: 'My Certificates',
      icon: Award,
      iconColor: 'text-emerald-400',
      count: certificatesCount,
      countColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'submissions',
      label: 'Capstone Submissions',
      icon: FolderGit2,
      iconColor: 'text-amber-400',
      count: submissionsCount,
      countColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: User,
      iconColor: 'text-slate-400',
    },
    {
      id: 'settings',
      label: 'Account & Settings',
      icon: Settings,
      iconColor: 'text-slate-400',
    },
    {
      id: 'support',
      label: '7-Day Refund & Support',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
    },
  ];

  const handleItemClick = (id: any) => {
    if (onSelectTab) {
      onSelectTab(id);
    }
    close();
  };

  const primarySlug = mounted && enrolledCourses.length > 0 ? enrolledCourses[0].courseSlug : 'react-foundations-free';

  const sidebarContent = (
    <div className="bg-white/95 dark:bg-[#0A0D16]/90 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 shadow-xl shadow-black/5 dark:shadow-black/40 space-y-5">
      
      {/* Profile Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shrink-0 shadow-md shadow-indigo-500/20">
            <div className="w-11 h-11 rounded-[14px] bg-slate-900 text-white flex items-center justify-center font-extrabold text-base">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div className="overflow-hidden space-y-0.5 min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
              {studentName}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {studentEmail}
            </p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-md border border-indigo-500/30 uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
              <span>VERIFIED STUDENT</span>
            </div>
          </div>
        </div>

        {/* Close button on mobile drawer */}
        <button
          onClick={close}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items Menu */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
          Workspace Navigation
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : item.iconColor}`} />
                <span>{item.label}</span>
              </div>
              {mounted && item.count !== undefined && item.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.countColor
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Enrolled Courses Section (if any) */}
      {mounted && enrolledCourses.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between px-3 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>My Enrolled Tracks ({enrolledCourses.length})</span>
            </span>
          </div>
          {enrolledCourses.slice(0, 3).map((enr, idx) => (
            <Link
              key={idx}
              href={`/learn/${enr.courseSlug}`}
              onClick={close}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs transition-all duration-200 border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/30 group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-semibold truncate">{enr.courseTitle}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                {enr.progressPct !== undefined ? `${enr.progressPct}%` : 'Active'}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Launch & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1">
          Quick Access
        </span>

        <Link
          href={`/learn/${primarySlug}`}
          onClick={close}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 font-semibold transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span>Resume Learning Track</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {onSelectTab ? (
          <button
            type="button"
            onClick={() => handleItemClick('submissions')}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Submit Capstone Form</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <Link
            href="/dashboard?tab=submissions"
            onClick={close}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Submit Capstone Form</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        <Link
          href="/ai-studio"
          onClick={close}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/15 text-purple-700 dark:text-purple-300 font-medium transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Studio (Copilot Beta)</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/courses"
          onClick={close}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-300 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Explore All Cohorts</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <button
          onClick={() => {
            logout();
            close();
          }}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-semibold transition-all duration-200 mt-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Always Visible on lg+ screens) */}
      <aside className="hidden lg:block lg:col-span-3 sticky top-28">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Controlled by useSidebarStore) */}
      {mounted && isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-md flex animate-fadeIn">
          <div className="w-4/5 max-w-xs bg-transparent h-full p-4 overflow-y-auto">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={close} />
        </div>
      )}
    </>
  );
}
