'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Award,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowUp,
  MessageCircle,
  ExternalLink,
  Send,
  Heart,
  Globe,
  Code2,
  Layers,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0F19] text-slate-400 border-t border-slate-800 relative z-20">
      {/* 1. Newsletter Capture Bar (Top) */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Weekly Engineering Newsletter</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Get weekly system design breakdowns + early access to Cohort #5
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Join 500+ ambitious developers across India. Zero spam, unsubscribe anytime.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 max-w-md">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all shrink-0"
            >
              <span>{subscribed ? 'Subscribed! 🎉' : 'Subscribe →'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Multi-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Identity (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <img
                src="/logo.png"
                alt="DevAscent Academy"
                className="w-12 h-12 object-cover rounded-full border-2 border-indigo-500/40 p-0.5 shadow-md group-hover:scale-105 transition-transform bg-slate-900"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white leading-tight">DevAscent</span>
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest leading-none">
                  Academy & Internships
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Democratizing high-caliber, code-first software engineering education for Indian developers. Bridging college theory with production-grade Full-Stack, NestJS, and Cloud systems.
            </p>

            <div className="text-xs text-slate-500 space-y-1">
              <p>📍 Founded 2025 • Bengaluru, Karnataka, India</p>
              <p className="text-indigo-400 font-medium">⚡ Trusted by 500+ BCA & Engineering Students</p>
            </div>

            {/* Social Media Icons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-950/60 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-500 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter X"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-400 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 hover:bg-red-950/40 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* WhatsApp Community */}
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>100% Verifiable Credentials</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-full">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Razorpay 256-Bit SSL</span>
              </div>
            </div>
          </div>

          {/* Column 2: Curriculum Pathways */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Curriculum</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/courses/full-stack-web-development" className="hover:text-indigo-400 transition-colors block">
                  Full-Stack Accelerator
                </Link>
              </li>
              <li>
                <Link href="/courses/backend-cloud-internship" className="hover:text-indigo-400 transition-colors block">
                  Backend & Cloud Internship
                </Link>
              </li>
              <li>
                <Link href="/learn/react-foundations-free" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>React Foundations</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-950 text-emerald-400 rounded uppercase">
                    Free
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-web-development" className="hover:text-indigo-400 transition-colors block">
                  NestJS Microservices
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-web-development" className="hover:text-indigo-400 transition-colors block">
                  Postgres & Prisma ORM
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-web-development" className="hover:text-indigo-400 transition-colors block">
                  Razorpay Fintech Webhooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verification & Security */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Verification</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/verify/DEVASCENT-2025-VALID" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Public Registry Search</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="hover:text-indigo-400 transition-colors block">
                  Sample Certificate Demo
                </Link>
              </li>
              <li>
                <Link href="/verify/DEVASCENT-2025-VALID" className="hover:text-indigo-400 transition-colors block">
                  SHA-256 Hash Verification
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-indigo-400 transition-colors block">
                  7-Day Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-400 transition-colors block">
                  Student Learning Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Community */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors block">
                  About DevAscent
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-indigo-400 transition-colors block">
                  Our Story & Mission
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>Careers</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-indigo-950 text-indigo-300 rounded uppercase">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-indigo-400 transition-colors block">
                  College Partnerships
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-indigo-400 transition-colors block">
                  Contact Leadership
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Zero-Risk Box */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Support</h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <Link href="/support" className="hover:text-indigo-400 transition-colors block">
                Help Desk & FAQ
              </Link>
              <a href="mailto:support@devascent.io" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>support@devascent.io</span>
              </a>
              <a href="tel:+919935806722" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 99358 06722</span>
              </a>
            </div>

            {/* Zero-Risk Guarantee Mini Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                <Award className="w-4 h-4 shrink-0" />
                <span>Zero-Risk Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                100% full refund within 7 days and under 20% progress. No questions asked.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                <CreditCard className="w-3 h-3 text-slate-400" />
                <span>UPI • Cards • NetBanking • RuPay</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Address & Compliance Bar */}
        <div className="py-6 border-b border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-center md:text-left">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              <strong className="text-slate-400">Registered Office:</strong> DevAscent Academy Pvt. Ltd., HSR Layout, Sector 7, Bengaluru, Karnataka – 560102, India
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span>GSTIN: 29AAACD0000A1Z5</span>
            <span>•</span>
            <span>CIN: U80903KA2025PTC198421</span>
          </div>
        </div>

        {/* 4. Bottom Legal Bar & Back-to-Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4">
            <p>© {new Date().getFullYear()} DevAscent Academy Pvt. Ltd. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <span className="text-slate-400 font-medium">Made with ❤️ in India 🇮🇳</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">
              7-Day Refund Policy
            </Link>
            <Link href="/support" className="hover:text-slate-300 transition-colors">
              Sitemap
            </Link>
            
            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3 text-indigo-400" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
