'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LegacyLessonRedirect() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawCourseId).toLowerCase().trim().replace(/\s+/g, '-');
  const lessonId = params?.lessonId as string;

  useEffect(() => {
    if (courseSlug && lessonId) {
      router.replace(`/learn/${courseSlug}/topic/${lessonId}`);
    }
  }, [courseSlug, lessonId, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      <p className="text-sm font-medium animate-pulse">Loading Topic...</p>
    </div>
  );
}
