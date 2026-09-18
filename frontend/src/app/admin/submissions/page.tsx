'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuthStore } from '../../../lib/store/authStore';
import { api } from '../../../lib/api';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Filter,
  Check,
  X,
  AlertCircle,
  Send,
  Sparkles,
  FolderGit2,
  Globe,
  Share2,
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reject modal state
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.getAllSubmissions(filterStatus === 'ALL' ? undefined : filterStatus);
      if (Array.isArray(res)) {
        setSubmissions(res);
      } else if (Array.isArray(res?.submissions)) {
        setSubmissions(res.submissions);
      } else {
        setSubmissions([]);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch submissions.' });
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  const handleApprove = async (submissionId: string) => {
    setActionLoading(submissionId);
    setNotification(null);
    try {
      const res = await api.approveSubmission(submissionId, 'Capstone meets strict industry standards. Certificate and public ledger hash generated.');
      setNotification({
        type: 'success',
        message: `✅ Approved! Certificate ${res?.certificate?.certId || ''} generated and emailed to student!`,
      });
      fetchSubmissions();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Approval failed.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalId || !rejectReason.trim()) return;
    setActionLoading(rejectModalId);
    setNotification(null);
    try {
      await api.rejectSubmission(rejectModalId, rejectReason.trim());
      setNotification({ type: 'success', message: 'Submission marked as rejected with feedback provided.' });
      setRejectModalId(null);
      setRejectReason('');
      fetchSubmissions();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Rejection failed.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instructor Review Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Student Capstone Project Submissions
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                Review graduation repositories, inspect LinkedIn posts, and issue official tamper-proof certificates.
              </p>
            </div>

            <div className="text-xs text-indigo-300 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
              <span>Lead Reviewer: <strong>Shivan Mishra</strong></span>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <span>{notification.message}</span>
              <button onClick={() => setNotification(null)} className="font-bold hover:opacity-75">✕</button>
            </div>
          )}

          {/* Filters & Count */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Filter by Status:</span>
              <div className="flex gap-1.5 ml-2">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      filterStatus === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing <strong>{submissions.length}</strong> total submissions
            </span>
          </div>

          {/* Submissions Table / Cards */}
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Submissions in this Queue</h3>
              <p className="text-xs text-slate-500">When students reach 100% progress and submit their form, they appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-indigo-200 transition-colors"
                >
                  {/* Student & Project Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        sub.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">• {sub.batch}</span>
                      <span className="text-xs font-semibold text-indigo-600">• {sub.course?.title}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{sub.projectName}</h3>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span><strong>Student:</strong> {sub.name} ({sub.email})</span>
                      {sub.user?.phone && <span><strong>Phone:</strong> {sub.user.phone}</span>}
                      {sub.user?.degree && <span><strong>Degree:</strong> {sub.user.degree}</span>}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={sub.gitRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-mono font-medium transition-colors"
                      >
                        <FolderGit2 className="w-3.5 h-3.5 text-indigo-300" />
                        <span>View GitHub Repo ↗</span>
                      </a>

                      <a
                        href={sub.linkedinPostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-medium transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Inspect LinkedIn Post ↗</span>
                      </a>
                    </div>

                    {sub.adminNote && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                        <strong>Instructor Note:</strong> {sub.adminNote}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center justify-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 shrink-0">
                    {sub.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(sub.id)}
                          disabled={actionLoading === sub.id}
                          className="w-full sm:w-44 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>{actionLoading === sub.id ? 'Issuing...' : 'Approve & Issue Cert'}</span>
                        </button>

                        <button
                          onClick={() => setRejectModalId(sub.id)}
                          disabled={actionLoading === sub.id}
                          className="w-full sm:w-44 py-2 px-4 border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Request Changes / Reject</span>
                        </button>
                      </>
                    )}

                    {sub.status === 'APPROVED' && (
                      <div className="text-center sm:text-right space-y-1">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Certificate Issued</span>
                        </span>
                        <p className="text-[11px] text-slate-400">PDF emailed to student</p>
                      </div>
                    )}

                    {sub.status === 'REJECTED' && (
                      <button
                        onClick={() => handleApprove(sub.id)}
                        disabled={actionLoading === sub.id}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                      >
                        Re-evaluate & Approve
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Provide Feedback for Student</h3>
            <p className="text-xs text-slate-500">
              Explain why this submission requires revisions (e.g., repository is private, missing README, broken deployment, etc.).
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please make the GitHub repository public and include architecture diagrams in README.md."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === rejectModalId}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-50"
              >
                Submit Feedback & Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
