'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import {
  BadgeCheck,
  Search,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  ScanLine,
  Copy,
  Sparkles,
  User,
  BookOpen,
  Calendar,
  Hash,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

interface Certificate {
  id: string;
  certId: string;
  studentName?: string;
  studentEmail?: string;
  recipientName?: string;
  userId?: string;
  courseName?: string;
  courseTitle?: string;
  courseId?: string;
  issuedAt: string;
  grade: string;
  verifyUrl?: string;
}

// ─── Manual Issue Modal ───────────────────────────────────────────────────
function IssueCertificateModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [studentSearch, setStudentSearch] = useState('');
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [grade, setGrade] = useState('Distinction (A+)');
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState('');
  const [issuedResult, setIssuedResult] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch courses and all students on modal open
  useEffect(() => {
    if (!isOpen) return;
    const fetchInitialData = async () => {
      try {
        setLoadingCourses(true);
        setSearchingStudents(true);

        const [coursesRes, studentsRes] = await Promise.all([
          api.admin.getCourseStats().catch(() => api.getCourses()),
          api.admin.getStudents({ limit: 100 }).catch(() => ({ data: [] })),
        ]);

        const courseList =
          coursesRes?.courses ||
          coursesRes?.data?.courses ||
          (Array.isArray(coursesRes?.data) ? coursesRes.data : []) ||
          (Array.isArray(coursesRes) ? coursesRes : []);

        const studentsPayload = studentsRes?.data || studentsRes;
        const studentList = Array.isArray(studentsPayload?.data)
          ? studentsPayload.data
          : Array.isArray(studentsPayload?.students)
          ? studentsPayload.students
          : Array.isArray(studentsPayload)
          ? studentsPayload
          : [];

        setCourses(Array.isArray(courseList) ? courseList : []);
        if (courseList.length > 0) {
          setSelectedCourseId(courseList[0].id);
        }

        setAllStudents(studentList);
        setStudents(studentList);

        // If only 1 student exists, pre-select them for convenience
        if (studentList.length === 1) {
          setSelectedStudent(studentList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch initial certificate data:', err);
      } finally {
        setLoadingCourses(false);
        setSearchingStudents(false);
      }
    };
    fetchInitialData();
  }, [isOpen]);

  // Dynamic filter for students
  useEffect(() => {
    if (selectedStudent) return;
    const q = studentSearch.trim().toLowerCase();
    if (!q) {
      setStudents(allStudents);
      return;
    }
    const filtered = allStudents.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
    );
    setStudents(filtered);
  }, [studentSearch, allStudents, selectedStudent]);

  if (!isOpen) return null;

  const handleIssue = async () => {
    setIssueError('');
    let studentToIssue = selectedStudent;

    // If user typed name without clicking dropdown, try matching
    if (!studentToIssue && studentSearch.trim()) {
      const q = studentSearch.trim().toLowerCase();
      const match = allStudents.find(
        (s) =>
          s.name?.toLowerCase() === q ||
          s.email?.toLowerCase() === q ||
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q)
      );
      if (match) {
        studentToIssue = match;
        setSelectedStudent(match);
      }
    }

    if (!studentToIssue) {
      setIssueError('Please select a student from the list.');
      return;
    }
    if (!selectedCourseId) {
      setIssueError('Please select a course.');
      return;
    }

    try {
      setIssuing(true);
      const res = await api.admin.issueCertificate({
        userId: studentToIssue.id,
        courseId: selectedCourseId,
        grade,
      });
      const certData = res?.certificate || res?.data?.certificate;
      setIssuedResult(certData);
      onSuccess();
    } catch (err: any) {
      setIssueError(err?.message || 'Failed to issue certificate.');
    } finally {
      setIssuing(false);
    }
  };

  const copyVerifyUrl = () => {
    if (!issuedResult?.verifyUrl) return;
    navigator.clipboard.writeText(issuedResult.verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/20">
              <GraduationCap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Issue Official Certificate</h2>
              <p className="text-[10px] text-white/40">Generates verifiable SHA-256 hash & emails student PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!issuedResult ? (
          <div className="space-y-4">
            {/* Student Search Picker */}
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">
                Select Student *
              </label>
              {selectedStudent ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <User className="w-4 h-4 text-violet-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{selectedStudent.name}</p>
                      <p className="text-[10px] text-white/40 truncate">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      setStudentSearch('');
                    }}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 ml-2 px-2 py-1 rounded bg-rose-500/10 cursor-pointer shrink-0"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by student name or email..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.09] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                  {searchingStudents && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400 animate-spin" />
                  )}

                  {/* Dropdown results */}
                  {students.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#161B22] border border-white/10 rounded-xl max-h-48 overflow-y-auto shadow-2xl z-30 divide-y divide-white/[0.04]">
                      {students.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudent(s);
                            setStudents([]);
                          }}
                          className="w-full text-left p-2.5 hover:bg-white/[0.04] transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{s.name}</p>
                            <p className="text-[10px] text-white/40">{s.email}</p>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50 border border-white/[0.08]">
                            {s.role || 'STUDENT'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Course Picker */}
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">
                Select Course *
              </label>
              {loadingCourses ? (
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/40 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                  Loading courses...
                </div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0D1117] text-white">
                      {c.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Grade Selector */}
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-1.5">
                Grade / Honor
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
              >
                <option value="Distinction (A+)" className="bg-[#0D1117] text-white">Distinction (A+)</option>
                <option value="Merit (A)" className="bg-[#0D1117] text-white">Merit (A)</option>
                <option value="Credit (B+)" className="bg-[#0D1117] text-white">Credit (B+)</option>
                <option value="Pass (B)" className="bg-[#0D1117] text-white">Pass (B)</option>
              </select>
            </div>

            {issueError && (
              <p className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {issueError}
              </p>
            )}

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white/60 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssue}
                disabled={issuing || (!selectedStudent && !studentSearch.trim()) || !selectedCourseId}
                className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 border border-violet-400/30 text-xs font-black text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-violet-600/20"
              >
                {issuing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Issuing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Issue Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Post-Issuance Success View */
          <div className="text-center py-3 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Certificate Ready & Issued!</h3>
              <p className="text-xs text-white/40 mt-1">
                Official PDF email dispatched to <span className="text-violet-300 font-semibold">{selectedStudent?.email}</span>.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Certificate ID:</span>
                <span className="font-mono font-bold text-violet-300">{issuedResult.certId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Recipient:</span>
                <span className="font-bold text-white">{issuedResult.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Course:</span>
                <span className="font-semibold text-white/90 truncate max-w-[200px]">{issuedResult.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Grade:</span>
                <span className="font-bold text-amber-300">{issuedResult.grade}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={copyVerifyUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-bold text-violet-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Verify URL'}</span>
              </button>

              <a
                href={api.getDownloadUrl(issuedResult.certId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-bold text-white/60 hover:text-white transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Certificates Page ───────────────────────────────────────────────
export default function AdminCertificatesPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState<string>('');

  const { data, isLoading, mutate } = useSWR(
    `/admin/certificates?search=${encodeURIComponent(search)}`,
    () => api.admin.getCertificates({ search })
  );

  const certificates: Certificate[] = data?.certificates || data?.data?.certificates || [];
  const totalCount = data?.total ?? certificates.length;

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/12 border border-violet-500/20">
              <BadgeCheck className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Certificate Maker & Registry</h1>
          </div>
          <p className="text-xs text-white/35 mt-1 ml-11">
            Issue tamper-proof, cryptographic SHA-256 verifiable credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/verify"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white text-xs font-bold transition-all"
          >
            <ScanLine className="w-3.5 h-3.5" />
            Public Verification Portal
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 border border-violet-400/30 text-white text-xs font-black transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Issue New Certificate
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl border bg-emerald-500/12 border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Total Issued</p>
            <p className="text-2xl font-black text-white">{totalCount}</p>
          </div>
        </div>

        <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl border bg-violet-500/12 border-violet-500/20">
            <Hash className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Security Mechanism</p>
            <p className="text-xs font-bold text-violet-300 mt-1">SHA-256 Public Ledger</p>
          </div>
        </div>

        <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl border bg-amber-500/12 border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Delivery Channel</p>
            <p className="text-xs font-bold text-amber-300 mt-1">SMTP Automated PDF</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or cert ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-white/40 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <p className="text-xs font-medium">Loading certificates registry...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-16 text-center text-white/40 space-y-3">
            <BadgeCheck className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-sm font-semibold text-white/60">No certificates found</p>
            <p className="text-xs text-white/30 max-w-sm mx-auto">
              Issue your first certificate by clicking the "Issue New Certificate" button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  {['Student', 'Course Name', 'Grade', 'Certificate ID', 'Issued Date', 'Verification', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-white/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-bold text-white">{cert.studentName || cert.recipientName}</p>
                      <p className="text-[10px] text-white/40">{cert.studentEmail || 'Registered Student'}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-white/90">{cert.courseName || cert.courseTitle}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/20">
                        {cert.grade || 'Distinction'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => copyId(cert.certId)}
                        className="flex items-center gap-1.5 font-mono text-[10px] text-violet-300 hover:text-violet-200 transition-colors group cursor-pointer"
                        title="Click to copy Certificate ID"
                      >
                        <span>{cert.certId}</span>
                        <Copy className="w-3 h-3 text-white/20 group-hover:text-violet-400 transition-colors" />
                        {copied === cert.certId && (
                          <span className="text-[9px] text-emerald-400 font-sans">Copied!</span>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-[10px] text-white/50">
                        {cert.issuedAt
                          ? new Date(cert.issuedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <Link
                        href={`/verify/${cert.certId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </td>

                    <td className="px-4 py-3.5">
                      <a
                        href={api.getDownloadUrl(cert.certId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] font-bold text-white/70 hover:text-white transition-all cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-emerald-400" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue Modal */}
      <IssueCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
