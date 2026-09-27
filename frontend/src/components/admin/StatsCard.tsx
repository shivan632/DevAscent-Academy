'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'blue';
  icon: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-500/10 hover:bg-indigo-500/15 border-indigo-500/20 hover:border-indigo-500/40',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/10',
  },
  emerald: {
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/20 hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  amber: {
    bg: 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20 hover:border-amber-500/40',
    iconBg: 'bg-amber-500/20 text-amber-400',
    glow: 'group-hover:shadow-amber-500/10',
  },
  rose: {
    bg: 'bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/20 hover:border-rose-500/40',
    iconBg: 'bg-rose-500/20 text-rose-400',
    glow: 'group-hover:shadow-rose-500/10',
  },
  violet: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/20 hover:border-purple-500/40',
    iconBg: 'bg-purple-500/20 text-purple-400',
    glow: 'group-hover:shadow-purple-500/10',
  },
  blue: {
    bg: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20 hover:border-blue-500/40',
    iconBg: 'bg-blue-500/20 text-blue-400',
    glow: 'group-hover:shadow-blue-500/10',
  },
};

export function StatsCard({
  label,
  value,
  sub,
  trend,
  color = 'indigo',
  icon,
  badge,
  onClick,
}: StatsCardProps) {
  const styles = colorStyles[color] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 shadow-lg ${styles.bg} ${styles.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {value}
            </p>
            {badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/10 text-white/80 border border-white/10">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${styles.iconBg}`}>
          {icon}
        </div>
      </div>

      {(sub || trend) && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          {sub && <span className="truncate">{sub}</span>}
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold shrink-0 ml-auto ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend.value}</span>
              {trend.label && <span className="text-white/30 text-[11px] font-normal">{trend.label}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
