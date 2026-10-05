'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LearnCourseRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawSlug).toLowerCase().trim().replace(/\s+/g, '-');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug) return;

    let isMounted = true;
    async function resolveTargetRoute() {
      try {
        setLoading(true);
        const res = await fetchApi(`/courses/${courseSlug}/curriculum`);
        const data = res?.data || res;

        if (!isMounted) return;

        const aiVideos = data?.aiVideos || [];
        const topics = data?.topics || data?.lessons || [];

        // 1. Check if Milestone 1 Video is not yet watched
        const video1 = aiVideos.find((v: any) => v.order === 1);
        if (video1 && !video1.isWatched && video1.isUnlocked) {
          router.replace(`/learn/${courseSlug}/video/${video1.id}`);
          return;
        }

        // 2. Otherwise find the first unlocked topic that is not yet completed
        const activeTopic = topics.find((t: any) => t.isUnlocked && !t.isCompleted);
        const targetTopic = activeTopic || topics.find((t: any) => t.isUnlocked) || topics[0];

        if (targetTopic) {
          router.replace(`/learn/${courseSlug}/topic/${targetTopic.id}`);
        } else if (video1) {
          router.replace(`/learn/${courseSlug}/video/${video1.id}`);
        } else {
          setError('No curriculum content available in this course yet.');
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load course curriculum.');
          setLoading(false);
        }
      }
    }

    resolveTargetRoute();
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
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
