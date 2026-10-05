'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import {
  HelpCircle,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Trash2,
  User,
  BookOpen,
  Calendar,
  X,
  Sparkles,
  MessageCircle,
  Filter,
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

export default function AdminQueriesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'answered' | 'urgent' | 'all'>('pending');
  const [courseFilter, setCourseFilter] = useState<string>('');

  // Reply Modal State
  const [replyingDoubt, setReplyingDoubt] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  // Fetch Queries
  const isUrgentParam = statusFilter === 'urgent' ? 'true' : undefined;
  const statusParam = statusFilter === 'urgent' ? undefined : statusFilter !== 'all' ? statusFilter : undefined;

  const { data, error, isLoading, mutate } = useSWR(
    `/admin/queries?page=${page}&limit=${limit}&status=${statusParam || ''}&isUrgent=${isUrgentParam || ''}&courseId=${courseFilter}&search=${debouncedSearch}`,
    () =>
      api.admin.getQueries({
        page,
        limit,
        status: statusParam,
        isUrgent: statusFilter === 'urgent' ? true : undefined,
        courseId: courseFilter || undefined,
        search: debouncedSearch || undefined,
      }),
    { revalidateOnFocus: false },
  );

  // Fetch Courses for filter
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

  // Open Reply Modal
  const handleOpenReply = (doubt: any) => {
    setReplyingDoubt(doubt);
    setReplyText(doubt.answer || '');
    setReplyError(null);
  };

  // Submit Answer
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      setReplyError('Answer cannot be empty.');
      return;
    }

    setIsSubmittingReply(true);
    setReplyError(null);

    try {
      await api.admin.answerQuery(replyingDoubt.id, replyText.trim());
      mutate();
      setReplyingDoubt(null);
      setReplyText('');
    } catch (err: any) {
      setReplyError(err.message || 'Failed to submit response');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Delete Doubt
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student query?')) return;
    try {
      await api.admin.deleteQuery(id);
      mutate();
    } catch (err: any) {
      alert(err.message || 'Failed to delete query');
    }
  };

  const stats = data?.stats || {
    totalQueries: 0,
    pendingQueries: 0,
    answeredQueries: 0,
    urgentQueries: 0,
  };

  const queriesList = data?.doubts || [];

  return (
    <div className="space-y-6">
      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="w-5 h-5" />
            </span>
            Student Queries & Doubt Desk
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Resolve student curriculum questions, technical blockers, and cohort inquiries.
          </p>
        </div>
      </div>

      {/* ─── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Pending Doubts"
          value={stats.pendingQueries.toLocaleString()}
          sub="Requires instructor reply"
          icon={Clock}
          color="bg-amber-500/15 text-amber-400"
        />
        <KpiCard
          label="Urgent Inquiries"
          value={stats.urgentQueries.toLocaleString()}
          sub="High priority blockers"
          icon={AlertTriangle}
          color="bg-rose-500/15 text-rose-400"
        />
        <KpiCard
          label="Resolved Doubts"
          value={stats.answeredQueries.toLocaleString()}
          sub="Successfully answered"
          icon={CheckCircle2}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <KpiCard
          label="Total Queries"
          value={stats.totalQueries.toLocaleString()}
          sub="All-time student doubts"
          icon={MessageCircle}
          color="bg-indigo-500/15 text-indigo-400"
        />
      </div>

      {/* ─── Filter & Search Bar ───────────────────────────────────────────── */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-full md:w-auto overflow-x-auto">
          {(['pending', 'urgent', 'answered', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition flex items-center gap-1.5 ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              {tab === 'urgent' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
              {tab === 'all' ? 'All Queries' : tab}
            </button>
          ))}
        </div>

        {/* Right filters: Course Selector & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 px-3 py-2 bg-[#161B22] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="">All Courses</option>
            {courses.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search query, student, email..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* ─── Queries List ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
            <SkeletonLoader rows={4} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-sm bg-[#0D1117] border border-white/[0.07] rounded-2xl">
            Failed to load queries. Please try again.
          </div>
        ) : queriesList.length === 0 ? (
          <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-12">
            <EmptyState
              icon={HelpCircle}
              title="No queries found"
              description={
                statusFilter === 'pending'
                  ? 'All student doubts have been answered! Great job.'
                  : 'No doubts match the selected criteria.'
              }
            />
          </div>
        ) : (
          queriesList.map((doubt: any) => {
            const isPending = doubt.status === 'PENDING';

            return (
              <div
                key={doubt.id}
                className={`bg-[#0D1117] border rounded-2xl p-5 shadow-lg transition-all ${
                  doubt.isUrgent && isPending
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-[#0D1117] to-[#0D1117]'
                    : 'border-white/[0.07] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Student & Query Information */}
                  <div className="space-y-2.5 flex-1">
                    {/* Badges Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Awaiting Reply
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Answered
                        </span>
                      )}

                      {doubt.isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Urgent
                        </span>
                      )}

                      {doubt.course && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          <BookOpen className="w-3 h-3" /> {doubt.course.title}
                        </span>
                      )}

                      {doubt.lesson && (
                        <span className="text-[11px] text-white/40">
                          Lesson #{doubt.lesson.lessonNumber}: {doubt.lesson.title}
                        </span>
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px] border border-indigo-500/30">
                        {doubt.user?.name ? doubt.user.name[0].toUpperCase() : 'S'}
                      </div>
                      <span className="font-semibold text-white">{doubt.user?.name || 'Student'}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/40">{doubt.user?.email}</span>
                      {doubt.user?.phone && (
                        <>
                          <span className="text-white/30">•</span>
                          <span className="text-white/40">{doubt.user.phone}</span>
                        </>
                      )}
                      <span className="text-white/30">•</span>
                      <span className="text-white/30 text-[11px]">
                        {new Date(doubt.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Question Content */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/90 leading-relaxed font-sans">
                      <p className="whitespace-pre-wrap">{doubt.question}</p>
                    </div>

                    {/* Answer (if answered) */}
                    {doubt.answer && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300/90 leading-relaxed space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                          <span>Instructor Response ({doubt.answeredBy?.name || 'Academy Admin'}):</span>
                          <span>
                            {doubt.answeredAt
                              ? new Date(doubt.answeredAt).toLocaleString()
                              : ''}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-emerald-100">{doubt.answer}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenReply(doubt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
                        isPending
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/[0.08]'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPending ? 'Answer Query' : 'Edit Answer'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(doubt.id)}
                      title="Delete query"
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

      {/* ─── Answer / Reply Drawer Modal ───────────────────────────────────── */}
      {replyingDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D1117] border border-white/[0.12] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Answer Student Query
                  </h3>
                  <p className="text-xs text-white/40">
                    Student: {replyingDoubt.user?.name || 'Student'} ({replyingDoubt.user?.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplyingDoubt(null)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmitReply} className="p-6 space-y-4">
              {/* Question preview */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Student Question:
                </span>
                <p className="text-xs text-white/90 whitespace-pre-wrap">
                  {replyingDoubt.question}
                </p>
              </div>

              {replyError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {replyError}
                </div>
              )}

              {/* Quick Template Replies */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Quick Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Great question! Check the lesson code snippet attached in the repository for the exact syntax.',
                    'Make sure your Node.js and dependencies are up-to-date using `npm install`.',
                    'Please verify your database connection URL and ensure your Neon pooler credentials are set.',
                    'Feel free to share your GitHub repo branch if the issue persists.',
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setReplyText((prev) => (prev ? `${prev}\n\n${tpl}` : tpl))
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06] transition text-left"
                    >
                      + {tpl.substring(0, 38)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Answer Text Area */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Your Answer / Explanation <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Type clear, constructive answer for the student..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition leading-relaxed font-sans"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingDoubt(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 active:scale-95"
                >
                  {isSubmittingReply ? 'Sending Answer...' : 'Publish Answer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
