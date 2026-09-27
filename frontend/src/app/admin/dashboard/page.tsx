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
  ShieldCheck,
  BookOpen,
  ScrollText,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isVisible, setIsVisible] = useState(true);

  // Monitor visibility to pause auto-refresh when tab is inactive
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    isVisible ? '/admin/overview' : null,
    () => api.admin.getOverview(),
    {
      refreshInterval: 120000, // 2 minutes cadence to save API calls
      revalidateOnFocus: true,
    }
  );

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Overview</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              Live Hub
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Real-time platform metrics · Auto-refreshes every 2 min · Last fetched {now}
          </p>
        </div>

        <button
          onClick={() => mutate()}
          disabled={isValidating}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isValidating ? 'animate-spin' : ''}`} />
          <span>{isValidating ? 'Refreshing…' : 'Refresh Now'}</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      {isLoading ? (
        <SkeletonLoader type="kpi" count={4} />
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400">
          Failed to load dashboard metrics. Please check network connection or verify admin session.
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
            sub={`${data?.totalSubmissions ?? 0} total submitted projects`}
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

      {/* Secondary Metrics */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0F1420] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Total Enrollments
                </p>
                <p className="text-xs text-white/30">Cohort registrations</p>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {data.totalEnrollments}
            </p>
            <p className="text-xs text-white/40 mt-2">Across all active batches & degrees</p>
          </div>

          <div className="bg-[#0F1420] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Avg Value / Student
                </p>
                <p className="text-xs text-white/30">ARPU metric</p>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              ₹
              {data.totalStudents > 0
                ? Math.round(data.totalRevenueInRupees / data.totalStudents).toLocaleString('en-IN')
                : 0}
            </p>
            <p className="text-xs text-white/40 mt-2">Average revenue per enrolled student</p>
          </div>

          <div className="bg-[#0F1420] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <UserX className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Suspended Accounts
                </p>
                <p className="text-xs text-white/30">Access blocked</p>
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {data.suspendedStudents}
            </p>
            <p className="text-xs text-white/40 mt-2">
              {data.totalStudents > 0
                ? `${((data.suspendedStudents / data.totalStudents) * 100).toFixed(1)}% of total cohort`
                : 'Zero suspensions'}
            </p>
          </div>
        </div>
      )}

      {/* Quick Action Station */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-white/50 uppercase tracking-wider">
            Quick Operations
          </h2>
          <span className="text-xs text-white/30">Direct admin actions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: 'Review Capstones',
              desc: 'Evaluate student repos & issue certificates',
              href: '/admin/submissions',
              badge: data?.pendingSubmissions,
              color: 'hover:border-amber-500/30 text-amber-400',
              icon: FileCheck,
            },
            {
              title: 'Process Refunds',
              desc: 'Approve or reject money-back requests',
              href: '/admin/refunds',
              badge: data?.pendingRefunds,
              color: 'hover:border-rose-500/30 text-rose-400',
              icon: CreditCard,
            },
            {
              title: 'Manage Students',
              desc: 'Search, view drawer, or suspend accounts',
              href: '/admin/students',
              color: 'hover:border-indigo-500/30 text-indigo-400',
              icon: Users,
            },
            {
              title: 'Curriculum Studio',
              desc: 'Manage course modules, lessons & quizzes',
              href: '/admin/courses',
              color: 'hover:border-purple-500/30 text-purple-400',
              icon: BookOpen,
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col justify-between p-4 bg-[#0F1420] border border-white/5 rounded-2xl transition-all duration-200 group hover:-translate-y-0.5 ${action.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    {action.badge !== undefined && action.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full animate-pulse">
                        {action.badge} pending
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-snug mt-0.5">{action.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40 group-hover:text-white transition-colors">
                  <span className="font-semibold text-[11px]">Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

