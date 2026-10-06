'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  Phone,
  ArrowRight,
  FileText,
  BadgeCheck,
  AlertCircle,
  CreditCard,
  Building,
  ChevronDown,
} from 'lucide-react';

const RETURN_RULES = [
  {
    title: '7-Day Cancellation Window',
    desc: 'You can cancel your course enrollment within 7 calendar days of purchase timestamp for a 100% full reversal.',
    badge: '7 Calendar Days',
  },
  {
    title: 'Digital Returns & Progress Cap',
    desc: 'As digital educational content cannot be returned physically, eligibility requires course progress to be under 20%.',
    badge: '< 20% Completed',
  },
  {
    title: 'Certificate Unissued',
    desc: 'No official verified internship certificate or digital credential should have been minted or issued.',
    badge: 'Unminted Certificate',
  },
];

const RETURN_FAQS = [
  {
    q: 'Can digital courses or internship programs be physically returned?',
    a: 'Because DevAscent Academy delivers digital goods (notes, guided video recordings, interactive quizzes, and capstone repositories), physical returns are impossible. Instead, "returns" are processed as immediate enrollment cancellations with a 100% refund of the fees paid.',
  },
  {
    q: 'How do I cancel my enrollment and request a return?',
    a: 'You can submit a 1-click return/refund request directly via our 7-Day Refund Portal (/refund-policy), or email our billing desk at devascentacademy@gmail.com with your Razorpay Payment ID.',
  },
  {
    q: 'How long does the payment reversal take?',
    a: 'Reversals are reviewed within 4 business hours. Once verified, Razorpay automatically credits the amount back to your original source (UPI, Credit/Debit Card, or NetBanking) within 3 to 5 business days.',
  },
  {
    q: 'Can I exchange my enrollment for a different track instead of cancelling?',
    a: 'Yes! If you prefer switching to another cohort (e.g. from Web Development to Python or Cloud Engineering), our mentor desk will migrate your batch free of charge without requiring cancellation.',
  },
];

export default function ReturnPolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-600/15 via-teal-600/10 to-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-emerald-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ─── Hero Header ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Consumer Protection &amp; Cancellation Standard</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Return &amp;{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Cancellation Policy
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Last Updated: <strong className="text-slate-200">October 2026</strong> • In accordance with Indian Consumer Protection (E-Commerce) Rules and payment gateway merchant guidelines.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 max-w-2xl mx-auto text-xs text-slate-400 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>100% money-back guarantee for course cancellations within 7 calendar days.</span>
              </div>
              <Link href="/refund-policy" className="text-emerald-400 hover:text-emerald-300 font-bold whitespace-nowrap">
                Open 1-Click Form →
              </Link>
            </div>
          </div>

          {/* ─── Core Policy Sections ─── */}
          <div className="space-y-8">

            {/* 1. Digital Nature of Service */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                  1
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Nature of Digital Educational Services
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-0 sm:pl-11">
                <p>
                  <strong>DevAscent Academy</strong> provides digitally delivered educational content, virtual internship cohorts, curriculum notes, project specifications, and verified cryptographic credentials.
                </p>
                <p>
                  Since intellectual property and downloadable notes cannot be physically returned like tangible goods, our &ldquo;Return Policy&rdquo; operates as a comprehensive <strong>Enrollment Cancellation &amp; 100% Fee Reversal Program</strong>.
                </p>
              </div>
            </div>

            {/* 2. Cancellation and Return Window */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-black">
                  2
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Eligibility for Order Cancellation &amp; Full Return
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 sm:pl-11">
                {RETURN_RULES.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {rule.badge}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      {rule.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Reversal Process & Timeline */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                  3
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Reversal Mechanism &amp; Payout Timelines
                </h2>
              </div>
              
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-0 sm:pl-11">
                <p>
                  Upon approval of your enrollment cancellation request:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong>100% of the net amount</strong> paid during checkout is authorized for reversal.</li>
                  <li>Zero processing or cancellation deduction is levied against the student.</li>
                  <li>The payment is credited back to the original source (UPI, Debit/Credit Card, NetBanking) through our authorized Razorpay gateway within <strong>3 to 5 business days</strong>.</li>
                </ul>
              </div>
            </div>

            {/* 4. Batch Rescheduling & Migration Option */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                  4
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Batch Rescheduling / Cohort Migration
                </h2>
              </div>
              
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-0 sm:pl-11">
                <p>
                  If you are unable to participate in your enrolled cohort due to academic exams, internships, or personal commitments, you do not need to cancel. DevAscent Academy permits free cohort deferral or migration to another track within 30 days of enrollment. Reach out to our mentor support desk to request a batch transfer.
                </p>
              </div>
            </div>

            {/* 5. How to Initiate a Return / Cancellation */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                  5
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  How to Initiate Your Return
                </h2>
              </div>
              
              <div className="pl-0 sm:pl-11 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-300 block">Method 1: Instant In-App Portal</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Visit our dedicated refund &amp; cancellation desk page to submit your Razorpay payment ID for auto-validation.
                    </p>
                    <Link
                      href="/refund-policy"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
                    >
                      <span>Open Refund &amp; Return Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-indigo-300 block">Method 2: Email Billing Desk</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Email your registered email and Payment ID to <a href="mailto:devascentacademy@gmail.com" className="text-indigo-400 underline">devascentacademy@gmail.com</a>.
                    </p>
                    <p className="text-[11px] text-slate-500">Helpline: +91 99358 06722 (Mon–Sat, 9 AM – 8 PM IST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. FAQs */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>Frequently Asked Return &amp; Cancellation Questions</span>
              </div>

              <div className="space-y-3">
                {RETURN_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800/80 bg-slate-950/40 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-400' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
