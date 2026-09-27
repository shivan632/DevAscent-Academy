'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import { SystemStatusIndicator } from './SystemStatusIndicator';
import {
  ShieldAlert,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Menu,
  ExternalLink,
  CreditCard,
  FileCheck,
} from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('just now');
  const [mountTime] = useState(Date.now());
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: badges } = useSWR('/admin/badge-counts', () => api.admin.getBadgeCounts(), {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });

  const isSuperAdmin =
    user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ||
    user?.email === 'shivrom.2020@gmail.com';

  const totalPending = (badges?.pendingSubmissions || 0) + (badges?.pendingRefunds || 0);

  // Time updater
  useEffect(() => {
    const updateTime = () => {
      const diffSec = Math.floor((Date.now() - mountTime) / 1000);
      if (diffSec < 60) setLastUpdated('just now');
      else setLastUpdated(`${Math.floor(diffSec / 60)}m ago`);
    };
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [mountTime]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3 bg-[#080C14]/90 backdrop-blur-md border-b border-white/5">
      {/* Left Branding / Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-indigo-500/20">
            ▲
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-tight text-white">DevAscent</span>
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Updated Timestamp */}
        <span className="hidden md:inline-block text-[11px] text-white/30">
          Updated {lastUpdated}
        </span>

        {/* System Health */}
        <SystemStatusIndicator />

        {/* Action Notifications / Badges */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="Pending Actions"
          >
            <Bell className="w-4 h-4" />
            {totalPending > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-[#080C14] animate-pulse">
                {totalPending > 99 ? '99+' : totalPending}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0F1420] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Action Required
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {totalPending} Pending
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/admin/submissions"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                        Submissions
                      </p>
                      <p className="text-[11px] text-white/40">Capstone projects review</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                    {badges?.pendingSubmissions ?? 0}
                  </span>
                </Link>

                <Link
                  href="/admin/refunds"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-rose-300 transition-colors">
                        Refund Requests
                      </p>
                      <p className="text-[11px] text-white/40">7-day policy requests</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400">
                    {badges?.pendingRefunds ?? 0}
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0F1420] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                <span>Student View</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
