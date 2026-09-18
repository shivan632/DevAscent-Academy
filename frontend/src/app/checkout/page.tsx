'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store/authStore';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  Tag,
  ArrowRight,
  Clock,
  Award,
  Zap,
  Briefcase
} from 'lucide-react';
import { ALL_COURSES_CATALOG } from '../courses/page';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useAuthStore();

  const courseParam = searchParams.get('course') || 'full-stack-accelerator';
  const priceParam = searchParams.get('price');

  // Find course details from catalog
  const selectedCourse = ALL_COURSES_CATALOG.find((c) => c.slug === courseParam) || {
    title: 'Full-Stack Web Development Cohort',
    slug: 'full-stack-accelerator',
    earlyBirdPriceInPaise: 59900,
    priceInPaise: 199900,
    durationWeeks: 6,
    type: 'COURSE'
  };

  const courseEarlyBird = priceParam
    ? parseInt(priceParam, 10)
    : selectedCourse.earlyBirdPriceInPaise / 100;
  
  const courseStandard = selectedCourse.priceInPaise / 100;

  const [fullName, setFullName] = useState(user?.name || 'Shivan Mishra');
  const [email, setEmail] = useState(user?.email || 'shivan.mishra@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 99358 06722');
  const [college, setCollege] = useState(user?.college || 'Pune University (BCA)');
  const [couponCode, setCouponCode] = useState('DEVASCENT');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const basePrice = courseStandard;
  const finalPrice = courseEarlyBird;
  const discount = basePrice - finalPrice;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'EARLYBIRD70' || couponCode.toUpperCase() === 'DEVASCENT' || couponCode.toUpperCase() === 'CODSOFT') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try DEVASCENT');
      setCouponApplied(false);
    }
  };

  const handlePayNow = async () => {
    setIsProcessing(true);

    // Mock/Sandbox Payment simulation
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Update client store state
      setUser({
        id: user?.id || 'std_demo_101',
        name: fullName,
        email: email,
        phone: phone,
        college: college,
        role: 'STUDENT',
      });

      // Redirect to student classroom / dashboard
      setTimeout(() => {
        router.push('/dashboard?enrolled=' + encodeURIComponent(selectedCourse.slug));
      }, 2200);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
          Razorpay Secured 256-Bit Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Complete Your Enrollment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Instant task dashboard access, mentor guidance, and verifiable digital certificate upon payment.
        </p>
      </div>

      {paymentSuccess ? (
        /* Success State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Successful!</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Welcome, <span className="font-semibold text-slate-900 dark:text-white">{fullName}</span>! Your enrollment for <strong className="text-indigo-600 dark:text-indigo-400">{selectedCourse.title}</strong> is confirmed.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-left text-xs font-mono text-slate-600 dark:text-slate-300 space-y-1 border border-slate-200 dark:border-slate-800">
            <p>Transaction ID: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">pay_rzp_{Date.now().toString().slice(-8)}</span></p>
            <p>Amount Paid: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">₹{finalPrice} (GST Included)</span></p>
            <p>Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE ENROLLMENT</span></p>
          </div>
          <p className="text-xs text-slate-400">Redirecting to your Student Workspace in 2 seconds...</p>
        </div>
      ) : (
        /* Main Checkout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Student Details */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Student Contact Information</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your verifiable certificate and classroom credentials will be issued to these details.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shivan Mishra"
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99358 06722"
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">College / Degree / Current Role</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. BCA / MCA / B.Tech / Working Professional"
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Trust Guarantee Note */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>7-Day Zero-Risk Money-Back Guarantee</span>
              </div>
              <p className="text-emerald-800 dark:text-emerald-400 leading-relaxed">
                If you don&apos;t find value in the first week, request a 100% full refund with zero questions asked.
              </p>
            </div>
          </div>

          {/* Right Summary: Order & Razorpay Trigger */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Order Summary</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {selectedCourse.type === 'INTERNSHIP' ? '💼 4-Week Virtual Internship' : '🚀 Engineering Cohort'}
                </span>
              </div>

              {/* Course line item */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{selectedCourse.title}</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedCourse.durationWeeks || 4} Weeks Tasks + LOR + Verified Cert</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Coupon / Referral Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="DEVASCENT"
                    className="flex-1 uppercase px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Special Early-Bird Scholarship Applied! (₹{discount} Saved)</span>
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
                )}
              </form>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Standard Enrollment Fee:</span>
                  <span>₹{basePrice}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Early Bird Discount:</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-800 text-base font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-indigo-600 dark:text-indigo-400">₹{finalPrice}</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all ${
                  isProcessing
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Connecting to Razorpay...</span>
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Razorpay — ₹{finalPrice}</span>
                  </>
                )}
              </button>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>256-Bit SSL</span>
                </span>
                <span>•</span>
                <span>UPI / GPay / PhonePe / Cards / NetBanking</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <CheckoutForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
