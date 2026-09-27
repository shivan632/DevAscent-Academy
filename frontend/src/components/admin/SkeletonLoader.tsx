'use client';

import React from 'react';

interface SkeletonLoaderProps {
  type?: 'kpi' | 'table' | 'chart' | 'card' | 'list';
  count?: number;
  rows?: number;
  cols?: number;
}

export function SkeletonLoader({
  type = 'kpi',
  count = 4,
  rows = 5,
  cols = 5,
}: SkeletonLoaderProps) {
  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-white/10 rounded-md" />
              <div className="w-10 h-10 bg-white/10 rounded-xl" />
            </div>
            <div className="h-7 w-28 bg-white/10 rounded-md" />
            <div className="h-3 w-36 bg-white/5 rounded-md pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
        {/* Table Header Skeleton */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-white/10 rounded-md flex-1" />
          ))}
        </div>
        {/* Table Rows Skeleton */}
        <div className="divide-y divide-white/5">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4 items-center">
              {Array.from({ length: cols }).map((_, j) => (
                <div key={j} className="h-4 bg-white/5 rounded-md flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-36 bg-white/10 rounded-md" />
          <div className="h-4 w-20 bg-white/10 rounded-md" />
        </div>
        <div className="h-64 w-full bg-white/5 rounded-xl flex items-end gap-3 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-t flex-1"
              style={{ height: `${20 + (i * 7) % 80}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="h-4 w-1/3 bg-white/10 rounded-md" />
          <div className="h-3 w-2/3 bg-white/5 rounded-md" />
        </div>
      ))}
    </div>
  );
}
