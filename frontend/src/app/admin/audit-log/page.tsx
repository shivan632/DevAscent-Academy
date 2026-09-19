'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { TableSkeleton, Pagination, EmptyState } from '../../../components/admin/AdminUI';
import { ScrollText, Filter } from 'lucide-react';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  STUDENT_SUSPENDED: { label: 'Student Suspended', color: 'text-red-400' },
  STUDENT_RESTORED: { label: 'Student Restored', color: 'text-emerald-400' },
  REFUND_APPROVED: { label: 'Refund Approved', color: 'text-emerald-400' },
  REFUND_REJECTED: { label: 'Refund Rejected', color: 'text-red-400' },
  SUBMISSION_APPROVED: { label: 'Submission Approved', color: 'text-emerald-400' },
  SUBMISSION_REJECTED: { label: 'Submission Rejected', color: 'text-red-400' },
  SUBMISSIONS_BULK_APPROVED: { label: 'Bulk Approved', color: 'text-amber-400' },
  ROLE_CHANGED: { label: 'Role Changed', color: 'text-indigo-400' },
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
    { refreshInterval: 30000 },
  );

  const logs = data?.logs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Audit Log</h1>
          <p className="text-sm text-white/35 mt-0.5">Every admin action is recorded here</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
          >
            <option value="">All Actions</option>
            {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4"><TableSkeleton rows={8} /></div>
        ) : !logs.length ? (
          <EmptyState message="No audit log entries found." />
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log: any) => {
              const actionInfo = ACTION_LABELS[log.action] || { label: log.action, color: 'text-white/60' };
              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <ScrollText className="w-3.5 h-3.5 text-white/30" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${actionInfo.color}`}>
                        {actionInfo.label}
                      </span>
                      {log.targetType && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/8 rounded text-white/35 uppercase tracking-wider">
                          {log.targetType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">
                      By <span className="text-white/70 font-medium">{log.admin.name}</span>
                      <span className="text-white/30"> · {log.admin.email}</span>
                    </p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        {Object.entries(log.metadata).map(([k, v]) => (
                          <span key={k} className="text-[10px] text-white/35">
                            <span className="text-white/20">{k}:</span>{' '}
                            <span className="text-white/50 font-mono">
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-white/35">{timeAgo(log.createdAt)}</p>
                    {log.ipAddress && (
                      <p className="text-[10px] text-white/20 font-mono mt-0.5">{log.ipAddress}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
