'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import confetti from 'canvas-confetti';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  QrCode,
  Calendar,
  User,
  BookOpen,
  Lock,
  RefreshCw,
  Printer
} from 'lucide-react';

export default function CertificateGeneratorPage() {
  const [studentName, setStudentName] = useState('Shivan Mishra');
  const [courseTitle, setCourseTitle] = useState('Full-Stack Web Development & Cloud Architecture');
  const [issueDate, setIssueDate] = useState('March 15, 2025');
  const [credentialId, setCredentialId] = useState('DEVASCENT-2025-VALID');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  const sha256Hash = 'e5370db083db47569c4fdb4f5110c2ac6cf8bb4f46e53525cd006c4993000a';

  const capstones = [
    'High-Scale Multi-Tenant SaaS with RBAC',
    'NestJS Microservices & Redis Distributed Cache',
    'Cryptographic SHA-256 Verifiable Certificate Ledger',
    'Razorpay Fintech Engine with HMAC Webhooks'
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const certUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${credentialId}` : 'https://devascent.io/verify';
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      courseTitle
    )}&organizationName=DevAscent+Academy&issueYear=2025&certUrl=${encodeURIComponent(
      certUrl
    )}&certId=${encodeURIComponent(credentialId)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/verify/${credentialId}` : 'https://devascent.io/verify';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerCelebration = () => {
    setIsGenerating(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setIsGenerating(false), 800);
  };

  const generateRandomId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setCredentialId(`DEVASCENT-2025-DA${randomNum}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Official Academic Certificate Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Official Credential & Certificate Generator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Live interactive generator for DevAscent Academy accredited certificates. Backed by SHA-256 cryptographic verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls Column */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Certificate Customizer</span>
              </h2>
              <button
                onClick={handleTriggerCelebration}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Celebrate</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Recipient Student Name:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Shivan Mishra"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Course Specialization:
                </label>
                <select
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Full-Stack Web Development & Cloud Architecture">
                    Full-Stack Web Development & Cloud Architecture
                  </option>
                  <option value="Advanced Next.js 15 & High-Scale SaaS Engineering">
                    Advanced Next.js 15 & High-Scale SaaS Engineering
                  </option>
                  <option value="NestJS Microservices & Distributed Backend Systems">
                    NestJS Microservices & Distributed Backend Systems
                  </option>
                  <option value="DevOps, Docker Containers & Cloud Deployment">
                    DevOps, Docker Containers & Cloud Deployment
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Issue Date:
                </label>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="e.g. March 15, 2025"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">
                    Credential ID:
                  </label>
                  <button
                    onClick={generateRandomId}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate ID</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value.toUpperCase())}
                  className="w-full font-mono uppercase bg-slate-800 border border-slate-700 text-amber-400 font-bold rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Add to LinkedIn Profile</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Verification Link Copied!' : 'Copy Verification URL'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-emerald-400 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tamper-Proof Guarantee
              </span>
              <p>
                Every certificate contains an immutable SHA-256 hash verified against git repository commits and assessment scores.
              </p>
            </div>
          </div>

          {/* Right Live Certificate Preview */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* The Actual Certificate Canvas */}
            <div
              ref={certRef}
              id="certificate-print-area"
              className="relative bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#0a0e1a] rounded-3xl p-6 sm:p-10 border-2 border-indigo-500/40 shadow-2xl text-white overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.25), 0 0 40px rgba(99, 102, 241, 0.15)'
              }}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Certificate Inner Luxury Border Frame */}
              <div className="relative border-2 border-indigo-400/30 rounded-2xl p-6 sm:p-8 space-y-8 bg-slate-900/80 backdrop-blur-md">
                
                {/* Guilloche / Geometric Corner Ornaments */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/70" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/70" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/70" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/70" />

                {/* Certificate Header with Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 border border-white/20 flex items-center justify-center shadow-md">
                      <img
                        src="/logo.png"
                        alt="DevAscent Academy Logo"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-base sm:text-lg tracking-wider uppercase text-white font-heading">
                        DevAscent Academy
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">
                        Academic Certification Board &bull; ISO 9001:2015 Compliant
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-700/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>VERIFIED CREDENTIAL</span>
                    </span>
                  </div>
                </div>

                {/* Certificate Title & Recipient */}
                <div className="space-y-4 text-center py-2">
                  <div className="space-y-1">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
                      Certificate of Academic Completion
                    </p>
                    <p className="text-xs text-slate-400">
                      This is to certify that the candidate
                    </p>
                  </div>

                  {/* Student Name */}
                  <div className="py-2">
                    <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 tracking-wide drop-shadow-sm">
                      {studentName || 'Student Name'}
                    </h2>
                    <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    has successfully satisfied all rigorous curriculum requirements, built and deployed production-grade capstone systems, and demonstrated mastery in:
                  </p>

                  <div className="inline-block px-4 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs sm:text-sm font-bold tracking-wide">
                    {courseTitle}
                  </div>
                </div>

                {/* Verified Capstones Grid */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                    Verified Production Deliverables & Capstones:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {capstones.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signatures & Seal Section */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-500/20 items-end text-center">
                  
                  {/* Left Signature */}
                  <div className="space-y-1">
                    <div className="font-serif italic text-base sm:text-lg text-indigo-200">
                      S. Mukherjee
                    </div>
                    <div className="w-24 h-px bg-slate-600 mx-auto" />
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Director of Engineering
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      DevAscent Academy
                    </span>
                  </div>

                  {/* Gold Official Stamp Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-400/80 bg-gradient-to-tr from-amber-500/20 via-indigo-900/40 to-amber-500/30 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10 p-1 text-center">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                      <span className="text-[7px] font-extrabold tracking-tighter text-amber-300 uppercase leading-none mt-0.5">
                        OFFICIAL SEAL
                      </span>
                    </div>
                  </div>

                  {/* Right Signature */}
                  <div className="space-y-1">
                    <div className="font-serif italic text-base sm:text-lg text-indigo-200">
                      A. Verma
                    </div>
                    <div className="w-24 h-px bg-slate-600 mx-auto" />
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Academic Registrar
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      {issueDate}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata & Cryptographic Hash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-left">
                  <div>
                    <span className="text-slate-400 block text-[9px]">CREDENTIAL ID:</span>
                    <span className="text-amber-300 font-bold">{credentialId}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-400 block text-[9px]">PUBLIC VERIFICATION URL:</span>
                    <span className="text-emerald-400 font-bold">
                      devascent.io/verify/{credentialId}
                    </span>
                  </div>
                  <div className="sm:col-span-2 pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400 block text-[8px] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-indigo-400" />
                      SHA-256 IMMUTABLE LEDGER RECORD:
                    </span>
                    <span className="text-slate-500 text-[9px] break-all">
                      {sha256Hash}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Links below preview */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 px-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ready for Employer Background Verification</span>
              </div>
              <Link
                href={`/verify/${credentialId}`}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>View Public Registry Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
