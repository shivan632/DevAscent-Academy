'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { KpiSkeleton } from '../../../components/admin/AdminUI';
import { TrendingUp, Users, IndianRupee, BarChart3, ArrowUpRight, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: resData, isLoading, mutate } = useSWR('/admin/analytics', () => api.admin.getAnalytics(), {
    refreshInterval: 60000,
  });

  const analytics = resData?.data || resData || {};

  // Build a continuous 14-day timeline even when database days have 0 entries
  const { signupDays, revenueDays, totalSignups, totalRevenue } = useMemo(() => {
    const rawSignups: Record<string, number> = analytics.signupsByDay || {};
    const rawRevenue: Record<string, number> = analytics.revenueByDay || {};

    const signups: [string, number][] = [];
    const revenue: [string, number][] = [];

    let sumSignups = 0;
    let sumRevenue = 0;

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().split('T')[0];

      const sCount = rawSignups[dayKey] || 0;
      const rAmount = rawRevenue[dayKey] || 0;

      signups.push([dayKey, sCount]);
      revenue.push([dayKey, rAmount]);

      sumSignups += sCount;
      sumRevenue += rAmount;
    }

    return {
      signupDays: signups,
      revenueDays: revenue,
      totalSignups: sumSignups,
      totalRevenue: sumRevenue,
    };
  }, [analytics]);

  const maxSignups = Math.max(1, ...signupDays.map(([, v]) => v));
  const maxRevenue = Math.max(1, ...revenueDays.map(([, v]) => v));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-violet-300">
              Platform Metrics
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Growth & Revenue Analytics</h1>
          <p className="text-xs text-white/40 mt-0.5">Rolling 14-day window · Live updates every 60s</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white/50">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>14-Day Velocity</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0D111C]/80 border border-white/[0.08] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">14-Day Signups</span>
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mt-2">{totalSignups}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Active new registrations</span>
              </p>
            </div>

            <div className="bg-[#0D111C]/80 border border-white/[0.08] rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">14-Day Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mt-2">
                ₹{Math.round(totalRevenue / 100).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Verified Razorpay collections</span>
              </p>
            </div>
          </div>

          {/* Daily Signups Chart */}
          <div className="bg-[#0D111C]/80 border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Daily Student Registrations</h2>
                  <p className="text-xs text-white/40">Verified user additions per day</p>
                </div>
              </div>
              <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-xl border border-violet-500/20">
                Peak: {maxSignups} signups/day
              </span>
            </div>

            <div className="flex items-end gap-2 sm:gap-3 h-44 pt-4">
              {signupDays.map(([day, count]) => {
                const pct = (count / maxSignups) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <span className="text-[10px] font-bold text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                      {count}
                    </span>
                    <div className="w-full relative bg-white/[0.03] rounded-t-xl overflow-hidden" style={{ height: '110px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-violet-600 via-indigo-500 to-violet-400 rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                        style={{ height: `${Math.max(count > 0 ? 12 : 4, pct)}%` }}
                        title={`${day}: ${count} signups`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/30 truncate max-w-[32px] sm:max-w-none">
                      {day.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Revenue Chart */}
          <div className="bg-[#0D111C]/80 border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Daily Revenue Volume</h2>
                  <p className="text-xs text-white/40">Gross tuition receipts (in INR)</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                Peak: ₹{Math.round(maxRevenue / 100).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-end gap-2 sm:gap-3 h-44 pt-4">
              {revenueDays.map(([day, amount]) => {
                const rupees = Math.round(amount / 100);
                const pct = (amount / maxRevenue) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <span className="text-[10px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 whitespace-nowrap">
                      ₹{rupees}
                    </span>
                    <div className="w-full relative bg-white/[0.03] rounded-t-xl overflow-hidden" style={{ height: '110px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                        style={{ height: `${Math.max(amount > 0 ? 12 : 4, pct)}%` }}
                        title={`${day}: ₹${rupees}`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/30 truncate max-w-[32px] sm:max-w-none">
                      {day.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
