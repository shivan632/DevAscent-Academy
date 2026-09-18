'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Code2,
  FileCode,
  ArrowRight,
  X,
  Zap,
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_ITEMS = [
  {
    category: 'Courses & Cohorts',
    items: [
      {
        title: 'Full-Stack Engineering Accelerator',
        badge: '70% OFF',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        url: '/courses/full-stack-accelerator',
        desc: 'Next.js 15, NestJS, PostgreSQL, Redis, Razorpay, Docker.',
        icon: Code2,
      },
      {
        title: 'Modern React & TypeScript Foundations',
        badge: 'FREE',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        url: '/learn/react-foundations-free',
        desc: '100% Free interactive track with verifiable certificate.',
        icon: Sparkles,
      },
      {
        title: 'Backend & Cloud Internship (Cohort 14)',
        badge: 'STIPEND',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        url: '/courses/backend-cloud-internship',
        desc: 'Real startup tasks, live code reviews, and offer letters.',
        icon: BookOpen,
      },
    ],
  },
  {
    category: 'Student Workspace & Tools',
    items: [
      {
        title: 'Student Dashboard & Workspace',
        badge: 'PORTAL',
        badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        url: '/dashboard',
        desc: 'Resume coursework, profile settings & capstones.',
        icon: BookOpen,
      },
      {
        title: 'Public Credential Verification Ledger',
        badge: 'LEDGER',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        url: '/verify/DEV-2026-A1B2C3',
        desc: 'Verify tamper-proof SHA-256 graduation certificates.',
        icon: ShieldCheck,
      },
      {
        title: 'Capstone Project Submission Form',
        badge: 'CLAIM CERT',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        url: '/learn/react-foundations-free/complete',
        desc: 'Submit your GitHub repository to earn your certificate.',
        icon: Award,
      },
      {
        title: '7-Day Money-Back Guarantee Policy',
        badge: 'POLICY',
        badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        url: '/refund-policy',
        desc: 'Instant refund terms with zero risk or fine print.',
        icon: ShieldCheck,
      },
    ],
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCH_ITEMS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 p-4">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, lessons, verifiable certificates, policies..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {filtered.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching results for "{query}"</p>
              <p className="text-xs text-slate-400">Try searching for "React", "Full-Stack", "Certificate", or "Refund".</p>
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.category} className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  {group.category}
                </span>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        onClick={() => handleSelect(item.url)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {item.title}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">Enter</kbd>
            <span>to open</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">ESC</kbd>
            <span>to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
