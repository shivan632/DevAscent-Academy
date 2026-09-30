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
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
} from 'lucide-react';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { useDebounce } from '../../../lib/hooks/useDebounce';

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  SUCCESS:  { label: 'Success',  icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20' },
  PAID:     { label: 'Success',  icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20' },
  PENDING:  { label: 'Pending',  icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/12 border-amber-500/20' },
  FAILED:   { label: 'Failed',   icon: XCircle,      color: 'text-rose-400',    bg: 'bg-rose-500/12 border-rose-500/20' },
  REFUNDED: { label: 'Refunded', icon: RefreshCw,    color: 'text-slate-400',   bg: 'bg-slate-500/12 border-slate-500/20' },
};

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-start gap-3 shadow-lg">
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('ALL');

  const search = useDebounce(searchInput, 300);

  const { data: resData, isLoading, isValidating, mutate } = useSWR(
    ['/admin/payments', page, limit, search, statusFilter, verifiedFilter],
    () =>
      api.admin.getPayments({
        page,
        limit,
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        emailVerified: verifiedFilter === 'ALL' ? undefined : verifiedFilter,
      }),
    { refreshInterval: 60000, revalidateOnFocus: true }
  );

  const payload = resData?.data || resData || {};
  const paymentsList: any[] = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.payments)
    ? payload.payments
    : Array.isArray(payload)
    ? payload
    : [];

  const meta = payload?.meta || {};
  const stats = payload?.stats || {};
  const total = meta?.total ?? paymentsList.length;
  const totalPages = meta?.totalPages ?? 1;

  const totalRevenue = stats?.totalRevenue ?? 0;
  const paidRevenue = stats?.paidRevenue ?? 0;
  const pendingRevenue = stats?.pendingRevenue ?? 0;
  const successCount = stats?.successCount ?? 0;
  const pendingCount = stats?.pendingCount ?? 0;
  const verifiedCount = stats?.verifiedCount ?? 0;
  const totalCount = stats?.totalCount ?? total;

  const handleExport = () => {
    window.open(api.admin.exportRevenueUrl(), '_blank');
  };

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
          <p className="text-xs text-white/35 mt-1 ml-11">
            Real-time student transactions from PostgreSQL database · batch & verification tracking
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => mutate()}
            disabled={isValidating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 text-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-500/5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          sub={pendingRevenue > 0 ? `₹${paidRevenue.toLocaleString('en-IN')} paid · ₹${pendingRevenue.toLocaleString('en-IN')} pending` : 'From paid enrollments'}
          icon={IndianRupee}
          color="bg-emerald-500/12 border border-emerald-500/20 text-emerald-400"
        />
        <KpiCard
          label="Successful"
          value={String(successCount)}
          sub="Payments completed"
          icon={CheckCircle2}
          color="bg-blue-500/12 border border-blue-500/20 text-blue-400"
        />
        <KpiCard
          label="Pending"
          value={String(pendingCount)}
          sub="Awaiting completion"
          icon={Clock}
          color="bg-amber-500/12 border border-amber-500/20 text-amber-400"
        />
        <KpiCard
          label="Email Verified"
          value={String(verifiedCount)}
          sub={`of ${totalCount} transactions`}
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
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, order ID, txn ID…"
              className="w-full pl-9 pr-8 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white/70 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success / Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Email Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white/70 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">All Emails</option>
            <option value="VERIFIED">Email Verified ✓</option>
            <option value="UNVERIFIED">Unverified ⚠</option>
          </select>

          <span className="text-[10px] text-white/30 font-medium ml-auto">
            {paymentsList.length} of {total} records
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={5} cols={7} />
          </div>
        ) : paymentsList.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payment records found"
            description={
              searchInput || statusFilter !== 'ALL' || verifiedFilter !== 'ALL'
                ? 'No transactions matched the applied filters.'
                : 'No student payments have been initiated yet.'
            }
            action={
              searchInput || statusFilter !== 'ALL' || verifiedFilter !== 'ALL'
                ? {
                    label: 'Reset Filters',
                    onClick: () => {
                      setSearchInput('');
                      setStatusFilter('ALL');
                      setVerifiedFilter('ALL');
                      setPage(1);
                    },
                  }
                : undefined
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.015]">
                    {['Student', 'Course / Batch', 'Amount', 'Method', 'Status', 'Date & Time', 'Transaction / Order ID'].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-wider text-white/35">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {paymentsList.map((p: any) => {
                    const statusKey = p.status?.toUpperCase() || 'PENDING';
                    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.PENDING;
                    const StatusIcon = cfg.icon;

                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
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
                          <p className="text-xs font-semibold text-white/80 max-w-[160px] truncate">{p.courseName}</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20">
                            {p.cohort}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-black text-emerald-400">₹{(p.amount || 0).toLocaleString('en-IN')}</p>
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
                          <p className="text-[10px] text-white/60 font-medium">
                            {new Date(p.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[9px] text-white/30">
                            {new Date(p.paidAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>

                        {/* Txn ID */}
                        <td className="px-4 py-3.5">
                          <p className="text-[10px] font-mono text-white/50 truncate max-w-[150px]" title={p.transactionId}>
                            {p.transactionId}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
              <div>
                Showing <span className="font-bold text-white">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
                <span className="font-bold text-white">{Math.min(page * limit, total)}</span> of{' '}
                <span className="font-bold text-white">{total}</span> payments
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-semibold text-white/70">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
