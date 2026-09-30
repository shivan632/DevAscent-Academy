'use client';

import React, { useState } from 'react';
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
  BadgeCheck,
  PlusCircle,
  Save,
  Check,
  Loader2,
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
  const { data: resData, isLoading, error, mutate } = useSWR(
    studentId ? `/admin/students/${studentId}` : null,
    () => api.admin.getStudentDetail(studentId!),
    { revalidateOnFocus: false }
  );

  const student = resData?.data || resData;

  const { data: coursesData } = useSWR('/admin/courses', () => api.admin.getCourseStats());
  const allCourses: any[] = coursesData?.courses || coursesData?.data?.courses || [];

  const [noteText, setNoteText] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const [selectedCourseToEnroll, setSelectedCourseToEnroll] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const currentNote = noteText !== null ? noteText : student?.adminNote || '';

  const handleSaveNote = async () => {
    if (!studentId) return;
    setSavingNote(true);
    try {
      await api.admin.updateStudentNote(studentId, currentNote);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
      await mutate();
    } catch (e: any) {
      alert(e.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!studentId) return;
    setVerifyingEmail(true);
    try {
      await api.admin.verifyStudentEmail(studentId);
      await mutate();
    } catch (e: any) {
      alert(e.message || 'Failed to verify email');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleEnrollCourse = async () => {
    if (!studentId || !selectedCourseToEnroll) return;
    setEnrolling(true);
    try {
      await api.admin.enrollStudentManual(studentId, selectedCourseToEnroll);
      setSelectedCourseToEnroll('');
      await mutate();
    } catch (e: any) {
      alert(e.message || 'Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
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
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
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
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border ${
                        student.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {student.status || 'ACTIVE'}
                    </span>
                    {student.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <BadgeCheck className="w-3 h-3" /> Email Verified
                      </span>
                    ) : (
                      <button
                        onClick={handleVerifyEmail}
                        disabled={verifyingEmail}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        {verifyingEmail ? 'Verifying…' : '⚠ Verify Email Now'}
                      </button>
                    )}
                  </div>
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
                    <span className="truncate">College: {student.collegeName || student.college || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Admin Note Section */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-white/50">
                    Internal Admin Notes
                  </h4>
                  <button
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold transition-all"
                  >
                    {savingNote ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : noteSaved ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    <span>{savingNote ? 'Saving…' : noteSaved ? 'Saved' : 'Save Note'}</span>
                  </button>
                </div>
                <textarea
                  value={currentNote}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add internal notes about this student's progress, phone calls, or cohort changes…"
                  rows={3}
                  className="w-full p-2.5 bg-black/20 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>

              {/* Manual Course Enrollment */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-white/50">
                  Manual Course Enrollment
                </h4>
                <div className="flex gap-2">
                  <select
                    value={selectedCourseToEnroll}
                    onChange={(e) => setSelectedCourseToEnroll(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#0B0F1A] border border-white/10 rounded-xl text-xs text-white/80 focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="">Select a course to enroll…</option>
                    {allCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleEnrollCourse}
                    disabled={!selectedCourseToEnroll || enrolling}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {enrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    <span>Enroll</span>
                  </button>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-white/50">
                    Enrolled Courses ({student.enrollments?.length || 0})
                  </h4>
                  <span className="text-[11px] text-indigo-400 font-semibold">
                    ₹{((student.payments || []).filter((p: any) => p.status === 'PAID').reduce((s: number, p: any) => s + p.amountInPaise, 0) / 100).toLocaleString('en-IN')} Spent
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
                            {new Date(enr.enrolledAt || enr.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        {enr.progressPct === 100 ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            <Award className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-white/40 font-medium">In Progress</span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/40">
                          <span>Completion</span>
                          <span className="font-bold text-white/70">{enr.progressPct || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                            style={{ width: `${enr.progressPct || 0}%` }}
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
                              ₹{((pay.amountInPaise || 0) / 100).toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] text-white/40 font-mono">
                              {pay.razorpayPaymentId || pay.razorpayOrderId || pay.id.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${
                              pay.status === 'PAID'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-amber-500/15 text-amber-400'
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
