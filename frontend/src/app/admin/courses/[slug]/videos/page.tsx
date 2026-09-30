'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getEmbedUrl, isDirectVideoUrl } from '@/lib/utils';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  Play,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AiVideoItem {
  id: string;
  courseId: string;
  order: number;
  title: string;
  description: string | null;
  videoUrl: string;
  durationSec: number;
  unlocksFromLesson: number;
  unlocksToLesson: number;
}

export default function AdminAiVideosPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [course, setCourse] = useState<{ id: string; title: string; slug: string } | null>(null);
  const [videos, setVideos] = useState<AiVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    id: '',
    order: 1,
    title: '',
    description: '',
    videoUrl: '',
    durationSec: 15,
    unlocksFromLesson: 1,
    unlocksToLesson: 5,
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res: any = await api.get(`/admin/courses/${slug}/videos`);
      if (res?.data?.success) {
        setCourse(res.data.course);
        setVideos(res.data.videos || []);
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || err.message || 'Failed to load AI overview videos',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchVideos();
  }, [slug]);

  // Position change handler (auto-fills unlocksFrom & unlocksTo)
  const handlePositionChange = (orderNum: number) => {
    let from = 1;
    let to = 5;
    if (orderNum === 2) {
      from = 6;
      to = 10;
    } else if (orderNum === 3) {
      from = 11;
      to = 15;
    }
    setForm((prev) => ({
      ...prev,
      order: orderNum,
      unlocksFromLesson: from,
      unlocksToLesson: to,
    }));
  };

  const handleOpenCreateModal = (suggestedOrder?: number) => {
    const nextOrder = suggestedOrder || (videos.length < 3 ? videos.length + 1 : 1);
    let from = 1;
    let to = 5;
    if (nextOrder === 2) {
      from = 6;
      to = 10;
    } else if (nextOrder === 3) {
      from = 11;
      to = 15;
    }

    setForm({
      id: '',
      order: nextOrder,
      title: '',
      description: '',
      videoUrl: '',
      durationSec: 15,
      unlocksFromLesson: from,
      unlocksToLesson: to,
    });
    setPreviewingVideoUrl(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (video: AiVideoItem) => {
    setForm({
      id: video.id,
      order: video.order,
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      durationSec: video.durationSec || 15,
      unlocksFromLesson: video.unlocksFromLesson,
      unlocksToLesson: video.unlocksToLesson,
    });
    setPreviewingVideoUrl(video.videoUrl);
    setModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (form.id) {
        // Update
        const res: any = await api.patch(`/admin/videos/${form.id}`, {
          order: form.order,
          title: form.title,
          description: form.description,
          videoUrl: form.videoUrl,
          durationSec: Number(form.durationSec),
          unlocksFromLesson: Number(form.unlocksFromLesson),
          unlocksToLesson: Number(form.unlocksToLesson),
        });
        if (res?.data?.success) {
          setFeedback({ type: 'success', message: 'AI Overview Video updated successfully!' });
        }
      } else {
        // Create
        const res: any = await api.post(`/admin/courses/${slug}/videos`, {
          order: form.order,
          title: form.title,
          description: form.description,
          videoUrl: form.videoUrl,
          durationSec: Number(form.durationSec),
          unlocksFromLesson: Number(form.unlocksFromLesson),
          unlocksToLesson: Number(form.unlocksToLesson),
        });
        if (res?.data?.success) {
          setFeedback({ type: 'success', message: 'AI Overview Video created successfully!' });
        }
      }

      setModalOpen(false);
      await fetchVideos();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || err.message || 'Failed to save AI video',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this AI Overview Video?')) return;
    try {
      setDeletingId(id);
      const res: any = await api.delete(`/admin/videos/${id}`);
      if (res?.data?.success) {
        setFeedback({ type: 'success', message: 'AI Video deleted successfully' });
        await fetchVideos();
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || err.message || 'Failed to delete video',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 sm:p-8">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/courses`}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Studio A
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  AI Overview Videos Studio
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {course ? `${course.title} (${slug})` : slug} — Configure 3 milestone AI overview videos that unlock lesson batches.
              </p>
            </div>
          </div>

          {/* Navigation to Studio B (Lessons Studio) */}
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/courses/${slug}/lessons`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Go to Lessons Studio</span>
            </Link>

            <button
              onClick={() => handleOpenCreateModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create AI Overview Video</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/40 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Architecture Milestone Diagram Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Course Progression Architecture</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                AI Overview Videos act as 10–20 second standalone milestone intros. When a student watches Video 1, it unlocks Lessons 1–5. Completing Lesson 5 unlocks Video 2, which in turn unlocks Lessons 6–10.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-indigo-400">🎬 V1 (L1-5)</span>
            <span>→</span>
            <span className="text-indigo-400">🎬 V2 (L6-10)</span>
            <span>→</span>
            <span className="text-indigo-400">🎬 V3 (L11-15)</span>
          </div>
        </div>

        {/* 3 Milestone Slots Grid */}
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-xs font-medium">Loading AI Overview Videos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((slotNumber) => {
              const video = videos.find((v) => v.order === slotNumber);
              const unlocksRange =
                slotNumber === 1 ? 'Lessons 1 – 5' : slotNumber === 2 ? 'Lessons 6 – 10' : 'Lessons 11 – 15';

              return (
                <div
                  key={slotNumber}
                  className={`rounded-2xl border flex flex-col overflow-hidden transition-all ${
                    video
                      ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 shadow-xl'
                      : 'bg-slate-950/40 border-dashed border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Slot Header */}
                  <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        #{slotNumber}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {slotNumber === 1
                          ? 'Module 1 Intro Video'
                          : slotNumber === 2
                          ? 'Module 2 Intro Video'
                          : 'Module 3 Intro Video'}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Unlocks {unlocksRange}
                    </span>
                  </div>

                  {/* Slot Body */}
                  {video ? (
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h4 className="text-sm font-bold text-white leading-snug">{video.title}</h4>
                        {video.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                          <span className="inline-flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            <span>{video.durationSec}s duration</span>
                          </span>
                          <span className="inline-flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            <span>Gates L{video.unlocksFromLesson}–L{video.unlocksToLesson}</span>
                          </span>
                        </div>
                      </div>

                      {/* Video Quick Preview Player */}
                      <div className="bg-black rounded-xl overflow-hidden aspect-video w-full border border-slate-800 flex items-center justify-center relative group">
                        {isDirectVideoUrl(video.videoUrl) ? (
                          <video
                            src={video.videoUrl}
                            controls
                            className="w-full h-full object-contain bg-black"
                            playsInline
                          />
                        ) : (
                          <iframe
                            src={getEmbedUrl(video.videoUrl)}
                            title={video.title}
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleOpenEditModal(video)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          disabled={deletingId === video.id}
                          className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/40 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/30"
                        >
                          {deletingId === video.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-300">Slot #{slotNumber} Empty</p>
                        <p className="text-[11px] text-slate-500">
                          Create intro video to gate {unlocksRange}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenCreateModal(slotNumber)}
                        className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Video #{slotNumber}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── MODAL: CREATE / EDIT AI OVERVIEW VIDEO ────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full my-auto flex flex-col max-h-[92vh] shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {form.id ? `Edit AI Video #${form.order}` : `Create AI Overview Video #${form.order}`}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Standalone milestone video that gates lesson batches.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveVideo} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-300">
              
              {/* Position in Course Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Position & Unlocking Milestone *</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((pos) => {
                    const label = pos === 1 ? 'Before L1 (Intro)' : pos === 2 ? 'Before L6 (Mid)' : 'Before L11 (Adv)';
                    const range = pos === 1 ? 'L1–L5' : pos === 2 ? 'L6–L10' : 'L11–L15';
                    const isSelected = form.order === pos;
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handlePositionChange(pos)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs">Video #{pos}</div>
                        <div className="text-[10px] text-indigo-300/80 mt-0.5">{range}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Video Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Introduction to Python & Engineering Architecture"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Short Description / Objective (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="A quick 15-second tour of what you will master in this module..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {/* Video URL & Test Play */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Video URL (YouTube Embed / MP4 / Cloudflare) *</label>
                  {form.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewingVideoUrl(previewingVideoUrl ? null : form.videoUrl)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      <Play className="w-3 h-3" />
                      <span>{previewingVideoUrl ? 'Hide Preview' : 'Test Play'}</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/... or https://youtube.com/embed/..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              {/* Video Live Test Preview */}
              {previewingVideoUrl && (
                <div className="bg-black rounded-xl overflow-hidden aspect-video max-h-48 w-full border border-slate-800 flex items-center justify-center">
                  {isDirectVideoUrl(previewingVideoUrl) ? (
                    <video
                      src={previewingVideoUrl}
                      controls
                      className="w-full h-full object-contain bg-black"
                      playsInline
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(previewingVideoUrl)}
                      title="Preview"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

              {/* Duration & Gating Range */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Duration (Sec)</label>
                  <input
                    type="number"
                    value={form.durationSec}
                    onChange={(e) => setForm({ ...form, durationSec: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                    min={5}
                    max={600}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Unlocks From</label>
                  <input
                    type="number"
                    value={form.unlocksFromLesson}
                    onChange={(e) => setForm({ ...form, unlocksFromLesson: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                    min={1}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] font-semibold">Unlocks To</label>
                  <input
                    type="number"
                    value={form.unlocksToLesson}
                    onChange={(e) => setForm({ ...form, unlocksToLesson: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                    min={1}
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-2 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{form.id ? 'Update AI Video' : 'Create AI Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
