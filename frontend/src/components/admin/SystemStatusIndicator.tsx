'use client';

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { api } from '../../lib/api';
import { ShieldCheck, AlertTriangle, AlertCircle, RefreshCw, Server, Database, Mail, HardDrive, CreditCard } from 'lucide-react';

export function SystemStatusIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data, error, isValidating, mutate } = useSWR('/admin/health', () => api.admin.getHealth(), {
    refreshInterval: 60000, // Check every 60s
    revalidateOnFocus: true,
  });

  // Close popup on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const overall = data?.overall || (error ? 'down' : 'ok');

  const statusConfig = {
    ok: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40',
      dot: 'bg-emerald-400 animate-pulse',
      label: 'Operational',
      icon: ShieldCheck,
    },
    degraded: {
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/40',
      dot: 'bg-amber-400 animate-ping',
      label: 'Degraded',
      icon: AlertTriangle,
    },
    down: {
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-500/40',
      dot: 'bg-rose-500 animate-ping',
      label: 'System Issue',
      icon: AlertCircle,
    },
  };

  const current = statusConfig[overall as keyof typeof statusConfig] || statusConfig.ok;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${current.color}`}
        title="View System Health"
      >
        <span className={`w-2 h-2 rounded-full ${current.dot}`} />
        <span className="hidden sm:inline font-semibold">{current.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0F1420] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">System Health</span>
            </div>
            <button
              onClick={() => mutate()}
              disabled={isValidating}
              className="p-1 text-white/40 hover:text-white transition-colors"
              title="Refresh Health"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-white/70">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Postgres (Neon)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/40">{data?.databaseLatencyMs ?? 0}ms</span>
                <span className={`w-2 h-2 rounded-full ${data?.database === 'ok' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-white/70">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Razorpay Gateway</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${data?.razorpay === 'ok' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-white/70">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                <span>Cloudinary CDN</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${data?.cloudinary === 'ok' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>SMTP Mailer</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${data?.smtp === 'ok' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30">
            <span>Uptime: {data?.uptimeSeconds ? `${Math.floor(data.uptimeSeconds / 60)}m` : 'Active'}</span>
            <span>Live check</span>
          </div>
        </div>
      )}
    </div>
  );
}
