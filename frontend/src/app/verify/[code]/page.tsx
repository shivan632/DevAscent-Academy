'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { api } from '../../../lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  ExternalLink,
  Award,
  Search,
  Sparkles,
  Layers,
  Calendar,
  User,
  BookOpen,
  XCircle,
  QrCode,
} from 'lucide-react';

export default function CertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const codeParam = (params?.code as string) || '';

  const [searchCode, setSearchCode] = useState(codeParam);
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVerification = async (certId: string) => {
    if (!certId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.verifyCertificatePublic(certId.trim());
      if (res?.verified) {
        setCertData(res);
      } else {
        setCertData(null);
        setError(res?.message || 'No record matches this Certificate ID in the public ledger.');
      }
    } catch (err: any) {
      setCertData(null);
      setError(err?.message || 'Verification lookup failed. Please check the Credential ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeParam) {
      fetchVerification(codeParam);
    }
  }, [codeParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      router.push(`/verify/${searchCode.trim()}`);
      fetchVerification(searchCode.trim());
    }
  };

  const handleShareLinkedIn = () => {
    if (!certData) return;
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      certData.course?.title || 'Certification'
    )}&organizationName=DevAscent+Academy&issueYear=2026&certUrl=${encodeURIComponent(
      window.location.href
    )}&certId=${encodeURIComponent(searchCode)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Search Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Public Verification Registry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Official Credential Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Verify the authenticity of digital certificates issued by DevAscent Academy. Backed by immutable SHA-256 cryptographic hashes.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Credential ID (e.g. DEV-2026-A1B2C3)"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify ID'}
            </button>
          </form>

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-3xl border-2 border-rose-200 p-8 shadow-md text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Credential Not Found / Unverified</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">{error}</p>
            </div>
          )}

          {/* Validated Certificate Showcase Card */}
          {certData && certData.verified && (
            <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl overflow-hidden">
              {/* Status Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                      STATUS: OFFICIALLY VERIFIED & AUTHENTIC
                    </span>
                    <h3 className="text-lg font-bold">Credential Confirmed by DevAscent Academy</h3>
                  </div>
                </div>

                <span className="font-mono text-xs bg-black/20 px-3 py-1.5 rounded-lg border border-white/20 self-start sm:self-center">
                  ID: {searchCode.toUpperCase()}
                </span>
              </div>

              {/* Credential Details */}
              <div className="p-6 sm:p-10 space-y-8">
                
                {/* Recipient Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 pb-8 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Issued To</span>
                    <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>{certData.recipient?.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">{certData.recipient?.degree} • {certData.recipient?.college}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Date of Issuance</span>
                    <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{new Date(certData.course?.completedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold block">Grade: {certData.course?.grade}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Course / Track</span>
                    <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span>{certData.course?.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">Instructor: {certData.instructor}</span>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Ledger Section */}
                <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>SHA-256 Immutable Cryptographic Fingerprint</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">PUBLIC IMMUTABLE LEDGER</span>
                  </div>
                  <div className="bg-black/40 p-3.5 rounded-xl border border-slate-800">
                    <code className="text-xs font-mono text-emerald-300 break-all select-all">
                      {certData.hash}
                    </code>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    This SHA-256 fingerprint was generated at the moment of graduation and permanently verifies that the recipient completed all assignments without tampering.
                  </p>
                </div>

                {/* Download and Share CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <a
                    href={api.getDownloadUrl(searchCode.toUpperCase())}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF with QR</span>
                  </a>

                  <button
                    onClick={handleShareLinkedIn}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Add to LinkedIn</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
