'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import {
  Bell,
  Plus,
  Send,
  Search,
  CheckCircle2,
  Trash2,
  Users,
  Layers,
  BookOpen,
  Calendar,
  AlertTriangle,
  Info,
  Sparkles,
  X,
  Volume2,
  Check,
} from 'lucide-react';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { useDebounce } from '../../../lib/hooks/useDebounce';

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-start gap-3 shadow-lg">
      <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-0.5">{label}</p>
        <p className="text-xl font-black text-white">{value}</p>
        <p className="text-[10px] text-white/35 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminNotificationsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState('');

  // Composer Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT' as 'ANNOUNCEMENT' | 'ALERT' | 'INFO' | 'SYSTEM',
    targetRole: 'ALL',
    targetCourseId: '',
    targetCohort: '',
  });

  const debouncedSearch = useDebounce(searchInput, 350);

  // Fetch Broadcasts
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/notifications?page=${page}&limit=${limit}&search=${debouncedSearch}`,
    () =>
      api.admin.getBroadcasts({
        page,
        limit,
        search: debouncedSearch || undefined,
      }),
    { revalidateOnFocus: false },
  );

  // Fetch Courses for Target Dropdown
  const { data: coursesData } = useSWR('/courses', () => api.getCourses(), {
    revalidateOnFocus: false,
  });

  const courses = useMemo(() => {
    return Array.isArray(coursesData)
      ? coursesData
      : Array.isArray(coursesData?.courses)
      ? coursesData.courses
      : [];
  }, [coursesData]);

  // Handle Send Broadcast
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setFormError('Title must be at least 3 characters.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setFormError('Message must be at least 5 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.admin.createNotification({
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
        targetRole: formData.targetRole,
        targetCourseId: formData.targetCourseId || undefined,
        targetCohort: formData.targetCohort ? Number(formData.targetCohort) : undefined,
      });

      setFormSuccess('Notification broadcast dispatched to students successfully!');
      mutate();
      setTimeout(() => {
        setIsComposerOpen(false);
        setFormSuccess(null);
        setFormData({
          title: '',
          message: '',
          type: 'ANNOUNCEMENT',
          targetRole: 'ALL',
          targetCourseId: '',
          targetCohort: '',
        });
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to dispatch notification broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Broadcast
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete broadcast "${title}"?`)) return;
    try {
      await api.admin.deleteBroadcast(id);
      mutate();
    } catch (err: any) {
      alert(err.message || 'Failed to delete broadcast');
    }
  };

  const payload = data?.data !== undefined ? data.data : data;

  const stats = payload?.stats || data?.stats || {
    totalBroadcasts: 0,
    totalReads: 0,
  };

  const broadcastsList = payload?.notifications || data?.notifications || (Array.isArray(payload) ? payload : []);

  return (
    <div className="space-y-6">
      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bell className="w-5 h-5" />
            </span>
            In-App Notification Broadcasts
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Dispatch instant notifications, batch announcements, and alerts directly to student notification bells.
          </p>
        </div>

        <button
          onClick={() => setIsComposerOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Compose Broadcast
        </button>
      </div>

      {/* ─── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard
          label="Total Broadcasts"
          value={stats.totalBroadcasts.toLocaleString()}
          sub="Dispatched all-time"
          icon={Send}
          color="bg-indigo-500/15 text-indigo-400"
        />
        <KpiCard
          label="Total Student Reads"
          value={stats.totalReads.toLocaleString()}
          sub="Notification views logged"
          icon={CheckCircle2}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <KpiCard
          label="Audience Scope"
          value="All Students"
          sub="Live in-app push bar"
          icon={Users}
          color="bg-sky-500/15 text-sky-400"
        />
      </div>

      {/* ─── Search Bar ────────────────────────────────────────────────────── */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search broadcast title or content..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* ─── Broadcast History List ────────────────────────────────────────── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
            <SkeletonLoader rows={4} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-sm bg-[#0D1117] border border-white/[0.07] rounded-2xl">
            Failed to load broadcasts. Please try again.
          </div>
        ) : broadcastsList.length === 0 ? (
          <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-12">
            <EmptyState
              icon={Bell}
              title="No broadcasts sent yet"
              description="Dispatch your first announcement to students to keep them updated on schedules and lectures."
              action={{
                label: 'Compose Broadcast',
                onClick: () => setIsComposerOpen(true),
              }}
            />
          </div>
        ) : (
          broadcastsList.map((item: any) => {
            const readsCount = item._count?.reads || 0;

            return (
              <div
                key={item.id}
                className="bg-[#0D1117] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-5 shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.type === 'ALERT'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : item.type === 'ANNOUNCEMENT'
                            ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {item.type === 'ALERT' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <Info className="w-3 h-3" />
                        )}
                        {item.type}
                      </span>

                      {item.targetCourse ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          <BookOpen className="w-3 h-3" /> {item.targetCourse.title}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/70 border border-white/[0.08]">
                          <Layers className="w-3 h-3" /> All Cohorts
                        </span>
                      )}

                      <span className="text-[11px] text-white/35">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>

                    {/* Message */}
                    <p className="text-xs text-white/70 leading-relaxed font-sans whitespace-pre-wrap">
                      {item.message}
                    </p>

                    {/* Footer Info */}
                    <div className="flex items-center gap-4 text-[11px] text-white/40 pt-1">
                      <span>Sender: {item.createdBy?.name || 'Academy Admin'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {readsCount} Student Reads
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete broadcast"
                      className="p-2 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Composer Modal ────────────────────────────────────────────────── */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D1117] border border-white/[0.12] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Compose Student Broadcast</h3>
                  <p className="text-xs text-white/40">
                    Pushes a live notification to students&apos; notification bell bar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSend} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  {formSuccess}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Notification Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚀 Live Project Workshop starts at 7:00 PM IST"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Category & Course Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Notification Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#161B22] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="ANNOUNCEMENT">Announcement 📢</option>
                    <option value="ALERT">Important Alert ⚠️</option>
                    <option value="INFO">General Info ℹ️</option>
                    <option value="SYSTEM">System Update ⚙️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Target Course / Audience
                  </label>
                  <select
                    value={formData.targetCourseId}
                    onChange={(e) => setFormData({ ...formData, targetCourseId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#161B22] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="">All Enrolled Students (Global)</option>
                    {courses.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Notification Message Body <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the announcement details, link instructions, or batch updates..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? 'Broadcasting...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
