'use client';

import React from 'react';
import { ShieldCheck, Award, Lock, ExternalLink, QrCode } from 'lucide-react';

export interface MasterCertificateProps {
  studentName?: string;
  courseTitle?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  issueDate?: string;
  certId?: string;
  verifyUrl?: string;
  sha256Hash?: string;
  founderName?: string;
  founderRole?: string;
  theme?: 'ivory' | 'obsidian';
  showPrintControls?: boolean;
}

export default function MasterCertificate({
  studentName = 'Shivan Mishra',
  courseTitle = 'Full-Stack Cloud & AI Software Engineering',
  duration = '08 Weeks',
  startDate = '15 Jan 2026',
  endDate = '15 Mar 2026',
  issueDate = '16 Mar 2026',
  certId = 'DEV-CERT-2026-9482',
  verifyUrl,
  sha256Hash = 'e5370db083db47569c4fdb4f5110c2ac6cf8bb4f46e53525cd006c4993000a',
  founderName = 'Shivan Mishra',
  founderRole = 'Founder & Director',
  theme = 'ivory',
}: MasterCertificateProps) {
  const effectiveVerifyUrl =
    verifyUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/verify/${certId}`
      : `https://www.devascentacademy.me/verify/${certId}`);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=2&color=0f172a&bgcolor=ffffff&data=${encodeURIComponent(
    effectiveVerifyUrl
  )}`;

  const isDark = theme === 'obsidian';

  return (
    <div
      id="devascent-master-certificate"
      className={`relative w-full max-w-[1020px] aspect-[1.414/1] mx-auto p-6 sm:p-10 select-none overflow-hidden transition-colors shadow-2xl ${
        isDark
          ? 'bg-[#090D1A] text-slate-100 border-[10px] border-[#0F172A]'
          : 'bg-[#FFFDF9] text-slate-900 border-[10px] border-[#1E293B]'
      }`}
      style={{
        boxShadow: isDark
          ? '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(99, 102, 241, 0.2)'
          : '0 25px 60px -15px rgba(15, 23, 42, 0.35), 0 0 30px rgba(217, 119, 6, 0.15)',
      }}
    >
      {/* ─── 1. Luxury Gold Ornamental Corner Brackets ─── */}
      <div className="absolute top-2 left-2 w-16 h-16 border-t-[3px] border-l-[3px] border-[#D97706] pointer-events-none" />
      <div className="absolute top-2 right-2 w-16 h-16 border-t-[3px] border-r-[3px] border-[#D97706] pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-16 h-16 border-b-[3px] border-l-[3px] border-[#D97706] pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-16 h-16 border-b-[3px] border-r-[3px] border-[#D97706] pointer-events-none" />

      {/* Outer & Inner Frame Accent Lines */}
      <div
        className={`absolute inset-3 border pointer-events-none ${
          isDark ? 'border-[#334155]/60' : 'border-[#CBD5E1]'
        }`}
      />
      <div className="absolute inset-5 border-[1.5px] border-[#D97706]/70 pointer-events-none" />
      <div
        className={`absolute inset-7 border pointer-events-none ${
          isDark ? 'border-[#1E293B]' : 'border-[#E2E8F0]'
        }`}
      />

      {/* ─── 2. Guilloche Wave Watermark Background ─── */}
      <div
        className="absolute inset-8 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 10px 10px, #D97706 1.5px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient Radial Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 3. Header Row: Credential ID & DevAscent Brandmark ─── */}
      <div className="relative z-10 flex justify-between items-center px-4 pt-1 border-b pb-3 border-amber-600/20">
        <div className="text-left flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400">
            Certificate ID:{' '}
            <span className="font-bold text-amber-700 dark:text-amber-400">{certId}</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
            MSME: UDYAM-UP-03-0165933
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            SHA-256 Verified Ledger
          </span>
        </div>

        {/* Real Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo-bkd-removed.png"
              alt="DevAscent Academy Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-sans font-black text-sm sm:text-base tracking-tight leading-none text-slate-900 dark:text-white uppercase">
              DevAscent <span className="text-indigo-600 dark:text-indigo-400">Academy</span>
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              Internships &amp; Technical Board
            </span>
          </div>
        </div>
      </div>

      {/* ─── 4. Main Body: Certificate Titles & Citation ─── */}
      <div className="relative z-10 text-center mt-4 sm:mt-6 px-4">
        <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.35em] text-[#D97706] uppercase">
          Official Verifiable Credential
        </p>

        {/* Title */}
        <h1
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-black tracking-wide text-slate-900 dark:text-white mt-1 drop-shadow-sm"
          style={{ fontFamily: "'Cinzel', 'Times New Roman', Georgia, serif" }}
        >
          Certificate of Internship
        </h1>

        <p className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mt-0.5">
          & Technical Excellence
        </p>

        {/* Ornate Flourish Divider */}
        <div className="flex items-center justify-center gap-3 my-2 sm:my-3">
          <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent to-[#D97706]" />
          <span className="text-[#D97706] text-sm sm:text-base">❖</span>
          <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-l from-transparent to-[#D97706]" />
        </div>

        <p className="text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
          This is proudly presented to
        </p>

        {/* Recipient Student Name */}
        <div className="my-2 sm:my-3">
          <h2
            className="font-serif text-2xl sm:text-4xl md:text-[42px] font-extrabold italic tracking-tight text-slate-900 dark:text-amber-200"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {studentName}
          </h2>
          <div className="w-48 sm:w-80 h-[2px] bg-gradient-to-r from-transparent via-[#D97706] to-transparent mx-auto mt-1.5" />
        </div>

        {/* Citation Narrative */}
        <p className="max-w-2xl mx-auto text-xs sm:text-[13px] md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans mt-2">
          for successfully completing an intensive <strong className="text-slate-900 dark:text-white font-bold">{duration}</strong> Virtual Internship in{' '}
          <strong className="text-indigo-700 dark:text-indigo-400 font-bold">{courseTitle}</strong> at{' '}
          <strong className="text-slate-900 dark:text-white">DevAscent Academy</strong> from {startDate} to {endDate}.
        </p>
        <p className="max-w-2xl mx-auto text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">
          The candidate demonstrated exemplary technical competency in production architectures, distributed systems, and capstone repository delivery.
        </p>
      </div>

      {/* ─── 5. Bottom Authority & Trust Row (4-Pillar Official Layout) ─── */}
      <div className="relative z-10 mt-6 sm:mt-8 px-2 sm:px-6 flex flex-wrap items-end justify-between gap-3 border-t border-amber-600/20 pt-4 sm:pt-6">
        
        {/* Pillar 1: Scannable Cryptographic QR Code */}
        <div className="flex items-center gap-2.5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1 rounded-lg border-2 border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center shrink-0">
            <img
              src={qrSrc}
              alt="Scan to Verify"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="text-left font-sans">
            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase border border-emerald-500/30">
              Scan to Verify
            </span>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1">
              Live SHA-256 Ledger
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
              Tamper-Proof
            </p>
          </div>
        </div>

        {/* Pillar 2: 3D Golden Rosette Ribbon Seal */}
        <div className="flex flex-col items-center">
          <div className="relative w-15 h-15 sm:w-18 sm:h-18 flex items-center justify-center">
            {/* Ribbon Tails */}
            <div className="absolute -bottom-2.5 left-2 w-3.5 h-6 bg-gradient-to-b from-amber-600 to-amber-800 transform -rotate-12 rounded-b-sm shadow-md" />
            <div className="absolute -bottom-2.5 right-2 w-3.5 h-6 bg-gradient-to-b from-amber-600 to-amber-800 transform rotate-12 rounded-b-sm shadow-md" />

            {/* Circular Medallion */}
            <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-1 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-amber-900/40 bg-gradient-to-b from-amber-500 to-amber-700 flex flex-col items-center justify-center text-white text-center p-0.5">
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">
                  OFFICIAL
                </span>
                <span className="text-[10px] font-black leading-tight tracking-wider">
                  SEAL
                </span>
                <span className="text-[6.5px] font-semibold leading-none">
                  ACCREDITED
                </span>
              </div>
            </div>
          </div>
          <span className="text-[8px] sm:text-[9px] font-sans font-bold text-amber-700 dark:text-amber-400 mt-2 uppercase tracking-wider">
            Academic Seal
          </span>
        </div>

        {/* Pillar 3: Official Govt. of India Registered MSME Badge */}
        <div className="flex flex-col items-center font-sans">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 p-1 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-[12px] sm:text-[14px] font-black text-slate-900 dark:text-white tracking-widest leading-none">
              MSME
            </span>
            <span className="text-[6px] sm:text-[7px] leading-tight text-slate-600 dark:text-slate-300 font-bold mt-1">
              सूक्ष्म, लघु एवं मध्यम उद्यम
            </span>
            <span className="text-[5.5px] sm:text-[6.5px] text-indigo-600 dark:text-indigo-400 font-semibold leading-tight mt-0.5">
              Govt. of India
            </span>
            <span className="text-[5px] sm:text-[6px] font-mono text-slate-500 dark:text-slate-400 font-bold mt-0.5 tracking-tighter">
              UDYAM-UP-03-0165933
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-slate-700 dark:text-slate-400 mt-2 uppercase tracking-wider">
            Govt. Registered
          </span>
        </div>

        {/* Pillar 4: Authentic Founder Signature */}
        <div className="text-center font-sans min-w-[130px] sm:min-w-[160px]">
          <div className="h-11 sm:h-13 flex items-center justify-center">
            <img
              src="/signature.png"
              alt="Shivan Mishra Signature"
              className={`max-h-full max-w-[150px] object-contain ${
                isDark ? 'brightness-125 invert' : 'contrast-125'
              }`}
            />
          </div>
          <div className="w-28 sm:w-36 h-[1.5px] bg-slate-400 dark:bg-slate-600 mx-auto mt-1" />
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white uppercase mt-1 tracking-wider">
            {founderName}
          </p>
          <p className="text-[8.5px] sm:text-[9.5px] text-slate-500 dark:text-slate-400">
            {founderRole}, DevAscent Academy
          </p>
        </div>

      </div>

      {/* ─── 6. Footer Legal, Public URL & Date ─── */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center text-[9px] sm:text-[10px] font-sans text-slate-400 dark:text-slate-500 px-3 mt-4 sm:mt-5 border-t border-slate-200 dark:border-slate-800/80 pt-2 gap-1">
        <span className="truncate max-w-[360px]">
          devascentacademy.me/verify/{certId} &bull; support@devascentacademy.me
        </span>
        <span className="font-mono text-[9px] truncate max-w-[280px]">
          SHA-256: {sha256Hash.slice(0, 24)}...
        </span>
        <span>
          Issued On: <strong className="text-slate-700 dark:text-slate-300">{issueDate}</strong>
        </span>
      </div>
    </div>
  );
}

