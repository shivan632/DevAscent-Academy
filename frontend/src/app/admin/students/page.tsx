'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';
import { StudentDetailDrawer } from '../../../components/admin/StudentDetailDrawer';
import {
  Search,
  Download,
  Eye,
  UserX,
  UserCheck,
  GraduationCap,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Calendar,
} from 'lucide-react';
import { useDebounce } from '../../../lib/hooks/useDebounce';

function useStudents(params: any) {
  return useSWR(
    ['/admin/students', params],
    () => api.admin.getStudents(params),
    { revalidateOnFocus: true, keepPreviousData: true }
  );
}

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchInput, setSearchInput] = useState('');
  const [degree, setDegree] = useState('');
  const [status, setStatus] = useState<string>('ACTIVE');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const search = useDebounce(searchInput, 300);

  const { data, isLoading, mutate } = useStudents({
    page,
    limit,
    search: search && search.length >= 2 ? search : undefined,
    degree: degree || undefined,
    status: status === 'ALL' ? undefined : status,
  });

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
    variant: 'danger',
    onConfirm: async () => {},
  });

  const handleSuspend = (student: any) => {
    setConfirmModal({
      isOpen: true,
      title: `Suspend ${student.name}?`,
      description: `This will immediately block ${student.name} from logging in and accessing courses. A mandatory reason is required for audit logs.`,
      confirmText: 'Suspend Account',
      variant: 'danger',
      requireReason: true,
      onConfirm: async (reason?: string) => {
        await api.admin.suspendStudent(student.id, reason || 'Account suspended by admin');
        await mutate();
      },
    });
  };

  const handleRestore = (student: any) => {
    setConfirmModal({
      isOpen: true,
      title: `Restore ${student.name}?`,
      description: `This will restore platform login and access for ${student.name}.`,
      confirmText: 'Restore Access',
      variant: 'primary',
      requireReason: false,
      onConfirm: async () => {
        await api.admin.restoreStudent(student.id);
        await mutate();
      },
    });
  };

  const handleExport = () => {
    window.open(api.admin.exportStudentsUrl(), '_blank');
  };

  const studentsPayload = data?.data || data;
  const studentsList: any[] = Array.isArray(studentsPayload)
    ? studentsPayload
    : Array.isArray(studentsPayload?.data)
    ? studentsPayload.data
    : Array.isArray(studentsPayload?.students)
    ? studentsPayload.students
    : [];
  const total = studentsPayload?.meta?.total ?? data?.meta?.total ?? studentsList.length;
  const totalPages = studentsPayload?.meta?.totalPages ?? data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Management</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {total} enrolled
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Search, inspect enrollments, and manage student account statuses with full audit logging.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-xl transition-all self-start sm:self-auto shadow-md shadow-indigo-500/5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by student name or email (min 2 chars)…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-9 py-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
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

        {/* Degree Filter */}
        <select
          value={degree}
          onChange={(e) => {
            setDegree(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white/70 focus:outline-none focus:border-indigo-500/50 transition-colors"
        >
          <option value="">All Degrees</option>
          <option value="BCA">BCA</option>
          <option value="MCA">MCA</option>
          <option value="BTECH">B.Tech / B.E.</option>
          <option value="BSC">B.Sc Computer Science</option>
          <option value="OTHER">Other Degrees</option>
        </select>

        {/* Status Filter Chips */}
        <div className="flex rounded-xl bg-[#0F1420] p-1 border border-white/10 shrink-0">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'ACTIVE', label: 'Active' },
            { key: 'SUSPENDED', label: 'Suspended' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setStatus(s.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === s.key
                  ? s.key === 'SUSPENDED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={6} cols={6} />
          </div>
        ) : studentsList.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found"
            description={
              searchInput || degree || status !== 'ACTIVE'
                ? 'Try adjusting your search criteria or resetting the applied filters.'
                : 'No students are enrolled yet.'
            }
            action={
              searchInput || degree || status !== 'ACTIVE'
                ? {
                    label: 'Reset Filters',
                    onClick: () => {
                      setSearchInput('');
                      setDegree('');
                      setStatus('ACTIVE');
                      setPage(1);
                    },
                  }
                : undefined
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] font-extrabold text-white/40 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-4 py-3.5">Degree & College</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Enrollments</th>
                    <th className="px-4 py-3.5">Total Paid</th>
                    <th className="px-4 py-3.5">Joined Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {studentsList.map((student: any) => (
                    <tr
                      key={student.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                            {student.name ? student.name[0].toUpperCase() : 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-white/40">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-white/90">{student.degree || '—'}</p>
                          <p className="text-[10px] text-white/40 truncate max-w-[140px]">
                            {student.collegeName || 'Not specified'}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            student.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          {student.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-white/80">
                        {student.enrollmentCount} course{student.enrollmentCount !== 1 ? 's' : ''}
                      </td>

                      <td className="px-4 py-4 font-bold text-emerald-400">
                        ₹{(student.totalSpentRupees || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="px-4 py-4 text-white/40 text-[11px]">
                        {new Date(student.joinedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentId(student.id)}
                            title="Inspect Dossier"
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {student.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleSuspend(student)}
                              title="Suspend Account"
                              className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(student)}
                              title="Restore Access"
                              className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
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

            {/* Mobile Card Layout */}
            <div className="block md:hidden divide-y divide-white/5 p-2">
              {data.data.map((student: any) => (
                <div
                  key={student.id}
                  className="p-4 space-y-3 cursor-pointer hover:bg-white/[0.02] rounded-xl transition-colors"
                  onClick={() => setSelectedStudentId(student.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{student.name}</p>
                      <p className="text-xs text-white/40">{student.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        student.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-white/60 pt-1">
                    <div>Degree: {student.degree || '—'}</div>
                    <div className="text-right text-emerald-400 font-bold">
                      ₹{(student.totalSpentRupees || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-2 border-t border-white/5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedStudentId(student.id)}
                      className="text-xs text-indigo-400 font-semibold"
                    >
                      View Details →
                    </button>

                    {student.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleSuspend(student)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-lg"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(student)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
              <div>
                Showing{' '}
                <span className="font-bold text-white">
                  {Math.min((page - 1) * limit + 1, total)}
                </span>{' '}
                to <span className="font-bold text-white">{Math.min(page * limit, total)}</span> of{' '}
                <span className="font-bold text-white">{total}</span> students
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

      {/* Student Detail Slide-over Drawer */}
      <StudentDetailDrawer
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
        onSuspend={(student) => {
          setSelectedStudentId(null);
          handleSuspend(student);
        }}
        onRestore={(student) => {
          setSelectedStudentId(null);
          handleRestore(student);
        }}
      />

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
