'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  Award,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Code2,
} from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-amber-500 selection:text-white">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-600/15 via-orange-600/10 to-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-amber-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Transparency &amp; Educational Standard Compliance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Educational &amp;{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Placement Disclaimer
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              In strict accordance with the <strong>Advertising Standards Council of India (ASCI)</strong> guidelines and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
            </p>
          </div>

          {/* Main Notice Callout */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-100 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                No Guaranteed Job Placement or Employment Promise
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-0 sm:pl-12">
              <strong>DevAscent Academy</strong> provides high-impact software engineering training, virtual internship project simulations, mentor code reviews, and verifiable credentials.
              <br /><br />
              <strong className="text-amber-300">Important:</strong> DevAscent Academy does <u>NOT</u> guarantee jobs, job offers, corporate placements, minimum salary packages (CTC), or interviews. Our virtual internship programs are strictly educational simulations engineered to help students build real-world portfolio artifacts, learn production code architecture, and acquire job-ready technical skills.
            </p>
          </div>

          {/* 3 Pillar Clarifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Skill Acceleration vs Employment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The curriculum is designed to teach modern frameworks (NestJS, React, TypeScript, Docker, PostgreSQL). Individual student career outcomes depend on practice, portfolio quality, and independent interview performance.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Verifiable Virtual Internships</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Virtual internships represent simulated capstone projects evaluated against production standards. Certificates reflect successful project completion, code quality, and curriculum participation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Software &amp; Tools Accuracy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Third-party tools, libraries, APIs, and frameworks (Next.js, Tailwind, Prisma, Docker) frequently release updates. We continuously maintain our codebases but cannot guarantee 100% bug-free external packages.
              </p>
            </div>

          </div>

          {/* Regulatory Transparency & Contact */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 backdrop-blur-xl text-xs sm:text-sm text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Consumer Protection Transparency Notice</span>
            </h3>
            
            <p className="leading-relaxed">
              If you have any questions regarding our educational terms, curriculum scope, or mentorship expectations before enrolling, our desk is available for complete pre-enrollment consultation:
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <Link
                href="/refund-policy"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 transition"
              >
                <span>Review 7-Day Refund Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition"
              >
                <span>Read Terms &amp; Conditions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="mailto:devascentacademy@gmail.com"
                className="text-indigo-400 hover:underline"
              >
                devascentacademy@gmail.com
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
