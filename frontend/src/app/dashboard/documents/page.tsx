'use client';

import React, { Suspense } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import StudentSidebar from '../../../components/StudentSidebar';
import AcademicDocumentsSection from '../../../components/AcademicDocumentsSection';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/authStore';

function DocumentsPageContent() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            <StudentSidebar
              activeTab="documents"
              onSelectTab={(tab) => {
                router.push(`/dashboard?tab=${tab}`);
              }}
              customAvatarUrl={user?.avatarUrl}
            />

            <div className="lg:col-span-9 space-y-6">
              <AcademicDocumentsSection studentName={user?.name || 'Student'} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function StudentDocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <DocumentsPageContent />
    </Suspense>
  );
}
