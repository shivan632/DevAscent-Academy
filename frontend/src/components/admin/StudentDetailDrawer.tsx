'use client';

import React from 'react';
import useSWR from 'swr';
import { api } from '../../lib/api';
import {
  X,
  Mail,
  Calendar,
  GraduationCap,
  Building,
  CreditCard,
  BookOpen,
  Award,
  UserX,
  UserCheck,
  Phone,
  ShieldAlert,
} from 'lucide-react';

interface StudentDetailDrawerProps {
  studentId: string | null;
  onClose: () => void;
  onSuspend: (student: any) => void;
  onRestore: (student: any) => void;
}

export function StudentDetailDrawer({
  studentId,
  onClose,
  onSuspend,
  onRestore,
}: StudentDetailDrawerProps) {
  const { data: student, isLoading, error } = useSWR(
    studentId ? `/admin/students/${studentId}` : null,
    () => api.admin.getStudentDetail(studentId!),
    { revalidateOnFocus: false }
  );

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md md:max-w-lg bg-[#0F1420] border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
              {student?.name ? student.name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Student Dossier</h2>
              <p className="text-[11px] text-white/40">ID: {studentId.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-white/40">Loading student details…</p>
            </div>
          ) : error || !student ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
              Failed to load student dossier.
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{student.name}</h3>
                    <p className="text-white/50 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-white/30" />
                      {student.email}
                    </p>
                    {student.phone && (
                      <p className="text-white/50 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-white/30" />
                        {student.phone}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border ${
                      student.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-white/60">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Degree: {student.degree || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Grad: {student.graduationYear || '—'}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">College: {student.collegeName || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-white/50">
                    Enrolled Courses ({student.enrollments?.length || 0})
                  </h4>
                  <span className="text-[11px] text-indigo-400 font-semibold">
                    ₹{(student.totalSpentRupees || 0).toLocaleString('en-IN')} Spent
                  </span>
                </div>

                {student.enrollments?.length === 0 ? (
                  <p className="text-white/30 italic">No courses enrolled yet.</p>
                ) : (
                  student.enrollments?.map((enr: any) => (
                    <div
                      key={enr.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white">{enr.course?.title || 'Course'}</p>
                          <p className="text-[10px] text-white/40">
                            Enrolled on{' '}
                            {new Date(enr.enrolledAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        {enr.certificateIssued ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            <Award className="w-3 h-3" /> Certified
                          </span>
                        ) : (
                          <span className="text-[10px] text-white/40 font-medium">In Progress</span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/40">
                          <span>Completion</span>
                          <span className="font-bold text-white/70">{enr.progressPercent || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                            style={{ width: `${enr.progressPercent || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment History */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-white/50">
                  Payment History ({student.payments?.length || 0})
                </h4>

                {student.payments?.length === 0 ? (
                  <p className="text-white/30 italic">No payment transactions recorded.</p>
                ) : (
                  <div className="space-y-1.5">
                    {student.payments?.map((pay: any) => (
                      <div
                        key={pay.id}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              ₹{(pay.amountInPaise / 100).toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] text-white/40">{pay.orderId || pay.id.slice(-8)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${
                              pay.status === 'PAID'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-rose-500/15 text-rose-400'
                            }`}
                          >
                            {pay.status}
                          </span>
                          <p className="text-[10px] text-white/30 mt-0.5">
                            {new Date(pay.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {student && (
          <div className="p-4 border-t border-white/5 bg-[#0B0F1A] flex items-center justify-end gap-3">
            {student.status === 'ACTIVE' ? (
              <button
                onClick={() => onSuspend(student)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-xl transition-all"
              >
                <UserX className="w-4 h-4" />
                <span>Suspend Account</span>
              </button>
            ) : (
              <button
                onClick={() => onRestore(student)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Restore Account</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
