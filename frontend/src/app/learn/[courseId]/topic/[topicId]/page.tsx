'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { fetchApi, api } from '@/lib/api';
import LearnSidebar from '@/components/learn/LearnSidebar';
import EmbeddedDocViewer from '@/components/learn/EmbeddedDocViewer';
import ContentFallback from '@/components/learn/ContentFallback';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  FileQuestion,
  FileText,
  Download,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const MarkdownViewer = dynamic(() => import('@/components/MarkdownViewer'), {
  ssr: false,
  loading: () => (
    <div className="py-8 flex justify-center text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
    </div>
  ),
});

const fetcher = (url: string) => fetchApi(url).then((res) => res?.data || res);

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawCourseId).toLowerCase().trim().replace(/\s+/g, '-');
  const topicId = params?.topicId as string;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);
  const [doubtOpen, setDoubtOpen] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const [submittingDoubt, setSubmittingDoubt] = useState(false);

  // Single fast SWR query with deduping and caching
  const { data, error, isLoading, mutate } = useSWR(
    courseSlug && topicId ? `/courses/${courseSlug}/topics/${topicId}/full` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 300000, // 5 min cache
      keepPreviousData: true,
    }
  );

  const topic = data?.topic;
  const curriculum = data?.curriculum;
  const prevItem = data?.prevItem;
  const nextItem = data?.nextItem;

  // Prefetch next item for sub-100ms navigation
  useEffect(() => {
    if (nextItem?.url) {
      router.prefetch(nextItem.url);
    }
  }, [nextItem, router]);

  const handleMarkCompleteAndContinue = async () => {
    if (!topic || togglingComplete) return;

    try {
      setTogglingComplete(true);
      await fetchApi(`/courses/${courseSlug}/topics/${topic.id}/complete`, {
        method: 'POST',
        body: JSON.stringify({ forceStatus: true }),
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Optimistic mutate
      mutate(
        (prev: any) => ({
          ...prev,
          topic: { ...prev?.topic, isCompleted: true },
        }),
        false
      );

      // Redirect immediately to the Quiz for this topic
      if (topic.associatedQuiz?.url) {
        router.push(topic.associatedQuiz.url);
      } else if (nextItem?.url) {
        router.push(nextItem.url);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update topic status.');
    } finally {
      setTogglingComplete(false);
    }
  };

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || submittingDoubt) return;

    try {
      setSubmittingDoubt(true);
      await fetchApi(`/courses/${courseSlug}/lessons/${topic.id}/doubt`, {
        method: 'POST',
        body: JSON.stringify({ question: doubtText.trim() }),
      });
      setDoubtText('');
      setDoubtOpen(false);
      alert('Your question has been sent to our engineering mentors! Check back soon for an answer.');
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to submit question.');
    } finally {
      setSubmittingDoubt(false);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">Loading Lecture Notes...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Topic Locked</h2>
          <p className="text-sm text-slate-400">{error?.message || topic?.lockReason || 'Topic not found or locked.'}</p>
          <div className="pt-2">
            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <div className="hidden md:block w-80 shrink-0 h-full">
        {curriculum && (
          <LearnSidebar
            curriculum={curriculum}
            currentPath={`/learn/${courseSlug}/topic/${topicId}`}
            courseSlug={courseSlug}
          />
        )}
      </div>

      {/* ─── MOBILE DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10">
            {curriculum && (
              <LearnSidebar
                curriculum={curriculum}
                currentPath={`/learn/${courseSlug}/topic/${topicId}`}
                courseSlug={courseSlug}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── MAIN TOPIC CONTENT STAGE ─── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href={`/learn/${courseSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Curriculum</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDoubtOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Ask Doubt</span>
            </button>

            {topic.isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            )}
          </div>
        </header>

        {/* Scrollable Lecture Notes Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 pb-24">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <span>TOPIC {topic.globalSeq}</span>
                <span>•</span>
                <span className="text-slate-400">{curriculum?.course?.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {topic.title}
              </h1>
              {topic.summary && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {topic.summary}
                </p>
              )}
            </div>

            {/* Rendered Markdown Notes or Empty Fallback */}
            {topic.writtenContent && topic.writtenContent.trim() ? (
              <MarkdownViewer content={topic.writtenContent} />
            ) : (
              <ContentFallback
                type="notes"
                topicTitle={topic.title}
                courseSlug={courseSlug}
                nextUrl={topic.associatedQuiz?.url || nextItem?.url}
                nextLabel={topic.associatedQuiz ? 'Take Topic Skill Quiz →' : 'Continue to Next Topic →'}
              />
            )}

            {/* 📥 PDF Exercise Guide / Google Drive Embedded Viewer (If Available) */}
            {topic.exercisePdfUrl && (
              <EmbeddedDocViewer
                url={topic.exercisePdfUrl}
                title={topic.exercisePdfTitle || `${topic.title} — Exercise & Blueprint Guide`}
                description="Review the step-by-step exercise rubric and cloud reference guide."
                accentColor="violet"
              />
            )}
          </div>
        </div>

        {/* ─── FIXED BOTTOM NAVIGATION BAR ─── */}
        <footer className="border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-8 py-3 shrink-0 flex items-center justify-between gap-2">
          {/* Previous Button */}
          {prevItem ? (
            <Link
              href={prevItem.url}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <div className="w-16" />
          )}

          {/* Central Action: Mark Complete & Proceed to Quiz */}
          <button
            type="button"
            onClick={handleMarkCompleteAndContinue}
            disabled={togglingComplete}
            className={`inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${
              topic.isCompleted
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
            }`}
          >
            {togglingComplete ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : topic.isCompleted ? (
              <>
                <span>Continue to Quiz</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Mark Complete ✓ → Go to Quiz</span>
              </>
            )}
          </button>

          {/* Next Button (Disabled until completed) */}
          {nextItem ? (
            topic.isCompleted ? (
              <Link
                href={nextItem.url}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Mark this topic complete to unlock the next item"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-slate-600 text-xs font-semibold border border-slate-800 cursor-not-allowed opacity-60"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )
          ) : (
            <div className="w-16" />
          )}
        </footer>
      </main>

      {/* ─── ASK DOUBT DRAWER MODAL ─── */}
      {doubtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Ask a Technical Question</h3>
              </div>
              <button
                type="button"
                onClick={() => setDoubtOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Have a question about <span className="text-white font-medium">{topic.title}</span>? Our engineering mentors respond within 24 hours.
            </p>

            <form onSubmit={handleSubmitDoubt} className="space-y-4">
              <textarea
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="Describe your question or paste code snippet here..."
                rows={4}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-mono"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDoubtOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDoubt || !doubtText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submittingDoubt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
