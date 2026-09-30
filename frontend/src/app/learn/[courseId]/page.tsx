'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LearnCourseRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params?.courseId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug) return;

    let isMounted = true;
    async function loadFirstLesson() {
      try {
        setLoading(true);
        const res = await fetchApi(`/courses/${courseSlug}/curriculum`);
        const data = res?.data || res;
        const lessons = data?.lessons || [];
        const aiVideos = data?.aiVideos || [];

        // Find the first unlocked lesson or first available lesson
        const firstUnlocked = lessons.find((l: any) => l.isUnlocked);
        const targetLesson = firstUnlocked || lessons[0];

        // Check if Video 1 exists and hasn't been watched yet
        const v1 = aiVideos.find((v: any) => v.order === 1);
        const needsIntro = v1 && !v1.isWatched;

        if (targetLesson && isMounted) {
          router.replace(`/learn/${courseSlug}/${targetLesson.id}${needsIntro ? '?showVideo=1' : ''}`);
        } else if (isMounted) {
          setError('No lessons available in this course yet.');
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load course curriculum.');
          setLoading(false);
        }
      }
    }

    loadFirstLesson();
    return () => {
      isMounted = false;
    };
  }, [courseSlug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">Entering Virtual Classroom...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Course Notice</h2>
        <p className="text-sm text-slate-400">{error || 'No lessons found.'}</p>
        <div className="pt-2">
          <Link
            href="/enrolled-courses"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Return to My Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
