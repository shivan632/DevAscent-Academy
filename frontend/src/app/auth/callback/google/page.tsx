'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuthStore } from '../../../../lib/store/authStore';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleGoogleCallback() {
      try {
        // Look for access_token or id_token in hash fragment or query params
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash || window.location.search);
        const token = params.get('access_token') || params.get('id_token') || params.get('token');

        if (!token) {
          setError('No authentication token received from Google.');
          setTimeout(() => router.push('/login'), 2500);
          return;
        }

        const res = await api.googleAuth(token);
        const rawUser = res?.data?.user || res?.user || res?.data;

        if (rawUser) {
          setUser(rawUser);
          if (rawUser.role === 'ADMIN') {
            router.push('/admin/submissions');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError('Failed to authenticate with Google. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2500);
        }
      } catch (err: any) {
        setError(err?.message || 'Authentication error. Please try again.');
        setTimeout(() => router.push('/login'), 2500);
      }
    }

    handleGoogleCallback();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white p-4">
      <div className="p-8 max-w-md w-full bg-[#0F1420] border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
        {!error ? (
          <>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-bold">Signing in with Google...</h2>
            <p className="text-xs text-slate-400">Verifying your Google credentials with DevAscent...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-rose-400">Sign-In Failed</h2>
            <p className="text-xs text-slate-300">{error}</p>
          </>
        )}
      </div>
    </div>
  );
}
