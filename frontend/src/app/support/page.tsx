'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store/authStore';
import { api } from '../../lib/api';
import {
  Mail,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  Clock,
  AlertTriangle,
  BookOpen,
  User,
  MessageCircle,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
  Flame,
  Search,
  ExternalLink,
  Code2,
  FileQuestion,
  LifeBuoy,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How do I unblock my quiz after exhausting attempts?',
    a: 'Each quiz allows multiple attempts. If your attempts are exhausted, reach out via this help desk or ping mentors on Discord with your course & topic details for an attempt reset.',
  },
  {
    q: 'How long does Capstone Project review take?',
    a: 'Capstone submissions are verified within 24–48 business hours by our senior technical mentors. Once approved, your verifiable certificate is immediately issued in your dashboard.',
  },
  {
    q: 'How does the 7-Day Money-Back Guarantee work?',
    a: 'We offer an unconditional 7-day refund policy from the date of enrollment. Submit a refund request via the direct channel or email support@devascentacademy.me.',
  },
  {
    q: 'Can I request mentorship for custom code debugging?',
    a: 'Yes! Post your snippet, repository link, and stack trace in this form or the Discord #code-help channel to receive live debugging assistance from our engineering mentors.',
  },
];

const QUERY_CATEGORIES = [
  'Technical Doubt & Code Bug',
  'Capstone Project Review',
  'Quiz & Progression Unlock',
  'Certificate & Verification',
  'Account & Payment Support',
];

export default function SupportPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ask' | 'my-doubts'>('ask');

  // Form State
  const [question, setQuestion] = useState('');
  const [courseId, setCourseId] = useState('');
  const [category, setCategory] = useState(QUERY_CATEGORIES[0]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // UI state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'ANSWERED'>('ALL');

  // Fetch Courses
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

  // Fetch Student's Doubts if Authenticated
  const {
    data: myDoubtsData,
    isLoading: isLoadingDoubts,
    mutate: mutateDoubts,
  } = useSWR(
    isAuthenticated ? '/doubts/my' : null,
    () => api.getMyDoubts({ limit: 50 }),
    { revalidateOnFocus: true },
  );

  const myDoubts = myDoubtsData?.doubts || [];

  const filteredDoubts = useMemo(() => {
    if (filterStatus === 'ALL') return myDoubts;
    if (filterStatus === 'PENDING') return myDoubts.filter((d: any) => d.status === 'PENDING');
    if (filterStatus === 'ANSWERED') return myDoubts.filter((d: any) => d.status !== 'PENDING');
    return myDoubts;
  }, [myDoubts, filterStatus]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('devascentacademy@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || question.trim().length < 10) {
      setSubmitError('Please provide a detailed question (at least 10 characters).');
      return;
    }

    if (!isAuthenticated) {
      setSubmitError('Please sign in to submit a query and receive mentor answers.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const fullQuestion = `[Category: ${category}]\n\n${question.trim()}`;

    try {
      await api.createDoubt({
        question: fullQuestion,
        courseId: courseId || undefined,
        isUrgent,
      });

      setSubmitSuccess('Your query has been dispatched to instructors! Check "My Queries" for replies.');
      setQuestion('');
      setIsUrgent(false);
      mutateDoubts();
      setTimeout(() => {
        setSubmitSuccess(null);
        setActiveTab('my-doubts');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit doubt. Rate limit: 5 queries/hour.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* ─── Hero Header ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3" />
              <span>Instructors Online • SLA &lt; 2 Hours</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              We&apos;re Here to Help You{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Ask doubt queries directly to instructors, unblock technical bugs, submit capstone questions, and get rapid 1-on-1 mentorship.
            </p>

            {/* Segmented Navigation Tabs */}
            <div className="inline-flex p-1.5 bg-slate-900/90 border border-slate-800/90 rounded-2xl backdrop-blur-xl shadow-lg mt-2">
              <button
                type="button"
                onClick={() => setActiveTab('ask')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  activeTab === 'ask'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ask a Query / Doubt</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('my-doubts')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  activeTab === 'my-doubts'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>My Queries</span>
                {myDoubts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wide">
                    {myDoubts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ─── Main Grid Stage ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ─── Left Sidebar: Direct Channels, FAQs, Quick Links ─── */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Direct Channels Card */}
              <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-indigo-400" />
                    <span>Direct Channels</span>
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    24/7 Monitored
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Email Support Card */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-2.5 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Email Support</span>
                          <span className="text-[10px] text-slate-400">Response within 4 hours</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition"
                        title="Copy email address"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <a
                      href="mailto:devascentacademy@gmail.com"
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium break-all flex items-center gap-1 group-hover:underline"
                    >
                      <span>devascentacademy@gmail.com</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>

                  {/* Discord Channel Card */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Discord Community</span>
                        <span className="text-[10px] text-slate-400">Live mentor channels & peer review</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Connect with fellow interns, share repository links, and debug in real-time voice & text rooms.
                    </p>
                    <a
                      href="https://discord.gg/devascent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 text-xs font-semibold transition"
                    >
                      <span>Join Discord Server</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Instant FAQs Accordion */}
              <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Frequently Asked Questions</span>
                </h3>

                <div className="space-y-2.5">
                  {FAQ_ITEMS.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-800/80 bg-slate-950/40 overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full text-left p-3.5 flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 hover:text-white"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-indigo-400' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-3.5 pb-3.5 text-[11px] text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Policy & Registry Links */}
              <div className="bg-gradient-to-br from-slate-900/90 to-indigo-950/40 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-3">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Quick Academy Links
                </span>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li>
                    <Link
                      href="/refund-policy"
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-indigo-500/40 hover:text-white transition"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>7-Day Money-Back Policy</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/verify/DEVASCENT-2025-VALID"
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-indigo-500/40 hover:text-white transition"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>Certificate Verification Registry</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* ─── Right Content Area: Query Form or My Doubts ─── */}
            <div className="lg:col-span-8">
              {activeTab === 'ask' ? (
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                  
                  {/* Form Header */}
                  <div className="border-b border-slate-800/80 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400">
                        <Code2 className="w-4 h-4" />
                        <span>Ask Instructor / Admin Desk</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        Submit Your Query or Code Blocker
                      </h2>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 self-start sm:self-auto">
                      Rate limit: 5 / hr
                    </span>
                  </div>

                  {/* Feedback Notifications */}
                  {submitError && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleAskDoubt} className="space-y-6">
                    
                    {/* Category Selection Chips */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Select Query Topic
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {QUERY_CATEGORIES.map((cat) => {
                          const isSelected = category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setCategory(cat)}
                              className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
                                isSelected
                                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold ring-1 ring-indigo-500/40 shadow-sm'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Course / Cohort Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Relevant Cohort / Course (Optional)
                      </label>
                      <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-950/80 text-slate-200 transition"
                      >
                        <option value="">General Academy Question</option>
                        {courses.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Question Text Area */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Your Question / Doubt Details <span className="text-rose-400">*</span>
                        </label>
                        <span className="text-[11px] text-slate-500">
                          {question.length} chars (min 10)
                        </span>
                      </div>
                      
                      <textarea
                        required
                        rows={6}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Describe what you're trying to build, what error message or bug you are encountering, your repo link, or concept details..."
                        className="w-full px-4 py-3.5 text-xs sm:text-sm border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-950/80 text-slate-200 placeholder:text-slate-600 leading-relaxed custom-scrollbar transition resize-y"
                      />
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Tip: Include steps to reproduce or stack traces for faster diagnosis.</span>
                      </p>
                    </div>

                    {/* Urgent Toggle Card */}
                    <div 
                      onClick={() => setIsUrgent(!isUrgent)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isUrgent
                          ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          isUrgent 
                            ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`text-xs font-bold block ${isUrgent ? 'text-rose-300' : 'text-slate-200'}`}>
                            Mark as Urgent Blocker (High Priority)
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Dispatches priority notification to on-call mentors for fastest response.
                          </span>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isUrgent ? 'bg-rose-500 border-rose-400 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isUrgent && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-indigo-600/25 transition-all disabled:opacity-50 active:scale-[0.99] border border-indigo-400/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Dispatching Query to Mentors...' : 'Submit Query to Instructors'}</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* ─── My Queries Tab ─── */
                <div className="space-y-4">
                  
                  {/* Filter & Summary Bar */}
                  <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Your Query Tickets</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {myDoubts.length} Total
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['ALL', 'PENDING', 'ANSWERED'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFilterStatus(status)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-xl transition ${
                            filterStatus === status
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {status === 'ALL' ? 'All' : status === 'PENDING' ? '⏳ Awaiting' : '✅ Answered'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!isAuthenticated ? (
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-10 text-center space-y-4 backdrop-blur-xl">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                        <User className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base text-white">Please Sign In</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Sign in to track your submitted doubt tickets and read mentor answers.
                      </p>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
                      >
                        <span>Sign In to Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : isLoadingDoubts ? (
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-12 text-center text-xs text-slate-400 animate-pulse">
                      Loading your query tickets...
                    </div>
                  ) : filteredDoubts.length === 0 ? (
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-12 text-center space-y-4 backdrop-blur-xl">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base text-white">No Queries Found</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        {filterStatus === 'ALL'
                          ? 'Have a code blocker or question? Submit your first inquiry and instructors will respond here.'
                          : `No queries currently matching the "${filterStatus}" filter.`}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('ask')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Ask a Doubt Now</span>
                      </button>
                    </div>
                  ) : (
                    filteredDoubts.map((d: any) => {
                      const isPending = d.status === 'PENDING';

                      return (
                        <div
                          key={d.id}
                          className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 shadow-lg space-y-4 backdrop-blur-xl hover:border-slate-750 transition"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              {isPending ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                                  <Clock className="w-3 h-3 animate-spin" /> Awaiting Response
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                  <CheckCircle2 className="w-3 h-3" /> Answered
                                </span>
                              )}

                              {d.isUrgent && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                                  <Flame className="w-3 h-3" /> Urgent Blocker
                                </span>
                              )}

                              {d.course && (
                                <span className="text-[11px] text-indigo-400 font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                                  {d.course.title}
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-slate-500">
                              {new Date(d.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* Student's Question */}
                          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <p className="whitespace-pre-wrap">{d.question}</p>
                          </div>

                          {/* Instructor Answer */}
                          {d.answer ? (
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-violet-950/30 border border-indigo-500/30 space-y-2.5">
                              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-[10px] font-black">
                                    ✓
                                  </div>
                                  <span>Mentor Answer ({d.answeredBy?.name || 'Academy Mentor'}):</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  {d.answeredAt ? new Date(d.answeredAt).toLocaleString() : ''}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-200 pl-8">
                                {d.answer}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic pl-1 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400/70" />
                              <span>Our technical mentors are reviewing this inquiry and will post a response shortly.</span>
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
