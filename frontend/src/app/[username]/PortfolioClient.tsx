'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  ShieldCheck,
  Award,
  Globe,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Calendar,
  MapPin,
  GraduationCap,
  FolderGit2,
  FileText,
  User,
  Cpu,
} from 'lucide-react';

interface PortfolioClientProps {
  initialData: any;
  handle: string;
}

export default function PortfolioClient({ initialData, handle }: PortfolioClientProps) {
  const [data] = useState<any>(initialData);
  const [copiedLink, setCopiedLink] = useState(false);

  const user = data?.user || {};
  const isPrivate = data?.isPrivate;

  const handleCopyProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(
        `Check out my verified production engineering portfolio and credentials on DevAscent Academy!`
      );
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        '_blank',
        'width=600,height=600'
      );
    }
  };

  if (isPrivate) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B14] text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Private Developer Profile</h2>
            <p className="text-xs text-slate-400">
              @{handle} has configured their DevAscent portfolio to private mode.
            </p>
            <Link
              href="/courses"
              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-xl transition-all"
            >
              Explore DevAscent Tracks
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const credentials = data?.verifiedCredentials || [];
  const capstones = data?.verifiedCapstones || [];
  const skills = user?.skills || [];
  const activeTracks = data?.activeTracks || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Top Banner & Profile Header */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0F1528] via-[#0D1222] to-[#0A0E1A] border border-slate-800/80 p-6 sm:p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Identity Column */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-emerald-500 p-0.5 shadow-xl">
                    <div className="w-full h-full rounded-[22px] bg-[#0A0D18] flex items-center justify-center text-2xl sm:text-3xl font-black text-white overflow-hidden">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{user.name?.charAt(0)?.toUpperCase() || 'D'}</span>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 border-2 border-[#0A0D18]" title="Verified Graduate">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                      {user.name}
                    </h1>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      @{user.username || handle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                    {user.bio || 'Software Engineering Scholar specializing in Production Web & Cloud Architectures.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
                    {user.college && (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{user.degree ? `${user.degree}, ` : ''}{user.college}</span>
                      </span>
                    )}
                    {user.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.city}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action & Socials Column */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  onClick={handleShareLinkedIn}
                  className="px-4 py-2.5 rounded-2xl bg-[#0077B5] hover:bg-[#006399] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/></svg>
                  <span>Share on LinkedIn</span>
                </button>

                <button
                  onClick={handleCopyProfile}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                    title="GitHub Profile"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
                  </a>
                )}
              </div>
            </div>

            {/* Technical Skills Pills */}
            {skills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1">
                  Verified Stack:
                </span>
                {skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-indigo-300 font-mono font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Grid: Capstone Projects (Left 7 cols) & Credentials Ledger (Right 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Production Capstone Projects */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Production Capstones
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                  ● Code Reviewed &amp; Approved
                </span>
              </div>

              {capstones.length > 0 ? (
                <div className="space-y-4">
                  {capstones.map((cap: any) => (
                    <div
                      key={cap.id}
                      className="p-6 rounded-3xl bg-[#0D1222] border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 shadow-lg group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                            {cap.course?.title || 'Capstone System'}
                          </span>
                          <h3 className="text-lg font-bold text-white pt-0.5">
                            {cap.projectName || 'Full-Stack Architecture Capstone'}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(cap.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {cap.gitRepoUrl && (
                          <a
                            href={cap.gitRepoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
                            <span>GitHub Repo</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        )}

                        {cap.linkedinPostUrl && (
                          <a
                            href={cap.linkedinPostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-800/80 hover:border-indigo-600 text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5 transition-all"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/></svg>
                            <span>LinkedIn Walkthrough</span>
                            <ExternalLink className="w-3 h-3 text-indigo-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-[#0D1222] border border-slate-800 text-center space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">Capstone Review in Progress</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Candidate is actively implementing their capstone milestone repository for mentor code review.
                  </p>
                </div>
              )}

              {/* Active Tracks & Roadmaps */}
              {activeTracks.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Enrolled Cohorts &amp; Tracks</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTracks.map((trk: any) => (
                      <div
                        key={trk.id}
                        className="p-4 rounded-2xl bg-[#0D1222] border border-slate-800 space-y-1"
                      >
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                          Cohort #{trk.course.cohortNumber || 14}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {trk.course.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {trk.course.durationWeeks || 4} Weeks Immersive
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Cryptographic Credentials Ledger */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Verified Credentials
                </h2>
              </div>

              {credentials.length > 0 ? (
                <div className="space-y-4">
                  {credentials.map((cert: any) => (
                    <div
                      key={cert.id}
                      className="p-6 rounded-3xl bg-gradient-to-br from-[#0D1222] to-[#0A0D18] border border-indigo-500/25 space-y-4 shadow-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                            {cert.grade || 'Distinction (A+)'}
                          </span>
                          <h3 className="text-base font-bold text-white pt-1">
                            {cert.courseTitle}
                          </h3>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                      </div>

                      <div className="space-y-2 text-xs font-mono text-slate-400 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cred ID:</span>
                          <span className="text-indigo-400 font-bold">{cert.certId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Issued:</span>
                          <span className="text-slate-300">
                            {new Date(cert.issuedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="pt-1 truncate">
                          <span className="text-slate-500 block text-[10px]">SHA-256 Hash:</span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {cert.sha256Hash}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/verify/${cert.certId}`}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center transition-all shadow-sm"
                        >
                          Verify on Public Ledger
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-[#0D1222] border border-slate-800 text-center space-y-2">
                  <Award className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">In Active Certification Phase</p>
                  <p className="text-[11px] text-slate-500">
                    Cryptographic credentials mint automatically upon final capstone review.
                  </p>
                </div>
              )}

              {/* DevAscent Guarantee Badge */}
              <div className="p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-mono font-bold text-indigo-400">
                  <Cpu className="w-4 h-4" />
                  <span>DevAscent Proof-of-Work Standards</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  All projects and credentials listed on this profile have been verified against real code commits, architecture reviews, and immutable hash registries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

