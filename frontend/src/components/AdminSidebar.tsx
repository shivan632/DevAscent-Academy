'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  CreditCard,
  BookOpen,
  BarChart2,
  ScrollText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  TestTube,
  ArrowLeft,
  Bell,
  X,
  Menu,
} from 'lucide-react';

interface BadgeCounts {
  pendingRefunds: number;
  pendingSubmissions: number;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/submissions', label: 'Submissions', icon: FileCheck, badgeKey: 'pendingSubmissions' as const },
  { href: '/admin/refunds', label: 'Refunds', icon: CreditCard, badgeKey: 'pendingRefunds' as const },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/audit-log', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [counts, setCounts] = useState<BadgeCounts>({ pendingRefunds: 0, pendingSubmissions: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_');

  const fetchBadges = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/badge-counts`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCounts(data);
      }
    } catch {}
  }, [API]);

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [fetchBadges, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 border border-red-500/30 rounded-lg">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Admin</span>
            </div>
            {isTestMode && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/15 border border-amber-500/30 rounded-lg">
                <TestTube className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Test Mode</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3">
          <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
          <p className="text-xs text-white/40 truncate mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 px-3 mb-2">
          Control Panel
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const count = item.badgeKey ? counts[item.badgeKey] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
                <span>{item.label}</span>
              </span>
              {count > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {count > 99 ? '99+' : count}
                </span>
              )}
              {isActive && !count && (
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student View</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-white/70"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B0F1A] border-r border-white/5 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {sidebarContent}
      </aside>
    </>
  );
}
