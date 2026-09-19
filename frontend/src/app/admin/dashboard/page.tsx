'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { KpiCard, KpiSkeleton } from '../../../components/admin/AdminUI';
import {
  Users,
  TrendingUp,
  IndianRupee,
  FileCheck,
  CreditCard,
  Clock,
  UserX,
  BarChart2,
} from 'lucide-react';

const fetcher = () => api.admin.getOverview();

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useSWR('/admin/overview', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Overview</h1>
        <p className="text-sm text-white/35 mt-1">
          Real-time platform metrics · Last updated {now}
        </p>
      </div>

      {/* KPI Grid */}
      {isLoading ? (
        <KpiSkeleton />
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400">
          Failed to load stats. Please refresh.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Students"
            value={data?.totalStudents ?? 0}
            sub={`${data?.activeStudents ?? 0} active · ${data?.suspendedStudents ?? 0} suspended`}
            color="indigo"
            icon={<Users className="w-4 h-4" />}
          />
          <KpiCard
            label="Total Revenue"
            value={`₹${(data?.totalRevenueInRupees ?? 0).toLocaleString('en-IN')}`}
            sub="From paid enrollments"
            color="emerald"
            icon={<IndianRupee className="w-4 h-4" />}
          />
          <KpiCard
            label="Pending Refunds"
            value={data?.pendingRefunds ?? 0}
            sub="Awaiting action"
            color={data?.pendingRefunds > 0 ? 'rose' : 'emerald'}
            icon={<CreditCard className="w-4 h-4" />}
          />
          <KpiCard
            label="Pending Submissions"
            value={data?.pendingSubmissions ?? 0}
            sub={`${data?.totalSubmissions ?? 0} total submitted`}
            color={data?.pendingSubmissions > 0 ? 'amber' : 'emerald'}
            icon={<FileCheck className="w-4 h-4" />}
          />
        </div>
      )}

      {/* Secondary Stats */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-sm font-semibold text-white/70">Total Enrollments</p>
            </div>
            <p className="text-4xl font-extrabold text-white">{data.totalEnrollments}</p>
            <p className="text-xs text-white/35 mt-1">Across all cohorts</p>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-white/70">Avg Revenue/Student</p>
            </div>
            <p className="text-4xl font-extrabold text-white">
              ₹{data.totalStudents > 0
                ? Math.round(data.totalRevenueInRupees / data.totalStudents).toLocaleString('en-IN')
                : 0}
            </p>
            <p className="text-xs text-white/35 mt-1">Per registered student</p>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <UserX className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-sm font-semibold text-white/70">Suspended Accounts</p>
            </div>
            <p className="text-4xl font-extrabold text-white">{data.suspendedStudents}</p>
            <p className="text-xs text-white/35 mt-1">
              {data.totalStudents > 0
                ? `${((data.suspendedStudents / data.totalStudents) * 100).toFixed(1)}% of total`
                : 'No students yet'}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Review Refunds', href: '/admin/refunds', color: 'text-rose-400', count: data?.pendingRefunds },
            { label: 'Review Submissions', href: '/admin/submissions', color: 'text-amber-400', count: data?.pendingSubmissions },
            { label: 'Manage Students', href: '/admin/students', color: 'text-indigo-400' },
            { label: 'View Audit Log', href: '/admin/audit-log', color: 'text-emerald-400' },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex flex-col items-start gap-2 p-4 bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 rounded-2xl transition-all group"
            >
              {action.count !== undefined && action.count > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {action.count} pending
                </span>
              )}
              <span className={`text-sm font-semibold ${action.color} group-hover:translate-x-0.5 transition-transform`}>
                {action.label} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
