'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import { SystemStatusIndicator } from './SystemStatusIndicator';
import {
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  ExternalLink,
  CreditCard,
  FileCheck,
  ShieldAlert,
  UserCircle,
  Settings,
  IndianRupee,
  BadgeCheck,
} from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: badges } = useSWR('/admin/badge-counts', () => api.admin.getBadgeCounts(), {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });

  const emailLower = user?.email?.toLowerCase().trim();
  const isSuperAdmin =
    emailLower === (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || '').toLowerCase().trim() ||
    emailLower === 'shivrom.2020@gmail.com';

  const totalPending = (badges?.pendingSubmissions || 0) + (badges?.pendingRefunds || 0);

  // Click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 h-14 bg-[#07090F]/95 backdrop-blur-md border-b border-white/[0.06] shrink-0">
      {/* Left — Hamburger + Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="relative hidden lg:flex w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10">
            <Image
              src="/logo.png"
              alt="DevAscent"
              fill
              sizes="32px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-black text-white tracking-tight">DevAscent</span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Role Badge */}
        {mounted && (
          <span className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isSuperAdmin
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
          }`}>
            <ShieldAlert className="w-2.5 h-2.5" />
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* System Health */}
        <div className="hidden sm:block">
          <SystemStatusIndicator />
        </div>

        {/* Pending Actions Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
            title="Pending Actions"
          >
            <Bell className="w-4 h-4" />
            {mounted && totalPending > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center border-2 border-[#07090F] animate-pulse">
                {totalPending > 99 ? '99+' : totalPending}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.07] mb-3">
                <span className="text-xs font-black text-white uppercase tracking-wider">Action Queue</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/25">
                  {totalPending} pending
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/admin/submissions"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-amber-500/8 border border-white/[0.06] hover:border-amber-500/20 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                      <FileCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors">Capstone Submissions</p>
                      <p className="text-[10px] text-white/35">Pending review</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400">
                    {badges?.pendingSubmissions ?? 0}
                  </span>
                </Link>

                <Link
                  href="/admin/refunds"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-rose-500/8 border border-white/[0.06] hover:border-rose-500/20 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white group-hover:text-rose-300 transition-colors">Refund Requests</p>
                      <p className="text-[10px] text-white/35">7-day policy window</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-400">
                    {badges?.pendingRefunds ?? 0}
                  </span>
                </Link>

                <Link
                  href="/admin/payments"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-emerald-500/8 border border-white/[0.06] hover:border-emerald-500/20 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                      <IndianRupee className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors">Payment Ledger</p>
                      <p className="text-[10px] text-white/35">View all transactions</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400">View</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600/50 to-indigo-600/50 border border-violet-500/30 flex items-center justify-center text-[11px] font-black text-violet-200">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-bold text-white truncate max-w-[110px]">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[9px] text-violet-400 font-black uppercase tracking-wider">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-white/30" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-white/[0.07] mb-1">
                <p className="text-[11px] font-bold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-white/35 truncate">{user?.email}</p>
              </div>

              <Link
                href="/admin/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-[11px] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
              >
                <UserCircle className="w-3.5 h-3.5 text-white/40" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-[11px] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-white/40" />
                <span>Settings</span>
              </Link>

              <Link
                href="/admin/certificates"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-[11px] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-white/40" />
                <span>Certificates</span>
              </Link>

              <div className="border-t border-white/[0.07] mt-1 pt-1">
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] text-white/40 hover:text-white/80 hover:bg-white/[0.04] rounded-xl transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
