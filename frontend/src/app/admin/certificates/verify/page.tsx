'use client';

import React, { useState } from 'react';
import {
  ScanLine,
  Search,
  CheckCircle2,
  XCircle,
  Hash,
  User,
  BookOpen,
  Calendar,
  BadgeCheck,
  ArrowLeft,
  Shield,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

// ─── Mock verify function ─────────────────────────────────────────────────
const MOCK_VALID_IDS: Record<string, {
  studentName: string; courseName: string; cohort: string;
  issuedAt: string; grade: string; email: string;
}> = {
  'DA-2024-7F3A2C1B': {
    studentName: 'Rahul Sharma', courseName: 'Web Dev Internship',
    cohort: 'Cohort 3', issuedAt: '2024-09-01T10:00:00Z',
    grade: 'Distinction', email: 'rahul@gmail.com',
  },
  'DA-2024-8B4D5E2A': {
    studentName: 'Priya Mehta', courseName: 'Python Internship',
    cohort: 'Cohort 3', issuedAt: '2024-09-05T12:00:00Z',
    grade: 'Merit', email: 'priya@gmail.com',
  },
};

type VerifyState = 'idle' | 'loading' | 'valid' | 'invalid';

export default function AdminCertificateVerifyPage() {
  const [certId, setCertId] = useState('');
  const [state, setState] = useState<VerifyState>('idle');
  const [result, setResult] = useState<typeof MOCK_VALID_IDS[string] | null>(null);

  const handleVerify = async () => {
    if (!certId.trim()) return;
    setState('loading');
    await new Promise((r) => setTimeout(r, 1000)); // simulate API
    const found = MOCK_VALID_IDS[certId.trim().toUpperCase()];
    if (found) {
      setResult(found);
      setState('valid');
    } else {
      setResult(null);
      setState('invalid');
    }
  };

  const handleReset = () => {
    setCertId('');
    setState('idle');
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/certificates" className="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/80 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Certificates
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/12 border border-violet-500/20">
            <ScanLine className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Verify Certificate</h1>
            <p className="text-xs text-white/35 mt-0.5">Enter a DevAscent Certificate ID to verify its authenticity</p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
        <label className="text-[10px] font-black uppercase tracking-wider text-white/40 block mb-2">
          Certificate ID
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              value={certId}
              onChange={(e) => { setCertId(e.target.value); setState('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. DA-2024-7F3A2C1B"
              className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.10] rounded-xl text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={!certId.trim() || state === 'loading'}
            className="px-5 py-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-sm font-black text-violet-300 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {state === 'loading' ? 'Checking…' : 'Verify'}
          </button>
        </div>
        <p className="text-[10px] text-white/25 mt-2 flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          Certificate IDs follow the format: DA-YYYY-XXXXXXXX (SHA-256 fingerprint)
        </p>
      </div>

      {/* Result: Valid */}
      {state === 'valid' && result && (
        <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-300">✓ Authentic Certificate</p>
              <p className="text-[10px] text-emerald-400/60">This certificate was issued by DevAscent Academy</p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
            {[
              { icon: User, label: 'Issued To', value: result.studentName },
              { icon: BookOpen, label: 'Course', value: result.courseName },
              { icon: BadgeCheck, label: 'Cohort', value: result.cohort },
              { icon: Calendar, label: 'Issued On', value: new Date(result.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-white/30 shrink-0" />
                <span className="text-[10px] text-white/40 w-16 shrink-0">{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-4 h-4 text-white/30 shrink-0" />
              <span className="text-[10px] text-white/40 w-16 shrink-0">Grade</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                result.grade === 'Distinction' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
                result.grade === 'Merit' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' :
                'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
              }`}>
                {result.grade}
              </span>
            </div>
          </div>

          <button onClick={handleReset} className="mt-4 text-[11px] text-emerald-400/60 hover:text-emerald-300 transition-colors flex items-center gap-1">
            <Search className="w-3 h-3" /> Verify another
          </button>
        </div>
      )}

      {/* Result: Invalid */}
      {state === 'invalid' && (
        <div className="bg-rose-500/8 border border-rose-500/20 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border-2 border-rose-500/25 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-300">✗ Certificate Not Found</p>
              <p className="text-[10px] text-rose-400/60">No record found for ID: <span className="font-mono">{certId}</span></p>
            </div>
          </div>
          <p className="text-xs text-white/40 mb-4">
            This certificate ID does not exist in our system. It may be invalid, revoked, or entered incorrectly. Double-check the ID and try again.
          </p>
          <button onClick={handleReset} className="text-[11px] text-rose-400/60 hover:text-rose-300 transition-colors flex items-center gap-1">
            <Search className="w-3 h-3" /> Try a different ID
          </button>
        </div>
      )}

      {/* Info section */}
      {state === 'idle' && (
        <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-3">How Verification Works</p>
          <div className="space-y-3">
            {[
              { step: '01', text: 'Each certificate has a unique SHA-256 derived ID assigned at issuance.' },
              { step: '02', text: 'The ID is printed on the certificate PDF and emailed to the student.' },
              { step: '03', text: 'Enter the ID above to instantly verify the certificate\'s authenticity.' },
              { step: '04', text: 'Results show the student name, course, cohort, and grade — no login needed for public verification.' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="text-[10px] font-black text-violet-400/60 w-6 shrink-0">{step}</span>
                <p className="text-[11px] text-white/40">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
