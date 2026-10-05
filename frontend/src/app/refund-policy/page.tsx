'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Mail,
  Clock,
  Zap,
  Sparkles,
  CreditCard,
  RefreshCcw,
  Check,
  Copy,
  ChevronDown,
  Lock,
  ExternalLink,
  LifeBuoy,
  FileText,
  BadgeCheck,
} from 'lucide-react';

const ELIGIBILITY_RULES = [
  {
    title: '7 Calendar Days Window',
    desc: 'Submit your request within 7 calendar days from your initial payment/enrollment timestamp.',
    tag: '7 Days',
  },
  {
    title: 'Progress Under 20%',
    desc: 'Curriculum completion must be under 20% (up to 4 lessons or exercises explored).',
    tag: '< 20% Progress',
  },
  {
    title: 'Certificate Unclaimed',
    desc: 'The official verified internship certificate must not have been issued or claimed.',
    tag: 'Uncertified',
  },
];

const TIMELINE_STEPS = [
  {
    step: '01',
    title: 'Submit Request',
    desc: 'Request via 1-click in Dashboard, this policy page, or direct email to billing desk.',
    duration: 'Instant (1 min)',
  },
  {
    step: '02',
    title: 'Auto-Verification',
    desc: 'Our billing system validates transaction timestamp and curriculum progress.',
    duration: '< 4 Business Hours',
  },
  {
    step: '03',
    title: 'Razorpay Payout',
    desc: 'Funds are directly reversed back to your original UPI, Debit/Credit Card, or Netbanking.',
    duration: '3 - 5 Business Days',
  },
];

const REFUND_FAQS = [
  {
    q: 'How will I receive the refunded money?',
    a: 'Refunds are automatically processed to the original payment method used during checkout (Google Pay, PhonePe, Paytm UPI, Credit/Debit Card, or Netbanking) via our authorized Razorpay payment gateway.',
  },
  {
    q: 'Do I need to give an explanation to get a refund?',
    a: 'No! Our 7-day guarantee is 100% no-questions-asked as long as you meet the basic eligibility criteria (under 20% curriculum progress within 7 calendar days).',
  },
  {
    q: 'What if I enrolled with a discount coupon or offer code?',
    a: 'You will receive 100% of the actual net amount paid during checkout. If you paid ₹1,499, you will receive the full ₹1,499 back with zero processing deductions.',
  },
  {
    q: 'Can I switch to another cohort instead of taking a refund?',
    a: 'Yes! If you prefer switching to another domain (e.g., AI Engineering, Backend, or DevOps), reach out to the mentor desk and we will migrate your batch with zero extra charge.',
  },
];

export default function RefundPolicyPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick Refund Application Modal / Form State
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('devascentacademy@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleQuickRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setApplyError('Please enter your Razorpay Payment ID or Order ID.');
      return;
    }

    setIsSubmitting(true);
    setApplyError(null);
    setApplySuccess(null);

    try {
      await api.requestRefund({
        orderId: orderId.trim(),
        reason: reason.trim() || '7-Day Money Back Guarantee Request',
        upiId: upiId.trim() || undefined,
      });

      setApplySuccess('Refund request submitted successfully! Our billing desk will process your reversal within 4 business hours.');
      setOrderId('');
      setUpiId('');
      setReason('');
    } catch (err: any) {
      setApplyError(err.message || 'Could not submit refund request. You can email devascentacademy@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-600/15 via-teal-600/10 to-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-emerald-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ─── Hero Header ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Student Protection & Zero-Risk Commitment</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              7-Day Money-Back{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Guarantee Policy
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Our transparent, fair, zero-risk promise. Try the curriculum, inspect the capstone blueprints, and experience our mentor platform with complete peace of mind.
            </p>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3 backdrop-blur-xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">100% Full Refund</span>
                  <span className="text-[10px] text-slate-400">₹1,499 returned in full</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3 backdrop-blur-xl">
                <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">No Hidden Deductions</span>
                  <span className="text-[10px] text-slate-400">Zero processing fees</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3 backdrop-blur-xl">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Fast Direct Reversal</span>
                  <span className="text-[10px] text-slate-400">3–5 Days to UPI / Bank</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Main Policy Document Cards ─── */}
          <div className="space-y-8">
            
            {/* 1. The Zero-Risk Commitment */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-black">
                  1
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  The 7-Day Zero-Risk Guarantee
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-0 sm:pl-11">
                We are confident in the engineering rigor, hands-on capstone depth, and practical mentorship of our virtual internship cohorts. If within <span className="text-emerald-400 font-bold">7 calendar days</span> of your enrollment timestamp you feel this program does not match your expectations, we will issue a full <span className="text-white font-bold">100% refund of your enrollment fee (₹1,499)</span>.
              </p>
            </div>

            {/* 2. Eligibility Criteria */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-black">
                  2
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Eligibility Criteria & Fair Guardrails
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 sm:pl-11">
                {ELIGIBILITY_RULES.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {rule.tag}
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

            {/* 3. How to Request a Refund */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                  3
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  How to Request Your Refund
                </h2>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-0 sm:pl-11">
                We make the refund process completely frictionless. You have two instant options:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 sm:pl-11">
                
                {/* Option A: Instant Form on Page */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Option A: Instant Form / Dashboard</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Submit In-App or Student Dashboard
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Use the 1-click refund application right on this page or from your Student Dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(!showApplyForm)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
                  >
                    <span>{showApplyForm ? 'Hide Refund Form' : 'Open 1-Click Refund Form'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option B: Direct Email Desk */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/40 transition-all space-y-3">
                  <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                    <Mail className="w-4 h-4" />
                    <span>Option B: Direct Email Billing Desk</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Email Billing Support
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Send your registered email & payment ID to our billing desk for priority processing.
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:devascentacademy@gmail.com"
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium underline"
                    >
                      devascentacademy@gmail.com
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* In-Page Refund Form (Toggleable) */}
              {showApplyForm && (
                <div className="mt-4 pl-0 sm:pl-11 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4 text-indigo-400" />
                        <span>Submit 7-Day Refund Request</span>
                      </h4>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Zero Processing Fee
                      </span>
                    </div>

                    {applyError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{applyError}</span>
                      </div>
                    )}

                    {applySuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{applySuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleQuickRefundSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Razorpay Payment ID / Order ID <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="e.g. pay_P2k89sd..."
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          UPI ID for Reversal (Optional if using original card/bank)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. username@okhdfcbank"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Reason / Feedback (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Tell us what we could improve (optional)..."
                          className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting Request...' : 'Confirm 100% Refund Request'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Payout Timeline & Gateway Security */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-black">
                  4
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Payout Timeline & Reversal Stages
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 sm:pl-11">
                {TIMELINE_STEPS.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 relative"
                  >
                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      STAGE {t.step}
                    </span>
                    <h3 className="text-xs font-bold text-white pt-1">{t.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{t.desc}</p>
                    <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{t.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Frequently Asked Questions ─── */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>Frequently Asked Policy Questions</span>
              </div>

              <div className="space-y-3">
                {REFUND_FAQS.map((faq, idx) => {
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
