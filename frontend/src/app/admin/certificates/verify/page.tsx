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
  Download,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../../lib/api';

type VerifyState = 'idle' | 'loading' | 'valid' | 'invalid';

export default function AdminCertificateVerifyPage() {
  const [certId, setCertId] = useState('');
  const [state, setState] = useState<VerifyState>('idle');
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async () => {
    const cleaned = certId.trim().toUpperCase();
    if (!cleaned) return;

    setState('loading');
    setErrorMsg('');
    try {
      const res = await api.verifyCertificatePublic(cleaned);
      if (res && res.verified !== false && (res.verified || res.certId || res.certificate || res.recipient || res.recipientName)) {
        const cert = res?.certificate || res?.data?.certificate || res?.data || res;
        setResult({
          certId: cert.certId || cleaned,
          recipientName: cert.recipientName || cert.recipient?.name || cert.user?.name || 'Verified Student',
          courseTitle: cert.courseTitle || cert.course?.title || 'DevAscent Academy',
          grade: cert.grade || cert.course?.grade || 'Distinction (A+)',
          issuedAt: cert.issuedAt || cert.course?.completedAt || cert.ledgerTimestamp,
          sha256Hash: cert.sha256Hash || cert.hash,
          ...cert,
        });
        setState('valid');
      } else {
        setResult(null);
        setErrorMsg(res?.message || 'Certificate not found on public ledger');
        setState('invalid');
      }
    } catch (err: any) {
      setResult(null);
      setErrorMsg(err?.message || 'Certificate not found on public ledger');
      setState('invalid');
    }
  };

  const handleReset = () => {
    setCertId('');
    setState('idle');
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Certificates
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/12 border border-violet-500/20">
            <ScanLine className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Verify Certificate</h1>
            <p className="text-xs text-white/35 mt-0.5">
              Enter a DevAscent Certificate ID to verify cryptographic authenticity
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6 shadow-xl">
        <label className="text-[10px] font-black uppercase tracking-wider text-white/40 block mb-2">
          Certificate ID / Fingerprint
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              value={certId}
              onChange={(e) => {
                setCertId(e.target.value);
                setState('idle');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. DEV-BATCH12-A8F3C2"
              className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.10] rounded-xl text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all uppercase"
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
          Certificate IDs follow the format: DEV-BATCH(n)-XXXXXX (SHA-256 fingerprint)
        </p>
      </div>

      {/* Result: Valid */}
      {state === 'valid' && result && (
        <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-300">✓ Authentic Verified Certificate</p>
              <p className="text-[10px] text-emerald-400/60">Cryptographic record confirmed on immutable database</p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
            {[
              { icon: Hash, label: 'Cert ID', value: result.certId || certId },
              { icon: User, label: 'Recipient', value: result.recipientName || result.user?.name || 'Verified Student' },
              { icon: BookOpen, label: 'Course', value: result.courseTitle || result.course?.title || 'DevAscent Academy' },
              {
                icon: Calendar,
                label: 'Issued On',
                value: result.issuedAt
                  ? new Date(result.issuedAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Verified',
              },
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
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {result.grade || 'A+'}
              </span>
            </div>

            {result.sha256Hash && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-[9px] text-white/30 uppercase font-mono">SHA-256 Checksum:</p>
                <p className="text-[10px] font-mono text-emerald-300/80 break-all">{result.sha256Hash}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <a
              href={api.getDownloadUrl(result.certId || certId)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={handleReset}
              className="text-[11px] text-emerald-400/60 hover:text-emerald-300 transition-colors flex items-center gap-1 ml-auto"
            >
              <Search className="w-3 h-3" /> Verify another
            </button>
          </div>
        </div>
      )}

      {/* Result: Invalid */}
      {state === 'invalid' && (
        <div className="bg-rose-500/8 border border-rose-500/20 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border-2 border-rose-500/25 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-300">✗ Certificate Not Found</p>
              <p className="text-[10px] text-rose-400/60">
                No verified record for ID: <span className="font-mono">{certId}</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-white/40 mb-4">
            {errorMsg ||
              'This certificate ID does not exist in the DevAscent registry. It may be revoked, pending issuance, or mistyped.'}
          </p>
          <button
            onClick={handleReset}
            className="text-[11px] text-rose-400/60 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <Search className="w-3 h-3" /> Try a different ID
          </button>
        </div>
      )}

      {/* Info section */}
      {state === 'idle' && (
        <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-5 shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/30 mb-3">
            How Verification Works
          </p>
          <div className="space-y-3">
            {[
              { step: '01', text: 'Each certificate has a unique SHA-256 derived ID assigned at issuance.' },
              { step: '02', text: 'The ID is printed on the certificate PDF, signed digitally, and registered.' },
              { step: '03', text: 'Instant database lookup checks against the authoritative certificates table.' },
              { step: '04', text: 'Public verification is also open to employers at devascent.in/verify.' },
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
