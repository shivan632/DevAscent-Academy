'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Briefcase,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Bell,
  Check,
  Award,
  Layers,
  Search,
} from 'lucide-react';

export default function InternshipsPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const upcomingInternships = [
    {
      id: 'web-dev',
      title: 'Full-Stack Web Development Virtual Internship',
      domain: 'Web Development',
      badge: 'Opening Next Cohort',
      duration: '4 Weeks',
      stipend: 'Performance-Based Stipend + LOR',
      techs: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'python-dev',
      title: 'Python Automation & Backend Internship',
      domain: 'Python & Cloud',
      badge: 'Curriculum Refresh',
      duration: '4 Weeks',
      stipend: 'Verified Certificate + Industry Mentorship',
      techs: ['Python 3', 'FastAPI', 'Tkinter', 'Web Scraping', 'Docker'],
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'ai-ml',
      title: 'Machine Learning & Predictive AI Internship',
      domain: 'AI / Data Science',
      badge: 'Waitlist Open',
      duration: '4 Weeks',
      stipend: 'Real-World Capstone + GitHub Verification',
      techs: ['PyTorch', 'Pandas', 'Scikit-Learn', 'OpenAI APIs'],
      gradient: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Banner / Notice */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Virtual Internships • Next Cohort Enrollment Coming Soon</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Industrial Internships <br />
              <span className="bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                Are Opening Soon
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We are currently upgrading our cohort evaluation infrastructure and capstone submission pipelines. 
              Active internships are temporarily paused for new enrollments. Get notified as soon as registrations open!
            </p>

            {/* Waitlist Subscription Box */}
            <div className="pt-4 max-w-md mx-auto">
              {subscribed ? (
                <div className="flex items-center justify-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>You are on the priority waitlist! We will notify you first.</span>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notify Me</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Upcoming Internship Tracks Preview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Upcoming Internship Programs
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  4-week intensive milestones with mentor feedback & verifiable certificates
                </p>
              </div>

              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
              >
                <span>View Live Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingInternships.map((track) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                        {track.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {track.duration}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {track.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {track.stipend}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {track.techs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Opening Soon</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA to Courses */}
          <div className="mt-14 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Start Learning Today
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Explore Available Courses & Free Tracks
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                You can start with our 100% Free React & TypeScript course or full-stack cohorts while internships are being refreshed.
              </p>
            </div>

            <Link
              href="/courses"
              className="z-10 px-6 py-3 rounded-2xl bg-white text-indigo-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shrink-0"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
