'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';
import {
  CheckCircle,
  XCircle,
  CheckSquare,
  ExternalLink,
  Code2,
  Globe,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';


export default function SubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, mutate } = useSWR(
    ['/admin/submissions', statusFilter, page],
    () => api.admin.getSubmissions({ status: statusFilter || undefined, page, limit: 20 }),
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

  const submissions = data?.submissions || [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === submissions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(submissions.map((s: any) => s.id)));
    }
  };

  const handleApprove = (submission: any) => {
    setConfirmModal({
      isOpen: true,
      title: `Approve Submission for ${submission.user?.name}?`,
      description: `This will mark the capstone project as verified, calculate certificate SHA-256 fingerprint, and issue their verifiable certificate.`,
      confirmText: 'Approve & Issue Certificate',
      variant: 'primary',
      requireReason: false,
      onConfirm: async () => {
        await api.admin.approveSubmission(submission.id);
        await mutate();
      },
    });
  };

  const handleReject = (submission: any) => {
    setConfirmModal({
      isOpen: true,
      title: `Reject Submission for ${submission.user?.name}?`,
      description: `Please provide specific revision feedback so the student knows what improvements are needed.`,
      confirmText: 'Reject Submission',
      variant: 'danger',
      requireReason: true,
      onConfirm: async (reason?: string) => {
        await api.admin.rejectSubmission(submission.id, reason || 'Revision required');
        await mutate();
      },
    });
  };

  const handleBulkApprove = () => {
    if (selected.size === 0) return;
    setConfirmModal({
      isOpen: true,
      title: `Bulk Approve ${selected.size} Submissions?`,
      description: `This will approve all ${selected.size} selected capstones and generate tamper-proof certificates for these students.`,
      confirmText: `Approve ${selected.size} Projects`,
      variant: 'primary',
      requireReason: false,
      onConfirm: async () => {
        await api.admin.bulkApproveSubmissions([...selected]);
        setSelected(new Set());
        await mutate();
      },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Capstone Reviews</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {total} total
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Review student GitHub repositories, inspect deployments, and approve cryptographic certificates.
          </p>
        </div>

        {selected.size > 0 && (
          <button
            onClick={handleBulkApprove}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all self-start sm:self-auto"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Approve {selected.size} Selected</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { key: 'PENDING', label: 'Pending Review' },
          { key: 'APPROVED', label: 'Approved' },
          { key: 'REJECTED', label: 'Rejected' },
          { key: '', label: 'All Submissions' },
        ].map((s) => (
          <button
            key={s.key || 'all'}
            onClick={() => {
              setStatusFilter(s.key);
              setPage(1);
              setSelected(new Set());
            }}
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

      {/* Main Submissions Table */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={5} cols={6} />
          </div>
        ) : !submissions.length ? (
          <EmptyState
            icon={FileCheck}
            title="No submissions found"
            description={
              statusFilter === 'PENDING'
                ? 'Great job! All pending capstones have been reviewed.'
                : 'No submissions match this filter.'
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] font-extrabold text-white/40 uppercase tracking-wider">
                    {statusFilter === 'PENDING' && (
                      <th className="px-5 py-3.5 w-10">
                        <input
                          type="checkbox"
                          checked={selected.size === submissions.length && submissions.length > 0}
                          onChange={toggleAll}
                          className="rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                        />
                      </th>
                    )}
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-4 py-3.5">Course</th>
                    <th className="px-4 py-3.5">Project Details</th>
                    <th className="px-4 py-3.5">Artifact Links</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Submitted</th>
                    <th className="px-6 py-3.5 text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {submissions.map((s: any) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                      {statusFilter === 'PENDING' && (
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selected.has(s.id)}
                            onChange={() => toggleSelect(s.id)}
                            className="rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                          />
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{s.user?.name}</p>
                        <p className="text-[11px] text-white/40">{s.user?.email}</p>
                      </td>

                      <td className="px-4 py-4 text-xs font-semibold text-white/80 max-w-[140px] truncate">
                        {s.course?.title || 'Course'}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{s.projectName || 'Capstone'}</p>
                        {s.notes && (
                          <p className="text-[11px] text-white/40 line-clamp-1 italic mt-0.5">
                            "{s.notes}"
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {s.gitRepoUrl && (
                            <a
                              href={s.gitRepoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors text-[11px]"
                              title="GitHub Repository"
                            >
                              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Code</span>
                            </a>

                          )}
                          {s.liveUrl && (
                            <a
                              href={s.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-colors text-[11px]"
                              title="Live Deployment"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            s.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : s.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              s.status === 'APPROVED'
                                ? 'bg-emerald-400'
                                : s.status === 'REJECTED'
                                ? 'bg-rose-400'
                                : 'bg-amber-400 animate-pulse'
                            }`}
                          />
                          {s.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-white/40 text-[11px]">
                        {new Date(s.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {s.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(s)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(s)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-white/30 italic">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-white/50">
              <span>
                Page {page} of {totalPages} ({total} submissions)
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

      {/* Reusable Confirm Modal */}
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
