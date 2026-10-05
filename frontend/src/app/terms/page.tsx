'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  FileText,
  ShieldCheck,
  Scale,
  Lock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Award,
  CreditCard,
  UserCheck,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility & Account Security' },
  { id: 'ip-rights', title: '3. Intellectual Property Rights' },
  { id: 'code-of-conduct', title: '4. Student Code of Conduct' },
  { id: 'payments-gst', title: '5. Payments, Pricing & GST' },
  { id: 'refunds-cancellations', title: '6. Refund & Batch Switch Policy' },
  { id: 'certifications', title: '7. Certification & Internship Verification' },
  { id: 'disclaimer-liability', title: '8. Disclaimers & Limitation of Liability' },
  { id: 'grievance', title: '9. Grievance Redressal & Support' },
  { id: 'governing-law', title: '10. Governing Law & Jurisdiction' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance');

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

      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Legal Terms of Service &amp; User Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Terms &amp;{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Effective Date: <strong className="text-slate-200">January 1, 2026</strong> • Last Updated: <strong className="text-slate-200">October 2026</strong>
              <br />
              Please review these terms carefully before enrolling in any DevAscent Academy cohort, virtual internship, or purchasing access to our curriculum.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 max-w-2xl mx-auto text-xs text-slate-400 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Compliant with Indian IT Act 2000, DPDP Act 2023 &amp; Consumer Protection (E-Commerce) Rules.</span>
              </div>
              <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 font-bold whitespace-nowrap">
                Privacy Policy →
              </Link>
            </div>
          </div>

          {/* Dual Layout: Sidebar Table of Contents + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Quick Navigation Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-4 sticky top-28 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Table of Contents
              </span>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      activeSection === sec.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
                  Quick Links
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <Link href="/privacy" className="text-indigo-400 hover:underline">
                    • Privacy Policy
                  </Link>
                  <Link href="/refund-policy" className="text-emerald-400 hover:underline">
                    • 7-Day Refund Policy
                  </Link>
                  <Link href="/disclaimer" className="text-amber-400 hover:underline">
                    • Placement Disclaimer
                  </Link>
                  <Link href="/support" className="text-slate-400 hover:underline">
                    • Grievance &amp; Support Desk
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Terms Content */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* 1. Acceptance */}
              <section id="acceptance" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Acceptance of Terms</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    By accessing, browsing, registering on, or purchasing from <strong>DevAscent Academy</strong> (the &ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), located at <code className="text-indigo-300 bg-slate-950 px-2 py-0.5 rounded">https://dev-ascent-academy.vercel.app</code> or its subdomains, you (&ldquo;Student&rdquo;, &ldquo;User&rdquo;, or &ldquo;You&rdquo;) agree to be legally bound by these Terms &amp; Conditions.
                  </p>
                  <p>
                    If you do not agree with any part of these Terms, you must immediately discontinue using our services and platform.
                  </p>
                </div>
              </section>

              {/* 2. Eligibility & Account Security */}
              <section id="eligibility" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Eligibility &amp; Account Security</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Age Requirement:</strong> You must be at least 18 years of age or possess legal parental/guardian consent if you are between 13 and 18 years old, in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act).
                    </li>
                    <li>
                      <strong>Accuracy of Credentials:</strong> You agree to provide accurate, up-to-date legal name, contact number, and college details during registration and checkout. These credentials are mathematically locked into your verifiable certificate.
                    </li>
                    <li>
                      <strong>Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your account login credentials. Sharing accounts, transferring seats, or reselling access is strictly prohibited and subject to immediate termination.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 3. Intellectual Property Rights */}
              <section id="ip-rights" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Intellectual Property Rights</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    All content hosted on DevAscent Academy—including curriculum blueprints, video recordings, interactive quizzes, capstone architectures, source codes, trademarks, logos, and downloadable PDFs—is the exclusive proprietary property of <strong>DevAscent Academy</strong> and protected under Indian Copyright and Trademark laws.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 space-y-2">
                    <span className="text-xs font-bold text-indigo-300 block">Limited Personal License:</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We grant you a non-exclusive, non-transferable, revocable personal license to view course materials for self-paced learning. You may not record, reproduce, redistribute, broadcast, or publicly host our proprietary training content without prior written authorization.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Student Code of Conduct */}
              <section id="code-of-conduct" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    4
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Student Code of Conduct</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>When participating in our community, doubt discussions, or submitting project work, you agree not to:</p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-400">
                    <li>Submit plagiarized source code or clone repositories from peers without original architectural implementation.</li>
                    <li>Engage in harassment, abusive language, or defamatory remarks toward instructors, mentors, or fellow peers.</li>
                    <li>Attempt to reverse-engineer, scrape, DDoS, or bypass platform authorization mechanisms.</li>
                    <li>Leak or distribute quiz answers or capstone answer keys on public forums.</li>
                  </ul>
                </div>
              </section>

              {/* 5. Payments, Pricing & GST */}
              <section id="payments-gst" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                    5
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Payments, Pricing &amp; GST Invoicing</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    All cohort and course prices are listed in Indian Rupees (INR - ₹).
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Payment Gateway:</strong> All online payments are securely processed through our authorized payment partner, <strong>Razorpay Software Private Limited</strong>, with 256-bit bank-grade encryption.
                    </li>
                    <li>
                      <strong>Goods &amp; Services Tax (GST):</strong> Applicable GST (18%) is included or detailed during checkout in accordance with the Central Goods and Services Tax Act, 2017.
                    </li>
                    <li>
                      <strong>Promotions &amp; Coupons:</strong> Discounts and early-bird offers are subject to specific validity periods and usage caps. DevAscent Academy reserves the right to modify or revoke coupon codes at any time.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 6. Refund & Batch Switch */}
              <section id="refunds-cancellations" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                    6
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Refund &amp; Cancellation Policy</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    We provide a transparent <strong>7-Day Money-Back Guarantee</strong>.
                  </p>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs space-y-1.5">
                    <p className="font-bold">Key Eligibility Summary:</p>
                    <p>• Request must be submitted within 7 calendar days of payment.</p>
                    <p>• Course progress must be below 20% (maximum 4 lessons completed).</p>
                    <p>• Certificate must not have been issued or claimed.</p>
                  </div>
                  <p>
                    For detailed application steps and processing timeline, please consult our full <Link href="/refund-policy" className="text-emerald-400 font-bold hover:underline">7-Day Refund Policy Page</Link>.
                  </p>
                </div>
              </section>

              {/* 7. Certifications */}
              <section id="certifications" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black">
                    7
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Certification &amp; Internship Verification</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    Official Virtual Internship Certificates and Offer Letters are awarded exclusively upon successful project submission and code evaluation by our mentor team.
                  </p>
                  <p>
                    Every certificate includes an immutable, unique <strong>Certificate ID</strong> and a cryptographic <strong>SHA-256 Hash</strong> registered in our public registry, permanently verifiable by recruiters worldwide at <code className="text-purple-300 bg-slate-950 px-2 py-0.5 rounded">/verify/[certId]</code>.
                  </p>
                </div>
              </section>

              {/* 8. Disclaimers */}
              <section id="disclaimer-liability" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-black">
                    8
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Disclaimers &amp; Limitation of Liability</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                    <span className="font-bold flex items-center gap-1.5 text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Educational Purpose &amp; No Placement Guarantee:
                    </span>
                    <p className="leading-relaxed">
                      DevAscent Academy offers skills training and virtual internship simulations designed to enhance software engineering competency. <strong>DevAscent Academy does not guarantee employment, salary packages, or corporate hiring.</strong> Career outcomes depend entirely on individual dedication, interview performance, and market factors. For details, see our <Link href="/disclaimer" className="text-amber-400 font-bold underline">Placement Disclaimer</Link>.
                    </p>
                  </div>
                  <p>
                    To the maximum extent permitted by applicable Indian law, DevAscent Academy shall not be liable for any indirect, incidental, or consequential damages resulting from downtime, network failures, or technical anomalies.
                  </p>
                </div>
              </section>

              {/* 9. Grievance */}
              <section id="grievance" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    9
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Grievance Redressal &amp; Compliance Officer</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    In accordance with the <em>Information Technology Act, 2000</em>, <em>Consumer Protection (E-Commerce) Rules, 2020</em>, and the <em>DPDP Act 2023</em>, the contact details of our Grievance Officer are:
                  </p>
                  
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <p className="text-white font-bold">Grievance &amp; Compliance Desk: <span className="text-indigo-400">Shivan Mishra</span></p>
                    <p className="text-slate-400">Designation: Head of Operations &amp; Grievance Officer</p>
                    <p className="text-slate-400">Email: <a href="mailto:devascentacademy@gmail.com" className="text-indigo-400 underline">devascentacademy@gmail.com</a></p>
                    <p className="text-slate-400">Support Line: <a href="tel:+919935806722" className="text-emerald-400">+91 99358 06722</a></p>
                    <p className="text-slate-400">Address: DevAscent Academy, Tech Operations Unit, Bengaluru, Karnataka, India</p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      * All user grievances are acknowledged within 48 hours and resolved within 30 days as mandated by law.
                    </p>
                  </div>
                </div>
              </section>

              {/* 10. Governing Law */}
              <section id="governing-law" className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                    10
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Governing Law &amp; Jurisdiction</h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bengaluru, Karnataka, India</strong> or <strong>Prayagraj, Uttar Pradesh, India</strong>.
                  </p>
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
