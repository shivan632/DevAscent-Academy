'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { TableSkeleton, Pagination, StatusBadge, EmptyState } from '../../../components/admin/AdminUI';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';
import { CheckCircle, XCircle, CheckSquare, ExternalLink } from 'lucide-react';

export default function SubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, mutate } = useSWR(
    ['/admin/submissions', statusFilter, page],
    () => api.admin.getSubmissions({ status: statusFilter || undefined, page, limit: 20 }),
    { refreshInterval: 30000 },
  );

  const [confirm, setConfirm] = useState<{
    open: boolean; type: 'approve' | 'reject' | 'bulk-approve';
    submissionId?: string; studentName?: string;
  }>({ open: false, type: 'approve' });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const submissions = data?.submissions || [];

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

  const handleConfirm = useCallback(async () => {
    setActionLoading(true);
    try {
      if (confirm.type === 'approve' && confirm.submissionId) {
        await api.admin.approveSubmission(confirm.submissionId);
      } else if (confirm.type === 'reject' && confirm.submissionId) {
        await api.admin.rejectSubmission(confirm.submissionId, rejectReason || 'Rejected by admin');
      } else if (confirm.type === 'bulk-approve') {
        await api.admin.bulkApproveSubmissions([...selected]);
        setSelected(new Set());
      }
      await mutate();
      setConfirm((c) => ({ ...c, open: false }));
    } catch (e: any) {
      alert(e.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }, [confirm, rejectReason, selected, mutate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Capstone Submissions</h1>
          <p className="text-sm text-white/35 mt-0.5">{data?.meta?.total ?? '—'} submissions</p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={() => setConfirm({ open: true, type: 'bulk-approve' })}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-sm font-semibold rounded-xl transition-all"
          >
            <CheckSquare className="w-4 h-4" />
            Approve {selected.size} Selected
          </button>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => { setStatusFilter(s); setPage(1); setSelected(new Set()); }}
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
        ) : !submissions.length ? (
          <EmptyState message="No submissions found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5">
                  {statusFilter === 'PENDING' && (
                    <th className="px-5 py-3">
                      <input type="checkbox"
                        checked={selected.size === submissions.length && submissions.length > 0}
                        onChange={toggleAll} className="rounded" />
                    </th>
                  )}
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Course</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Project</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Links</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Submitted</th>
                  {statusFilter === 'PENDING' && (
                    <th className="text-right px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s: any) => (
                  <tr key={s.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    {statusFilter === 'PENDING' && (
                      <td className="px-5 py-3.5">
                        <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded" />
                      </td>
                    )}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-white">{s.user.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{s.user.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-white/55 max-w-[120px] truncate">{s.course.title}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-white/80">{s.projectName}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">Batch: {s.batch}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <a href={s.gitRepoUrl} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all" title="GitHub Repo">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </a>
                        {s.linkedinPostUrl && (
                          <a href={s.linkedinPostUrl} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="LinkedIn">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-white/40">
                      {new Date(s.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    {statusFilter === 'PENDING' && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setConfirm({ open: true, type: 'approve', submissionId: s.id, studentName: s.user.name })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => setConfirm({ open: true, type: 'reject', submissionId: s.id, studentName: s.user.name })}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all">
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
      <Pagination page={page} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />

      {/* Reject Dialog */}
      {confirm.open && confirm.type === 'reject' && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0F1420] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reject Submission?</h3>
            <p className="text-sm text-white/55 mb-4">From <strong className="text-white">{confirm.studentName}</strong>. Reason:</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why…" rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-red-500/50 resize-none" />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setConfirm((c) => ({ ...c, open: false }))} className="px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleConfirm} disabled={actionLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 flex items-center gap-2">
                {actionLoading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={confirm.open && confirm.type === 'approve'} title="Approve Submission?"
        description={`Approve capstone submission from ${confirm.studentName}. This will mark it as approved.`}
        confirmLabel="Yes, Approve" variant="default" isLoading={actionLoading}
        onConfirm={handleConfirm} onCancel={() => setConfirm((c) => ({ ...c, open: false }))} />
      <ConfirmDialog open={confirm.open && confirm.type === 'bulk-approve'}
        title={`Bulk Approve ${selected.size} Submissions?`}
        description={`Approve all ${selected.size} selected submissions. Cannot be undone.`}
        confirmLabel={`Approve ${selected.size}`} variant="warning" isLoading={actionLoading}
        onConfirm={handleConfirm} onCancel={() => setConfirm((c) => ({ ...c, open: false }))} />
    </div>
  );
}
