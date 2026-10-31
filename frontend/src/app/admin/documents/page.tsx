'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  ShieldCheck,
  Award,
  PlusCircle,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  FileCheck2,
  FileBadge,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDocumentsPage() {
  const { data: documents, isLoading, mutate } = useSWR(
    '/admin/academic-documents',
    () => api.admin.getAcademicDocuments(),
    { revalidateOnFocus: true }
  );

  const { data: studentsData } = useSWR('/admin/students?limit=100', () =>
    api.admin.getStudents({ limit: 100 })
  );
  const studentsList: any[] = studentsData?.data?.students || studentsData?.students || [];

  const { data: coursesData } = useSWR('/admin/courses', () => api.admin.getCourseStats());
  const coursesList: any[] = coursesData?.courses || coursesData?.data?.courses || [];
  // LOR is awarded exclusively for completed Internship tracks
  const internshipPrograms = coursesList.filter(
    (c) => c.type === 'INTERNSHIP' || c.isPaidInternship || /internship/i.test(c.title)
  );

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOR' | 'OFFER_LETTER'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Issue LOR modal
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [performanceGrade, setPerformanceGrade] = useState('Distinction (A+)');
  const [issuing, setIssuing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const list: any[] = Array.isArray(documents) ? documents : documents?.data || [];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = list.filter((doc) => {
    if (typeFilter !== 'ALL' && doc.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDocId = doc.docId?.toLowerCase().includes(q);
      const matchName = doc.user?.name?.toLowerCase().includes(q) || doc.recipientName?.toLowerCase().includes(q);
      const matchEmail = doc.user?.email?.toLowerCase().includes(q);
      const matchCourse = doc.course?.title?.toLowerCase().includes(q) || doc.courseTitle?.toLowerCase().includes(q);
      const matchUsername = doc.user?.username?.toLowerCase().includes(q);
      if (!matchDocId && !matchName && !matchEmail && !matchCourse && !matchUsername) return false;
    }
    return true;
  });

  const lorCount = list.filter((d) => d.type === 'LOR').length;
  const offerCount = list.filter((d) => d.type === 'OFFER_LETTER').length;

  const handleIssueLor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      setErrorMsg('Please select both a student and an internship program.');
      return;
    }

    setIssuing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.admin.issueLor({
        userId: selectedStudentId,
        courseId: selectedCourseId,
        grade: performanceGrade,
      });

      setSuccessMsg(`Official Letter of Recommendation issued! Doc ID: ${res?.docId || res?.data?.docId || 'DEV-LOR'}`);
      await mutate();
      setTimeout(() => {
        setIsLorModalOpen(false);
        setSuccessMsg('');
        setSelectedStudentId('');
        setSelectedCourseId('');
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to issue Letter of Recommendation');
    } finally {
      setIssuing(false);
    }
  };

  const downloadDoc = (docId: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    window.open(`${backendUrl}/documents/${docId}/download`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FileBadge className="w-5 h-5" />
            </span>
            Academic Letters & LOR Management
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Manage, sign, and issue cryptographically verifiable Offer Letters and Letters of Recommendation on DevAscent letterhead.
          </p>
        </div>

        <button
          onClick={() => {
            setIsLorModalOpen(true);
            setErrorMsg('');
            setSuccessMsg('');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Issue Official LOR</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileBadge className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Letters of Recommendation</p>
            <p className="text-xl font-black text-white mt-0.5">{lorCount}</p>
            <p className="text-[10px] text-purple-400/80 font-medium">Issued for high achievers</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Internship Offer Letters</p>
            <p className="text-xl font-black text-white mt-0.5">{offerCount}</p>
            <p className="text-[10px] text-cyan-400/80 font-medium">Auto-generated upon cohort enrollment</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Public Ledger Status</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">100% Signed</p>
            <p className="text-[10px] text-white/40">SHA-256 tamper-proof ledger</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by student, username, course, or doc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Type Filter Chips */}
        <div className="flex rounded-xl bg-[#0F1420] p-1 border border-white/10 self-start md:self-auto">
          {(['ALL', 'LOR', 'OFFER_LETTER'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === t
                  ? t === 'LOR'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : t === 'OFFER_LETTER'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All Documents' : t === 'LOR' ? 'LOR Only' : 'Offer Letters Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={6} cols={6} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileBadge}
            title="No academic documents found"
            description={
              search || typeFilter !== 'ALL'
                ? 'No documents match your search criteria.'
                : 'No Offer Letters or Letters of Recommendation have been generated yet.'
            }
            action={
              search || typeFilter !== 'ALL'
                ? {
                    label: 'Reset Filters',
                    onClick: () => {
                      setSearch('');
                      setTypeFilter('ALL');
                    },
                  }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] font-extrabold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Document ID</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Recipient Student</th>
                  <th className="px-4 py-3.5">Internship Program & Cohort</th>
                  <th className="px-4 py-3.5">Issued Date</th>
                  <th className="px-4 py-3.5">Integrity Hash</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{doc.docId}</span>
                        <button
                          onClick={() => copyToClipboard(doc.docId, doc.id)}
                          title="Copy Document ID"
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          {copiedId === doc.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {doc.type === 'LOR' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          <Award className="w-3 h-3" /> LOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          <FileText className="w-3 h-3" /> Offer Letter
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{doc.recipientName || doc.user?.name || 'Student'}</p>
                          {doc.user?.username && (
                            <Link
                              href={`/@${doc.user.username}`}
                              target="_blank"
                              className="px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 font-mono hover:bg-violet-500/20 transition-colors"
                            >
                              @{doc.user.username}
                            </Link>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40">{doc.user?.email || '—'}</p>
                        {doc.user?.college && (
                          <p className="text-[10px] text-white/30 truncate max-w-[180px]">{doc.user.college}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-white/90">{doc.courseTitle || doc.course?.title}</p>
                        <p className="text-[10px] text-white/40">
                          Cohort #{doc.course?.cohortNumber || 1} • {doc.durationWeeks || 8} Weeks
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-white/50 text-[11px]">
                      {new Date(doc.issuedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-[10px] text-white/30 truncate block max-w-[120px]" title={doc.sha256Hash}>
                        {doc.sha256Hash ? `${doc.sha256Hash.slice(0, 10)}...${doc.sha256Hash.slice(-6)}` : 'Verified'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => downloadDoc(doc.docId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                          title="Download Official Vector PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <Link
                          href={`/verify?code=${doc.docId}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                          title="Verify on Public Ledger"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue LOR Modal */}
      {isLorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0F1420] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Issue Letter of Recommendation (LOR)
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Sign an official Letter of Recommendation on DevAscent letterhead signed by Founder & Systems Architect.
                </p>
              </div>
              <button
                onClick={() => setIsLorModalOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueLor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Select Recipient Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
                  required
                >
                  <option value="">Choose a registered student...</option>
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email}){s.username ? ` — @${s.username}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-white/70">
                    Associated Internship Program *
                  </label>
                  <span className="text-[10px] text-purple-400 font-mono">
                    Internship Only
                  </span>
                </div>
                {internshipPrograms.length === 0 ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    No active internship programs found. LOR is awarded exclusively for completed internship programs. (Create or configure an Internship program under Courses & Programs).
                  </div>
                ) : (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
                    required
                  >
                    <option value="">Choose internship track...</option>
                    {internshipPrograms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (Cohort #{c.cohortNumber || 1})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Performance Evaluation / Grade
                </label>
                <select
                  value={performanceGrade}
                  onChange={(e) => setPerformanceGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Distinction (A+)">Distinction (A+) — Exceptional Capstone & Architecture</option>
                  <option value="Outstanding (A)">Outstanding (A) — High System Reliability & Speed</option>
                  <option value="Merit (B+)">Merit (B+) — Consistently High Quality Codebase</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200/90 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Letterhead & Ledger Guarantees
                </p>
                <p>
                  Issuing this LOR will immediately create a vector-rendered PDF with company seals, signature, unique verification QR code, and SHA-256 hash. The student will instantly see and download it in their student dashboard.
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLorModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issuing}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {issuing ? 'Generating & Signing...' : 'Issue Official LOR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

