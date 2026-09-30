'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { StudentDetailDrawer } from '../../../components/admin/StudentDetailDrawer';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';
import {
  Search, ClipboardList, ChevronLeft, ChevronRight, X, RefreshCw,
  BadgeCheck, Eye, BookOpen, UserX, UserCheck,
} from 'lucide-react';
import { useDebounce } from '../../../lib/hooks/useDebounce';

function useEnrollments(params: any) {
  return useSWR(
    ['/admin/enrollments', params],
    () => api.admin.getEnrollments(params),
    { revalidateOnFocus: true, keepPreviousData: true }
  );
}

export default function EnrollmentsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchInput, setSearchInput] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<any>({ isOpen: false, title: '', description: '', confirmText: 'Confirm', variant: 'danger', onConfirm: async () => {} });

  const search = useDebounce(searchInput, 300);
  const { data: coursesData } = useSWR('/admin/courses', () => api.admin.getCourseStats());
  const coursesList: any[] = coursesData?.courses || coursesData?.data?.courses || [];
  const { data, isLoading, isValidating, mutate } = useEnrollments({
    page, limit,
    search: search && search.length >= 2 ? search : undefined,
    courseId: courseFilter === 'ALL' ? undefined : courseFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const handleSuspend = (student: any) => setConfirmModal({ isOpen: true, title: `Suspend ${student.name}?`, description: `Block ${student.name} from logging in and accessing courses.`, confirmText: 'Suspend Account', variant: 'danger', requireReason: true, onConfirm: async (reason?: string) => { await api.admin.suspendStudent(student.id, reason || 'Suspended by admin'); await mutate(); } });
  const handleRestore = (student: any) => setConfirmModal({ isOpen: true, title: `Restore ${student.name}?`, description: `Restore login and access for ${student.name}.`, confirmText: 'Restore Access', variant: 'primary', requireReason: false, onConfirm: async () => { await api.admin.restoreStudent(student.id); await mutate(); } });

  const payload = data?.data || data;
  const list: any[] = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const total = payload?.meta?.total ?? list.length;
  const totalPages = payload?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Enrollments</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{total} total</span>
          </div>
          <p className="text-xs text-white/40 mt-1">Complete enrollment registry — course progress, payment status, and student access management.</p>
        </div>
        <button onClick={() => mutate()} disabled={isValidating} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white text-xs font-semibold transition-all self-start sm:self-auto">
          <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Search student name or email…" value={searchInput} onChange={(e) => { setSearchInput(e.target.value); setPage(1); }} className="w-full pl-10 pr-9 py-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors" />
          {searchInput && <button onClick={() => { setSearchInput(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }} className="px-3.5 py-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white/70 focus:outline-none focus:border-indigo-500/50 cursor-pointer">
          <option value="ALL">All Courses</option>
          {coursesList.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <div className="flex rounded-xl bg-[#0F1420] p-1 border border-white/10 shrink-0">
          {[{ key: 'ALL', label: 'All' }, { key: 'ACTIVE', label: 'Active' }, { key: 'COMPLETED', label: 'Completed' }].map((s) => (
            <button key={s.key} onClick={() => { setStatusFilter(s.key); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s.key ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm' : 'text-white/40 hover:text-white'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6"><SkeletonLoader type="table" rows={8} cols={6} /></div>
        ) : list.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No enrollments found" description={searchInput || courseFilter !== 'ALL' || statusFilter !== 'ALL' ? 'Try adjusting your filters.' : 'No enrollments exist yet.'} action={searchInput || courseFilter !== 'ALL' || statusFilter !== 'ALL' ? { label: 'Reset Filters', onClick: () => { setSearchInput(''); setCourseFilter('ALL'); setStatusFilter('ALL'); setPage(1); } } : undefined} />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] font-extrabold text-white/40 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-4 py-3.5">Course / Cohort</th>
                    <th className="px-4 py-3.5">Progress</th>
                    <th className="px-4 py-3.5">Payment</th>
                    <th className="px-4 py-3.5">Enrolled On</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {list.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">{enrollment.student?.name?.[0]?.toUpperCase() || 'S'}</div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{enrollment.student?.name}</p>
                            <p className="text-[10px] text-white/40 truncate">{enrollment.student?.email}</p>
                            {enrollment.student?.degree && <p className="text-[9px] text-white/25">{enrollment.student.degree}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white truncate max-w-[180px]">{enrollment.course?.title}</p>
                        <p className="text-[10px] text-white/40">Cohort {enrollment.course?.cohortNumber || '—'}</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400/70 bg-indigo-500/10 px-1.5 py-0.5 rounded">{enrollment.course?.type || 'COURSE'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-1 w-28">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/50">Progress</span>
                            <span className={`font-bold ${(enrollment.progressPct || 0) === 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>{enrollment.progressPct || 0}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${(enrollment.progressPct || 0) === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${enrollment.progressPct || 0}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {enrollment.payment ? (
                          <div>
                            <p className="font-bold text-emerald-400">₹{(enrollment.payment.amountRupees || 0).toLocaleString('en-IN')}</p>
                            <p className="text-[9px] text-white/30 font-mono truncate max-w-[100px]">{enrollment.payment.razorpayPaymentId || '—'}</p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">Free / Manual</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-white/40">{new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${enrollment.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : enrollment.status === 'COMPLETED' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${enrollment.status === 'ACTIVE' ? 'bg-emerald-400' : enrollment.status === 'COMPLETED' ? 'bg-indigo-400' : 'bg-slate-400'}`} />
                          {enrollment.status || 'ACTIVE'}
                        </span>
                        {enrollment.student?.isEmailVerified ? (
                          <div className="flex items-center gap-0.5 text-[9px] text-emerald-400 mt-1"><BadgeCheck className="w-2.5 h-2.5" /><span>Verified</span></div>
                        ) : (
                          <span className="text-[9px] text-amber-400">⚠ Unverified</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setSelectedStudentId(enrollment.student?.id)} title="Student Dossier" className="p-1.5 rounded-lg text-white/40 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"><Eye className="w-4 h-4" /></button>
                          <Link href={`/admin/courses/${enrollment.course?.slug}`} title="Course Studio" className="p-1.5 rounded-lg text-white/40 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"><BookOpen className="w-4 h-4" /></Link>
                          {enrollment.student?.status === 'ACTIVE' ? (
                            <button onClick={() => handleSuspend(enrollment.student)} title="Suspend" className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"><UserX className="w-4 h-4" /></button>
                          ) : (
                            <button onClick={() => handleRestore(enrollment.student)} title="Restore" className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"><UserCheck className="w-4 h-4" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-white/5 p-2">
              {list.map((enrollment: any) => (
                <div key={enrollment.id} className="p-4 space-y-3 hover:bg-white/[0.02] rounded-xl transition-colors" onClick={() => setSelectedStudentId(enrollment.student?.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="font-bold text-white text-sm">{enrollment.student?.name}</p><p className="text-xs text-white/40">{enrollment.student?.email}</p></div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${enrollment.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-indigo-500/15 text-indigo-300'}`}>{enrollment.status || 'ACTIVE'}</span>
                  </div>
                  <div className="text-xs text-white/60"><p className="font-semibold text-white">{enrollment.course?.title}</p><p>Cohort {enrollment.course?.cohortNumber} · {enrollment.progressPct || 0}% complete</p></div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${enrollment.progressPct || 0}%` }} /></div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-emerald-400 font-bold">{enrollment.payment ? `₹${enrollment.payment.amountRupees?.toLocaleString('en-IN')}` : 'Free'}</span>
                    <button className="text-xs text-indigo-400 font-semibold" onClick={(e) => { e.stopPropagation(); setSelectedStudentId(enrollment.student?.id); }}>View →</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
              <div>Showing <span className="font-bold text-white">{Math.min((page - 1) * limit + 1, total)}</span> to <span className="font-bold text-white">{Math.min(page * limit, total)}</span> of <span className="font-bold text-white">{total}</span> enrollments</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none text-white"><ChevronLeft className="w-4 h-4" /></button>
                <span className="px-3 py-1 font-semibold text-white/70">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none text-white"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      <StudentDetailDrawer studentId={selectedStudentId} onClose={() => setSelectedStudentId(null)} onSuspend={(student) => { setSelectedStudentId(null); handleSuspend(student); }} onRestore={(student) => { setSelectedStudentId(null); handleRestore(student); }} />
      <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal((prev: any) => ({ ...prev, isOpen: false }))} onConfirm={confirmModal.onConfirm} title={confirmModal.title} description={confirmModal.description} confirmText={confirmModal.confirmText} variant={confirmModal.variant} requireReason={confirmModal.requireReason} />
    </div>
  );
}
