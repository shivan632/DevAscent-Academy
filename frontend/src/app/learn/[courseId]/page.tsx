import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function LearnCourseRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.courseId || '';
  const courseSlug = decodeURIComponent(rawSlug).toLowerCase().trim().replace(/\s+/g, '-');

  if (!courseSlug) {
    redirect('/courses');
  }

  let targetUrl: string | null = null;
  let errorMessage: string | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('devascent_token')?.value;

    const res = await fetch(`${getApiBaseUrl()}/courses/${courseSlug}/curriculum`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const json = await res.json();
      const data = json?.data || json;
      const aiVideos = data?.aiVideos || [];
      const topics = data?.topics || data?.lessons || [];

      // 1. Check if Milestone 1 Video is not yet watched
      const video1 = aiVideos.find((v: any) => v.order === 1);
      if (video1 && !video1.isWatched && video1.isUnlocked) {
        targetUrl = `/learn/${courseSlug}/video/${video1.id}`;
      } else {
        // 2. Otherwise find the first unlocked topic that is not yet completed
        const activeTopic = topics.find((t: any) => t.isUnlocked && !t.isCompleted);
        const targetTopic = activeTopic || topics.find((t: any) => t.isUnlocked) || topics[0];
        if (targetTopic) {
          targetUrl = `/learn/${courseSlug}/topic/${targetTopic.id}`;
        } else if (video1) {
          targetUrl = `/learn/${courseSlug}/video/${video1.id}`;
        }
      }
    }
  } catch (err: any) {
    errorMessage = err?.message || 'Failed to resolve course content.';
  }

  if (targetUrl) {
    redirect(targetUrl);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Course Notice</h2>
        <p className="text-sm text-slate-400">{errorMessage || 'No lessons found in this course.'}</p>
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
