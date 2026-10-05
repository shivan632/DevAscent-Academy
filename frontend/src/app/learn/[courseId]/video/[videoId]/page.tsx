'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import confetti from 'canvas-confetti';
import { fetchApi, api } from '@/lib/api';
import LearnSidebar from '@/components/learn/LearnSidebar';
import {
  PlayCircle,
  CheckCircle2,
  Menu,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Video,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetchApi(url).then((res) => res?.data || res);

export default function AiVideoPage() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawCourseId).toLowerCase().trim().replace(/\s+/g, '-');
  const videoId = params?.videoId as string;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [markingWatched, setMarkingWatched] = useState(false);

  // Single fast SWR query with deduping and caching
  const { data, error, isLoading, mutate } = useSWR(
    courseSlug && videoId ? `/courses/${courseSlug}/videos/${videoId}/full` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 300000, // 5 min cache
      keepPreviousData: true,
    }
  );

  const video = data?.video;
  const curriculum = data?.curriculum;

  // Prefetch target topic for instant navigation
  React.useEffect(() => {
    if (video?.targetTopicUrl) {
      router.prefetch(video.targetTopicUrl);
    }
  }, [video, router]);

  const handleMarkWatched = async () => {
    if (!video || markingWatched) return;

    try {
      setMarkingWatched(true);
      await api.markAiVideoWatched(video.id);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Update SWR cache optimistically
      mutate(
        (prev: any) => ({
          ...prev,
          video: { ...prev?.video, isWatched: true },
        }),
        false
      );

      // Smoothly navigate to the first topic of this milestone
      const targetUrl = video.targetTopicUrl || `/learn/${courseSlug}/topic/${video.targetTopicId}`;
      router.push(targetUrl);
    } catch (err: any) {
      alert(err?.message || 'Failed to mark video as watched.');
    } finally {
      setMarkingWatched(false);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">Loading AI Overview Video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Video Notice</h2>
          <p className="text-sm text-slate-400">{error?.message || 'Video not found or access locked.'}</p>
          <div className="pt-2">
            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <div className="hidden md:block w-80 shrink-0 h-full">
        {curriculum && (
          <LearnSidebar
            curriculum={curriculum}
            currentPath={`/learn/${courseSlug}/video/${videoId}`}
            courseSlug={courseSlug}
          />
        )}
      </div>

      {/* ─── MOBILE DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10">
            {curriculum && (
              <LearnSidebar
                curriculum={curriculum}
                currentPath={`/learn/${courseSlug}/video/${videoId}`}
                courseSlug={courseSlug}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── MAIN VIDEO STAGE ─── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-950">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Curriculum</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Milestone {video.order} Orientation
            </span>
          </div>
        </header>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                <Video className="w-3.5 h-3.5" />
                <span>PART {video.order} — Milestone {video.order} AI Video</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {video.title}
              </h1>
              {video.description && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>

            {/* Video Player Card */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl shadow-indigo-950/20 aspect-video w-full">
              {video.videoUrl ? (
                video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={video.videoUrl.replace('watch?v=', 'embed/')}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={video.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                  <PlayCircle className="w-12 h-12 text-slate-600" />
                  <p className="text-sm">Video content not available.</p>
                </div>
              )}
            </div>

            {/* Single Prominent Action Button (Strictly as specified: "✓ Mark as Watched → Continue to Topic N") */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Unlocks Topics {video.order === 1 ? '1-5' : video.order === 2 ? '6-10' : '11-15'}</p>
                  <p className="text-[11px] text-slate-400">
                    {video.isWatched ? 'You have marked this intro video as watched.' : 'Watch this short intro to unlock the next batch of lecture notes & quizzes.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleMarkWatched}
                disabled={markingWatched}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50 shrink-0"
              >
                {markingWatched ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>✓ Mark as Watched → Continue to Topic {video.targetTopicSeq || 1}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
