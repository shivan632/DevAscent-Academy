'use client';

import React from 'react';
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
  Code2,
  Layers,
  HelpCircle,
  BookOpen,
  LifeBuoy,
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#07090E] text-slate-400 border-t border-slate-850 relative z-20 overflow-hidden">
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-20 left-1/4 w-[600px] h-[300px] bg-gradient-to-t from-indigo-950/20 via-violet-950/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 right-1/4 w-[500px] h-[250px] bg-gradient-to-t from-emerald-950/15 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* ─── 4-5 Column Main Navigation Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Identity (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <img
                src="/logo.png"
                alt="DevAscent Academy"
                className="w-11 h-11 object-cover rounded-2xl border border-indigo-500/30 p-0.5 shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform bg-slate-900"
              />
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white leading-tight">DevAscent</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">
                  Academy &amp; Programs
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Democratizing high-caliber, code-first software engineering education for Indian developers. Bridging college theory with production-grade Full-Stack, NestJS, and Cloud systems.
            </p>

            <div className="text-xs text-slate-500 space-y-1.5 font-medium">
              <p className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </p>
              <p className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Trusted by 500+ BCA &amp; Engineering Students</span>
              </p>
            </div>

            {/* Social Media Channels */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/60 text-slate-400 hover:text-indigo-300 flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter X"
                  className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/40 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Discord / Community */}
                <a
                  href="https://discord.gg/devascent"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-300 flex items-center justify-center transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>100% Verifiable Credentials</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Razorpay 256-Bit SSL</span>
              </div>
            </div>
          </div>

          {/* Column 2: Programs (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Programs</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/courses/web-development-internship" className="hover:text-indigo-300 transition-colors block">
                  Web Development Internship
                </Link>
              </li>
              <li>
                <Link href="/courses/python-programming-internship" className="hover:text-indigo-300 transition-colors block">
                  Python Programming Internship
                </Link>
              </li>
              <li>
                <Link href="/courses/java-programming-internship" className="hover:text-indigo-300 transition-colors block">
                  Java Programming Internship
                </Link>
              </li>
              <li>
                <Link href="/courses/backend-cloud-internship" className="hover:text-indigo-300 transition-colors block">
                  Backend &amp; Cloud Internship
                </Link>
              </li>
              <li>
                <Link href="/courses/data-science-internship" className="hover:text-indigo-300 transition-colors block">
                  Data Science Internship
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-accelerator" className="hover:text-indigo-300 transition-colors block">
                  Full-Stack Accelerator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verification & Platform (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verification</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/verify/DEVASCENT-2025-VALID" className="hover:text-indigo-300 transition-colors flex items-center gap-1 group">
                  <span>Public Registry Search</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="hover:text-indigo-300 transition-colors block">
                  Sample Certificate Demo
                </Link>
              </li>
              <li>
                <Link href="/verify/DEVASCENT-2025-VALID" className="hover:text-indigo-300 transition-colors block">
                  SHA-256 Hash Verification
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-indigo-300 transition-colors block">
                  7-Day Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-indigo-300 transition-colors block">
                  Return &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-300 transition-colors block">
                  Student Learning Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Zero-Risk Card (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Support &amp; Desk</span>
            </h4>
            
            <div className="space-y-2.5 text-xs sm:text-sm">
              <Link href="/contact" className="hover:text-cyan-300 transition-colors flex items-center gap-2">
                <LifeBuoy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Contact &amp; Student Desk</span>
              </Link>
              
              <Link href="/support" className="hover:text-indigo-300 transition-colors flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Help Desk &amp; Doubt Q&amp;A</span>
              </Link>
              
              <a href="mailto:devascentacademy@gmail.com" className="hover:text-indigo-300 transition-colors flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>devascentacademy@gmail.com</span>
              </a>
              
              <a href="tel:+919935806722" className="hover:text-emerald-300 transition-colors flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 99358 06722</span>
              </a>
            </div>

            {/* Zero-Risk Guarantee Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/25 space-y-2 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Zero-Risk Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Full 7-day refund under 20% progress. Zero questions asked. Direct UPI/Card reversal.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>UPI • Cards • NetBanking • RuPay</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Bottom Copyright & Quick Navigation ─── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4">
            <p>© {new Date().getFullYear()} DevAscent Academy Pvt. Ltd. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <span className="text-slate-400 font-medium">Made with ❤️ in India 🇮🇳</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-cyan-300 transition-colors font-medium">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-indigo-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-emerald-400 transition-colors font-medium">
              Refund Policy
            </Link>
            <Link href="/return-policy" className="hover:text-emerald-400 transition-colors font-medium">
              Return Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-amber-400 transition-colors">
              Placement Disclaimer
            </Link>
            <Link href="/support" className="hover:text-indigo-400 transition-colors font-medium">
              Help Desk
            </Link>
            
            {/* Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
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
