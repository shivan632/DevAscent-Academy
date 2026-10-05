'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';
import { useSidebarStore } from '../lib/store/sidebarStore';
import ThemeToggle from './ThemeToggle';
import NotificationsDropdown from './NotificationsDropdown';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  BookOpen,
  Award,
  Briefcase,
  Sparkles,
  FolderGit2,
  HelpCircle,
  Zap,
  Globe,
  RotateCcw,
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internshipsDropdownOpen, setInternshipsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const internshipsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { toggle: toggleSidebar } = useSidebarStore();

  useEffect(() => {
    setMounted(true);
    checkAuth();
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAuth]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuth = mounted && isAuthenticated;
  const isAdmin = mounted && user?.role === 'ADMIN';
  const currentUser = mounted ? user : null;

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/dashboard') return pathname.startsWith('/dashboard');
    if (path === '/enrolled-courses') return pathname.startsWith('/enrolled-courses');
    if (path === '/courses') return pathname.startsWith('/courses') || pathname.startsWith('/learn');
    if (path === '/about') return pathname === '/about';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Accessibility Skip-to-content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-xl"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#07090E]/90 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-slate-200/80 dark:border-slate-800/80 py-2.5'
            : 'bg-white/85 dark:bg-[#07090E]/75 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/60 py-3'
        }`}
      >
        {/* Top ambient hairline glow in dark mode */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Left: Brand Logo + Mobile Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {/* Sidebar Mobile Toggle Button (Visible in Dashboard or Workspace) */}
            {pathname.startsWith('/dashboard') && (
              <button
                onClick={toggleSidebar}
                aria-label="Toggle Student Sidebar"
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
                <img
                  src="/logo.png"
                  alt="DevAscent Academy"
                  className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full bg-slate-900 group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                  DevAscent
                </span>
                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">
                  Academy &amp; Internships
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          {isAuth ? (
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 bg-slate-100/60 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md">
              {/* 1. Dashboard */}
              <Link
                href="/dashboard"
                className={`text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
                  isActive('/dashboard')
                    ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Dashboard</span>
              </Link>

              {/* 2. Enrolled Course */}
              <Link
                href="/enrolled-courses"
                className={`text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
                  isActive('/enrolled-courses')
                    ? 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Enrolled Course</span>
              </Link>

              {/* 3. Virtual Internships/Course Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (internshipsTimeoutRef.current) clearTimeout(internshipsTimeoutRef.current);
                  setInternshipsDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  internshipsTimeoutRef.current = setTimeout(() => setInternshipsDropdownOpen(false), 150);
                }}
              >
                <button
                  onClick={() => setInternshipsDropdownOpen(!internshipsDropdownOpen)}
                  className={`text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
                    pathname.startsWith('/courses') || pathname.startsWith('/internships') || pathname.startsWith('/learn')
                      ? 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200/60 dark:border-amber-500/30 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                  <span>Virtual Internships/Course</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${internshipsDropdownOpen ? 'rotate-180 text-amber-500' : 'text-slate-400'}`} />
                </button>

                {internshipsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-80 bg-white/95 dark:bg-[#0D111D]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800/90 p-2 z-50 animate-fadeIn space-y-1">
                    {/* Item 1: Internship */}
                    <Link
                      href="/internships"
                      onClick={() => setInternshipsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-500/10 transition-all group/item border border-transparent hover:border-amber-500/20"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-amber-400 transition-colors truncate">
                            💼 Virtual Internship
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-md border border-amber-500/30">
                            Coming Soon
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Industrial tracks with verified assessment</span>
                      </div>
                    </Link>

                    {/* Item 2: Course */}
                    <Link
                      href="/courses"
                      onClick={() => setInternshipsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-500/10 transition-all group/item border border-transparent hover:border-indigo-500/20"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-indigo-400 transition-colors block">
                          📚 Courses &amp; Programs
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">All engineering courses &amp; developer roadmaps</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 4. Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
                  setResourcesDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  resourcesTimeoutRef.current = setTimeout(() => setResourcesDropdownOpen(false), 150);
                }}
              >
                <button
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  className={`text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
                    pathname === '/ai-studio' || pathname === '/refund-policy' || pathname === '/support'
                      ? 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-500/30 font-semibold shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Resources</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180 text-purple-500' : 'text-slate-400'}`} />
                </button>

                {resourcesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-80 bg-white/95 dark:bg-[#0D111D]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800/90 p-2 z-50 animate-fadeIn space-y-1">
                    {/* Item 1: AI Copilot Studio */}
                    <Link
                      href="/ai-studio"
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-500/10 transition-all group/item border border-transparent hover:border-indigo-500/20"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-indigo-400 transition-colors block">
                          🤖 AI Copilot Studio
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Smart notes, mock interviews &amp; roadmaps</span>
                      </div>
                    </Link>

                    {/* Item 2: 7-Day Money-Back Policy */}
                    <Link
                      href="/refund-policy"
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-500/10 transition-all group/item border border-transparent hover:border-emerald-500/20"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-emerald-400 transition-colors block">
                          💚 7-Day Money-Back Policy
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Zero-risk 100% refund guarantee</span>
                      </div>
                    </Link>

                    {/* Item 3: Help & Support Desk */}
                    <Link
                      href="/support"
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-500/10 transition-all group/item border border-transparent hover:border-amber-500/20"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-amber-400 transition-colors block">
                          ⭕ Help &amp; Support Desk
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Direct mentor assistance &amp; FAQs</span>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/certificate"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-500/10 transition-all border-t border-slate-200 dark:border-slate-800/80 pt-2"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">Certificate Studio (Admin)</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Official PDF generator &amp; test mint</span>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* 5. About Page Link */}
              <Link
                href="/about"
                className={`text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3 rounded-xl ${
                  isActive('/about')
                    ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-500/30 font-semibold shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>About</span>
              </Link>

              {/* Admin Console Link (if signed in as ADMIN) */}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-indigo-500/20 transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-3 bg-slate-100/60 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md">
              <Link
                href="/courses"
                className={`text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl ${
                  isActive('/courses')
                    ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Explore Courses</span>
              </Link>
              <Link
                href="/about"
                className={`text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl ${
                  isActive('/about')
                    ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>About</span>
              </Link>
            </nav>
          )}

          {/* Right: Notifications, Theme & Profile/CTAs (Search removed) */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications Dropdown (Only when logged in) */}
            {isAuth && <NotificationsDropdown />}

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* User Profile Dropdown OR Guest CTA */}
            {isAuth && currentUser ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-all shadow-sm group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                    {currentUser.name || 'Student'}
                  </span>
                  <ChevronDown className={`hidden sm:inline w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-[#0D111D]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800/90 p-2 z-50 animate-fadeIn space-y-1">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1.5 text-[9px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase">
                        {currentUser.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard?tab=overview"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>My Learning &amp; Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=certificates"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      <span>My Certificates</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=submissions"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Capstone Submissions</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Student Profile</span>
                    </Link>

                    <Link
                      href="/ai-studio"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>AI Studio Copilot</span>
                    </Link>

                    <Link
                      href="/refund-policy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                      <span>7-Day Guarantee Portal</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>Admin Command Center</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors border-t border-slate-100 dark:border-slate-800/80 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Enroll</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 animate-fadeIn">
            <div className="space-y-2">
              {isAuth ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/enrolled-courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>Enrolled Course</span>
                  </Link>

                  <Link
                    href="/internships"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      <span>💼 Internship</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-md border border-amber-500/30">
                      Coming Soon
                    </span>
                  </Link>

                  <Link
                    href="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>📚 Course (All Courses)</span>
                  </Link>

                  <Link
                    href="/ai-studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🤖 AI Copilot Studio</span>
                  </Link>

                  <Link
                    href="/refund-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-500" />
                    <span>💚 7-Day Money-Back Policy</span>
                  </Link>

                  <Link
                    href="/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>⭕ Help &amp; Support Desk</span>
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>About DevAscent</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive('/about')
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span>About DevAscent</span>
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {!isAuth ? (
                <>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Enroll</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-semibold text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
