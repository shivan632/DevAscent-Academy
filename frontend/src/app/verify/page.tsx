'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Award,
  Hash,
  ArrowRight,
} from 'lucide-react';

export default function VerifyIndexPage() {
  const router = useRouter();
  const [certId, setCertId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify/${certId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4 sm:px-6 space-y-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DevAscent Public Trust Registry</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Verify Digital Certificate
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enter the unique Certificate ID printed on your document or QR code to verify its authenticity on the immutable public ledger.
            </p>
          </div>

          <form onSubmit={handleSearch} className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. DEV-2026-A1B2C3"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!certId.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Verify Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Hash className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1">SHA-256 Hash</p>
              <p className="text-[11px] text-slate-500">Cryptographically tamper-proof fingerprint.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1">Instant Validation</p>
              <p className="text-[11px] text-slate-500">Real-time status lookup against registry.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1">Direct PDF & QR</p>
              <p className="text-[11px] text-slate-500">High-resolution verified PDF download.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
