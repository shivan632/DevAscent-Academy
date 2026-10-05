'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Sparkles,
  Bot,
  FileText,
  HelpCircle,
  Map,
  Cpu,
  ArrowRight,
  Code2,
  Lock,
  Clock,
  Layers,
  Zap,
  ArrowLeft,
} from 'lucide-react';

const UPCOMING_FEATURES = [
  {
    icon: FileText,
    name: 'AI Study Notes & Diagram Synthesizer',
    desc: 'Transforms complex codebases, lectures, and system designs into high-retention architectural cheat sheets and ASCII diagrams.',
    badge: 'In Development',
    color: 'from-violet-500/20 to-indigo-500/20 text-violet-400 border-violet-500/30',
  },
  {
    icon: HelpCircle,
    name: 'Senior Architect Interview Grilling',
    desc: 'Simulates intense Tier-1 technical rounds. Asks deep edge-case questions, critiques your answers, and tests scalability thinking.',
    badge: 'Beta Testing',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    icon: Map,
    name: 'Personalized Career Roadmap Generator',
    desc: 'Generates customized week-by-week engineering milestones mapped specifically to your current background and dream target role.',
    badge: 'Designing Prompts',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    icon: Cpu,
    name: 'Technical Whitepaper & PDF Summarizer',
    desc: 'Summarizes dense RFCs, database research papers, and framework release notes into 5-minute actionable summaries.',
    badge: 'Research Phase',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
  },
];

export default function AiStudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Futuristic Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ─── Hero Coming Soon Section ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            {/* Pulsing Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold backdrop-blur-xl shadow-lg shadow-indigo-500/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
              </span>
              <span>DevAscent AI Copilot Studio • Coming Soon</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              AI Study Studio &{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Engineering Copilot
              </span>
            </h1>

            {/* Big "Coming Soon" Badge Box */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 text-indigo-200 font-extrabold text-sm sm:text-base shadow-xl">
                <Clock className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="tracking-wider uppercase text-xs sm:text-sm">
                  🚧 Feature in Active Development — Coming Soon
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed pt-2">
              We are fine-tuning specialized LLM agent models and code synthesis pipelines to provide deeply contextual, senior-level architectural assistance for our enrolled students.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all"
              >
                <span>Explore Internships & Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ─── Preview of Upcoming AI Capabilities ─── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Upcoming AI Copilot Capabilities</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Here is what we are building into the DevAscent engineering environment.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Phase 2 Rollout
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {UPCOMING_FEATURES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-3 relative group hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-slate-400 border border-slate-800">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
