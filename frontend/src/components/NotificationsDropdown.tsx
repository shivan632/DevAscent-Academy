'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store/authStore';
import {
  Bell,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  Zap,
  Check,
  Volume2,
  VolumeX,
  Clock,
  AlertTriangle,
  Info,
  Layers,
  BookOpen,
} from 'lucide-react';

// Web Audio API Synthesizer Chime for instant, zero-asset notification sound
function playChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Pleasant high melodic chord (E6 -> A6)
    osc1.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
    osc2.frequency.setValueAtTime(1760.0, ctx.currentTime + 0.08); // A6

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start(ctx.currentTime + 0.08);
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const prevUnreadRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  // Load sound setting from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devascent_notification_sound');
      if (saved !== null) {
        setSoundEnabled(saved === 'true');
      }
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('devascent_notification_sound', String(next));
      }
      if (next) playChime();
      return next;
    });
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getNotifications({ limit: 15 });
      const items = res?.notifications || [];
      const unread = res?.unreadCount || 0;

      // Play sound if new notification arrived and sound is enabled
      if (soundEnabled && unread > prevUnreadRef.current && prevUnreadRef.current !== 0) {
        playChime();
      }
      prevUnreadRef.current = unread;

      setNotifications(items);
      setUnreadCount(unread);
    } catch {
      // Background poll silently fails without disrupting user
    }
  }, [isAuthenticated, soundEnabled]);

  // 60-Second Polling + visibilitychange pause/resume strategy
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (!intervalId) {
        intervalId = setInterval(fetchNotifications, 60000); // 60s polling
      }
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Pause when tab is inactive, resume + immediate fetch when focused
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchNotifications();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark single notification read
  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      prevUnreadRef.current = Math.max(0, prevUnreadRef.current - 1);
    } catch {
      // Ignored
    }
  };

  // Mark all read
  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      prevUnreadRef.current = 0;
    } catch {
      // Ignored
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Unread Badge */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Notifications"
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#0D1117] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.09] p-4 z-50 animate-fadeIn space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.07] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sound Toggle Button */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Mark All Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04] -mx-1 px-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-white/40 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-white/20" />
                <p>No notifications yet</p>
                <p className="text-[10px]">Announcements and updates will appear here.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                  className={`py-3 px-2 rounded-xl transition cursor-pointer ${
                    !item.isRead
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/25 border-l-2 border-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'ALERT' ? (
                        <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : item.type === 'ANNOUNCEMENT' ? (
                        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            !item.isRead
                              ? 'text-indigo-900 dark:text-white'
                              : 'text-slate-800 dark:text-white/70'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-white/50 leading-relaxed line-clamp-2 font-sans">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400 dark:text-white/35">
                        {item.targetCourse ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[120px]">
                            {item.targetCourse.title}
                          </span>
                        ) : (
                          <span>All Cohorts</span>
                        )}
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
