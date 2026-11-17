'use client';

import React from 'react';
import {
  CreditCard,
  PlayCircle,
  CheckSquare,
  Code2,
  GitBranch,
  Send,
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  desc: string;
  detail: string;
  icon: React.ReactNode;
  badge?: string;
}

const journeySteps: Step[] = [
  {
    id: '01',
    title: 'Enroll',
    desc: 'Instant Access',
    detail: 'Secure Razorpay checkout with live batch seat confirmation.',
    icon: <CreditCard className="w-5 h-5 text-indigo-400" />,
    badge: 'Step 1',
  },
  {
    id: '02',
    title: 'Access Course',
    desc: 'Interactive Workspace',
    detail: 'Modular video lectures, architecture deep-dives & production notes.',
    icon: <PlayCircle className="w-5 h-5 text-blue-400" />,
  },
  {
    id: '03',
    title: 'Clear Quizzes',
    desc: 'Knowledge Verification',
    detail: '6–8 scenario-based MCQs per module to unlock next topics.',
    icon: <CheckSquare className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: '04',
    title: 'Build Project',
    desc: 'Real Systems',
    detail: 'Implement production architectures, database schemas & APIs.',
    icon: <Code2 className="w-5 h-5 text-teal-400" />,
    badge: 'Core Work',
  },
  {
    id: '05',
    title: 'Push to GitHub',
    desc: 'Clean Commits',
    detail: 'Public GitHub repo with detailed README, architecture diagrams & tests.',
    icon: <GitBranch className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: '06',
    title: 'Submit Review',
    desc: 'Instructor Audit',
    detail: 'Submit repo & LinkedIn post for formal code and design review.',
    icon: <Send className="w-5 h-5 text-amber-400" />,
  },
  {
    id: '07',
    title: 'SHA-256 Verify',
    desc: 'Public Ledger',
    detail: 'Cryptographic hash generated & recorded on DevAscent registry.',
    icon: <ShieldCheck className="w-5 h-5 text-violet-400" />,
    badge: 'Tamper-Proof',
  },
  {
    id: '08',
    title: 'Get Certified',
    desc: 'Official Credential',
    detail: 'Gold-accredited PDF certificate + verified public portfolio link.',
    icon: <Award className="w-5 h-5 text-yellow-400" />,
  },
];

export default function CourseJourney() {
  return (
    <section className="relative py-16 sm:py-20 bg-[#080C16] border-y border-slate-800/80 overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Path to Mastery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-serif">
            COURSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400">JOURNEY</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            From enrollment to cryptographic certification — complete production projects, submit real code, and earn globally verifiable credentials.
          </p>
        </div>

        {/* ─── 8-Step Timeline Horizontal Carousel / Flex Container ─── */}
        <div className="relative">
          {/* Subtle Connecting Line Running Behind Icons on Desktop */}
          <div className="hidden lg:block absolute top-[52px] left-12 right-12 h-[2px] bg-gradient-to-r from-indigo-500/30 via-cyan-500/40 to-yellow-500/30 -z-0" />

          {/* Steps Wrapper: Horizontal Scrollable on Mobile, Grid/Flex on Desktop */}
          <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent snap-x snap-mandatory lg:grid lg:grid-cols-8 lg:gap-3 lg:overflow-visible">
            {journeySteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex-shrink-0 w-64 lg:w-auto flex flex-col items-center text-center group snap-center"
              >
                {/* Step Number */}
                <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition-colors mb-2">
                  {step.id}
                </span>

                {/* Node Circle with Glow */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0F172A] border border-slate-700/80 group-hover:border-indigo-500/80 group-hover:bg-indigo-950/40 shadow-lg group-hover:shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all duration-300 flex items-center justify-center mb-3">
                  {step.icon}
                  {step.badge && (
                    <span className="absolute -top-2 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight bg-indigo-500 text-white shadow-sm">
                      {step.badge}
                    </span>
                  )}
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="font-sans font-bold text-sm text-slate-100 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-[11px] font-medium text-indigo-400 mt-0.5">
                  {step.desc}
                </p>

                {/* Step Description */}
                <p className="text-[11px] text-slate-400 leading-normal mt-1.5 px-1 line-clamp-3">
                  {step.detail}
                </p>

                {/* Mobile Chevron between steps */}
                {idx < journeySteps.length - 1 && (
                  <div className="lg:hidden mt-3 text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 max-w-2xl mx-auto rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-indigo-500/20 p-4 text-center">
          <p className="text-xs sm:text-sm text-slate-300">
            ⚡ Every project undergoes instructor assessment before your SHA-256 certificate is minted to the public registry.
          </p>
        </div>
      </div>
    </section>
  );
}
