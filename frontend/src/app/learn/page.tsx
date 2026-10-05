'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { fetchApi } from '../../lib/api';
import { Loader2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnIndexRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function resolveActiveTrack() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('devascent_token') : null;
        if (!token) {
          router.replace('/login?redirect=/dashboard');
          return;
        }

        // Fetch user's enrollments to find their primary track
        const res = await fetchApi('/enrollments/my');
        const enrollments = Array.isArray(res) ? res : res?.data || [];

        if (!isMounted) return;

        if (enrollments && enrollments.length > 0) {
          const primary = enrollments[0];
          const slug = primary?.course?.slug || primary?.courseSlug;
          if (slug) {
            router.replace(`/learn/${slug}`);
            return;
          }
        }

        // Fallback: If no enrollments found, go to courses catalog or dashboard
        router.replace('/enrolled-courses');
      } catch (err) {
        if (isMounted) {
          router.replace('/dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!authLoading) {
      resolveActiveTrack();
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, router]);

  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center text-slate-300 p-4 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-bold text-white">Opening Learning Portal...</p>
        <p className="text-xs text-slate-500">Resolving your active virtual classroom &amp; lessons</p>
      </div>
    </div>
  );
}
