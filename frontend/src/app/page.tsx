'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../lib/store/authStore';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Terminal,
  Zap,
  Star,
  Users,
  Award,
  ChevronDown,
  ChevronRight,
  Play,
  X,
  Layers,
  Server,
  Lock,
  ExternalLink,
  Laptop,
  Check,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'razorpay' | 'verifier'>('architecture');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [certName, setCertName] = useState('Shivan Mishra');

  const capstoneProjects = [
    {
      id: 1,
      title: 'High-Scale Multi-Tenant SaaS',
      tag: 'Full-Stack Core',
      desc: 'Next.js 15 App Router, TypeScript, Tailwind CSS, PostgreSQL, and Prisma with role-based access control and tenant isolation.',
      features: ['Multi-tenant DB schema', 'Server Actions & SSR', 'Role-Based Access Control (RBAC)', 'Zustand Global State'],
      badge: 'Production App #1',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      id: 2,
      title: 'NestJS Microservices & Redis',
      tag: 'Backend & Cloud',
      desc: 'Decoupled event-driven backend using NestJS, Redis caching, Rate-limiting, and PostgreSQL with transaction rollback guarantees.',
      features: ['Modular NestJS architecture', 'Redis distributed lock & cache', 'JWT httpOnly cookie security', 'Docker Compose cluster'],
      badge: 'Production App #2',
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      id: 3,
      title: 'Verifiable Digital Certificate Ledger',
      tag: 'Security & Hash Registry',
      desc: 'Cryptographically verifiable PDF certificate generator with SHA-256 immutable hashes and public registry lookup.',
      features: ['SHA-256 hash generation', 'Server-side PDF generation', 'Public QR verification URL', 'LinkedIn credential integration'],
      badge: 'Production App #3',
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      id: 4,
      title: 'Razorpay Payment & Webhook Engine',
      tag: 'Fintech & Orders',
      desc: 'End-to-end checkout pipeline with order creation, HMAC-SHA256 signature verification, idempotent webhooks, and automated refund triggers.',
      features: ['Razorpay checkout SDK', 'HMAC webhook verification', 'Idempotency key handler', 'Automated 7-day refund flow'],
      badge: 'Production App #4',
      gradient: 'from-amber-600 to-orange-600',
    },
  ];

  const curriculum = [
    {
      week: 1,
      title: 'Modern TypeScript, Next.js 15 & Architectural Foundations',
      summary: 'Master full TypeScript typing, Next.js App Router, Server Components vs Client Components, and canonical design systems.',
      lessons: ['Type-safe frontend development with .tsx', 'App Router layout trees & streaming SSR', 'Tailwind CSS design token system', 'Zustand state management setup'],
    },
    {
      week: 2,
      title: 'NestJS Modular Backend, Relational Data & Prisma ORM',
      summary: 'Build clean, enterprise NestJS backend with controllers, services, DTO validation pipes, and Prisma relational schema.',
      lessons: ['NestJS dependency injection & modules', 'Prisma schema design for complex systems', 'PostgreSQL relations & migrations', 'Global exception filters & response interceptors'],
    },
    {
      week: 3,
      title: 'Hardened Authentication, Security & httpOnly Session Tokens',
      summary: 'Implement military-grade authentication with bcrypt hashing, JWT access/refresh tokens in httpOnly cookies, and RBAC guards.',
      lessons: ['Password hashing with bcrypt & salt rounds', 'JWT strategy & Passport integration', 'HttpOnly cookie guards against XSS/CSRF', 'Role-based authorization (Student/Admin/Instructor)'],
    },
    {
      week: 4,
      title: 'Razorpay Fintech Engine, HMAC Webhooks & Orders',
      summary: 'Integrate real payments with Razorpay. Handle order creation, payment signatures, webhooks, and automated refund workflows.',
      lessons: ['Razorpay order initialization API', 'HMAC-SHA256 webhook signature validation', 'Idempotent transaction state updates', '7-day automated refund policy engine'],
    },
    {
      week: 5,
      title: 'Verifiable Digital Credentials & SHA-256 Ledger',
      summary: 'Generate tamper-proof PDF certificates with SHA-256 cryptographic hashes and a public verification registry portal.',
      lessons: ['Automated PDF generation engine', 'SHA-256 cryptographic hashing of credentials', 'Public registry verification endpoint', 'LinkedIn 1-click certificate sharing'],
    },
    {
      week: 6,
      title: 'Dockerization, Cloud CI/CD & Capstone Production Deployment',
      summary: 'Containerize frontend & backend with Docker Compose, configure production environment variables, and deploy live on cloud infrastructure.',
      lessons: ['Multi-stage Docker build optimization', 'Docker Compose for Fullstack + Postgres + Redis', 'Cloud deployment (Render / AWS / Vercel)', 'Production monitoring & health checks'],
    },
  ];

  const faqs = [
    {
      q: 'I am a BCA / non-tier-1 college student. Is this cohort suitable for me?',
      a: 'Yes, 100%! DevAscent Academy is specifically engineered for BCA, MCA, and engineering students who want to bridge the gap between college theory and real-world software engineering jobs. We start with clear mental models and build directly into production-grade systems.',
    },
    {
      q: 'How does the 7-day money-back guarantee work?',
      a: 'We offer an absolute zero-risk policy. If you enroll and decide within 7 days (and under 20% lesson completion) that the course is not for you, you can request a 1-click refund from your student dashboard or email support. Your entire ₹1,499 will be refunded to your original payment method.',
    },
    {
      q: 'Is the certificate verifiable by recruiters and employers?',
      a: 'Yes! Every certificate issued generates a unique SHA-256 cryptographic hash and public verification URL (e.g. devascent.io/verify/DEVASCENT-2025-VALID). Recruiters can visit the registry anytime to verify your identity, graduation date, and capstone credentials.',
    },
    {
      q: 'Are the 4 capstone projects real production apps or basic tutorials?',
      a: 'They are complete, production-ready portfolio apps: Multi-Tenant SaaS, NestJS Microservices backend, Cryptographic Certificate Ledger, and Razorpay Fintech engine with webhooks. You will write real code and deploy them to live URLs.',
    },
    {
      q: 'What is the schedule and batch timing?',
      a: 'Cohort #4 starts this coming Monday. All lecture recordings, source code repositories, and interactive exercises are available on your student dashboard 24/7, accompanied by weekly live Q&A sessions and Discord community code reviews.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Top Urgency Banner */}
      <div className="mt-16 sm:mt-20 bg-indigo-900 text-white py-2.5 px-4 text-xs sm:text-sm font-medium border-b border-indigo-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-emerald-300">Cohort #4 Status:</span>
            <span>31 of 40 seats filled for upcoming Monday batch</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-indigo-200">
            <span>⚡ 70% Early Bird Closes Soon</span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay 256-Bit SSL Secured</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section with "Mono Indigo" (Minimal) Liquid Aurora 3D Background */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Subtle Developer Grid Mesh */}
        <div className="absolute inset-0 hero-grid-pattern opacity-35 dark:opacity-20 pointer-events-none z-0"></div>

        {/* Mono Indigo Liquid Aurora Gradient (Pure CSS, 60fps, Natural Wide Coverage) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Subtle Top Ambient Indigo Glow Wash */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] bg-gradient-to-b from-indigo-600/35 via-indigo-500/20 to-transparent rounded-full blur-[90px] sm:blur-[120px] animate-aurora-flow-4 opacity-70 dark:opacity-85"></div>

          {/* Blob 1: Indigo 600 (#4f46e5) — Top-Left */}
          <div
            className="absolute -top-[10%] -left-[10%] sm:left-[2%] w-[580px] sm:w-[780px] h-[480px] sm:h-[650px] rounded-full blur-[90px] sm:blur-[130px] opacity-65 dark:opacity-85 animate-aurora-flow-1"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #4f46e5 0%, #4338ca 50%, transparent 75%)',
            }}
          ></div>

          {/* Blob 2: Indigo 500 (#6366f1) — Bottom-Right */}
          <div
            className="absolute top-[25%] -right-[10%] sm:right-[2%] w-[600px] sm:w-[820px] h-[520px] sm:h-[680px] rounded-full blur-[95px] sm:blur-[135px] opacity-60 dark:opacity-80 animate-aurora-flow-2"
            style={{
              background: 'radial-gradient(circle at 60% 60%, #6366f1 0%, #4f46e5 50%, transparent 75%)',
            }}
          ></div>

          {/* Blob 3: Indigo 400 (#818cf8) — Center */}
          <div
            className="absolute top-[18%] left-[20%] sm:left-[28%] w-[520px] sm:w-[720px] h-[440px] sm:h-[580px] rounded-full blur-[85px] sm:blur-[120px] opacity-55 dark:opacity-75 animate-aurora-flow-3"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #818cf8 0%, #6366f1 45%, transparent 70%)',
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Pitch */}
            <div className="lg:col-span-7 space-y-6">
              {/* Batch Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <Rocket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Admissions Open for Cohort #4</span>
                <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                <span className="text-slate-600 dark:text-slate-400">Limited to 40 Students</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Become a Full-Stack Web Developer.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
                  Build & Ship 4 Production Apps
                </span>{' '}
                in 6 Weeks.
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                From BCA/BTech fundamentals to production Next.js, NestJS, PostgreSQL, Docker, and Razorpay payment integration. Weekly live code reviews, verifiable credentials, and 100% money-back guarantee.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/checkout?course=full-stack-web-development"
                  className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>Enroll in Course — ₹1,499</span>
                  <span className="bg-black/20 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    70% OFF
                  </span>
                </Link>

                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                >
                  <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                  <span>Watch 15-Min Free Preview</span>
                </button>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">4.9/5 Rating</span>
                  <span className="text-slate-500 dark:text-slate-400">(280+ alumni)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-slate-800 dark:text-slate-300">Hired at Top Startups</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-slate-800 dark:text-slate-300">100% Practical & Project-First</span>
                </div>
              </div>
            </div>

            {/* Right Column: Code & Architecture Bento */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden ring-1 ring-slate-800/80">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="text-xs text-slate-400 font-mono ml-2">cohort-4-stack.config.ts</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
                    LIVE PREVIEW
                  </span>
                </div>

                {/* Tab Selectors */}
                <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-mono">
                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                      activeTab === 'architecture'
                        ? 'border-indigo-500 text-indigo-400 bg-slate-800/50'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Architecture
                  </button>
                  <button
                    onClick={() => setActiveTab('schema')}
                    className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                      activeTab === 'schema'
                        ? 'border-indigo-500 text-indigo-400 bg-slate-800/50'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Prisma Schema
                  </button>
                  <button
                    onClick={() => setActiveTab('razorpay')}
                    className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                      activeTab === 'razorpay'
                        ? 'border-indigo-500 text-indigo-400 bg-slate-800/50'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Razorpay
                  </button>
                  <button
                    onClick={() => setActiveTab('verifier')}
                    className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                      activeTab === 'verifier'
                        ? 'border-indigo-500 text-indigo-400 bg-slate-800/50'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    SHA-256 Hash
                  </button>
                </div>

                {/* Code Body */}
                <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                  {activeTab === 'architecture' && (
                    <div className="space-y-1 text-slate-300">
                      <p className="text-indigo-400">// DevAscent Production Architecture</p>
                      <p className="text-emerald-400">export const <span className="text-white">platform</span> = {'{'}</p>
                      <p className="pl-4">frontend: <span className="text-amber-300">'Next.js 15 App Router (.tsx)'</span>,</p>
                      <p className="pl-4">backend: <span className="text-amber-300">'NestJS Microservices'</span>,</p>
                      <p className="pl-4">database: <span className="text-amber-300">'PostgreSQL + Prisma ORM'</span>,</p>
                      <p className="pl-4">security: <span className="text-amber-300">'JWT in httpOnly Cookies + RBAC'</span>,</p>
                      <p className="pl-4">payments: <span className="text-amber-300">'Razorpay HMAC-SHA256 Webhooks'</span>,</p>
                      <p className="pl-4">verifiableCerts: <span className="text-emerald-400">true</span>,</p>
                      <p className="pl-4">earlyBirdPrice: <span className="text-purple-300">1499</span>,</p>
                      <p className="text-emerald-400">{'};'}</p>
                    </div>
                  )}

                  {activeTab === 'schema' && (
                    <div className="space-y-1 text-slate-300">
                      <p className="text-indigo-400">// Prisma Relational Schema</p>
                      <p className="text-purple-400">model <span className="text-white">Enrollment</span> {'{'}</p>
                      <p className="pl-4">id        <span className="text-blue-300">String</span>   @id @default(uuid())</p>
                      <p className="pl-4">user      <span className="text-blue-300">User</span>     @relation(fields: [userId], references: [id])</p>
                      <p className="pl-4">course    <span className="text-blue-300">Course</span>   @relation(fields: [courseId], references: [id])</p>
                      <p className="pl-4">status    <span className="text-emerald-400">EnrollmentStatus</span> @default(ACTIVE)</p>
                      <p className="pl-4">createdAt <span className="text-blue-300">DateTime</span> @default(now())</p>
                      <p className="text-purple-400">{'}'}</p>
                    </div>
                  )}

                  {activeTab === 'razorpay' && (
                    <div className="space-y-1 text-slate-300">
                      <p className="text-indigo-400">// Razorpay Signature Verification</p>
                      <p className="text-purple-400">async verifyPayment<span className="text-white">(signature, orderId, paymentId)</span> {'{'}</p>
                      <p className="pl-4 text-slate-400">const body = `${'{orderId}|{paymentId}'}`;</p>
                      <p className="pl-4">const expected = crypto</p>
                      <p className="pl-8">.createHmac(<span className="text-amber-300">'sha256'</span>, process.env.RZP_SECRET)</p>
                      <p className="pl-8">.update(body)</p>
                      <p className="pl-8">.digest(<span className="text-amber-300">'hex'</span>);</p>
                      <p className="pl-4 text-emerald-400">return expected === signature; // Idempotent unlock</p>
                      <p className="text-purple-400">{'}'}</p>
                    </div>
                  )}

                  {activeTab === 'verifier' && (
                    <div className="space-y-1 text-slate-300">
                      <p className="text-indigo-400">// Verifiable Certificate Ledger</p>
                      <p className="text-purple-400">export function <span className="text-white">hashCredential</span>(payload) {'{'}</p>
                      <p className="pl-4">const raw = `${'{payload.studentId}:{payload.courseId}:{Date.now()}'}`;</p>
                      <p className="pl-4 text-emerald-400">return crypto.createHash('sha256').update(raw).digest('hex');</p>
                      <p className="text-purple-400">{'}'}</p>
                      <p className="pt-2 text-slate-400">// Hash: e5370db083db47569c4fdb4f5110c2ac...</p>
                    </div>
                  )}
                </div>

                {/* Footer Highlight */}
                <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cohort Duration: <span className="text-white font-semibold">6 Weeks</span></span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Prisma Migrations Ready</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* DevAscent Academy Intro Video Showcase with ::before pseudo-element glow */}
          <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>DevAscent Academy Official Overview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Watch How DevAscent Prepares You for Real Tech Careers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                See our code-first curriculum, live portfolio code reviews, and tamper-proof graduation certificates in action.
              </p>
            </div>

            {/* Glowing Video Frame Container */}
            <div className="video-glow-frame bg-slate-950 p-2 sm:p-3 shadow-2xl border border-slate-800">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  preload="auto"
                  poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
                  className="w-full h-full object-cover rounded-xl"
                >
                  <source
                    src="https://res.cloudinary.com/dfzhjogqm/video/upload/v1789473373/DevAscentAcademy.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support HTML5 video streaming.
                </video>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Capstone Projects Showcase (Screenshot 1 Fix: Dark & Light Mode Glassmorphism) */}
      <section className="py-20 bg-white dark:bg-[#090d16] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full">
              Production Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              4 Full-Stack Capstone Apps You Will Build & Deploy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              No toy todo lists or counter apps. You will build enterprise-grade software architectures that impress technical recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capstoneProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-slate-50/80 dark:bg-slate-900/90 rounded-2xl p-8 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 px-2.5 py-1 rounded-md shadow-sm">
                      {project.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 rounded">
                      {project.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.desc}
                  </p>

                  <div className="space-y-2 pt-2">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="group-hover:underline flex items-center gap-1">
                    <span>Explore Project Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono">100% Code-First</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Week Curriculum Roadmap (Screenshot 2 Fix: Crisp Cards & Dark/Light Styling) */}
      <section className="py-20 bg-[#F8F9FF] dark:bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full">
              Syllabus & Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A 6-Week Structured Path to Senior-Level Code
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Carefully paced for college students & working professionals with step-by-step milestones.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {curriculum.map((weekItem) => {
              const isOpen = activeWeek === weekItem.week;
              return (
                <div
                  key={weekItem.week}
                  className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-indigo-400 dark:border-indigo-500 shadow-md ring-2 ring-indigo-100 dark:ring-indigo-950/80'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setActiveWeek(isOpen ? 0 : weekItem.week)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        W{weekItem.week}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{weekItem.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{weekItem.summary}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {weekItem.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {weekItem.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-medium">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/courses/full-stack-web-development"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 px-6 py-3 rounded-xl shadow-sm hover:shadow"
            >
              <span>Download Detailed 24-Page Syllabus PDF</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Verifiable Certificate Showcase */}
      <section className="py-20 bg-white dark:bg-[#090d16] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full">
                Industry-Grade Credential
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                An Official Verifiable Certificate of Completion
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Every graduate receives a tamper-proof digital certificate backed by an immutable SHA-256 cryptographic hash and a permanent public verification URL.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Permanent Public Registry</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Recruiters can verify your credential instantly via devascent.io/verify/ID.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">1-Click LinkedIn Add</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Add verified skills and project showcases directly to your LinkedIn profile.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Cryptographically Signed</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">SHA-256 hash generated directly from your capstone code commits.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Name Changer with Sample Notice */}
              <div className="pt-2 space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preview Your Name on the Certificate (Sample Demo):
                  </label>
                  <input
                    type="text"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full max-w-sm px-4 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Note: The preview below is a sample demonstration only. Real verifiable credentials are cryptographically issued upon course completion.
                </p>
              </div>
            </div>

            {/* Certificate Realistic Mockup Card (Sample Demo) */}
            <div className="lg:col-span-6">
              <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 shadow-2xl border-2 border-indigo-500/30 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Diagonal Sample Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] rotate-[-25deg] select-none">
                  <span className="text-7xl font-extrabold tracking-widest text-white uppercase">
                    SAMPLE ONLY
                  </span>
                </div>

                {/* Certificate Frame */}
                <div className="border border-indigo-400/30 rounded-xl p-6 sm:p-8 space-y-6 relative bg-slate-900/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/logo.png"
                        alt="DevAscent Academy"
                        className="w-8 h-8 object-contain rounded-lg drop-shadow-sm bg-white/10 p-0.5"
                      />
                      <span className="font-bold text-sm tracking-wider uppercase">DevAscent Academy</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2.5 py-0.5 rounded shadow-sm">
                      SAMPLE PREVIEW ONLY
                    </span>
                  </div>

                  <div className="space-y-2 text-center py-2">
                    <p className="text-xs uppercase tracking-widest text-indigo-300">Certificate of Completion (Sample)</p>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                      {certName || 'Your Name Here'}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
                      Has successfully mastered Full-Stack Web Development, built & deployed 4 production capstones, and passed the technical assessment with distinction.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-indigo-500/20 pt-4 text-left text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sample Credential ID:</span>
                      <span className="text-amber-300 font-semibold">SAMPLE-DEVASCENT-DEMO</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Verification URL:</span>
                      <span className="text-emerald-400 font-semibold">devascent.io/verify</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/verify/DEVASCENT-2025-VALID"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors"
                  >
                    <span>Inspect Live Public Verification Page (Demo)</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing & Checkout Section */}
      <section id="pricing" className="py-20 bg-[#F8F9FF] dark:bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Invest in Your Career for the Cost of a Weekend Dinner
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              No ₹50,000 upfront bootcamps. Premium tech education priced fairly for Indian students.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-indigo-600 p-8 space-y-6">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                ⚡ 70% Early-Bird Cohort Offer
              </div>

              <div className="text-center space-y-2 pt-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Full-Stack Cohort Pass</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">6 Weeks Live Cohort + 1 Year Extended Access</p>
                <div className="flex items-baseline justify-center gap-3 pt-2">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">₹1,499</span>
                  <span className="text-lg text-slate-400 line-through">₹4,999</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                    SAVE 70%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">One-time payment • No hidden subscriptions • GST Included</p>
              </div>

              {/* Checklist */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                {[
                  'Full 6-Week Structured Next.js 15 & NestJS Roadmap',
                  '4 Production Capstone Repositories with Source Code',
                  'Razorpay Payment & Webhook Integration Pipeline',
                  'Official Verifiable SHA-256 PDF Certificate',
                  'Weekly Live Q&A & Code Reviews with Mentor',
                  'Student Discussion Community Access',
                  '7-Day 100% Money-Back Guarantee (Zero Risk)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4 space-y-3">
                <Link
                  href="/checkout?course=full-stack-web-development"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Enroll in Cohort #4 Now — ₹1,499</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>7-Day Refund</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Razorpay Secured</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion (Screenshot 3 Fix: High contrast headers and dark/light styled items) */}
      <section className="py-20 bg-white dark:bg-[#090d16] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Everything you need to know about the curriculum, payments, and guarantees.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/80 dark:bg-slate-900 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600/50 shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 15-Min Free Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Play className="w-4 h-4 text-indigo-400" />
                <span>DevAscent Free Preview: Full-Stack Architecture in 15 Minutes</span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player / Frame */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 relative">
              <video
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source
                  src="https://res.cloudinary.com/dfzhjogqm/video/upload/v1789473373/DevAscentAcademy.mp4"
                  type="video/mp4"
                />
                Your browser does not support HTML5 video streaming.
              </video>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Ready to unlock all 6 weeks and live projects?</span>
              <Link
                href="/checkout?course=full-stack-web-development"
                onClick={() => setPreviewModalOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Enroll for ₹1,499
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Conversion Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block leading-tight">Cohort #4 Early Bird</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">₹1,499</span>
          <span className="text-[10px] text-slate-400 line-through ml-1">₹4,999</span>
        </div>
        <Link
          href="/checkout?course=full-stack-web-development"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20"
        >
          Enroll Now
        </Link>
      </div>

      <Footer />
    </div>
  );
}
