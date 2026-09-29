'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import {
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  RefreshCw,
  Filter,
  MailCheck,
  Users,
  TrendingUp,
  Calendar,
  ChevronDown,
  BadgeCheck,
} from 'lucide-react';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Payment {
  id: string;
  studentName: string;
  studentEmail: string;
  emailVerified: boolean;
  courseName: string;
  cohort: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  method: string;
  transactionId: string;
  paidAt: string;
}

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  SUCCESS:  { label: 'Success',  icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20' },
  PENDING:  { label: 'Pending',  icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/12 border-amber-500/20' },
  FAILED:   { label: 'Failed',   icon: XCircle,      color: 'text-rose-400',    bg: 'bg-rose-500/12 border-rose-500/20' },
  REFUNDED: { label: 'Refunded', icon: RefreshCw,    color: 'text-slate-400',   bg: 'bg-slate-500/12 border-slate-500/20' },
};

// ─── Mock data (replace with real API) ────────────────────────────────────
const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', studentName: 'Rahul Sharma', studentEmail: 'rahul@gmail.com', emailVerified: true,  courseName: 'Web Dev Internship', cohort: 'Cohort 4', amount: 4999, status: 'SUCCESS',  method: 'UPI',       transactionId: 'UPI2024092801', paidAt: '2024-09-28T10:24:00Z' },
  { id: 'p2', studentName: 'Priya Mehta',  studentEmail: 'priya@gmail.com',  emailVerified: true,  courseName: 'Python Internship',  cohort: 'Cohort 4', amount: 3999, status: 'SUCCESS',  method: 'Razorpay',  transactionId: 'RZP2024092802', paidAt: '2024-09-28T11:15:00Z' },
  { id: 'p3', studentName: 'Amit Singh',   studentEmail: 'amit@yahoo.com',   emailVerified: false, courseName: 'Web Dev Internship', cohort: 'Cohort 3', amount: 4999, status: 'PENDING',  method: 'NetBanking',transactionId: 'NB2024092803',  paidAt: '2024-09-27T09:00:00Z' },
  { id: 'p4', studentName: 'Sneha Patel',  studentEmail: 'sneha@gmail.com',  emailVerified: true,  courseName: 'Python Internship',  cohort: 'Cohort 3', amount: 3999, status: 'REFUNDED', method: 'UPI',       transactionId: 'UPI2024092604', paidAt: '2024-09-26T14:30:00Z' },
  { id: 'p5', studentName: 'Karan Joshi',  studentEmail: 'karan@gmail.com',  emailVerified: true,  courseName: 'Web Dev Internship', cohort: 'Cohort 4', amount: 4999, status: 'SUCCESS',  method: 'Card',      transactionId: 'CARD2024092505',paidAt: '2024-09-25T16:45:00Z' },
  { id: 'p6', studentName: 'Divya Rao',    studentEmail: 'divya@outlook.com',emailVerified: false, courseName: 'Python Internship',  cohort: 'Cohort 4', amount: 3999, status: 'FAILED',   method: 'UPI',       transactionId: 'UPI2024092406', paidAt: '2024-09-24T08:20:00Z' },
];

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-start gap-3">
      <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-0.5">{label}</p>
        <p className="text-xl font-black text-white">{value}</p>
        <p className="text-[10px] text-white/35 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cohortFilter, setCohortFilter] = useState<string>('ALL');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('ALL');

  // TODO: replace with real API call
  const payments = MOCK_PAYMENTS;
  const isLoading = false;

  const cohorts = useMemo(() => ['ALL', ...Array.from(new Set(payments.map((p) => p.cohort)))], [payments]);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        !search ||
        p.studentName.toLowerCase().includes(search.toLowerCase()) ||
        p.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchCohort = cohortFilter === 'ALL' || p.cohort === cohortFilter;
      const matchVerified =
        verifiedFilter === 'ALL' ||
        (verifiedFilter === 'VERIFIED' && p.emailVerified) ||
        (verifiedFilter === 'UNVERIFIED' && !p.emailVerified);
      return matchSearch && matchStatus && matchCohort && matchVerified;
    });
  }, [payments, search, statusFilter, cohortFilter, verifiedFilter]);

  const totalRevenue = payments.filter((p) => p.status === 'SUCCESS').reduce((s, p) => s + p.amount, 0);
  const successCount = payments.filter((p) => p.status === 'SUCCESS').length;
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;
  const verifiedCount = payments.filter((p) => p.emailVerified).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/12 border border-emerald-500/20">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Payment Ledger</h1>
          </div>
          <p className="text-xs text-white/35 mt-1 ml-11">All student payments · batch & email verification tracking</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 text-emerald-300 text-xs font-bold transition-all self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          sub="From successful payments"
          icon={IndianRupee}
          color="bg-emerald-500/12 border border-emerald-500/20 text-emerald-400"
        />
        <KpiCard
          label="Successful"
          value={String(successCount)}
          sub="Payments cleared"
          icon={CheckCircle2}
          color="bg-blue-500/12 border border-blue-500/20 text-blue-400"
        />
        <KpiCard
          label="Pending"
          value={String(pendingCount)}
          sub="Awaiting confirmation"
          icon={Clock}
          color="bg-amber-500/12 border border-amber-500/20 text-amber-400"
        />
        <KpiCard
          label="Email Verified"
          value={String(verifiedCount)}
          sub={`of ${payments.length} students`}
          icon={MailCheck}
          color="bg-violet-500/12 border border-violet-500/20 text-violet-400"
        />
      </div>

      {/* Filters */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, txn ID…"
              className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white/70 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Cohort Filter */}
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white/70 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
          >
            {cohorts.map((c) => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Batches' : c}</option>
            ))}
          </select>

          {/* Email Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white/70 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">All Emails</option>
            <option value="VERIFIED">Email Verified ✓</option>
            <option value="UNVERIFIED">Unverified ⚠</option>
          </select>

          <span className="text-[10px] text-white/30 font-medium ml-auto">
            {filtered.length} of {payments.length} records
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Student', 'Course / Batch', 'Amount', 'Method', 'Status', 'Paid At', 'Txn ID'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-white/30">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-white/30">
                    No payments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const cfg = STATUS_CONFIG[p.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      {/* Student */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-xs font-bold text-white">{p.studentName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-white/40">{p.studentEmail}</p>
                            {p.emailVerified ? (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400">
                                <BadgeCheck className="w-2.5 h-2.5" /> Verified
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-400">⚠ Unverified</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Course / Batch */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-semibold text-white/80">{p.courseName}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20">
                          {p.cohort}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-black text-emerald-400">₹{p.amount.toLocaleString('en-IN')}</p>
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/[0.05] text-white/60 border border-white/[0.08]">
                          {p.method}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Paid At */}
                      <td className="px-4 py-3.5">
                        <p className="text-[10px] text-white/50">
                          {new Date(p.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[9px] text-white/30">
                          {new Date(p.paidAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      {/* Txn ID */}
                      <td className="px-4 py-3.5">
                        <p className="text-[10px] font-mono text-white/40 truncate max-w-[120px]">{p.transactionId}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
