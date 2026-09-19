'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';
import { useSidebarStore } from '../lib/store/sidebarStore';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';
import NotificationsDropdown from './NotificationsDropdown';
import {
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  BookOpen,
  Award,
  FileCheck,
  Briefcase,
  Sparkles,
  Code2,
  FileText,
  FolderGit2,
  Search,
  Settings,
  HelpCircle,
  Zap,
  Globe,
  MessageSquare,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const coursesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { toggle: toggleSidebar } = useSidebarStore();

  useEffect(() => {
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

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
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
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800 py-2.5'
            : 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/80 py-3.5'
        }`}
      >
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          
          {/* Left: Brand Logo + Mobile Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {/* Sidebar Mobile Toggle Button (Visible in Dashboard or Workspace) */}
            {pathname.startsWith('/dashboard') && (
              <button
                onClick={toggleSidebar}
                aria-label="Toggle Student Sidebar"
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/logo.png"
                alt="DevAscent Academy"
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border-2 border-indigo-500/40 p-0.5 shadow-md group-hover:scale-105 transition-transform bg-slate-900"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                  DevAscent
                </span>
                <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">
                  Academy & Internships
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Visible only when logged in) */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* 1. Dashboard / My Learning */}
              <Link
                href="/dashboard"
                className={`text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 py-1 px-2 rounded-lg ${
                  isActive('/dashboard')
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Dashboard</span>
              </Link>

              {/* 2. Programs & Cohorts Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (coursesTimeoutRef.current) clearTimeout(coursesTimeoutRef.current);
                  setCoursesDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  coursesTimeoutRef.current = setTimeout(() => setCoursesDropdownOpen(false), 150);
                }}
              >
                <button
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                  className={`text-xs xl:text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 py-1 px-2 rounded-lg ${
                    isActive('/courses') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Programs & Cohorts</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded uppercase">
                    Free Track
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>

                {coursesDropdownOpen && (
                  <div className="absolute top-full left-0 w-84 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-fadeIn space-y-1">
                    <Link
                      href="/courses"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 block">
                          All Cohorts & Tracks
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Explore live accelerator cohorts & virtual internships</span>
                      </div>
                    </Link>

                    <Link
                      href="/learn/react-foundations-free"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs">
                        FREE
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 group-hover/item:text-emerald-700 block">
                          Modern React & TypeScript Foundations
                        </span>
                        <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">100% Free interactive lessons + verifiable certificate</span>
                      </div>
                    </Link>

                    <Link
                      href="/courses/full-stack-accelerator"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 font-bold text-xs">
                        🔥
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-indigo-600 block">
                          Full-Stack Accelerator (Cohort 4)
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Next.js 15, NestJS, Redis, Razorpay, Postgres</span>
                      </div>
                    </Link>

                    <Link
                      href="/courses/backend-cloud-internship"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs">
                        💼
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 group-hover/item:text-amber-700 block">
                          Backend & Cloud Internship
                        </span>
                        <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80">Stipend up to ₹8,000 & verified offer letter</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. Verify Credential */}
              <Link
                href="/verify/DEV-2026-A1B2C3"
                className={`text-xs xl:text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 py-1 px-2 rounded-lg ${
                  isActive('/verify') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verify Credential</span>
              </Link>

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
                  className="text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 py-1 px-2 rounded-lg"
                >
                  <span>Resources</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>

                {resourcesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-fadeIn space-y-1">
                    <Link
                      href="/certificate"
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">Certificate Generator Demo</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Interactive SHA-256 PDF preview</span>
                      </div>
                    </Link>

                    <Link
                      href="/refund-policy"
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">7-Day Money-Back Policy</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">No questions asked refund terms</span>
                      </div>
                    </Link>

                    <Link
                      href="/support"
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">Help & Support Desk</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Direct assistance from mentor</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 5. Support Desk Link */}
              <Link
                href="/support"
                className={`text-xs xl:text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2 rounded-lg ${
                  isActive('/support') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Help Desk
              </Link>

              {/* Admin Console Link (if signed in as ADMIN) */}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link
                href="/about"
                className={`text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
                  isActive('/about')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>About</span>
              </Link>
            </nav>
          )}

          {/* Right: Actions, Search, Notifications, Theme & Profile/CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Global Search Button with ⌘K Badge (Only when logged in) */}
            {isAuthenticated && (
              <button
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search"
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden md:inline text-xs">Search...</span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Notifications Dropdown (Only when logged in) */}
            {isAuthenticated && <NotificationsDropdown />}

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* User Profile Dropdown OR Guest CTA */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name || 'Student'}
                  </span>
                  <ChevronDown className="hidden sm:inline w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-fadeIn space-y-1">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>My Learning & Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>My Certificates</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Student Profile</span>
                    </Link>

                    <Link
                      href="/refund-policy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
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
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Enroll</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger (Visible if authenticated OR to access sign in) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 animate-fadeIn">
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span>Programs & Cohorts</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      Free Track
                    </span>
                  </Link>

                  <Link
                    href="/learn/react-foundations-free"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>React Foundations (Free Track)</span>
                  </Link>

                  <Link
                    href="/verify/DEV-2026-A1B2C3"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verify Credential Ledger</span>
                  </Link>

                  <Link
                    href="/refund-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <RotateCcw className="w-4 h-4 text-indigo-600" />
                    <span>7-Day Money-Back Guarantee</span>
                  </Link>

                  <Link
                    href="/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span>Help Desk & Support</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive('/about')
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>About DevAscent</span>
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-semibold text-sm rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
