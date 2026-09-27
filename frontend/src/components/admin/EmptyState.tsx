'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!Icon) {
      return <Inbox className="w-8 h-8 text-white/30" />;
    }
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as LucideIcon;
    return <IconComponent className="w-8 h-8 text-indigo-400" />;
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/[0.015] border border-white/5 max-w-md mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 shadow-inner">
        {renderIcon()}
      </div>
      <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-white/50 leading-relaxed mb-6 max-w-xs">{description}</p>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && (
            action.href ? (
              <a
                href={action.href}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                {action.label}
              </a>
            ) : (
              <button
                onClick={action.onClick}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                {action.label}
              </button>
            )
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-semibold transition-all"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
