'use client';

import React, { useState } from 'react';
import {
  BadgeCheck,
  Search,
  Download,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ScanLine,
  Copy,
  Sparkles,
  User,
  BookOpen,
  Calendar,
  Hash,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Certificate {
  id: string;
  certId: string;       // SHA-based verifiable ID
  studentName: string;
  studentEmail: string;
  courseName: string;
  cohort: string;
  issuedAt: string | null;
  status: 'ISSUED' | 'PENDING' | 'REVOKED';
  grade: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────
const MOCK_CERTS: Certificate[] = [
  { id: 'c1', certId: 'DA-2024-7F3A2C1B', studentName: 'Rahul Sharma',   studentEmail: 'rahul@gmail.com', courseName: 'Web Dev Internship', cohort: 'Cohort 3', issuedAt: '2024-09-01T10:00:00Z', status: 'ISSUED',  grade: 'Distinction' },
  { id: 'c2', certId: 'DA-2024-8B4D5E2A', studentName: 'Priya Mehta',    studentEmail: 'priya@gmail.com', courseName: 'Python Internship',  cohort: 'Cohort 3', issuedAt: '2024-09-05T12:00:00Z', status: 'ISSUED',  grade: 'Merit' },
  { id: 'c3', certId: '',                 studentName: 'Karan Joshi',     studentEmail: 'karan@gmail.com', courseName: 'Web Dev Internship', cohort: 'Cohort 4', issuedAt: null,                   status: 'PENDING', grade: '—' },
  { id: 'c4', certId: '',                 studentName: 'Divya Rao',       studentEmail: 'divya@gmail.com', courseName: 'Python Internship',  cohort: 'Cohort 4', issuedAt: null,                   status: 'PENDING', grade: '—' },
];

const STATUS_CONFIG = {
  ISSUED:  { label: 'Issued',  icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20' },
  PENDING: { label: 'Pending', icon: Clock,         color: 'text-amber-400',   bg: 'bg-amber-500/12 border-amber-500/20' },
  REVOKED: { label: 'Revoked', icon: XCircle,       color: 'text-rose-400',    bg: 'bg-rose-500/12 border-rose-500/20' },
};

// ─── Issue Modal ──────────────────────────────────────────────────────────
function IssueModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const [grade, setGrade] = useState('Merit');
  const [issuing, setIssuing] = useState(false);
  const [done, setDone] = useState(false);

  const handleIssue = async () => {
    setIssuing(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate API
    setIssuing(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <BadgeCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Issue Certificate</h2>
            <p className="text-[10px] text-white/40">This action is permanent and logged in audit trail</p>
          </div>
        </div>

        {!done ? (
          <>
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <InfoRow icon={User} label="Student" value={cert.studentName} />
                <InfoRow icon={BookOpen} label="Course" value={cert.courseName} />
                <InfoRow icon={Calendar} label="Cohort" value={cert.cohort} />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1.5">Grade / Honor</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.10] rounded-xl text-xs text-white focus:outline-none focus:border-violet-500/50 transition-all"
                >
                  <option>Distinction</option>
                  <option>Merit</option>
                  <option>Pass</option>
                </select>
              </div>

              <p className="text-[10px] text-white/30 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                A unique SHA-256 certificate ID will be auto-generated on issue.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white/60 hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleIssue}
                disabled={issuing}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-black text-emerald-300 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {issuing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
                    Issuing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Issue Certificate
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <p className="text-sm font-black text-white mb-1">Certificate Issued!</p>
            <p className="text-[11px] text-white/40 mb-2">A verification link has been emailed to the student.</p>
            <p className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-3 py-1.5 rounded-lg border border-violet-500/20">
              DA-2024-{Math.random().toString(16).slice(2, 10).toUpperCase()}
            </p>
            <button onClick={onClose} className="mt-5 w-full px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-bold text-white/60 hover:text-white transition-all">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-3.5 h-3.5 text-white/30 shrink-0" />
      <span className="text-[10px] text-white/40 w-14 shrink-0">{label}</span>
      <span className="text-[11px] font-semibold text-white">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function AdminCertificatesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [issuingCert, setIssuingCert] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState<string>('');

  const filtered = MOCK_CERTS.filter((c) => {
    const matchSearch =
      !search ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.certId.toLowerCase().includes(search.toLowerCase()) ||
      c.studentEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const issued = MOCK_CERTS.filter((c) => c.status === 'ISSUED').length;
  const pending = MOCK_CERTS.filter((c) => c.status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/12 border border-violet-500/20">
              <BadgeCheck className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Certificate Manager</h1>
          </div>
          <p className="text-xs text-white/35 mt-1 ml-11">Issue and manage SHA-256 verifiable certificates</p>
        </div>
        <Link
          href="/admin/certificates/verify"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 text-violet-300 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <ScanLine className="w-3.5 h-3.5" />
          Verify a Certificate
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Issued', value: issued, color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20', icon: CheckCircle2 },
          { label: 'Pending Approval', value: pending, color: 'text-amber-400', bg: 'bg-amber-500/12 border-amber-500/20', icon: Clock },
          { label: 'Total', value: MOCK_CERTS.length, color: 'text-violet-400', bg: 'bg-violet-500/12 border-violet-500/20', icon: BadgeCheck },
        ].map((k) => (
          <div key={k.label} className={`bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`p-2.5 rounded-xl border ${k.bg}`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">{k.label}</p>
              <p className="text-2xl font-black text-white">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, cert ID…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white/70 focus:outline-none focus:border-violet-500/50 cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="ISSUED">Issued</option>
          <option value="PENDING">Pending</option>
          <option value="REVOKED">Revoked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Student', 'Course / Cohort', 'Grade', 'Certificate ID', 'Issued On', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-white/30">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert) => {
                const cfg = STATUS_CONFIG[cert.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={cert.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-bold text-white">{cert.studentName}</p>
                      <p className="text-[10px] text-white/40">{cert.studentEmail}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-white/80">{cert.courseName}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20">
                        {cert.cohort}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        cert.grade === 'Distinction' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
                        cert.grade === 'Merit' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' :
                        cert.grade === 'Pass' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' :
                        'bg-white/[0.05] text-white/30 border border-white/[0.08]'
                      }`}>
                        {cert.grade}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      {cert.certId ? (
                        <button
                          onClick={() => copyId(cert.certId)}
                          className="flex items-center gap-1.5 font-mono text-[10px] text-violet-300 hover:text-violet-200 transition-colors group"
                        >
                          <span>{cert.certId}</span>
                          <Copy className="w-3 h-3 text-white/20 group-hover:text-violet-400 transition-colors" />
                          {copied === cert.certId && (
                            <span className="text-[9px] text-emerald-400">Copied!</span>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-white/25 italic">Not yet issued</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-[10px] text-white/50">
                        {cert.issuedAt
                          ? new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {cert.status === 'PENDING' && (
                          <button
                            onClick={() => setIssuingCert(cert)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 text-[10px] font-bold text-emerald-300 transition-all"
                          >
                            <Sparkles className="w-3 h-3" />
                            Issue
                          </button>
                        )}
                        {cert.status === 'ISSUED' && (
                          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] font-bold text-white/50 hover:text-white transition-all">
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Modal */}
      {issuingCert && <IssueModal cert={issuingCert} onClose={() => setIssuingCert(null)} />}
    </div>
  );
}
