'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  RotateCw,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Step 1: Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [degree, setDegree] = useState('BCA');

  // Step 2: OTP verification state
  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: 'bg-slate-300' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { level: 33, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { level: 66, label: 'Medium', color: 'bg-amber-500' };
    return { level: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Phone auto-format helper
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+91') && val.trim().length > 0 && !val.startsWith('+')) {
      val = '+91 ' + val;
    }
    setPhone(val);
  };

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.register({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim() || 'Student',
        phone: phone.trim() || '+91 98765 43210',
        degree: degree || 'BCA',
      });

      setStep('OTP');
      setResendCooldown(60);
      setSuccessMsg(res?.message || 'Verification code sent to your email.');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Sign-In SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '934300544473-1ic2l93u2kirb57b7sno5kjosfis9n5c.apps.googleusercontent.com';
    
    // Load Google Identity Services script if not already present
    if (!document.getElementById('google-jssdk')) {
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    setError('');

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '934300544473-1ic2l93u2kirb57b7sno5kjosfis9n5c.apps.googleusercontent.com';

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await api.googleAuth(tokenResponse.access_token);
              const rawUser = res?.data?.user || res?.user || res?.data;
              if (rawUser) {
                setUser(rawUser);
                if (rawUser.role === 'ADMIN') {
                  router.push('/admin/submissions');
                } else {
                  router.push('/dashboard');
                }
              }
            } catch (err: any) {
              setError(err?.message || 'Google registration failed. Please try again.');
            } finally {
              setGoogleLoading(false);
            }
          } else {
            setGoogleLoading(false);
          }
        },
      });
      tokenClient.requestAccessToken();
    } else {
      // Fallback: Direct OAuth redirect
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback/google');
      const scope = encodeURIComponent('openid email profile');
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.verifyOtp(email.trim().toLowerCase(), otpCode.trim());
      const rawUser = res?.data?.user || res?.user;
      if (rawUser) {
        setUser(rawUser);
        router.push('/dashboard');
      } else {
        router.push('/login?verified=true');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');
    try {
      await api.sendOtp(email.trim().toLowerCase(), name.trim());
      setSuccessMsg('A fresh verification code was sent to your email!');
      setResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code. Please wait a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-[#090d16] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-20 px-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-[#0F1420] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* Left Panel: Split Aurora Narrative */}
          <div className="relative md:col-span-5 bg-gradient-to-br from-indigo-950 via-[#131b2e] to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
            
            {/* Ambient Left Aurora Blobs */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none animate-aurora-flow-1"></div>
            <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-aurora-flow-2"></div>
            <div className="absolute inset-0 hero-grid-pattern opacity-20 pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>DevAscent Engineering</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {step === 'REGISTER' ? 'Start Your High-Impact Career' : 'Check Your Inbox'}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                {step === 'REGISTER'
                  ? 'Join India\'s premier cohort-based engineering platform for BCA, MCA, and tech graduates. Verified credentials & real-world GitHub projects.'
                  : `We sent a secure 6-digit verification code to ${email || 'your email'}. Enter it to activate your student workspace.`}
              </p>
            </div>

            {/* Glowing Animated Trust Signals */}
            <div className="relative z-10 space-y-3.5 py-6">
              {[
                'OTP Secured Registration & Verification',
                'Free & Paid Accelerator Cohorts + Internships',
                'Verifiable Certificate with QR Ledger',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/30 hover:bg-white/[0.08] transition-all group backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-xs text-slate-200 font-medium group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted Credentials & Ledger</span>
              </span>
            </div>
          </div>

          {/* Right Panel: Elevated Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            {step === 'REGISTER' ? (
              <>
                <div className="mb-6 space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Create Student Account
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>

                {/* Google Continue Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all group mb-4"
                >
                  {googleLoading ? (
                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-4">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                  <span className="bg-white dark:bg-[#0F1420] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                    or register with email
                  </span>
                </div>

                {error && (
                  <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aarav@college.edu or gmail.com"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl focus:outline-none transition-all"
                      />
                      {isEmailValid && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2 animate-fadeIn" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        WhatsApp / Phone
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Degree Program
                      </label>
                      <div className="relative">
                        <select
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl focus:outline-none transition-all"
                        >
                          <option value="BCA">BCA (Computer Applications)</option>
                          <option value="MCA">MCA (Master of Applications)</option>
                          <option value="BTECH">B.Tech / B.E. (CS / IT / ECE)</option>
                          <option value="BSC_CS">B.Sc Computer Science</option>
                          <option value="OTHER">Other STEM Background</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Create Password
                      </label>
                      {password && (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          Strength: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Animated Strength Bar */}
                    {password && (
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.level}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Elevated Gradient CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 px-6 rounded-xl text-white font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{loading ? 'Creating Account...' : 'Continue to Verification'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              </>
            ) : (
              /* OTP Screen */
              <div className="space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Verify Your Email</h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enter the 6-digit code sent to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
                  </p>
                </div>

                {successMsg && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 text-center">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full text-center py-4 bg-slate-50 dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl text-3xl font-mono tracking-widest text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                    <p className="text-xs text-slate-400 text-center mt-2">
                      Code expires in 10 minutes. Maximum 5 attempts.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{loading ? 'Verifying...' : 'Verify & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('REGISTER');
                      setError('');
                    }}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    ← Edit details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Verification Code'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
