'use client';

import React from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { KpiSkeleton } from '../../../components/admin/AdminUI';
import { TrendingUp, Users, IndianRupee } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading } = useSWR('/admin/analytics', () => api.admin.getAnalytics(), {
    refreshInterval: 60000,
  });

  const signupDays = data ? Object.entries(data.signupsByDay).slice(-14) : [];
  const revenueDays = data ? Object.entries(data.revenueByDay).slice(-14) : [];

  const maxSignups = Math.max(1, ...signupDays.map(([, v]) => v as number));
  const maxRevenue = Math.max(1, ...revenueDays.map(([, v]) => v as number));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Analytics</h1>
        <p className="text-sm text-white/35 mt-0.5">Last 14 days · Refreshes every 60s</p>
      </div>

      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <>
          {/* Daily Signups Chart */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Daily Student Signups</h2>
                <p className="text-xs text-white/35">Last 14 days</p>
              </div>
            </div>
            {signupDays.length === 0 ? (
              <p className="text-xs text-white/35 text-center py-8">No signups in this period</p>
            ) : (
              <div className="flex items-end gap-1.5 h-32">
                {signupDays.map(([day, count]) => {
                  const pct = ((count as number) / maxSignups) * 100;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        {count as number}
                      </span>
                      <div className="w-full relative" style={{ height: '88px' }}>
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all hover:from-indigo-500 hover:to-indigo-300"
                          style={{ height: `${Math.max(4, pct)}%` }}
                          title={`${day}: ${count} signups`}
                        />
                      </div>
                      <span className="text-[9px] text-white/25 rotate-45 origin-left">
                        {day.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Revenue Chart */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Daily Revenue</h2>
                <p className="text-xs text-white/35">Last 14 days (in ₹)</p>
              </div>
            </div>
            {revenueDays.length === 0 ? (
              <p className="text-xs text-white/35 text-center py-8">No revenue in this period</p>
            ) : (
              <div className="flex items-end gap-1.5 h-32">
                {revenueDays.map(([day, amount]) => {
                  const rupees = Math.round((amount as number) / 100);
                  const pct = ((amount as number) / maxRevenue) * 100;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{rupees.toLocaleString('en-IN')}
                      </span>
                      <div className="w-full relative" style={{ height: '88px' }}>
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all hover:from-emerald-500 hover:to-emerald-300"
                          style={{ height: `${Math.max(4, pct)}%` }}
                          title={`${day}: ₹${rupees}`}
                        />
                      </div>
                      <span className="text-[9px] text-white/25 rotate-45 origin-left">
                        {day.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
