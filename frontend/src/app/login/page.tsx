'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      const res = await api.login({ email: email.trim().toLowerCase(), password });
      const rawUser = res?.data?.user || res?.user || res?.data;
      if (rawUser) {
        setUser(rawUser);
        if (rawUser.role === 'ADMIN') {
          router.push('/admin/submissions');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error('Login failed: Invalid server response');
      }
    } catch (err: any) {
      if (err?.data?.isEmailVerified === false || err?.message?.toLowerCase().includes('not been verified')) {
        setNeedsVerification(true);
        setUnverifiedEmail(email.trim().toLowerCase());
        setError('Your email address has not been verified yet with OTP.');
      } else {
        setError(err?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
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
              setError(err?.message || 'Google sign-in failed. Please try again.');
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

  const handleSendVerificationCode = async () => {
    setLoading(true);
    try {
      await api.sendOtp(unverifiedEmail);
      router.push(`/register?email=${encodeURIComponent(unverifiedEmail)}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1420] shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Left Panel: Split Aurora Narrative */}
      <div className="relative md:col-span-5 bg-gradient-to-br from-indigo-950 via-[#131b2e] to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
        
        {/* Ambient Left Aurora Blobs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none animate-aurora-flow-1"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-aurora-flow-2"></div>
        <div className="absolute inset-0 hero-grid-pattern opacity-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>DevAscent Portal</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome Back to Your Workspace
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
              Access your cohort lectures, live project reviews, Discord community, and verifiable credential ledger.
            </p>
          </div>
        </div>

        {/* Animated Trust Signals */}
        <div className="relative z-10 space-y-3.5 py-6">
          {[
            '24/7 Access to Lecture Recordings',
            'Automated Tamper-Proof Certificates with QR',
            'Direct Capstone Code Review by Mentor',
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
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Session</span>
          </span>
          <Link href="/support" className="text-indigo-400 hover:text-indigo-300 hover:underline">
            Help Desk
          </Link>
        </div>
      </div>

      {/* Right Panel: Elevated Interactive Form */}
      <div className="md:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-center">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to enter your student dashboard
          </p>
        </div>

        {/* Google Continue Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all group"
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
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          <span className="bg-white dark:bg-[#0F1420] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
            or with email
          </span>
        </div>

        {searchParams.get('verified') === 'true' && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Email verified successfully! You can now sign in.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div className="space-y-1 flex-1">
              <span>{error}</span>
              {needsVerification && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline flex items-center gap-1 hover:text-indigo-700"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Send Verification Code to {unverifiedEmail} →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl focus:outline-none transition-all"
              />
              {isEmailValid && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2 animate-fadeIn" />
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link href="/support" className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          </div>

          {/* Elevated Gradient CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Signing In...</span>
              </span>
            ) : (
              <>
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
          <span>Don't have an enrolled account yet? </span>
          <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register & Verify Email Now
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-[#090d16] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-20 px-4">
        <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
