'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
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
  ShieldCheck,
  ArrowLeft,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses & Curriculum', icon: BookOpen },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/submissions', label: 'Submissions', icon: FileCheck, badgeKey: 'pendingSubmissions' as const },
  { href: '/admin/refunds', label: 'Refund Requests', icon: CreditCard, badgeKey: 'pendingRefunds' as const },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/audit-log', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { data: badges } = useSWR('/admin/badge-counts', () => api.admin.getBadgeCounts(), {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });

  const isSuperAdmin =
    user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ||
    user?.email === 'shivrom.2020@gmail.com';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B0F1A] border-r border-white/5 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-500/20">
            ▲
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">DevAscent</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-white/40">Command Center</p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pt-2 pb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/30">
            Navigation
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const count = item.badgeKey && badges ? badges[item.badgeKey] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-white/40'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {count > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 text-[10px] font-black bg-rose-500 text-white rounded-full flex items-center justify-center animate-pulse">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
                {isActive && !count && (
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400/70" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Footer */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider truncate">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* Switch to Student Mode */}
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Portal</span>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400/90 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-full shrink-0 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
