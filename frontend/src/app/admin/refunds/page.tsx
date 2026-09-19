'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { TableSkeleton, Pagination, StatusBadge, EmptyState } from '../../../components/admin/AdminUI';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';
import { CheckCircle, XCircle } from 'lucide-react';

export default function RefundsPage() {
  const [statusFilter, setStatusFilter] = useState('SUBMITTED');
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    ['/admin/refunds', statusFilter],
    () => api.admin.getRefunds(statusFilter || undefined),
    { refreshInterval: 30000 },
  );

  const [confirm, setConfirm] = useState<{
    open: boolean; type: 'approve' | 'reject'; refundId: string; studentName: string; amountRs: number;
  }>({ open: false, type: 'approve', refundId: '', studentName: '', amountRs: 0 });
  const [rejectReason, setRejectReason] = useState('Does not meet 7-day policy criteria');
  const [actionLoading, setActionLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setActionLoading(true);
    try {
      if (confirm.type === 'approve') {
        await api.admin.approveRefund(confirm.refundId);
      } else {
        await api.admin.rejectRefund(confirm.refundId, rejectReason);
      }
      await mutate();
      setConfirm((c) => ({ ...c, open: false }));
    } catch (e: any) {
      alert(e.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }, [confirm, rejectReason, mutate]);

  const refunds = data?.refunds || [];
  const statuses = ['SUBMITTED', 'APPROVED', 'REJECTED', 'PROCESSED', ''];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Refund Management</h1>
        <p className="text-sm text-white/35 mt-0.5">{refunds.length} refunds · 7-day policy</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === s
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-white/5 text-white/50 hover:text-white border border-white/8'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4"><TableSkeleton rows={5} /></div>
        ) : !refunds.length ? (
          <EmptyState message="No refunds found for this status." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Course</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Reason</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">UPI</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Submitted</th>
                  {statusFilter === 'SUBMITTED' && (
                    <th className="text-right px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {refunds.map((r: any) => (
                  <tr key={r.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-white">{r.user.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{r.user.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-white/60 max-w-[120px] truncate">
                        {r.payment?.course?.title || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-emerald-400">
                        ₹{Math.round(r.amountInPaise / 100).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-white/55 max-w-[140px] truncate" title={r.reason}>{r.reason}</p>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-white/40 font-mono">{r.upiId || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-white/40">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    {statusFilter === 'SUBMITTED' && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setConfirm({
                              open: true, type: 'approve', refundId: r.id,
                              studentName: r.user.name,
                              amountRs: Math.round(r.amountInPaise / 100),
                            })}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setConfirm({
                              open: true, type: 'reject', refundId: r.id,
                              studentName: r.user.name,
                              amountRs: Math.round(r.amountInPaise / 100),
                            })}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirm.type === 'reject' && confirm.open && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0F1420] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reject Refund?</h3>
            <p className="text-sm text-white/55 mb-4">
              Reject ₹{confirm.amountRs} refund for <strong className="text-white">{confirm.studentName}</strong>. Provide a reason:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-red-500/50 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setConfirm((c) => ({ ...c, open: false }))}
                className="px-4 py-2 text-sm text-white/60 hover:text-white"
              >Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Reject Refund
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open && confirm.type === 'approve'}
        title={`Approve ₹${confirm.amountRs} Refund?`}
        description={`This will approve the refund for ${confirm.studentName}. The student's enrollment will be marked as refunded. This cannot be undone.`}
        confirmLabel="Yes, Approve Refund"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </div>
  );
}
