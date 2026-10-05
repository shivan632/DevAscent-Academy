'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CapstoneSubmitRedirect() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawCourseId).toLowerCase().trim().replace(/\s+/g, '-');

  useEffect(() => {
    if (courseSlug) {
      router.replace(`/learn/${courseSlug}/complete`);
    }
  }, [courseSlug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090E] text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
    </div>
  );
}
