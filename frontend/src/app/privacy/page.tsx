'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Cpu,
  Mail,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  KeyRound,
  Trash2,
  Bell,
  Scale,
} from 'lucide-react';

const PRIVACY_SECTIONS = [
  { id: 'overview', title: '1. Privacy Overview & DPDP Compliance' },
  { id: 'data-collected', title: '2. Information We Collect' },
  { id: 'purpose-use', title: '3. How We Use Your Information' },
  { id: 'data-sharing', title: '4. Third-Party Service Providers' },
  { id: 'cookies-tracking', title: '5. Cookies & Local Session Storage' },
  { id: 'user-rights', title: '6. Your Rights Under DPDP Act 2023' },
  { id: 'data-security', title: '7. Data Security & Cryptography' },
  { id: 'retention', title: '8. Data Retention & Account Deletion' },
  { id: 'grievance', title: '9. Data Protection Officer & Grievance' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-cyan-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Privacy{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Effective Date: <strong className="text-slate-200">January 1, 2026</strong> • Last Updated: <strong className="text-slate-200">October 2026</strong>
              <br />
              At <strong>DevAscent Academy</strong>, we are deeply committed to protecting your student privacy, academic telemetry, and financial transaction confidentiality.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 max-w-2xl mx-auto text-xs text-slate-400 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Zero selling of student data. Encrypted credentials &amp; verifiable records.</span>
              </div>
              <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 font-bold whitespace-nowrap">
                Terms of Service →
              </Link>
            </div>
          </div>

          {/* Dual Layout: Sidebar Table of Contents + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-4 sticky top-28 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Privacy Sections
              </span>
              <nav className="space-y-1">
                {PRIVACY_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      activeSection === sec.id
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Related Policies
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <Link href="/terms" className="text-indigo-400 hover:underline">
                    • Terms &amp; Conditions
                  </Link>
                  <Link href="/refund-policy" className="text-emerald-400 hover:underline">
                    • 7-Day Refund Policy
                  </Link>
                  <Link href="/disclaimer" className="text-amber-400 hover:underline">
                    • Placement Disclaimer
                  </Link>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* 1. Overview */}
              <section id="overview" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Privacy Overview &amp; DPDP Compliance</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    DevAscent Academy (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates as a Data Fiduciary under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>.
                  </p>
                  <p>
                    This Privacy Policy articulates how we collect, process, store, and safeguard your personal data when you interact with our courses, virtual internships, and public registry at <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">https://dev-ascent-academy.vercel.app</code>.
                  </p>
                </div>
              </section>

              {/* 2. Data Collected */}
              <section id="data-collected" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Information We Collect</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        Account &amp; Student Identity
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Full legal name, email address, WhatsApp/mobile number, college/university name, degree, and graduation year.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        Course Telemetry &amp; Code Submissions
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Lesson completion timestamps, quiz attempts and scores, capstone GitHub repositories, LinkedIn showcase links, and doubt tickets.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Payment Transaction References
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Razorpay Order ID, Payment ID, amount paid, and invoice timestamps. <em>(We do NOT store raw credit card numbers or banking PINs)</em>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        Technical Logs &amp; Audit Trail
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        IP address, device browser agent, login session tokens, and security audit logs to prevent fraudulent multiple-device abuse.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Purpose */}
              <section id="purpose-use" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">How We Use Your Information</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>Your personal data is strictly processed for legitimate educational purposes:</p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-300">
                    <li>Granting secure authenticated access to course modules, video lectures, and projects.</li>
                    <li>Generating cryptographically sealed SHA-256 Certificates of Internship and official Offer Letters.</li>
                    <li>Delivering transactional notifications (OTP verifications, password resets, doubt resolution alerts, and cohort start dates).</li>
                    <li>Processing refund requests back through Razorpay in accordance with our 7-Day Refund Policy.</li>
                  </ul>
                </div>
              </section>

              {/* 4. Third-Party Sharing */}
              <section id="data-sharing" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                    4
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Third-Party Service Providers</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    We never rent, trade, or sell student information. We only share necessary data with trusted cloud infrastructure providers under strict Data Processing Agreements:
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <strong className="text-white">Razorpay Software Pvt. Ltd.</strong>
                        <p className="text-slate-400">Payment processing, UPI/Card reconciliation, and automated refunds.</p>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PCI-DSS Level 1</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <strong className="text-white">Neon PostgreSQL &amp; AWS Cloud</strong>
                        <p className="text-slate-400">Encrypted database storage and serverless computing instances.</p>
                      </div>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">AES-256</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <strong className="text-white">Transactional Mail &amp; SMS Relays</strong>
                        <p className="text-slate-400">Sending registration OTPs and certificate download links.</p>
                      </div>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">TLS 1.3</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Cookies */}
              <section id="cookies-tracking" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                    5
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Cookies &amp; Local Session Storage</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    We use secure, HTTP-only cookies and browser LocalStorage solely to maintain your active login session, preserve video playback progress across devices, and retain shopping cart / coupon selections.
                  </p>
                  <p>
                    We do not deploy intrusive third-party cross-site behavioral tracking or adware trackers.
                  </p>
                </div>
              </section>

              {/* 6. User Rights DPDP */}
              <section id="user-rights" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                    6
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Your Rights Under DPDP Act 2023</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>As a Data Principal in India, you possess the following statutory rights:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">Right to Access:</strong>
                      <p className="text-slate-400">Request a copy of all personal records and learning telemetry stored with us.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">Right to Correction:</strong>
                      <p className="text-slate-400">Update misspelled names, phone numbers, or college credentials in your profile.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">Right to Erasure:</strong>
                      <p className="text-slate-400">Request account deletion and removal of personal identifiers from active databases.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">Right to Grievance Redressal:</strong>
                      <p className="text-slate-400">Lodge concerns directly with our Data Protection &amp; Grievance Officer.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Security */}
              <section id="data-security" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    7
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Data Security &amp; Cryptography</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    We implement robust technical and organizational security safeguards:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                    <li>Password hashes salted and generated using industry-standard bcrypt hashing.</li>
                    <li>All network communications encrypted using modern TLS 1.3 over HTTPS.</li>
                    <li>JWT tokens signed with secret keys and validated with expiration timers.</li>
                    <li>Immutable SHA-256 certificate hashing to prevent academic fraud or credential tampering.</li>
                  </ul>
                </div>
              </section>

              {/* 8. Retention */}
              <section id="retention" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black">
                    8
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Data Retention &amp; Account Deletion</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    We retain your academic records and certificate registry records indefinitely so recruiters can verify your achievements at any future date. If you request account closure, we anonymize your personal details while maintaining mandatory financial accounting records for statutory audit compliance (7 years as required by Indian tax laws).
                  </p>
                </div>
              </section>

              {/* 9. Grievance */}
              <section id="grievance" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                    9
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Data Protection Officer &amp; Grievance Contact</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    If you have questions about this Privacy Policy or wish to exercise your rights, contact our Data Protection Officer:
                  </p>
                  
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <p className="text-white font-bold">Data Protection Officer: <span className="text-cyan-400">Shivan Mishra</span></p>
                    <p className="text-slate-400">Email: <a href="mailto:devascentacademy@gmail.com" className="text-cyan-400 underline">devascentacademy@gmail.com</a></p>
                    <p className="text-slate-400">Direct Phone: <a href="tel:+919935806722" className="text-emerald-400">+91 99358 06722</a></p>
                    <p className="text-slate-400">Location: DevAscent Academy, Bengaluru, Karnataka, India</p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      * Inquiries are acknowledged within 48 hours and resolved in accordance with DPDP Act statutory timelines.
                    </p>
                  </div>
                </div>
              </section>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
