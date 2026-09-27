'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Download,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export default function RefundsPage() {
  const [statusFilter, setStatusFilter] = useState('SUBMITTED');

  const { data, isLoading, mutate } = useSWR(
    ['/admin/refunds', statusFilter],
    () => api.admin.getRefunds(statusFilter || undefined),
    { refreshInterval: 60000 }
  );

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'primary';
    requireReason?: boolean;
    onConfirm: (reason?: string) => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    variant: 'primary',
    onConfirm: async () => {},
  });

  const refunds = data?.refunds || [];

  const handleApprove = (refund: any) => {
    const amountRs = Math.round((refund.amountInPaise || 0) / 100);
    setConfirmModal({
      isOpen: true,
      title: `Approve Refund of ₹${amountRs.toLocaleString('en-IN')}?`,
      description: `This will approve the 100% money-back guarantee refund for ${refund.user?.name}. Course access will be revoked and payment gateway reversal recorded.`,
      confirmText: 'Approve & Reverse Payment',
      variant: 'primary',
      requireReason: false,
      onConfirm: async () => {
        await api.admin.approveRefund(refund.id);
        await mutate();
      },
    });
  };

  const handleReject = (refund: any) => {
    setConfirmModal({
      isOpen: true,
      title: `Reject Refund for ${refund.user?.name}?`,
      description: `Please enter the reason why this refund request does not satisfy the 7-day refund guarantee policy.`,
      confirmText: 'Reject Refund Request',
      variant: 'danger',
      requireReason: true,
      onConfirm: async (reason?: string) => {
        await api.admin.rejectRefund(refund.id, reason || 'Does not meet 7-day policy criteria');
        await mutate();
      },
    });
  };

  const handleExport = () => {
    window.open(api.admin.exportRevenueUrl(), '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Refund Processing</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
              7-Day Policy Guard
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Review money-back refund requests, inspect UPI IDs, and execute financial reversals.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Revenue CSV</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { key: 'SUBMITTED', label: 'Action Required (Submitted)' },
          { key: 'APPROVED', label: 'Approved' },
          { key: 'REJECTED', label: 'Rejected' },
          { key: 'PROCESSED', label: 'Processed' },
          { key: '', label: 'All Requests' },
        ].map((s) => (
          <button
            key={s.key || 'all'}
            onClick={() => setStatusFilter(s.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === s.key
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'bg-[#0F1420] text-white/50 hover:text-white border border-white/5'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={5} cols={6} />
          </div>
        ) : !refunds.length ? (
          <EmptyState
            icon={CreditCard}
            title="No refund requests found"
            description={
              statusFilter === 'SUBMITTED'
                ? 'Zero pending refund requests. All student accounts in good standing.'
                : 'No refund records match this filter.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] font-extrabold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Refund Amount</th>
                  <th className="px-4 py-3.5">Reason & UPI</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Submitted</th>
                  {statusFilter === 'SUBMITTED' && (
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                {refunds.map((r: any) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{r.user?.name}</p>
                      <p className="text-[11px] text-white/40">{r.user?.email}</p>
                    </td>

                    <td className="px-4 py-4 text-xs font-semibold text-white/80 max-w-[140px] truncate">
                      {r.payment?.course?.title || '—'}
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-extrabold text-emerald-400">
                        ₹{Math.round((r.amountInPaise || 0) / 100).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="px-4 py-4 max-w-[200px]">
                      <p className="text-xs text-white/80 line-clamp-1 italic" title={r.reason}>
                        "{r.reason}"
                      </p>
                      {r.upiId && (
                        <p className="text-[10px] font-mono text-indigo-300 mt-0.5">
                          UPI: {r.upiId}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          r.status === 'APPROVED' || r.status === 'PROCESSED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'APPROVED' || r.status === 'PROCESSED'
                              ? 'bg-emerald-400'
                              : r.status === 'REJECTED'
                              ? 'bg-rose-400'
                              : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        {r.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-white/40 text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {statusFilter === 'SUBMITTED' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        requireReason={confirmModal.requireReason}
      />
    </div>
  );
}
