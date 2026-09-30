'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { KpiSkeleton, StatusBadge, EmptyState } from '../../../components/admin/AdminUI';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Layers,
  Edit3,
  ExternalLink,
  Calendar,
  IndianRupee,
  Check,
  X,
  Loader2,
  Sparkles,
  Settings2,
  Video
} from 'lucide-react';

export default function CoursesPage() {
  const { data, isLoading, mutate } = useSWR('/admin/courses', () => api.admin.getCourseStats());
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [savingDetails, setSavingDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    priceInRupees: 0,
    earlyBirdPriceInRupees: 0,
    totalSeats: 0,
    seatsRemaining: 0,
    isPublished: true,
    stipendDetails: '',
  });

  const courses: any[] = data?.courses || data?.data?.courses || (Array.isArray(data) ? data : []);

  const handleOpenEdit = (course: any) => {
    setEditingCourse(course);
    setEditForm({
      priceInRupees: Math.round((course.priceInPaise || 499900) / 100),
      earlyBirdPriceInRupees: Math.round((course.earlyBirdPriceInPaise || 149900) / 100),
      totalSeats: course.totalSeats || 40,
      seatsRemaining: course.seatsRemaining || 10,
      isPublished: course.isPublished ?? true,
      stipendDetails: course.stipendDetails || '',
    });
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || savingDetails) return;

    try {
      setSavingDetails(true);
      await api.admin.updateCourseDetails(editingCourse.slug, {
        priceInPaise: Math.round(editForm.priceInRupees * 100),
        earlyBirdPriceInPaise: Math.round(editForm.earlyBirdPriceInRupees * 100),
        totalSeats: Number(editForm.totalSeats),
        seatsRemaining: Number(editForm.seatsRemaining),
        isPublished: editForm.isPublished,
        stipendDetails: editForm.stipendDetails,
      });

      setEditingCourse(null);
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to update course details');
    } finally {
      setSavingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Course & Internship Management</span>
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Manage course curriculums, video lectures, markdown notes, quizzes, and live pricing.
          </p>
        </div>
      </div>

      {isLoading ? (
        <KpiSkeleton />
      ) : !courses.length ? (
        <EmptyState message="No courses found in database." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Course Title & Metadata */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white truncate max-w-md">
                        {course.title}
                      </h3>
                      <StatusBadge status={course.isPublished ? 'ACTIVE' : 'REJECTED'} />
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700 uppercase font-mono">
                        {course.type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20 uppercase font-mono">
                        {course.domain}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>/{course.slug}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        ₹{Math.round(course.earlyBirdPriceInPaise / 100 || 0)} Early Bird
                      </span>
                      <span>•</span>
                      <span>{course.seatsRemaining} / {course.totalSeats} seats left</span>
                    </div>
                  </div>
                </div>

                {/* KPI stats */}
                <div className="flex items-center gap-6 sm:gap-8 shrink-0 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] mb-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </div>
                    <p className="text-base font-bold text-white">{course.enrollmentCount || 0}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] mb-0.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Certs</span>
                    </div>
                    <p className="text-base font-bold text-white">{course.certificateCount || 0}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px] mb-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Avg Pct</span>
                    </div>
                    <p className="text-base font-bold text-emerald-400">{course.avgProgress || 0}%</p>
                  </div>

                  <div className="text-center">
                    <p className="text-[11px] text-slate-400 mb-0.5">Revenue</p>
                    <p className="text-base font-bold text-emerald-400">
                      ₹{(course.revenueRupees || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-slate-700/60"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public Page</span>
                  </Link>

                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700/80"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Settings</span>
                  </button>

                  <Link
                    href={`/admin/courses/${course.slug}/videos`}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/30"
                  >
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Videos</span>
                  </Link>
                </div>

                <Link
                  href={`/admin/courses/${course.slug}/lessons`}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Layers className="w-4 h-4" />
                  <span>Curriculum Studio →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Settings Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <span>Edit Course Settings</span>
                </h3>
                <p className="text-xs text-slate-400">{editingCourse.title}</p>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.priceInRupees}
                    onChange={(e) => setEditForm({ ...editForm, priceInRupees: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Early Bird Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.earlyBirdPriceInRupees}
                    onChange={(e) => setEditForm({ ...editForm, earlyBirdPriceInRupees: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Total Seats</label>
                  <input
                    type="number"
                    value={editForm.totalSeats}
                    onChange={(e) => setEditForm({ ...editForm, totalSeats: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Seats Remaining</label>
                  <input
                    type="number"
                    value={editForm.seatsRemaining}
                    onChange={(e) => setEditForm({ ...editForm, seatsRemaining: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Stipend / Assessment Details</label>
                <input
                  type="text"
                  value={editForm.stipendDetails}
                  onChange={(e) => setEditForm({ ...editForm, stipendDetails: e.target.value })}
                  placeholder="e.g. Verified Certificate + LOR + Task Assessment"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publishToggle"
                  checked={editForm.isPublished}
                  onChange={(e) => setEditForm({ ...editForm, isPublished: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="publishToggle" className="text-slate-300 font-semibold cursor-pointer">
                  Publish on Website (Make Live to Students)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDetails}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20"
                >
                  {savingDetails ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
