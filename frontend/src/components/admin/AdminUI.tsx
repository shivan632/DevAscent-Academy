'use client';

import React from 'react';

// ─── Skeleton Variants ──────────────────────────────────────────────────────

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white/5 animate-pulse rounded-xl ${className}`}
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5 animate-pulse">
          <SkeletonBox className="h-3 w-24 mb-3" />
          <SkeletonBox className="h-8 w-16 mb-2" />
          <SkeletonBox className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 bg-white/3 rounded-xl animate-pulse">
          <SkeletonBox className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBox className="h-3 w-40" />
            <SkeletonBox className="h-2.5 w-56" />
          </div>
          <SkeletonBox className="h-6 w-16 rounded-lg" />
          <SkeletonBox className="h-6 w-12 rounded-lg" />
          <SkeletonBox className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose';
  icon: React.ReactNode;
}

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20',
  emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
  rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20',
};

const iconBg = {
  indigo: 'bg-indigo-500/15 text-indigo-400',
  emerald: 'bg-emerald-500/15 text-emerald-400',
  amber: 'bg-amber-500/15 text-amber-400',
  rose: 'bg-rose-500/15 text-rose-400',
};

export function KpiCard({ label, value, sub, color = 'indigo', icon }: KpiCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Prev
      </button>
      <span className="text-xs text-white/40 px-2">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    SUSPENDED: 'bg-red-500/15 text-red-400 border-red-500/20',
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    APPROVED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    REJECTED: 'bg-red-500/15 text-red-400 border-red-500/20',
    SUBMITTED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    PAID: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    REFUNDED: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    PROCESSED: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    COMPLETED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  };
  const cls = styles[status] || 'bg-white/5 text-white/40 border-white/10';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
      {status}
    </span>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm font-medium text-white/40">{message}</p>
    </div>
  );
}
