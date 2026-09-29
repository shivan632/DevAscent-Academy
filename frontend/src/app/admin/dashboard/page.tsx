'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { StatsCard } from '../../../components/admin/StatsCard';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import {
  Users,
  TrendingUp,
  IndianRupee,
  FileCheck,
  CreditCard,
  Clock,
  UserX,
  RefreshCw,
  ArrowRight,
  BookOpen,
  ScrollText,
  BadgeCheck,
  ShieldAlert,
  Activity,
  MailCheck,
  ScanLine,
  UserCircle,
} from 'lucide-react';
import { useAuthStore } from '../../../lib/store/authStore';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleVisibility = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    isVisible ? '/admin/overview' : null,
    () => api.admin.getOverview(),
    { refreshInterval: 120000, revalidateOnFocus: true }
  );

  const overview = data?.data || data || {};

  const isSuperAdmin =
    user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ||
    user?.email === 'shivrom.2020@gmail.com';

  const hour = mounted ? new Date().getHours() : 0;
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const quickActions = [
    { title: 'Review Capstones',     desc: 'Evaluate GitHub repos & issue certificates', href: '/admin/submissions', badge: overview?.pendingSubmissions, color: 'hover:border-amber-500/30',  accent: 'text-amber-400',   bg: 'bg-amber-500/10',  icon: FileCheck },
    { title: 'Process Refunds',      desc: 'Approve or reject 7-day refund requests',    href: '/admin/refunds',    badge: overview?.pendingRefunds,    color: 'hover:border-rose-500/30',   accent: 'text-rose-400',    bg: 'bg-rose-500/10',   icon: CreditCard },
    { title: 'Payment Ledger',       desc: 'View all transactions & batch payments',      href: '/admin/payments',   badge: undefined,               color: 'hover:border-emerald-500/30',accent: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: IndianRupee },
    { title: 'Manage Students',      desc: 'Search, view profile, or suspend accounts',  href: '/admin/students',   badge: undefined,               color: 'hover:border-blue-500/30',   accent: 'text-blue-400',    bg: 'bg-blue-500/10',    icon: Users },
    { title: 'Curriculum Studio',    desc: 'Upload PDFs, links, lessons, quizzes',       href: '/admin/courses',    badge: undefined,               color: 'hover:border-violet-500/30', accent: 'text-violet-400',  bg: 'bg-violet-500/10',  icon: BookOpen },
    { title: 'Certificates',         desc: 'Issue & verify SHA-256 certificates',        href: '/admin/certificates',badge: undefined,              color: 'hover:border-teal-500/30',   accent: 'text-teal-400',    bg: 'bg-teal-500/10',    icon: BadgeCheck },
    { title: 'Verify Certificate',   desc: 'Instant certificate authenticity check',     href: '/admin/certificates/verify', badge: undefined,      color: 'hover:border-cyan-500/30',   accent: 'text-cyan-400',    bg: 'bg-cyan-500/10',    icon: ScanLine },
    { title: 'Audit Log',            desc: 'Full trail of all admin operations',         href: '/admin/audit-log',  badge: undefined,               color: 'hover:border-slate-500/30',  accent: 'text-slate-400',   bg: 'bg-slate-500/10',   icon: ScrollText },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Hero Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {/* Admin identity banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-violet-300">
              {mounted && isSuperAdmin ? 'Super Admin' : 'Admin'} Portal
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            {mounted ? `${greeting}, ${user?.name?.split(' ')[0] || 'Admin'}` : 'Admin Dashboard'}
          </h1>
          <p className="text-xs text-white/35 mt-1">
            DevAscent Command Center · Real-time platform overview
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[10px] text-white/30">
            <Activity className="w-3 h-3 text-emerald-400" />
            Auto-refresh 2m
          </div>
          <button
            onClick={() => mutate()}
            disabled={isValidating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] text-white/70 hover:text-white text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-violet-400 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Primary KPI Grid ── */}
      {isLoading ? (
        <SkeletonLoader type="kpi" count={4} />
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          Failed to load dashboard metrics. Check network or verify admin session.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Students"
            value={data?.totalStudents ?? 0}
            sub={`${data?.activeStudents ?? 0} active · ${data?.suspendedStudents ?? 0} suspended`}
            color="indigo"
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            label="Total Revenue"
            value={`₹${(data?.totalRevenueInRupees ?? 0).toLocaleString('en-IN')}`}
            sub="From verified paid enrollments"
            color="emerald"
            icon={<IndianRupee className="w-5 h-5" />}
          />
          <StatsCard
            label="Pending Submissions"
            value={data?.pendingSubmissions ?? 0}
            sub={`${data?.totalSubmissions ?? 0} total submitted`}
            color={data?.pendingSubmissions > 0 ? 'amber' : 'emerald'}
            icon={<FileCheck className="w-5 h-5" />}
            badge={data?.pendingSubmissions > 0 ? `${data.pendingSubmissions} to review` : undefined}
          />
          <StatsCard
            label="Pending Refunds"
            value={data?.pendingRefunds ?? 0}
            sub="7-day policy refund requests"
            color={data?.pendingRefunds > 0 ? 'rose' : 'emerald'}
            icon={<CreditCard className="w-5 h-5" />}
            badge={data?.pendingRefunds > 0 ? 'Action required' : undefined}
          />
        </div>
      )}

      {/* ── Secondary Metrics ── */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Enrollments', value: data.totalEnrollments,
              sub: 'Across all active batches', icon: TrendingUp, color: 'bg-violet-500/12 border-violet-500/20 text-violet-400',
            },
            {
              label: 'Avg Revenue / Student', value: `₹${data.totalStudents > 0 ? Math.round(data.totalRevenueInRupees / data.totalStudents).toLocaleString('en-IN') : 0}`,
              sub: 'ARPU metric', icon: IndianRupee, color: 'bg-amber-500/12 border-amber-500/20 text-amber-400',
            },
            {
              label: 'Suspended Accounts', value: data.suspendedStudents,
              sub: data.totalStudents > 0 ? `${((data.suspendedStudents / data.totalStudents) * 100).toFixed(1)}% of cohort` : 'Zero suspensions',
              icon: UserX, color: 'bg-rose-500/12 border-rose-500/20 text-rose-400',
            },
          ].map((m) => (
            <div key={m.label} className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl border ${m.color}`}>
                  <m.icon className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white/35">{m.label}</p>
              </div>
              <p className="text-3xl font-black text-white tracking-tight">{m.value}</p>
              <p className="text-[11px] text-white/30 mt-1.5">{m.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick Action Grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.12em]">Quick Operations</h2>
          <span className="text-[10px] text-white/20">All admin workspaces</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col justify-between p-4 bg-[#0D1117] border border-white/[0.07] rounded-2xl transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 ${action.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${action.bg} transition-colors`}>
                      <Icon className={`w-4 h-4 ${action.accent}`} />
                    </div>
                    {action.badge !== undefined && action.badge > 0 && (
                      <span className="px-2 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full animate-pulse">
                        {action.badge} pending
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xs font-black text-white/90 group-hover:${action.accent} transition-colors`}>
                      {action.title}
                    </h3>
                    <p className="text-[10px] text-white/35 leading-snug mt-0.5">{action.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-white/30 group-hover:text-white/70 transition-colors">
                  <span className="font-bold">Open</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
