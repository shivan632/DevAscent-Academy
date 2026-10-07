'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const emailMatch = Boolean(
    user?.email &&
      (user.email.toLowerCase().trim() === 'shivrom.2020@gmail.com' ||
        user.email.toLowerCase().trim() ===
          (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || '').toLowerCase().trim())
  );
  const isAllowed = Boolean(user && (user.role === 'ADMIN' || emailMatch));

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (mounted && !isLoading) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('devascent_token') : null;
      if (!token && !user) {
        window.location.href = '/login';
      } else if (user && !isAllowed) {
        window.location.href = '/dashboard';
      }
    }
  }, [mounted, isLoading, user, isAllowed]);

  // While mounting or loading auth state, render loading placeholder consistently on server & client
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-white/40 font-medium">Verifying admin credentials…</p>
        </div>
      </div>
    );
  }

  // Not admin — show nothing while redirect happens
  if (!isAllowed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex text-white font-sans antialiased selection:bg-indigo-500/30">
      {/* Isolated Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Isolated Admin Navbar */}
        <AdminNavbar onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

        {/* Dynamic Admin Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
