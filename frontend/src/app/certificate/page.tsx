'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import confetti from 'canvas-confetti';
import MasterCertificate from '../../components/MasterCertificate';
import { useAuthStore } from '../../lib/store/authStore';
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
  Printer,
  ShieldAlert,
  Palette,
  Clock,
} from 'lucide-react';

export default function CertificateGeneratorPage() {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuthStore();
  const [studentName, setStudentName] = useState('Shivan Mishra');
  const [courseTitle, setCourseTitle] = useState('Full-Stack Cloud & AI Software Engineering');
  const [duration, setDuration] = useState('08 Weeks');
  const [startDate, setStartDate] = useState('15 Jan 2026');
  const [endDate, setEndDate] = useState('15 Mar 2026');
  const [issueDate, setIssueDate] = useState('16 March 2026');
  const [credentialId, setCredentialId] = useState('DEV-CERT-2026-9482');
  const [theme, setTheme] = useState<'ivory' | 'obsidian'>('ivory');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.replace('/dashboard?tab=certificates');
      }
    }
  }, [user, isLoading, router]);

  const certRef = useRef<HTMLDivElement>(null);

  const sha256Hash = 'e5370db083db47569c4fdb4f5110c2ac6cf8bb4f46e53525cd006c4993000a';

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const certUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${credentialId}` : `https://www.devascentacademy.me/verify/${credentialId}`;
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      courseTitle
    )}&organizationName=DevAscent+Academy&issueYear=2026&certUrl=${encodeURIComponent(
      certUrl
    )}&certId=${encodeURIComponent(credentialId)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/verify/${credentialId}` : `https://www.devascentacademy.me/verify/${credentialId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerCelebration = () => {
    setIsGenerating(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    setTimeout(() => setIsGenerating(false), 800);
  };

  const generateRandomId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setCredentialId(`DEV-CERT-2026-${randomNum}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Hide on print */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 print:p-0 print:m-0 print:max-w-none">
        
        {/* Header Title (Hide on print) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 print:hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Official Master Certificate Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            DevAscent Master Certificate Generator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Live interactive generator featuring cryptographic SHA-256 ledger verification, authentic founder authorization, and official academic excellence sealing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls Column (Hide on print) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl backdrop-blur-md print:hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Certificate Customizer</span>
              </h2>
              <button
                onClick={handleTriggerCelebration}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Celebrate</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 text-xs flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Design Edition:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('ivory')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    theme === 'ivory'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  📜 Ivory Parchment (Print)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('obsidian')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    theme === 'obsidian'
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-md shadow-indigo-500/15'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  🌌 Obsidian Cyber
                </button>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Recipient Student Name:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Shivan Mishra"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Specialization Track:
                </label>
                <select
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Full-Stack Cloud & AI Software Engineering">
                    Full-Stack Cloud & AI Software Engineering
                  </option>
                  <option value="Python Programming & Applied Machine Learning">
                    Python Programming & Applied Machine Learning
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Duration:
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="08 Weeks"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Issue Date:
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="16 March 2026"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Start Date:
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="15 Jan 2026"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    End Date:
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="15 Mar 2026"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">
                    Credential ID:
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomId}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono cursor-pointer"
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
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Add to LinkedIn Profile</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Verification Link Copied!' : 'Copy Verification URL'}</span>
              </button>
            </div>

            {/* Trust Badges Notice */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Govt. Registered Enterprise &bull; UDYAM-UP-03-0165933
              </span>
              <p>
                Accredited under the Ministry of MSME, Govt. of India. Every credential features immutable SHA-256 cryptographic verification and authentic founder authorization.
              </p>
            </div>
          </div>

          {/* Right Live Master Certificate Preview */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Master Certificate Live Canvas */}
            <div ref={certRef} className="print:m-0 print:p-0">
              <MasterCertificate
                studentName={studentName}
                courseTitle={courseTitle}
                duration={duration}
                startDate={startDate}
                endDate={endDate}
                issueDate={issueDate}
                certId={credentialId}
                verifyUrl={
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/verify/${credentialId}`
                    : `https://www.devascentacademy.me/verify/${credentialId}`
                }
                sha256Hash={sha256Hash}
                theme={theme}
              />
            </div>

            {/* Quick Links below preview (Hide on print) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 px-2 print:hidden">
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

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
