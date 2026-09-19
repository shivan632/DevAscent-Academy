'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace('/login?redirect=/admin/dashboard');
      } else if (user.role !== 'ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // While loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-white/40">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  // Not admin — show nothing while redirect happens
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-[#080C14]/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2 ml-10 lg:ml-0">
            <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">
              DevAscent Academy
            </span>
            <span className="text-white/20">·</span>
            <span className="text-xs font-bold text-indigo-400">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/30">Live</span>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
