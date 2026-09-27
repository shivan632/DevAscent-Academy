'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { ScrollText, Filter, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  STUDENT_SUSPENDED: { label: 'Student Suspended', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  STUDENT_RESTORED: { label: 'Student Restored', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  REFUND_APPROVED: { label: 'Refund Approved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  REFUND_REJECTED: { label: 'Refund Rejected', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  SUBMISSION_APPROVED: { label: 'Submission Approved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  SUBMISSION_REJECTED: { label: 'Submission Rejected', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  SUBMISSIONS_BULK_APPROVED: { label: 'Bulk Approved', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ROLE_CHANGED: { label: 'Role Changed', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  COURSE_UPDATED: { label: 'Course Updated', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
};

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading } = useSWR(
    ['/admin/audit-log', page, actionFilter],
    () => api.admin.getAuditLog({ page, limit: 30, action: actionFilter || undefined }),
    { refreshInterval: 60000 }
  );

  const logs = data?.logs || [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Audit Trail</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Every administrative mutation is permanently tracked with admin identity, IP, and payload metadata.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-8 py-2 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white/80 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Action Types</option>
              {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={8} cols={4} />
          </div>
        ) : !logs.length ? (
          <EmptyState
            icon={ScrollText}
            title="No audit entries"
            description="No administrative actions have been recorded matching this filter."
          />
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {logs.map((log: any) => {
                const actionInfo = ACTION_LABELS[log.action] || {
                  label: log.action,
                  color: 'text-white/60 bg-white/5 border-white/10',
                };

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <ScrollText className="w-4 h-4 text-indigo-400" />
                    </div>

                    {/* Main Log Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${actionInfo.color}`}
                        >
                          {actionInfo.label}
                        </span>
                        {log.targetType && (
                          <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-white/40 uppercase font-bold">
                            {log.targetType}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/70 mt-1">
                        By <span className="text-white font-bold">{log.admin?.name || 'Admin'}</span>
                        <span className="text-white/40"> · {log.admin?.email}</span>
                      </p>

                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(log.metadata).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[10px] px-2 py-1 bg-white/[0.02] border border-white/5 rounded-md text-white/40"
                            >
                              <span className="text-white/20 font-semibold">{k}:</span>{' '}
                              <span className="text-white/60 font-mono">
                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp & IP */}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-white/50 font-medium">{timeAgo(log.createdAt)}</p>
                      {log.ipAddress && (
                        <p className="text-[10px] text-white/20 font-mono mt-0.5">
                          {log.ipAddress}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-white/50">
              <span>
                Page {page} of {totalPages} ({total} audit logs)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
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
