'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import confetti from 'canvas-confetti';
import { fetchApi } from '@/lib/api';
import LearnSidebar from '@/components/learn/LearnSidebar';
import ContentFallback from '@/components/learn/ContentFallback';
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Loader2,
  Menu,
  ShieldCheck,
  Check,
  Award,
} from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetchApi(url).then((res) => res?.data || res);

export default function DedicatedQuizPage() {
  const params = useParams();
  const router = useRouter();
  const rawCourseId = (params?.courseId as string) || '';
  const courseSlug = decodeURIComponent(rawCourseId).toLowerCase().trim().replace(/\s+/g, '-');
  const quizId = params?.quizId as string;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [startedAt] = useState<string>(() => new Date().toISOString());

  // Single fast SWR query
  const { data, error, isLoading, mutate } = useSWR(
    courseSlug && quizId ? `/courses/${courseSlug}/quizzes/${quizId}/full` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
      keepPreviousData: true,
    }
  );

  const quiz = data?.quiz;
  const topic = data?.topic;
  const curriculum = data?.curriculum;
  const nextItem = data?.nextItem;
  const prevItem = data?.prevItem;

  // Prefetch next item
  useEffect(() => {
    if (nextItem?.url) {
      router.prefetch(nextItem.url);
    }
  }, [nextItem, router]);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const isPassed = quiz?.isPassed || submitResult?.passed;
  const attemptsCount = submitResult ? submitResult.attemptNum : quiz?.attemptsCount || 0;
  const maxAttempts = quiz?.maxAttempts || 3;
  const attemptsExhausted = quiz?.attemptsExhausted || (submitResult && !submitResult.passed && submitResult.remainingAttempts === 0);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitResult || (quiz?.isPassed && !submitResult)) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || Object.keys(selectedAnswers).length < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      }));

      const res = await fetchApi(`/courses/${courseSlug}/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          answers: answersPayload,
          startedAt,
        }),
      });

      const result = res?.data || res;
      setSubmitResult(result);

      if (result?.passed) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      // Revalidate cache
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryQuiz = () => {
    setSubmitResult(null);
    setSelectedAnswers({});
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">Loading Quiz Questions...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Quiz Notice</h2>
          <p className="text-sm text-slate-400">{error?.message || 'Quiz is locked. Complete the topic first.'}</p>
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
            currentPath={`/learn/${courseSlug}/quiz/${quizId}`}
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
                currentPath={`/learn/${courseSlug}/quiz/${quizId}`}
                courseSlug={courseSlug}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── MAIN QUIZ STAGE ─── */}
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

            {topic && (
              <Link
                href={topic.url}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Topic {topic.globalSeq}</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Attempt {Math.min(maxAttempts, attemptsCount + (submitResult ? 0 : 1))} of {maxAttempts}
            </span>
          </div>
        </header>

        {/* Scrollable Quiz Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 pb-24">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                <span>TOPIC {topic?.globalSeq || 1} QUIZ</span>
                <span>•</span>
                <span className="text-slate-400">Skill Check</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {quiz.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {totalQuestions} MCQs · 1 mark each · Passing score: <span className="text-emerald-400 font-bold">60%</span> · Max {maxAttempts} attempts
              </p>
            </div>

            {/* ─── RESULT BANNER (If Submitted) ─── */}
            {submitResult && (
              <div
                className={`p-6 rounded-2xl border space-y-3 animate-in fade-in duration-300 ${
                  submitResult.passed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        submitResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {submitResult.passed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {submitResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Not Passed'}
                      </h3>
                      <p className="text-xs opacity-80">
                        Score: <span className="font-bold">{submitResult.correctCount}/{submitResult.totalQuestions} ({submitResult.scorePct}%)</span>
                        {' — '}Required: {quiz.passingScore}%
                      </p>
                    </div>
                  </div>

                  {submitResult.passed ? (
                    nextItem ? (
                      <Link
                        href={nextItem.url}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
                      >
                        <span>Continue to Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : null
                  ) : submitResult.remainingAttempts > 0 ? (
                    <button
                      type="button"
                      onClick={handleRetryQuiz}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry ({submitResult.remainingAttempts} left)</span>
                    </button>
                  ) : null}
                </div>

                {attemptsExhausted && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <p className="font-bold text-amber-400">All 3 attempts exhausted.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Please contact <a href="mailto:support@devascentacademy.me" className="text-indigo-400 underline">support@devascentacademy.me</a> to request an attempt reset.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ─── QUESTIONS LIST OR EMPTY FALLBACK ─── */}
            {totalQuestions === 0 ? (
              <ContentFallback
                type="quiz"
                title={`${quiz.title} (Questions Pending)`}
                courseSlug={courseSlug}
                nextUrl={nextItem?.url}
                nextLabel={nextItem?.title ? `Continue to ${nextItem.title} →` : 'Continue Curriculum →'}
              />
            ) : (
              <div className="space-y-6">
              {questions.map((q: any, qIdx: number) => {
                const questionNum = qIdx + 1;
                const userSelectedIdx = selectedAnswers[q.id];
                const feedbackItem = submitResult?.feedback?.find((f: any) => f.questionId === q.id);

                return (
                  <div
                    key={q.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 hover:border-slate-700/80 transition-colors"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                          {questionNum}
                        </span>
                        <h2 className="text-sm sm:text-base font-semibold text-white leading-snug">
                          {q.question}
                        </h2>
                      </div>

                      {feedbackItem && (
                        <div className="shrink-0">
                          {feedbackItem.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>+1 Mark</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>0 Marks</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Optional Code Snippet */}
                    {q.codeSnippet && (
                      <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Options Grid */}
                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                        const isSelected = userSelectedIdx === optIdx;

                        let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900';
                        if (isSelected) {
                          optionStyle = 'bg-indigo-600/15 border-indigo-500 text-white font-medium ring-1 ring-indigo-500/40';
                        }

                        if (feedbackItem) {
                          if (optIdx === feedbackItem.correctOptionIndex) {
                            optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 font-medium ring-1 ring-emerald-500/40';
                          } else if (isSelected && !feedbackItem.isCorrect) {
                            optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-200 font-medium ring-1 ring-rose-500/40';
                          } else {
                            optionStyle = 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            disabled={!!submitResult || attemptsExhausted}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-850 text-slate-400 border border-slate-700/60'
                                }`}
                              >
                                {optionLetter}
                              </span>
                              <span className="leading-relaxed">{opt}</span>
                            </div>

                            {feedbackItem && optIdx === feedbackItem.correctOptionIndex && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box (Revealed on submit) */}
                    {feedbackItem?.explanation && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-indigo-400">Explanation:</span>
                        <p className="text-slate-400 leading-relaxed">{feedbackItem.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>

        {/* ─── FIXED BOTTOM SUBMIT BAR ─── */}
        <footer className="border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-8 py-3 shrink-0 flex items-center justify-between gap-2">
          {topic && (
            <Link
              href={topic.url}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Review Notes</span>
            </Link>
          )}

          {totalQuestions === 0 ? (
            nextItem ? (
              <Link
                href={nextItem.url}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <span>Continue to Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null
          ) : !submitResult ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={submitting || attemptsExhausted || Object.keys(selectedAnswers).length < totalQuestions}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answers...</span>
                </>
              ) : (
                <>
                  <span>Submit Quiz ({Object.keys(selectedAnswers).length}/{totalQuestions})</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : submitResult.passed ? (
            nextItem ? (
              <Link
                href={nextItem.url}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Continue to Next Topic</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null
          ) : (
            <button
              type="button"
              onClick={handleRetryQuiz}
              disabled={attemptsExhausted}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
