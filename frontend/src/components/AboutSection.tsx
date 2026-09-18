'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Users,
  Award,
  TrendingUp,
  Zap,
  Activity,
  Layers,
  Server,
  QrCode,
  Bot,
  IndianRupee,
  MessageSquare,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  GitBranch,
  Shield,
  Gauge,
  Radio,
  Check
} from 'lucide-react';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'manifesto' | 'slo'>('manifesto');

  const telemetryStats = [
    {
      label: 'MENTORED',
      value: '1,200+',
      sub: 'Tier-1, 2 & 3 grads',
      pct: '88%',
      color: 'bg-indigo-600',
      icon: Users,
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      label: 'DEFENSE RATE',
      value: '94.8%',
      sub: 'Staff architect audit',
      pct: '94.8%',
      color: 'bg-emerald-500',
      icon: ShieldCheck,
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'AVG CTC',
      value: '₹18.4L',
      sub: 'Full-stack & platform',
      pct: '82%',
      color: 'bg-purple-600',
      icon: IndianRupee,
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'TRUST SCORE',
      value: '4.9/5',
      sub: '800+ audited reviews',
      pct: '98%',
      color: 'bg-amber-500',
      icon: Award,
      textColor: 'text-amber-500'
    }
  ];

  const pipelineStages = [
    {
      stage: 'STAGE 01',
      title: 'Systems Foundation',
      desc: 'Low-level OS memory abstractions, async event loops, Git rebase governance, and clean RESTful API schemas under strict linting.',
      metricLabel: 'BENCHMARK',
      metricVal: '< 5ms Node I/O',
      icon: Terminal,
      color: 'indigo'
    },
    {
      stage: 'STAGE 02',
      title: 'Microservices & Webhooks',
      desc: 'Handling live payment gateways with idempotent keys, outbox patterns, transactional integrity, and fault-tolerant Razorpay workers.',
      metricLabel: 'GUARANTEE',
      metricVal: 'Zero Replay Errors',
      icon: Activity,
      color: 'emerald'
    },
    {
      stage: 'STAGE 03',
      title: 'Concurrency & Redis',
      desc: 'Distributed locks with Redlock, pub/sub streaming with message queues, write-through caching layers, and Postgres index tuning.',
      metricLabel: 'STRESS TEST',
      metricVal: '10,000 req / sec',
      icon: Gauge,
      color: 'indigo'
    },
    {
      stage: 'STAGE 04',
      title: 'Live Capstone Defense',
      desc: 'Real 45-minute architectural defense in front of Staff Platform Engineers and Shivan Mishra before SHA-256 certificate issuance.',
      metricLabel: 'ACCREDITATION',
      metricVal: 'Cryptographic Hash',
      icon: ShieldCheck,
      color: 'emerald'
    }
  ];

  const milestones = [
    {
      year: '2023',
      badge: 'The Prototype',
      title: 'Weekend Systems Teardowns',
      desc: 'Frustrated by college students forced to compile in legacy Turbo C++, Shivan Mishra started conducting free 1-on-1 architecture teardowns for 30 ambitious undergraduates on Discord and Zoom.',
      highlight: 'Batch #00: 30 students, 28 placed in first 90 days',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
    },
    {
      year: 'Early 2024',
      badge: 'Platform Launch',
      title: 'DevAscent Platform & Registry Go Live',
      desc: 'Engineered an automated cohort management engine with real-time Razorpay integration, instant webhook handling, and the cryptographic Verified Certificate Registry for transparent proof-of-work.',
      highlight: 'Batches #01 & #02 sold out in 4 hours',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
    },
    {
      year: 'Late 2024',
      badge: 'AI Integration',
      title: 'The AI Study Studio Rollout',
      desc: 'Shipped proprietary AI tooling including Whisper-driven Voice Synthesizer notes, automated AST code critiques for homework PRs, and adaptive knowledge-graph roadmaps.',
      highlight: 'Reduced homework submission review lag to under 4 minutes',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    },
    {
      year: '2025 & Beyond',
      badge: 'Nationwide Scale',
      title: '1,200+ Alumni Impact',
      desc: 'Active alumni now working as SDE-1, SDE-2, and platform engineers across Bengaluru, Hyderabad, Gurugram, and Pune. Launching enterprise hiring days and direct recruiter pipelines.',
      highlight: 'Cohort #04 enrolling with upgraded distributed systems track',
      badgeColor: 'bg-indigo-600 text-white dark:bg-indigo-500'
    }
  ];

  const mentors = [
    {
      initials: 'RK',
      name: 'Rohan Kulkarni',
      role: 'Staff Platform Eng',
      tag: 'Ex-Fintech Unicorn',
      desc: 'Advises on distributed database replication, idempotent payment webhooks, and transactional consistency.',
      action: 'Bi-weekly Capstone Reviews',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
    },
    {
      initials: 'AP',
      name: 'Ananya Pathak',
      role: 'Principal Cloud Arch',
      tag: 'Multi-Cloud Specialist',
      desc: 'Guides container orchestration, Kubernetes manifests, edge delivery caching, and Terraform provisioning tracks.',
      action: 'Cloud Infra Clinics',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
    },
    {
      initials: 'VS',
      name: 'Vikram Sen',
      role: 'Head of Backend',
      tag: 'Scale Series-C',
      desc: 'Conducts live mock system design rounds and capstone defense evaluation for candidates preparing for top product firms.',
      action: 'Evaluates Final Defenses',
      badgeBg: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
    }
  ];

  return (
    <section id="about" className="w-full bg-[#F8F9FF] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200 border-t border-slate-200 dark:border-slate-800">
      
      {/* 1. HERO SECTION: CYBER-EDITORIAL SYSTEM DOSSIER */}
      <div className="relative w-full overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-200 dark:border-slate-800">
        
        {/* Glowing Background Radial Flares */}
        <div className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 -left-32 w-[450px] h-[450px] rounded-full bg-cyan-500/10 dark:bg-cyan-600/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb & Top System Flag */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Terminal className="w-4 h-4" />
                <span>DevAscent OS</span>
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">Systems Dossier & Founder Origin</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Arch: High-Throughput Mentorship Engine</span>
            </div>
          </div>

          {/* Hero Headline & Core Directive */}
          <div className="max-w-4xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
              <span>SYSTEM_MISSION: PRODUCTION_READY_2025</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Crafting Distributed Systems Engineers,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
                Not Tutorial Watchers.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Conceived by <strong className="text-slate-900 dark:text-white font-semibold">Shivan Mishra</strong> (Founder & Principal Systems Architect) to dismantle the engineering syllabus deficit. We replace 20-year-old classroom theory with real distributed backends, live Redis cache locks, microservices, and cryptographic capstone proofs.
            </p>
          </div>

          {/* Live Engineering Telemetry Strip */}
          <div className="mb-12 p-3 sm:px-6 bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-slate-600 dark:text-slate-300 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">CLUSTER_STATUS: ONLINE</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>PING: <strong className="text-slate-900 dark:text-white font-bold">21ms</strong> [AWS ap-south-1 Mumbai]</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-500" />
              <span>NODES: <strong className="text-slate-900 dark:text-white font-bold">14 Active Edge Relays</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>UPTIME: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">99.99%</strong> (Verified Registry)</span>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>SLO: 100% LIVE CODE COMMIT REQUIREMENT</span>
            </div>
          </div>

          {/* Bento Grid: Founder Identity & Terminal Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Card 1: Founder Identity Bento Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 space-y-6">
                {/* Header tag */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    OPERATOR_KEY: SHIVAN_MISHRA
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                    STAFF ARCH
                  </span>
                </div>

                {/* Cyber Emblem & Insignia Frame */}
                <div className="relative rounded-2xl overflow-hidden min-h-[340px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center border border-slate-800 shadow-inner group p-6 sm:p-8 text-center">
                  
                  {/* Subtle Radar Circles */}
                  <div className="absolute w-64 h-64 rounded-full border border-dashed border-cyan-500/20 pointer-events-none"></div>
                  <div className="absolute w-52 h-52 rounded-full border border-indigo-500/20 pointer-events-none"></div>

                  <div className="relative z-10 space-y-4 my-auto py-4">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-1.5 shadow-2xl shadow-indigo-600/50 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <div className="w-full h-full bg-slate-950 rounded-full p-3 sm:p-4 flex items-center justify-center overflow-hidden border border-cyan-400/40">
                        <img
                          src="/logo.png"
                          alt="DevAscent Academy Logo"
                          className="w-full h-full object-contain rounded-full drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white font-mono">Shivan Mishra</h4>
                      <p className="text-xs sm:text-sm text-cyan-300 font-mono">Principal Systems Architect & Founder</p>
                    </div>
                  </div>

                  {/* Floating Secure Sig Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-cyan-500/40 text-[10px] font-mono text-cyan-200 font-bold">
                    SECURE_SIG
                  </div>

                  {/* Bottom Cryptographic Status Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md py-1.5 px-3 rounded-xl shadow-md flex items-center justify-between border border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="font-mono text-[10px] font-semibold text-slate-200">ARCHITECT CREDENTIALS // VERIFIED</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>

                {/* Identity & Architectural Credentials */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shivan Mishra</h3>
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Founder & Principal Systems Architect</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Direct head of engineering and curriculum design. Previously architected mission-critical high-frequency transaction engines, low-latency queues, and distributed consensus streaming platforms.
                  </p>
                </div>
              </div>

              {/* Social Links & SHA PGP Fingerprint */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 relative z-10">
                <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                  <span>PGP: 7F9A 41BC 88E1 2940</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">RSA 4096 / VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive Terminal Window (shivan_manifesto.sh) + Telemetry Stats */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-[#0c1322] text-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex-1 flex flex-col justify-between overflow-hidden relative">
                <div>
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                      
                      <div className="ml-3 flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('manifesto')}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                            activeTab === 'manifesto'
                              ? 'bg-slate-900 border border-slate-700 text-cyan-300'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>shivan_manifesto.sh</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('slo')}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                            activeTab === 'slo'
                              ? 'bg-slate-900 border border-slate-700 text-cyan-300'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>pipeline_slo.yaml</span>
                        </button>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold font-mono">
                      [ACTIVE]
                    </span>
                  </div>

                  {/* Terminal Content */}
                  <div className="py-4 font-mono text-xs sm:text-sm leading-relaxed space-y-3">
                    {activeTab === 'manifesto' ? (
                      <>
                        <div className="text-slate-400 flex items-start gap-3">
                          <span className="text-slate-600 select-none text-xs">01</span>
                          <span className="text-cyan-400">#!/usr/bin/env devascent_engine</span>
                        </div>
                        <div className="text-slate-400 flex items-start gap-3">
                          <span className="text-slate-600 select-none text-xs">02</span>
                          <span><span className="text-purple-400">export</span> TARGET_STANDARD=<span className="text-emerald-300">&quot;Production_Staff_Level&quot;</span></span>
                        </div>
                        <div className="text-slate-300 flex items-start gap-3 bg-slate-900/90 p-3 rounded-xl border-l-2 border-cyan-400 shadow-md">
                          <span className="text-slate-600 select-none text-xs">03</span>
                          <p className="text-slate-200">
                            <span className="text-amber-300 font-bold">echo</span> <span className="text-emerald-300">&quot;Why DevAscent was born: standard college curricula teach 20-year-old C++ while production demands Redis, Kafka, and idempotent microservices.&quot;</span>
                          </p>
                        </div>
                        <div className="text-slate-400 flex items-start gap-3">
                          <span className="text-slate-600 select-none text-xs">04</span>
                          <span className="text-slate-300">
                            We treat Indian software engineers with intellectual dignity. No passive 60-hour video bingeing. Day one starts with Git rebases, schema indexing, idempotency keys, and handling Razorpay webhooks under simulated network partitions.
                          </span>
                        </div>
                        <div className="text-slate-400 flex items-start gap-3">
                          <span className="text-slate-600 select-none text-xs">05</span>
                          <span className="text-cyan-400 flex items-center gap-1">
                            <span>&gt; shivan.execute_credo()</span>
                            <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-400 flex items-start gap-3">
                          <span className="text-slate-600 select-none text-xs">01</span>
                          <span className="text-indigo-400">version: &apos;3.8&apos;</span>
                        </div>
                        <div className="text-slate-400 flex items-start gap-3">
                          <span className="text-slate-600 select-none text-xs">02</span>
                          <span className="text-purple-400">service: devascent_pipeline</span>
                        </div>
                        <div className="text-slate-300 flex items-start gap-3 bg-slate-900/90 p-3 rounded-xl border-l-2 border-emerald-400">
                          <span className="text-slate-600 select-none text-xs">03</span>
                          <p className="text-slate-200">
                            code_reviews: <span className="text-emerald-300">100% Mentor Audited</span><br />
                            capstone_repos: <span className="text-emerald-300">4 Full Production Apps</span><br />
                            refund_guarantee: <span className="text-emerald-300">7 Days 100% Money-Back</span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Terminal Highlights */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Live Containerized Code Reviews</span>
                  </div>
                  <div className="text-cyan-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SHA-256 Diplomas</span>
                  </div>
                </div>
              </div>

              {/* 4 Metric Telemetry Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {telemetryStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </span>
                      <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
                    </div>
                    <div className={`text-xl sm:text-2xl font-extrabold ${stat.textColor}`}>
                      {stat.value}
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className={`${stat.color} h-full rounded-full`} style={{ width: stat.pct }}></div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-mono pt-1">
                      {stat.sub}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 2. INTERACTIVE SYSTEMS BLUEPRINT & PEDAGOGICAL PIPELINE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping"></span>
              <span>PEDAGOGICAL_ARCHITECTURE_V4</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Systems Blueprint
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg">
            Unlike rote video sites, our curriculum functions as a continuous deployment pipeline with strict technical benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                    stage.color === 'emerald'
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {stage.stage}
                  </span>
                  <stage.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {stage.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {stage.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 font-mono text-xs flex items-center justify-between">
                <span className="text-slate-400">{stage.metricLabel}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{stage.metricVal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GUIDING PRINCIPLES BENTO MATRIX */}
      <div className="bg-slate-100/70 dark:bg-[#0b1120] py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-1 block">
                FOUNDATIONAL_CONVICTIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Guiding Principles Matrix
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
              Architected to protect student time, maximize compounding skills, and instill uncompromising craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento 01: Production-Grade or Nothing */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">
                    PILLAR_01
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Production-Grade or Nothing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  We don&apos;t tolerate toy Todo lists. Every student writes production code deployed to real cloud clusters: full multi-tenancy, zero-downtime migrations, automated unit test suites, and system telemetry monitors.
                </p>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 flex items-center gap-2">
                    <span className="text-indigo-600 font-bold">❯</span>
                    <span>devascent deploy --tenant=enterprise_09 --env=production</span>
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 pl-4 font-semibold">✔ CI/CD Checks Passed (32/32 tests green)</div>
                  <div className="text-slate-500 pl-4">✔ Postgres Index Latency: 0.8ms | Redis Lock: Active</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">Zero Toy Projects</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">Real Concurrency</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">CI/CD Pipelines</span>
              </div>
            </div>

            {/* Bento 02: Cryptographic Transparency */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950">
                    PILLAR_02
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cryptographic Transparency</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Unconditional 7-day refund guarantee. No lock-in, no hidden small print. Every graduate&apos;s project defense is publicly auditable on our SHA-256 certificate registry.
                </p>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                  <QrCode className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">REGISTRY: VERIFIED</div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">HASH: 4e91...b820a1f</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">7-Day Refund</span>
                <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">Public Hash Registry</span>
              </div>
            </div>

            {/* Bento 03: AI-Accelerated Pedagogy */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950">
                    PILLAR_03
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI-Accelerated Pedagogy</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Automated AST code critiques directly in GitHub PRs, audio recaps for each architecture clinic, and adaptive roadmap routing built natively for engineers.
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs flex items-center justify-between border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">PR REVIEW TIME</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">&lt; 4 Minutes Avg</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">Audio Engine</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">AST Syntax Lint</span>
              </div>
            </div>

            {/* Bento 04: Student-First Economics */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800">
                    PILLAR_04
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Student-First Economics</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  We reject the exploitative ₹3,00,000 ISA loan racket that traps graduates. DevAscent is priced transparently at ₹1,499 with instant UPI and no-cost EMI.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="font-mono text-base font-bold text-slate-900 dark:text-white">₹1,499</div>
                    <div className="text-[11px] text-slate-500">All-Inclusive Fee</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">0 Hidden</div>
                    <div className="text-[11px] text-slate-500">No Surprise Costs</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">₹0 Debt</div>
                    <div className="text-[11px] text-slate-500">Zero Predatory Loans</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">Instant UPI</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">Democratized Access</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. TIMELINE: THE DEVASCENT EVOLUTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest mb-2">
            <Calendar className="w-4 h-4" />
            <span>CHRONOLOGY_LOG</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Origin Story & Growth Milestones
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            From a weekend Discord system teardown room to India’s most rigorous modern engineering academy.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-8">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 relative group">
              <div className="md:w-1/3 flex flex-col md:items-end">
                <span className={`px-3.5 py-1 rounded-full font-mono text-sm font-bold inline-block shadow-sm ${milestone.badgeColor}`}>
                  {milestone.year}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  {milestone.badge}
                </span>
              </div>
              <div className="md:w-2/3 bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{milestone.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {milestone.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{milestone.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ENGINEERING ADVISORY BOARD & DIRECT FOUNDER DESK */}
      <div className="bg-slate-100/70 dark:bg-[#0b1120] py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Mentors Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-1 block">
                  ADVISORY_TELEMETRY
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Engineering Advisory Board
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
                  Staff engineers, cloud architects, and fintech leads collaborating directly with Shivan Mishra to conduct bi-weekly code teardowns and calibrate curriculum relevance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {mentors.map((mentor, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/90 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl font-bold font-mono flex items-center justify-center shadow-sm text-sm ${mentor.badgeBg}`}>
                          {mentor.initials}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{mentor.name}</h5>
                          <p className="text-[11px] text-slate-500">{mentor.role}</p>
                        </div>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                        {mentor.tag}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {mentor.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{mentor.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Direct Founder Desk Hotline */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>LIVE FOUNDER DESK</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold font-mono">
                    SLA &lt; 25m
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Have a technical doubt before enrolling?</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Connect directly with Shivan Mishra. No marketing reps or aggressive sales pressure. Strictly engineering consultation and curriculum roadmap alignment.
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Direct WhatsApp Hotline Active</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="https://wa.me/919935806722?text=Hi%20Shivan,%20I%20have%20a%20question%20about%20DevAscent%20Academy%20Cohort%204"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Shivan on WhatsApp</span>
                </a>
                <p className="text-center font-mono text-[10px] text-slate-400 mt-2">
                  Open 9:00 AM – 9:00 PM IST
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
