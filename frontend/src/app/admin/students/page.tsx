'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { TableSkeleton, Pagination, StatusBadge, EmptyState } from '../../../components/admin/AdminUI';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';
import { Search, Download, Eye, UserX, UserCheck, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../../../lib/hooks/useDebounce';

function useStudents(params: any) {
  return useSWR(
    ['/admin/students', params],
    () => api.admin.getStudents(params),
    { revalidateOnFocus: true, keepPreviousData: true },
  );
}

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [degree, setDegree] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const search = useDebounce(searchInput, 400);

  const { data, isLoading, mutate } = useStudents({ page, limit: 20, search, degree, status });

  const [confirm, setConfirm] = useState<{
    open: boolean; title: string; description: string; confirmLabel: string;
    variant: 'default' | 'danger' | 'warning'; action?: () => Promise<void>;
  }>({ open: false, title: '', description: '', confirmLabel: '', variant: 'default' });
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = useCallback(async () => {
    if (!confirm.action) return;
    setActionLoading(true);
    try {
      await confirm.action();
      await mutate();
      setConfirm((c) => ({ ...c, open: false }));
    } catch (e: any) {
      alert(e.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }, [confirm, mutate]);

  const askSuspend = (student: any) =>
    setConfirm({
      open: true,
      title: `Suspend ${student.name}?`,
      description: `This will block ${student.name} from logging in. You can restore anytime.`,
      confirmLabel: 'Yes, Suspend',
      variant: 'danger',
      action: () => api.admin.suspendStudent(student.id, 'Suspended by admin'),
    });

  const askRestore = (student: any) =>
    setConfirm({
      open: true,
      title: `Restore ${student.name}?`,
      description: `This will re-enable access for ${student.name}.`,
      confirmLabel: 'Yes, Restore',
      variant: 'default',
      action: () => api.admin.restoreStudent(student.id),
    });

  const handleExport = () => {
    window.open(api.admin.exportStudentsUrl(), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Students</h1>
          <p className="text-sm text-white/35 mt-0.5">
            {data?.meta.total ?? '—'} total students
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-sm font-semibold rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <select
          value={degree}
          onChange={(e) => { setDegree(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none focus:border-indigo-500/50 transition-colors"
        >
          <option value="">All Degrees</option>
          <option value="BCA">BCA</option>
          <option value="MCA">MCA</option>
          <option value="BTECH">B.Tech</option>
          <option value="OTHER">Other</option>
        </select>
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {['ACTIVE', 'SUSPENDED'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                status === s
                  ? s === 'SUSPENDED'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-white/3 text-white/40 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} />
          </div>
        ) : !data?.data.length ? (
          <EmptyState message="No students found for the selected filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Degree</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Courses</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Spent</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-5 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((student: any, idx: number) => (
                  <tr
                    key={student.id}
                    className={`border-b border-white/3 hover:bg-white/3 transition-colors ${
                      idx % 2 === 0 ? '' : 'bg-white/[0.015]'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-white">{student.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-white/60">{student.degree || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white/60">{student.enrollmentCount}</td>
                    <td className="px-4 py-3.5 text-sm text-white/60">
                      ₹{student.totalSpentRupees.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-white/40">
                      {new Date(student.joinedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {student.status === 'ACTIVE' ? (
                          <button
                            onClick={() => askSuspend(student)}
                            title="Suspend"
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => askRestore(student)}
                            title="Restore"
                            className="p-2 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={data?.meta.totalPages || 1}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        confirmLabel={confirm.confirmLabel}
        variant={confirm.variant}
        isLoading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </div>
  );
}
