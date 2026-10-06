'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X, Check } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('devascent_cookie_consent');
      if (!consent) {
        // Small delay so page loads gracefully first
        const timer = setTimeout(() => {
          setVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // LocalStorage blocked
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('devascent_cookie_consent', JSON.stringify({
        essential: true,
        functional: true,
        analytics: true,
        timestamp: new Date().toISOString(),
      }));
    } catch (e) {}
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('devascent_cookie_consent', JSON.stringify({
        essential: true,
        functional: false,
        analytics: false,
        timestamp: new Date().toISOString(),
      }));
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie and Privacy Consent Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 dark:bg-[#0D111D]/95 border border-slate-700/80 dark:border-slate-800 shadow-2xl backdrop-blur-xl text-slate-200 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Your Privacy &amp; Cookie Choices
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>DPDP Act 2023 Compliant</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleEssentialOnly}
            aria-label="Close cookie consent banner"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          We use strictly necessary cookies to keep you signed in and process enrollments safely. We never sell student data or use third-party ad retargeting pixels.
        </p>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
          <Link href="/cookie-policy" className="text-indigo-400 hover:text-indigo-300 underline font-medium">
            Cookie Policy
          </Link>
          <span>•</span>
          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline font-medium">
            Privacy Policy
          </Link>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>

          <button
            type="button"
            onClick={handleEssentialOnly}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all"
          >
            <span>Essential Only</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
