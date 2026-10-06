'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { api } from '@/lib/api';
import {
  Plus,
  Edit2,
  Trash2,
  Video,
  FileText,
  Award,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  Layers,
  Eye,
  Clock,
  FolderGit2
} from 'lucide-react';

interface QuestionForm {
  id?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  codeSnippet?: string;
}

interface LessonForm {
  id?: string;
  moduleId: string;
  title: string;
  lessonNumber: number;
  durationMinutes: number;
  summary: string;
  notesPdfUrl: string;
  isFreePreview: boolean;
}

export default function AdminCurriculumStudioPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params?.slug as string;

  // Data fetching
  const { data, isLoading, mutate } = useSWR(
    courseSlug ? `/admin/courses/${courseSlug}/curriculum` : null,
    () => api.admin.getCurriculum(courseSlug)
  );

  const course = data?.course || data?.data?.course;

  // Module modal state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [savingModule, setSavingModule] = useState(false);

  // Course Project modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectPdfUrl, setProjectPdfUrl] = useState('');
  const [savingProject, setSavingProject] = useState(false);

  // Lesson studio modal state (Studio B: 2 Tabs only: Notes PDF + Quiz)
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'notes' | 'quiz'>('notes');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [lessonForm, setLessonForm] = useState<LessonForm>({
    moduleId: '',
    title: '',
    lessonNumber: 1,
    durationMinutes: 35,
    summary: '',
    notesPdfUrl: '',
    isFreePreview: false,
  });

  // Quiz in lesson studio
  const [quizTitle, setQuizTitle] = useState('');
  const [quizPassingScore, setQuizPassingScore] = useState(70);
  const [quizMaxAttempts, setQuizMaxAttempts] = useState(3);
  const [quizQuestions, setQuizQuestions] = useState<QuestionForm[]>([]);
  const [savingLesson, setSavingLesson] = useState(false);

  // Open Add Module
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleTitle('');
    setModuleDescription('');
    setModuleModalOpen(true);
  };

  // Open Edit Module
  const handleOpenEditModule = (mod: any) => {
    setEditingModule(mod);
    setModuleTitle(mod.title);
    setModuleDescription(mod.description || '');
    setModuleModalOpen(true);
  };

  // Save Module (Create or Update)
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || savingModule) return;

    try {
      setSavingModule(true);
      if (editingModule) {
        await api.admin.updateModule(courseSlug, editingModule.id, {
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
        });
      } else {
        await api.admin.createModule(courseSlug, {
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
        });
      }
      setModuleModalOpen(false);
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to save module');
    } finally {
      setSavingModule(false);
    }
  };

  // Delete Module
  const handleDeleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${moduleTitle}" and all its lessons?`)) return;

    try {
      await api.admin.deleteModule(courseSlug, moduleId);
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete module');
    }
  };

  // Open Course Project Modal
  const handleOpenCourseProject = () => {
    setProjectTitle(course?.projectPdfTitle || `${course?.title || 'Web Development'} Capstone Project`);
    setProjectPdfUrl(course?.projectPdfUrl || '');
    setProjectModalOpen(true);
  };

  // Save Course Project
  const handleSaveCourseProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingProject) return;

    try {
      setSavingProject(true);
      await api.admin.updateCourseProject(courseSlug, {
        projectPdfTitle: projectTitle.trim() || undefined,
        projectPdfUrl: projectPdfUrl.trim() || undefined,
      });
      setProjectModalOpen(false);
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to update course project');
    } finally {
      setSavingProject(false);
    }
  };

  // Open Add Lesson
  const handleOpenAddLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setLessonForm({
      moduleId,
      title: '',
      lessonNumber: 1,
      durationMinutes: 35,
      summary: '',
      notesPdfUrl: '',
      isFreePreview: false,
    });
    setQuizTitle('Skill Assessment Quiz');
    setQuizPassingScore(70);
    setQuizMaxAttempts(3);
    setQuizQuestions([
      {
        question: 'What is the primary architectural advantage of semantic layout?',
        options: [
          'Tight coupling between files',
          'Clean separation of concerns and accessibility',
          'Eliminates database transactions',
          'Disables authentication guards',
        ],
        correctOptionIndex: 1,
        explanation: 'Semantic HTML5 structure ensures accessibility, SEO readability, and maintainable DOM hierarchy.',
      },
    ]);
    setActiveStudioTab('notes');
    setLessonModalOpen(true);
  };

  // Open Edit Lesson
  const handleOpenEditLesson = (moduleId: string, lesson: any) => {
    setSelectedModuleId(moduleId);
    setLessonForm({
      id: lesson.id,
      moduleId,
      title: lesson.title,
      lessonNumber: lesson.lessonNumber,
      durationMinutes: lesson.durationMinutes || 35,
      summary: lesson.summary || '',
      notesPdfUrl: lesson.notesPdfUrl || '',
      isFreePreview: lesson.isFreePreview || false,
    });

    if (lesson.quiz) {
      setQuizTitle(lesson.quiz.title || 'Skill Assessment Quiz');
      setQuizPassingScore(lesson.quiz.passingScore || 70);
      setQuizMaxAttempts(lesson.quiz.maxAttempts || 3);
      setQuizQuestions(
        lesson.quiz.questions?.map((q: any) => ({
          id: q.id,
          question: q.question || q.questionText,
          options: Array.isArray(q.options) && q.options.length ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctOptionIndex: q.correctOptionIndex ?? 0,
          explanation: q.explanation || '',
          codeSnippet: q.codeSnippet || '',
        })) || []
      );
    } else {
      setQuizTitle(`${lesson.title} - Skill Assessment`);
      setQuizPassingScore(70);
      setQuizMaxAttempts(3);
      setQuizQuestions([]);
    }

    setActiveStudioTab('notes');
    setLessonModalOpen(true);
  };

  // Save Lesson (Create or Update + Upsert Quiz)
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || savingLesson) return;

    try {
      setSavingLesson(true);
      let lessonId = lessonForm.id;

      if (lessonId) {
        // Update lesson (2 tabs: Notes PDF & Quiz)
        await api.admin.updateLesson(courseSlug, lessonId, {
          title: lessonForm.title.trim(),
          durationMinutes: Number(lessonForm.durationMinutes),
          summary: lessonForm.summary.trim() || undefined,
          notesPdfUrl: lessonForm.notesPdfUrl.trim() || undefined,
          isFreePreview: lessonForm.isFreePreview,
        });
      } else {
        // Create lesson
        const res = await api.admin.createLesson(courseSlug, selectedModuleId, {
          title: lessonForm.title.trim(),
          durationMinutes: Number(lessonForm.durationMinutes),
          summary: lessonForm.summary.trim() || undefined,
          notesPdfUrl: lessonForm.notesPdfUrl.trim() || undefined,
          isFreePreview: lessonForm.isFreePreview,
        });
        const created = res?.lesson || res?.data?.lesson;
        lessonId = created?.id;
      }

      // If quiz questions exist, upsert quiz
      if (lessonId && quizQuestions.length > 0) {
        await api.admin.upsertLessonQuiz(courseSlug, lessonId, {
          title: quizTitle.trim() || `${lessonForm.title} Quiz`,
          passingScore: Number(quizPassingScore) || 70,
          maxAttempts: Number(quizMaxAttempts) || 3,
          questions: quizQuestions.map((q, qIdx) => ({
            order: qIdx + 1,
            question: q.question.trim(),
            options: q.options.map((opt) => opt.trim()),
            correctOptionIndex: Number(q.correctOptionIndex),
            explanation: q.explanation?.trim() || '',
            codeSnippet: q.codeSnippet?.trim() || '',
          })),
        });
      }

      setLessonModalOpen(false);
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to save lesson');
    } finally {
      setSavingLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`Are you sure you want to delete lesson "${lessonTitle}"?`)) return;

    try {
      await api.admin.deleteLesson(courseSlug, lessonId);
      mutate();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete lesson');
    }
  };

  // Add Question to Quiz
  const handleAddQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        question: 'New Question prompt...',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
        explanation: 'Explanation for why this option is correct.',
      },
    ]);
  };

  // Remove Question from Quiz
  const handleRemoveQuestion = (qIndex: number) => {
    setQuizQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  // Update Question Option
  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, qi) => {
        if (qi !== qIndex) return q;
        const newOptions = [...q.options];
        newOptions[optIndex] = text;
        return { ...q, options: newOptions };
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-2 rounded-xl transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Courses</span>
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-white">
                {course?.title || 'Curriculum Studio'}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 uppercase font-mono">
                {course?.type || 'INTERNSHIP'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              /{courseSlug} • {course?.modules?.length || 0} Modules •{' '}
              {course?.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0} Lessons
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/admin/courses/${courseSlug}/videos`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white transition-all border border-indigo-500/30 shadow-sm"
          >
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Videos Studio</span>
          </Link>

          {/* Course Project Modal Trigger */}
          <button
            onClick={handleOpenCourseProject}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-white transition-all border border-emerald-500/30 shadow-sm"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Course Project ↗</span>
          </button>

          <button
            onClick={handleOpenAddModule}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-xs">Loading Course Curriculum...</p>
        </div>
      ) : !course?.modules?.length ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Modules Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start structuring this course by adding your first module, then attach Google Drive PDF lesson notes and quizzes!
            </p>
          </div>
          <button
            onClick={handleOpenAddModule}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Module</span>
          </button>
        </div>
      ) : (
        /* Modules & Lessons Hierarchy Tree */
        <div className="space-y-4">
          {course.modules.map((mod: any, mIdx: number) => (
            <div
              key={mod.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              {/* Module Bar */}
              <div className="p-4 sm:p-5 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                    {mod.moduleNumber || mIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{mod.title}</span>
                    </h3>
                    {mod.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenAddLesson(mod.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModule(mod)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit Module"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteModule(mod.id, mod.title)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 rounded-lg transition-colors border border-red-800/40"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lessons List in Module */}
              <div className="p-3 sm:p-4 space-y-2.5">
                {!mod.lessons?.length ? (
                  <div className="p-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No lessons in this module. Click "Add Lesson" above to add your first lecture.
                  </div>
                ) : (
                  mod.lessons.map((lesson: any, lIdx: number) => {
                    const hasNotes = Boolean(lesson.notesPdfUrl);
                    const hasQuiz = Boolean(lesson.quiz && (lesson.quiz.questions?.length > 0));
                    const questionCount = lesson.quiz?.questions?.length || 0;

                    return (
                      <div
                        key={lesson.id}
                        className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                      >
                        {/* Lesson Title & Number */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-300 shrink-0">
                            {lesson.lessonNumber || lIdx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate max-w-sm sm:max-w-md">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.durationMinutes || 35} mins
                              </span>
                              {lesson.isFreePreview && (
                                <span className="text-purple-400 font-semibold">• Free Preview</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content Badges (2 badges only: Notes & Quiz) */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0 text-[10px] font-medium">
                          {/* Notes status */}
                          <span
                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                              hasNotes
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <FileText className="w-3 h-3" />
                            <span>{hasNotes ? 'Notes ✓' : 'Notes Pending'}</span>
                          </span>

                          {/* Quiz status */}
                          <span
                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                              hasQuiz
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <Award className="w-3 h-3" />
                            <span>
                              {hasQuiz
                                ? `Quiz (${questionCount}Q)`
                                : 'Quiz Missing'}
                            </span>
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEditLesson(mod.id, lesson)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
                          >
                            <Edit2 className="w-3 h-3 text-indigo-400" />
                            <span>Edit Studio</span>
                          </button>

                          <button
                            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 rounded-lg transition-colors border border-red-800/30"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL 1: ADD / EDIT MODULE ────────────────────────────────────────── */}
      {moduleModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{editingModule ? 'Edit Module' : 'Create New Module'}</span>
              </h3>
              <button
                onClick={() => setModuleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Module Title *</label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Module 1: React 19 Foundations & State"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Module Description (Optional)</label>
                <textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  rows={3}
                  placeholder="Summary of topics covered in this module..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingModule || !moduleTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                >
                  {savingModule ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{editingModule ? 'Update Module' : 'Create Module'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: COURSE PROJECT MODAL ─────────────────────────────────────── */}
      {projectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-400" />
                <span>Course Project PDF</span>
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseProject} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Project Title *</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Web Development Capstone Project"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold">Project PDF URL *</label>
                  {projectPdfUrl && (
                    <a
                      href={projectPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Test PDF Link ↗</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={projectPdfUrl}
                  onChange={(e) => setProjectPdfUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1dtrV7i.../preview"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  ℹ️ Format: Google Drive /preview link (e.g. <code>https://drive.google.com/file/d/[ID]/preview</code>)
                </p>
              </div>

              {projectPdfUrl && (
                <div className="border border-slate-800 rounded-xl overflow-hidden p-2 bg-slate-950">
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Live Preview Verification:</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Google Drive Preview</span>
                  </div>
                  <div className="h-44 rounded-lg overflow-hidden border border-slate-800">
                    <iframe
                      src={projectPdfUrl.replace(/\/view(\?.*)?$/, '/preview')}
                      className="w-full h-full border-0"
                      title="Project PDF Preview"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject || !projectTitle.trim() || !projectPdfUrl.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  {savingProject ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: 2-TAB LESSON STUDIO (STUDIO B) ─────────────────────────── */}
      {lessonModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full my-auto flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Studio B
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {lessonForm.id ? `Edit Lesson: ${lessonForm.title}` : 'Create New Lesson'}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure Lesson Notes PDF and Skill Quiz (6-8 Questions).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLessonModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Studio Tabs */}
            <div className="bg-slate-950 border-b border-slate-800 flex items-center px-4 overflow-x-auto text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setActiveStudioTab('notes')}
                className={`py-3 px-5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeStudioTab === 'notes'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 Lesson Notes PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStudioTab('quiz')}
                className={`py-3 px-5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeStudioTab === 'quiz'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>❓ Skill Quiz ({quizQuestions.length} Questions)</span>
              </button>
            </div>

            {/* Studio Form Body */}
            <form onSubmit={handleSaveLesson} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-slate-300">
              
              {/* TAB 1: LESSON NOTES PDF */}
              {activeStudioTab === 'notes' && (
                <div className="space-y-4">
                  {/* Common Title & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-slate-300 font-semibold">Lesson Title *</label>
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        placeholder="e.g. 1.1 Semantic HTML5 & Modern Layout Architecture"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Est. Read Time (Mins)</label>
                      <input
                        type="number"
                        value={lessonForm.durationMinutes}
                        onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-white focus:outline-none"
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Learning Objective / Summary</label>
                    <textarea
                      value={lessonForm.summary}
                      onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
                      rows={2}
                      placeholder="Structured semantic markup, landmark roles, and accessibility foundations..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  {/* Google Drive PDF URL input */}
                  <div className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>📄 Lesson Notes PDF URL *</span>
                      </label>

                      {lessonForm.notesPdfUrl && (
                        <a
                          href={lessonForm.notesPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>🔍 Test PDF Link ↗</span>
                        </a>
                      )}
                    </div>

                    <input
                      type="url"
                      value={lessonForm.notesPdfUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, notesPdfUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/xxxxx/preview"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
                    />

                    <p className="text-[11px] text-slate-400">
                      ℹ️ Format: <code>https://drive.google.com/file/d/[ID]/preview</code> (Google Drive /preview link)
                    </p>

                    {lessonForm.notesPdfUrl && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80">
                        <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                          <span>Live In-Studio PDF Preview:</span>
                          <span className="text-indigo-400 font-mono text-[10px]">Google Drive Preview</span>
                        </div>
                        <div className="h-64 rounded-xl overflow-hidden border border-slate-800 bg-black">
                          <iframe
                            src={lessonForm.notesPdfUrl.replace(/\/view(\?.*)?$/, '/preview')}
                            className="w-full h-full border-0"
                            title="Lesson PDF Preview"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1 pb-1">
                    <input
                      type="checkbox"
                      id="freePreviewCheck"
                      checked={lessonForm.isFreePreview}
                      onChange={(e) => setLessonForm({ ...lessonForm, isFreePreview: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="freePreviewCheck" className="text-slate-300 font-medium cursor-pointer">
                      Mark as Free Preview (Allow un-enrolled students to access this lesson)
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: SKILL QUIZ BUILDER */}
              {activeStudioTab === 'quiz' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="space-y-1 flex-1">
                      <label className="text-slate-300 font-semibold">Quiz Title</label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="e.g. Semantic HTML5 & Layout Assessment"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="space-y-1 shrink-0">
                        <label className="text-slate-300 font-semibold">Passing (%)</label>
                        <input
                          type="number"
                          value={quizPassingScore}
                          onChange={(e) => setQuizPassingScore(Number(e.target.value))}
                          className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                          min={10}
                          max={100}
                        />
                      </div>

                      <div className="space-y-1 shrink-0">
                        <label className="text-slate-300 font-semibold">Max Attempts</label>
                        <input
                          type="number"
                          value={quizMaxAttempts}
                          onChange={(e) => setQuizMaxAttempts(Number(e.target.value))}
                          className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                          min={1}
                          max={10}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">
                        Quiz Questions ({quizQuestions.length})
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {!quizQuestions.length ? (
                      <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-2">
                        <p>No questions configured for this lesson assessment.</p>
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                        >
                          + Add First Question
                        </button>
                      </div>
                    ) : (
                      quizQuestions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-400 font-mono">
                              Question #{qIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(qIdx)}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 text-[11px]">Question Prompt *</label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const newQuestions = [...quizQuestions];
                                newQuestions[qIdx].question = e.target.value;
                                setQuizQuestions(newQuestions);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                              required
                            />
                          </div>

                          {/* Options */}
                          <div className="space-y-2 pt-1">
                            <label className="text-slate-400 text-[11px] flex items-center justify-between">
                              <span>Options (Select the correct radio button)</span>
                              <span className="text-emerald-400">Green = Correct Answer</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = q.correctOptionIndex === optIdx;
                                return (
                                  <div
                                    key={optIdx}
                                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                                      isCorrect
                                        ? 'bg-emerald-950/20 border-emerald-500/50'
                                        : 'bg-slate-900 border-slate-800'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`correct-opt-${qIdx}`}
                                      checked={isCorrect}
                                      onChange={() => {
                                        const newQuestions = [...quizQuestions];
                                        newQuestions[qIdx].correctOptionIndex = optIdx;
                                        setQuizQuestions(newQuestions);
                                      }}
                                      className="text-emerald-500 focus:ring-0 cursor-pointer"
                                    />
                                    <span className="font-mono text-[10px] text-slate-400">
                                      {String.fromCharCode(65 + optIdx)}:
                                    </span>
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                      className="flex-1 bg-transparent border-0 text-white text-xs focus:outline-none"
                                      required
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Explanation */}
                          <div className="space-y-1 pt-1">
                            <label className="text-slate-400 text-[11px]">Explanation (Shown to students post-quiz)</label>
                            <input
                              type="text"
                              value={q.explanation}
                              onChange={(e) => {
                                const newQuestions = [...quizQuestions];
                                newQuestions[qIdx].explanation = e.target.value;
                                setQuizQuestions(newQuestions);
                              }}
                              placeholder="Why is this answer correct?"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="text-slate-400 text-[11px]">
                  All changes sync to Neon PostgreSQL and reflect on student learning rooms instantly.
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLessonModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingLesson || !lessonForm.title.trim()}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    {savingLesson ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{lessonForm.id ? 'Save Lesson' : 'Create Lesson'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
