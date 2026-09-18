'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  FileCode,
  Terminal,
  Download,
  Award,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Lock
} from 'lucide-react';

export default function LessonPlayerPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'resources'>('notes');
  const [isCompleted, setIsCompleted] = useState(false);

  const modules = [
    {
      title: 'Week 1: Next.js 15 & Modern TypeScript',
      lessons: [
        { id: 'lesson-1', title: '1. TypeScript Strict Typing & Generics', duration: '45m', completed: true },
        { id: 'lesson-2', title: '2. Next.js 15 App Router & Server Components', duration: '55m', completed: true },
        { id: 'lesson-3', title: '3. Zustand Client State Management', duration: '40m', completed: true },
        { id: 'lesson-4', title: '4. Capstone #1: Multi-Tenant Architecture Scaffold', duration: '60m', completed: true },
      ],
    },
    {
      title: 'Week 2: NestJS Modular Backend & Prisma ORM',
      lessons: [
        { id: 'lesson-5', title: '5. NestJS Modules, Controllers & Services', duration: '50m', completed: true },
        { id: 'lesson-6', title: '6. PostgreSQL Schema Modeling with Prisma', duration: '65m', completed: true },
        { id: 'lesson-7', title: '7. DTOs, Pipes & Validation Filters', duration: '45m', completed: true },
        { id: 'lesson-8', title: '8. Database Seeding & Relations Optimization', duration: '60m', completed: false, active: true },
      ],
    },
    {
      title: 'Week 3: Hardened JWT Auth & RBAC Security',
      lessons: [
        { id: 'lesson-9', title: '9. Bcrypt Password Hashing Math', duration: '40m', completed: false },
        { id: 'lesson-10', title: '10. httpOnly Cookie JWT Tokens & Rotation', duration: '50m', completed: false },
        { id: 'lesson-11', title: '11. Role Guards & CSRF Security Hardening', duration: '45m', completed: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Classroom Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Lesson 8 of 20</span>
            <span className="text-sm font-bold text-white max-w-sm sm:max-w-md truncate">
              Database Seeding & Relations Optimization
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/learn/full-stack-web-development/quiz"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Module Skill Quiz</span>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center: Video Player & Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Video Player Canvas */}
          <div className="bg-black relative aspect-video max-h-[520px] w-full flex items-center justify-center border-b border-slate-800 group">
            <div className="text-center space-y-3 z-10 p-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/50 transform group-hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white translate-x-0.5" />}
              </button>
              <div className="space-y-1">
                <p className="text-xs text-slate-300 font-medium">
                  {isPlaying ? 'Lecture Playing: Database Relations & Query Performance' : 'Click to Play Lecture (1080p Full HD)'}
                </p>
                <p className="text-[11px] text-slate-500">Instructor: DevAscent Lead Architect • 60m 00s</p>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-mono">14:20 / 60:00</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold">1080p</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCompleted(!isCompleted)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Content Tabs */}
          <div className="bg-slate-900 border-b border-slate-800 flex px-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lecture Notes & Architecture</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Source Code & Queries</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'resources'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Exercise Files (ZIP)</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-300 max-w-4xl text-sm leading-relaxed">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Prisma Relational Modeling & Index Strategy</h2>
                <p>
                  In this lesson, we structure relational entities for high-scale performance in PostgreSQL. We avoid common N+1 query traps and design compound indexes on foreign keys (`userId`, `courseId`).
                </p>

                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">Key Engineering Rules</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    <li>Always use explicit relations in `schema.prisma` with `@relation(fields: [...], references: [...])`.</li>
                    <li>Add `@@index([userId, courseId])` to speed up student progress checks to under 2ms.</li>
                    <li>Wrap multi-step database writes in `prisma.$transaction([...])` to guarantee ACID properties.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>prisma/seed.ts</span>
                  <span className="text-emerald-400">TypeScript</span>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
                  <p className="text-indigo-400">// Seed courses, modules and quiz questions</p>
                  <p className="text-purple-400">async function <span className="text-white">main</span>() {'{'}</p>
                  <p className="pl-4">const course = await prisma.course.upsert({'{'}</p>
                  <p className="pl-8">where: {'{'} slug: <span className="text-amber-300">'full-stack-web-development'</span> {'}'},</p>
                  <p className="pl-8">update: {'{}'},</p>
                  <p className="pl-8">create: {'{'}</p>
                  <p className="pl-12">title: <span className="text-amber-300">'Full-Stack Web Development & Cloud'</span>,</p>
                  <p className="pl-12">price: <span className="text-emerald-400">1499</span>,</p>
                  <p className="pl-8">{'}'},</p>
                  <p className="pl-4">{'}'});</p>
                  <p className="text-purple-400">{'}'}</p>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">Week 2 Starter Code & Prisma Schemas</h5>
                    <p className="text-[11px] text-slate-400">Includes docker-compose.yml and seed data (4.2 MB)</p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Syllabus Tree */}
        <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Cohort Curriculum</h3>
            <span className="text-xs font-semibold text-emerald-400">7/20 Done</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 text-xs">
            {modules.map((mod, midx) => (
              <div key={midx} className="p-3 space-y-2">
                <h4 className="font-bold text-slate-300 text-[11px] px-1">{mod.title}</h4>
                <div className="space-y-1">
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => router.push(`/learn/full-stack-web-development/${lesson.id}`)}
                      className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                        lesson.active
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                          : 'hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : lesson.active ? (
                          <div className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0"></div>
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
