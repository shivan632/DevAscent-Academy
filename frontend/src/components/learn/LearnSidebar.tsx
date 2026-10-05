'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileQuestion,
  Award,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
  FileText,
  Clock,
  Send,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface LearnSidebarProps {
  curriculum: {
    course: {
      id: string;
      slug: string;
      title: string;
    };
    isEnrolled: boolean;
    progressPct: number;
    stats: {
      totalTopics: number;
      completedTopics: number;
      passedQuizzes: number;
      totalVideos: number;
      watchedVideos: number;
    };
    groupedModules: {
      id: string;
      moduleNumber: number;
      title: string;
      description?: string;
      aiVideo: {
        id: string;
        order: number;
        title: string;
        durationSec: number;
        isUnlocked: boolean;
        isWatched: boolean;
        url: string;
      } | null;
      topics: {
        id: string;
        lessonNumber: number;
        globalSeq: number;
        title: string;
        durationMinutes: number;
        isUnlocked: boolean;
        isCompleted: boolean;
        url: string;
        quiz: {
          id: string;
          title: string;
          questionCount: number;
          isUnlocked: boolean;
          isPassed: boolean;
          attemptsCount: number;
          scoreDisplay: string;
          url: string;
        } | null;
      }[];
    }[];
    capstone: {
      isUnlocked: boolean;
      isSubmitted: boolean;
      submissionStatus: string | null;
      isEligibleForCertificate: boolean;
      url: string;
      submitUrl: string;
      exercisePdfUrl?: string | null;
    };
  };
  currentPath?: string;
  courseSlug: string;
  onCloseMobile?: () => void;
}

export default function LearnSidebar({
  curriculum,
  currentPath = '',
  courseSlug,
  onCloseMobile,
}: LearnSidebarProps) {
  const { course, progressPct = 0, groupedModules = [], capstone } = curriculum || {};

  return (
    <aside className="w-full h-full flex flex-col bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl select-none">
      {/* ─── HEADER: Course Title & Global Progress ─── */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>My Courses</span>
          </Link>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <h2 className="text-sm font-bold text-white tracking-tight line-clamp-1">
          {course?.title || 'Course Curriculum'}
        </h2>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Curriculum Progress</span>
            <span className="font-bold text-indigo-400">{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE MODULE LIST ─── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-5 custom-scrollbar">
        {groupedModules.map((mod) => {
          const video = mod.aiVideo;

          return (
            <div key={mod.id} className="space-y-1.5">
              {/* Module Title Header */}
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/90">
                  Part {mod.moduleNumber}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {mod.topics.length} Topics
                </span>
              </div>

              {/* 🎬 AI Milestone Video Header Row */}
              {video && (
                <div className="mb-2">
                  {video.isUnlocked ? (
                    <Link
                      href={video.url}
                      onClick={onCloseMobile}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                        currentPath.includes(`/video/${video.id}`)
                          ? 'bg-indigo-600/15 border-indigo-500/50 shadow-sm shadow-indigo-500/10 text-white ring-1 ring-indigo-500/30'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            video.isWatched
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:bg-indigo-500/30'
                          }`}
                        >
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate text-slate-200 group-hover:text-white">
                            Milestone {video.order} AI Video
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {video.isWatched ? 'Intro completed' : `${video.durationSec}s Intro`}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 ml-2">
                        {video.isWatched ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Done</span>
                          </span>
                        ) : currentPath.includes(`/video/${video.id}`) ? (
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                            ▶ Current
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            Watch
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-slate-600 opacity-60">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 text-slate-600 border border-slate-800/60">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs font-medium truncate text-slate-500">
                          Milestone {video.order} AI Video
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-600">🔒</span>
                    </div>
                  )}
                </div>
              )}

              {/* ─── 2-ROW TOPIC + QUIZ ITEMS ─── */}
              <div className="space-y-1">
                {mod.topics.map((t) => {
                  const isCurrentTopic = currentPath.includes(`/topic/${t.id}`);
                  const isCurrentQuiz = t.quiz && currentPath.includes(`/quiz/${t.quiz.id}`);

                  return (
                    <div
                      key={t.id}
                      className="rounded-xl bg-slate-900/40 border border-slate-800/60 p-1.5 space-y-1 hover:border-slate-800 transition-colors"
                    >
                      {/* 📘 LINE 1: Topic Row */}
                      {t.isUnlocked ? (
                        <Link
                          href={t.url}
                          onClick={onCloseMobile}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-xs ${
                            isCurrentTopic
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="text-[13px] shrink-0">📘</span>
                            <span className="truncate font-medium">
                              {t.title}
                            </span>
                          </div>

                          {/* Line 1 Status Badge */}
                          <div className="shrink-0 flex items-center gap-1">
                            {t.isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Done</span>
                              </span>
                            ) : isCurrentTopic ? (
                              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                ▶ Current
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">
                                {t.durationMinutes}m
                              </span>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-600 opacity-60">
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="text-[13px] shrink-0">📘</span>
                            <span className="truncate">{t.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-600 shrink-0">
                            🔒 · {t.durationMinutes}m
                          </span>
                        </div>
                      )}

                      {/* 📝 LINE 2: Quiz Row */}
                      {t.quiz && (
                        <div>
                          {t.quiz.isUnlocked ? (
                            <Link
                              href={t.quiz.url}
                              onClick={onCloseMobile}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-xs pl-7 ${
                                isCurrentQuiz
                                  ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                <span className="text-[11px] shrink-0">📝</span>
                                <span className="truncate">
                                  {mod.moduleNumber}.{t.lessonNumber} Quiz ({t.quiz.questionCount} MCQs)
                                </span>
                              </div>

                              {/* Line 2 Status Badge */}
                              <div className="shrink-0">
                                {t.quiz.isPassed ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{t.quiz.scoreDisplay || 'Passed'}</span>
                                  </span>
                                ) : t.quiz.attemptsCount > 0 ? (
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                    ⚠️ {t.quiz.scoreDisplay || 'Retry'}
                                  </span>
                                ) : isCurrentQuiz ? (
                                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                                    ▶ Start
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 hover:text-violet-400">
                                    Start
                                  </span>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-600 pl-7 opacity-50">
                              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                <span className="text-[11px] shrink-0">📝</span>
                                <span className="truncate">
                                  {mod.moduleNumber}.{t.lessonNumber} Quiz ({t.quiz.questionCount} MCQs)
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-600 shrink-0">
                                🔒
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ─── WEB DEVELOPMENT PROJECT PDF LINK (ABOVE CAPSTONE) ─── */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="px-2 flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${capstone?.isUnlocked ? 'text-cyan-400/90' : 'text-slate-500'}`}>
              Project Specification
            </span>
            <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
              capstone?.isUnlocked
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : 'bg-slate-900 text-slate-600 border-slate-800/80'
            }`}>
              PDF
            </span>
          </div>

          {capstone?.isUnlocked ? (
            <a
              href={capstone?.exercisePdfUrl || 'https://drive.google.com/file/d/1dtrV7i90kKfAumqe0kLSfgYdYFJmevbk/preview'}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-blue-950/30 hover:from-cyan-900/40 hover:to-blue-900/40 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-200 transition-all shadow-sm shadow-cyan-950/20"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-semibold truncate text-cyan-100 group-hover:text-white">
                    Web Development Project
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-cyan-300/80 truncate">
                    View PDF Guidelines
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400/70 group-hover:text-cyan-300 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <div
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-900 bg-slate-950/40 text-slate-600 opacity-60 cursor-not-allowed select-none"
              title="Complete all 15 topics and pass all quizzes to unlock the Project PDF"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 text-slate-600 border border-slate-800/60">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-medium truncate text-slate-500">
                    Web Development Project
                  </span>
                  <span className="text-[10px] text-slate-600 truncate">
                    Locked — Complete all topics & quizzes
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-600 shrink-0 ml-1">🔒</span>
            </div>
          )}
        </div>

        {/* ─── CAPSTONE & CERTIFICATE SECTION ─── */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
              Capstone & Certification
            </span>
          </div>

          {/* Capstone Project Guidelines Link */}
          {capstone?.isUnlocked ? (
            <Link
              href={capstone.url}
              onClick={onCloseMobile}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                currentPath.includes('/project')
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium truncate">Capstone Project</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                Ready
              </span>
            </Link>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-900 bg-slate-950/40 text-slate-600 opacity-60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 text-slate-600 border border-slate-800/60">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium truncate">Capstone Project</span>
              </div>
              <span className="text-[10px] text-slate-600">🔒</span>
            </div>
          )}

          {/* Submit Capstone Link */}
          {capstone?.isUnlocked ? (
            <Link
              href={capstone.submitUrl}
              onClick={onCloseMobile}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                currentPath.includes('/submit')
                  ? 'bg-violet-500/15 border-violet-500/40 text-violet-200 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium truncate">Submit Capstone</span>
              </div>
              {capstone.isSubmitted ? (
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {capstone.submissionStatus === 'APPROVED' ? '✅ Approved' : '⏳ Submitted'}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md">
                  Submit
                </span>
              )}
            </Link>
          ) : null}

          {/* Verified Certificate Link */}
          {capstone?.isEligibleForCertificate ? (
            <Link
              href="/certificate"
              onClick={onCloseMobile}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 hover:from-emerald-600/30 hover:to-teal-600/30 transition-all font-semibold"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span className="text-xs truncate">Claim Certificate</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                🏆 Issued
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
