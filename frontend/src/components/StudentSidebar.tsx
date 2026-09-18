'use client';

import React from 'react';
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
  ExternalLink,
  Code2,
} from 'lucide-react';

interface StudentSidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: 'overview' | 'certificates' | 'submissions' | 'profile' | 'settings' | 'support') => void;
  certificatesCount?: number;
  submissionsCount?: number;
}

export default function StudentSidebar({
  activeTab = 'overview',
  onSelectTab,
  certificatesCount = 0,
  submissionsCount = 0,
}: StudentSidebarProps) {
  const { user, logout } = useAuthStore();
  const { isOpen, close } = useSidebarStore();
  const pathname = usePathname();

  const studentName = user?.name || 'Student';
  const studentEmail = user?.email || 'student@devascent.io';

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview & Learning',
      icon: LayoutDashboard,
    },
    {
      id: 'certificates',
      label: 'My Certificates',
      icon: Award,
      count: certificatesCount,
      countColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'submissions',
      label: 'Capstone Submissions',
      icon: FolderGit2,
      count: submissionsCount,
      countColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: User,
    },
    {
      id: 'settings',
      label: 'Account & Settings',
      icon: Settings,
    },
    {
      id: 'support',
      label: '7-Day Refund & Support',
      icon: ShieldCheck,
    },
  ];

  const handleItemClick = (id: any) => {
    if (onSelectTab) {
      onSelectTab(id);
    }
    close();
  };

  const sidebarContent = (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm space-y-6">
      
      {/* Profile Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-indigo-600/25 shrink-0">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden space-y-0.5">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
              {studentName}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {studentEmail}
            </p>
            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/90 rounded-md border border-indigo-200/80 dark:border-indigo-800/80 uppercase tracking-wider">
              {user?.role === 'ADMIN' ? 'ADMINISTRATOR' : 'VERIFIED STUDENT'}
            </span>
          </div>
        </div>

        {/* Close button on mobile drawer */}
        <button
          onClick={close}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items Menu */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
          Workspace Navigation
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
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

      {/* Quick Launch & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
          Quick Access
        </span>

        <Link
          href="/learn/react-foundations-free"
          onClick={close}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>React Free Track</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </Link>

        <Link
          href="/courses"
          onClick={close}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Explore All Cohorts</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          onClick={() => {
            logout();
            close();
          }}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-200/80 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold transition-colors mt-2"
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
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/70 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-xs bg-transparent h-full p-4 overflow-y-auto animate-fadeIn">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={close} />
        </div>
      )}
    </>
  );
}
