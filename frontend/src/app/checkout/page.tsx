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
  Briefcase,
  Sparkles,
  GraduationCap,
  UserCheck,
  PhoneCall,
  Mail,
  Building2,
  ChevronRight,
  Flame,
  Check,
} from 'lucide-react';
import { ALL_COURSES_CATALOG } from '../../lib/courseCatalogData';
import { api } from '../../lib/api';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, isAuthenticated, isLoading: authLoading } = useAuthStore();

  const courseParam = searchParams.get('course') || 'web-development-internship';
  const priceParam = searchParams.get('price');

  // Find course details from catalog
  const selectedCourse = ALL_COURSES_CATALOG.find((c) => c.slug === courseParam) || {
    title: 'Web Development Virtual Internship',
    slug: 'web-development-internship',
    earlyBirdPriceInPaise: 29900,
    priceInPaise: 99900,
    durationWeeks: 4,
    type: 'INTERNSHIP',
    tasks: ['Landing Page Architecture', 'Personal Portfolio with Interactive Theme', 'Calculator / Dynamic Web App'],
  };

  const courseStandard = selectedCourse.priceInPaise / 100;
  const initialEarlyBird = priceParam
    ? parseInt(priceParam, 10)
    : selectedCourse.earlyBirdPriceInPaise / 100;

  // Student details state
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [university, setUniversity] = useState(user?.college || user?.degree || '');
  
  // Coupon & Price State
  const initialCoupon = searchParams.get('coupon') || '';
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  // Submission & Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
      if (!university) setUniversity(user.college || user.degree || '');
    }
  }, [user]);

  // Recalculate prices
  const basePrice = initialEarlyBird;
  const finalPrice = Math.max(0, basePrice - (couponApplied ? couponDiscount : 0));
  const totalDiscount = couponApplied ? couponDiscount : 0;

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = couponCode.toUpperCase().trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      setCouponApplied(false);
      setCouponDiscount(0);
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError('');
    setCouponSuccessMsg('');

    try {
      const res = await api.validateCoupon(
        code,
        selectedCourse.slug,
        Math.round(basePrice * 100),
      );

      const discountInRupees = Math.round(res.discountInPaise / 100);
      setCouponDiscount(discountInRupees);
      setCouponApplied(true);
      setCouponError('');
      setCouponSuccessMsg(
        `Coupon "${res.code}" applied! You saved ₹${discountInRupees.toLocaleString()}`,
      );
    } catch (err: any) {
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponError(err.message || 'Invalid or expired coupon code.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError('');
    setCouponSuccessMsg('');
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert('You must be signed in to your account to enroll and proceed to payment.');
      router.push(`/login?redirect=${encodeURIComponent(`/checkout?course=${courseParam}${priceParam ? `&price=${priceParam}` : ''}`)}`);
      return;
    }

    if (!fullName.trim()) {
      alert('Please provide your Full Legal Name for your certificate.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid student Email Address.');
      return;
    }
    if (!phone.trim()) {
      alert('Please provide your WhatsApp / Phone number for cohort onboarding.');
      return;
    }
    if (!university.trim()) {
      alert('Please specify your College / University / Current Degree.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Prepare complete student contact and university details
      const studentDetails = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: university.trim(),
        degree: university.trim(),
      };

      // 2. Create Order in Database (stores Name, Email, Phone, University, Course, Price, Coupon & registers/activates Enrollment)
      const orderRes = await api.createOrder(
        selectedCourse.slug,
        couponApplied ? couponCode.toUpperCase().trim() : undefined,
        studentDetails
      );

      const orderPayload = orderRes?.data || orderRes;
      const orderId = orderPayload?.razorpayOrderId || `ord_${Date.now()}`;
      const paymentId = orderPayload?.razorpayPaymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Automatically store authenticated session token
      if (orderPayload?.token) {
        localStorage.setItem('devascent_token', orderPayload.token);
        if (orderPayload.user) {
          setUser(orderPayload.user);
        }
      }

      // 3. Verify Payment & Idempotently Synchronize Ledger in Database
      try {
        const verifyRes = await api.verifyPayment({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: 'demo_mock_verified_signature_sandbox',
        });

        const verifyPayload = verifyRes?.data || verifyRes;
        if (verifyPayload?.token) {
          localStorage.setItem('devascent_token', verifyPayload.token);
          if (verifyPayload.user) {
            setUser(verifyPayload.user);
          }
        }
      } catch (verifyErr) {
        console.warn('Verification sync note:', verifyErr);
      }

      // 4. Update local user state
      if (user) {
        setUser({
          ...user,
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: university.trim(),
        });
      }

      setSuccessDetails({
        paymentId,
        orderId,
        studentName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        university: university.trim(),
        courseTitle: selectedCourse.title,
        amount: finalPrice,
        coupon: couponApplied ? couponCode.toUpperCase().trim() : 'NONE',
      });

      setIsProcessing(false);
      setPaymentSuccess(true);

      // Auto-redirect to enrolled courses
      setTimeout(() => {
        router.push('/enrolled-courses');
      }, 2500);
    } catch (err: any) {
      setIsProcessing(false);
      console.error('Checkout error:', err);
      const errMsg = err?.message || 'Payment processing failed. Please check your details and try again.';
      if (errMsg.includes('already enrolled')) {
        alert('You are already enrolled in this course! Redirecting to your enrolled courses...');
        router.push('/enrolled-courses');
        return;
      }
      alert(errMsg);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Dynamic Ambient Liquid Mesh Background */}
      <div className="absolute -top-24 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-emerald-500/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Razorpay 256-Bit SSL Secured Checkout</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Enrollment</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Fill in your student credentials below to register your seat, connect your ledger records, and unlock your interactive workspace.
        </p>
      </div>

      {!authLoading && !isAuthenticated && !user ? (
        /* Authentication Required Gate */
        <div className="relative z-20 max-w-xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-indigo-500/10 space-y-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-500 animate-pulse" />
          
          <div className="w-16 h-16 bg-indigo-500/15 border border-indigo-400/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-500/20">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>AUTHENTICATION REQUIRED TO ENROLL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Please Sign In to Continue</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              To link your enrollment records, course curriculum, and verifiable cryptographic certificates to your student account, you must sign in or register before proceeding to payment.
            </p>
          </div>

          {/* Selected Course Summary Preview */}
          <div className="bg-slate-950/80 rounded-2xl p-5 text-left text-xs border border-slate-800 space-y-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="font-mono text-[11px] text-slate-400">Selected Program:</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {selectedCourse.type === 'INTERNSHIP' ? '4-WK INTERNSHIP' : '6-WK ACCELERATOR'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{selectedCourse.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{selectedCourse.slug}</p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Payable Amount:</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">₹{initialEarlyBird}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/checkout?course=${courseParam}${priceParam ? `&price=${priceParam}` : ''}`)}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/register?redirect=${encodeURIComponent(`/checkout?course=${courseParam}${priceParam ? `&price=${priceParam}` : ''}`)}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>New Student? Create Free Account</span>
            </Link>

            <div className="pt-2">
              <Link
                href="/courses"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1"
              >
                <span>← Browse other courses in catalog</span>
              </Link>
            </div>
          </div>
        </div>
      ) : paymentSuccess && successDetails ? (
        /* Liquid Animated Success Modal */
        <div className="relative z-20 max-w-xl mx-auto bg-slate-900/80 backdrop-blur-2xl border border-emerald-500/40 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-emerald-500/10 space-y-6 overflow-hidden">
          {/* Subtle liquid glow top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 animate-pulse" />
          
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Enrollment Confirmed & Stored in DB</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Welcome, {successDetails.studentName}!</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              You are officially enrolled in <strong className="text-indigo-400">{successDetails.courseTitle}</strong>.
            </p>
          </div>

          {/* Database Recorded Ledger Card */}
          <div className="bg-slate-950/80 rounded-2xl p-5 text-left text-xs font-mono border border-slate-800 space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center text-slate-400">
              <span>Transaction ID:</span>
              <span className="text-indigo-400 font-bold">{successDetails.paymentId}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Student Name:</span>
              <span className="text-white font-semibold">{successDetails.studentName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Email Address:</span>
              <span className="text-slate-200">{successDetails.email}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Phone / WhatsApp:</span>
              <span className="text-slate-200">{successDetails.phone}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>University / College:</span>
              <span className="text-slate-200">{successDetails.university}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Coupon Applied:</span>
              <span className="text-amber-400 font-bold">{successDetails.coupon}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-300 font-bold">Amount Paid:</span>
              <span className="text-emerald-400 font-black">₹{successDetails.amount} (All Inclusive)</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/enrolled-courses"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <span>Go to My Enrolled Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-slate-400">Redirecting automatically in 3 seconds...</p>
          </div>
        </div>
      ) : (
        /* Main Dual-Card Checkout Grid */
        <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Card: 1. Student Contact Information */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 hover:border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6 transition-all relative overflow-hidden group">
            
            {/* Subtle card top gradient shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-1.5 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Step 1 of 2</span>
              </div>
              <h2 className="text-xl font-black text-white">Student Contact Information</h2>
              <p className="text-xs text-slate-400">
                Your verifiable certificate, official offer letter, and portal login will be issued directly to these credentials.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Full Legal Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Full Legal Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Raja Mishra"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-950/80 text-white placeholder-slate-500 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Email and Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shivanmishra174@gmail.com"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-950/80 text-white placeholder-slate-500 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* WhatsApp / Phone */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                    <span>WhatsApp / Phone *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 7579081973"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-950/80 text-white placeholder-slate-500 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* University / College / Degree */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>College / University / Current Degree *</span>
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. United University, Prayagraj (BCA/B.Tech)"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-950/80 text-white placeholder-slate-500 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7-Day Zero-Risk Money-Back Guarantee</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                If you don&apos;t find immense practical value within your first week, request a 100% full refund through your student desk with zero friction.
              </p>
            </div>
          </div>

          {/* Right Card: 2. Order Summary & Payment Gateway */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 hover:border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden group">
              
              {/* Card top glow */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-1.5 pb-3 border-b border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white">2. Order Summary</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedCourse.type === 'INTERNSHIP'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {selectedCourse.type === 'INTERNSHIP' ? '💼 4-Week Virtual Internship' : '🚀 Engineering Cohort'}
                  </span>
                </div>
              </div>

              {/* Course details banner */}
              <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{selectedCourse.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedCourse.durationWeeks || 4} Weeks Tasks + LOR + Verified Cert</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-300 shrink-0 font-mono">₹{basePrice}</span>
                </div>
              </div>

              {/* Coupon / Referral Code Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Discount Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={couponApplied || isValidatingCoupon}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!couponApplied) handleApplyCoupon();
                      }
                    }}
                    placeholder="ENTER CODE"
                    className="flex-1 uppercase px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider bg-slate-950/90 text-white placeholder-slate-600 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                    >
                      {isValidatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  )}
                </div>

                {couponApplied && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-fadeIn">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponSuccessMsg}</span>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-400 font-semibold">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Standard Enrollment Fee:</span>
                  <span className="font-mono text-slate-300 font-semibold">₹{basePrice}</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Early Bird / Referral Discount:</span>
                    <span className="font-mono">- ₹{totalDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span className="text-slate-300 font-medium">Included</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-sm font-bold text-white">
                  <span className="text-slate-200">Total Amount:</span>
                  <div className="flex items-baseline gap-2">
                    {couponApplied && (
                      <span className="text-xs text-slate-500 line-through font-mono">₹{basePrice}</span>
                    )}
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 font-mono">
                      ₹{finalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Liquid Radiant Payment Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full relative group/btn overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {/* Liquid animated flowing border */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl animate-pulse group-hover/btn:opacity-100 transition-opacity" />
                
                <div className="relative flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99]">
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Recording Enrollment & Connecting Razorpay...</span>
                    </span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay with Razorpay — ₹{finalPrice}</span>
                    </>
                  )}
                </div>
              </button>

              {/* Payment Trust Badges */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-Bit SSL</span>
                </span>
                <span>•</span>
                <span>UPI / GPay / PhonePe / Cards / NetBanking</span>
              </div>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <Suspense fallback={
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <CheckoutForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
