'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Mail, Clock } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Student Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              7-Day Money-Back Guarantee Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Our transparent, fair, zero-risk commitment to every ambitious student enrolling in DevAscent Academy.
            </p>
          </div>

          {/* Policy Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">1. The 7-Day Zero-Risk Guarantee</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We are confident in the engineering rigor, hands-on capstone depth, and practical mentorship of our cohorts. If within <span className="font-semibold text-slate-900">7 calendar days</span> of your purchase date you feel this program does not match your expectations, we will issue a full 100% refund of your enrollment fee (₹1,499).
              </p>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">2. Eligibility Criteria</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The refund request must be submitted within 7 calendar days from the initial transaction timestamp.</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Course completion progress must be under 20% (maximum of 4 completed lessons or exercises).</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The final certificate must not have been claimed or issued.</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">3. How to Request a Refund</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We make the refund process completely seamless and frictionless. You have two instant options:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Option A: 1-Click Dashboard</h4>
                  <p className="text-xs text-slate-500">Log in to your Student Dashboard and click "Request 7-Day Refund" in the guarantee panel.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Option B: Email Billing Desk</h4>
                  <p className="text-xs text-slate-500">Send an email to <span className="font-semibold text-slate-800">support@devascent.io</span> with your registered email and Razorpay payment ID.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">4. Payout Timeline</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Once submitted, our billing engine immediately approves the refund and triggers the reversal via Razorpay. The funds typically reflect in your original payment source (UPI / Bank / Card) within 3 to 5 business days.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/checkout?course=full-stack-web-development"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all text-center"
              >
                Enroll Now with Zero Risk (₹1,499)
              </Link>
              <Link
                href="/support"
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <span>Have more questions? Visit Help Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
