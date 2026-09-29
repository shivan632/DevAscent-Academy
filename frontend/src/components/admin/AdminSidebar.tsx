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
  BadgeCheck,
  ShieldAlert,
  UserCircle,
  IndianRupee,
  ScanLine,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navGroups = [
  {
    label: 'Core',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/courses', label: 'Courses & Curriculum', icon: BookOpen },
      { href: '/admin/students', label: 'Students', icon: Users },
      { href: '/admin/submissions', label: 'Submissions', icon: FileCheck, badgeKey: 'pendingSubmissions' as const },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/payments', label: 'Payments', icon: IndianRupee },
      { href: '/admin/refunds', label: 'Refund Requests', icon: CreditCard, badgeKey: 'pendingRefunds' as const },
    ],
  },
  {
    label: 'Credentials',
    items: [
      { href: '/admin/certificates', label: 'Certificates', icon: BadgeCheck },
      { href: '/admin/certificates/verify', label: 'Verify Certificate', icon: ScanLine },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/audit-log', label: 'Audit Log', icon: ScrollText },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
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

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#07090F] border-r border-white/[0.06] select-none">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-tight">DevAscent</span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-violet-500/25 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-white/35 font-medium">Command Center</p>
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

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const count = item.badgeKey && badges ? badges[item.badgeKey] : 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all group ${
                      active
                        ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white border border-violet-500/25 shadow-sm shadow-violet-500/10'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active ? 'text-violet-400' : 'text-white/35 group-hover:text-white/70'
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
                      {active && !count && (
                        <ChevronRight className="w-3 h-3 text-violet-400/70" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin Footer */}
      <div className="p-3 border-t border-white/[0.06] space-y-1.5 shrink-0">
        {/* Admin Profile Card */}
        <Link
          href="/admin/profile"
          onClick={onCloseMobile}
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all group ${
            isActive('/admin/profile')
              ? 'bg-violet-600/10 border-violet-500/20'
              : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/40 to-indigo-600/40 border border-violet-500/30 flex items-center justify-center font-black text-xs text-violet-200 shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white truncate">{user?.name || 'Admin'}</p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-violet-400" />
              <span className="text-[9px] text-violet-300 font-bold uppercase tracking-wider">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
          <UserCircle className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
        </Link>

        {/* Student View */}
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-white/40 hover:text-white/80 rounded-xl hover:bg-white/[0.04] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Student View</span>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
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
