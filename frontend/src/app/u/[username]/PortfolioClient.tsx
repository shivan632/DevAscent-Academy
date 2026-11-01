'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { api } from '../../../lib/api';
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
  Mail,
  Download,
  Trophy,
  Star,
  BookOpen,
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-3.5 h-3.5 fill-current"} viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-3.5 h-3.5 fill-current"} viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-3.5 h-3.5 fill-current"} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

interface PortfolioClientProps {
  initialData: any;
  handle: string;
}

export default function PortfolioClient({ initialData, handle }: PortfolioClientProps) {
  const [data, setData] = useState<any>(initialData);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeProjectTab, setActiveProjectTab] = useState<'all' | 'capstones' | 'personal'>('all');

  const cleanHandle = (handle || '').replace(/^%40/i, '').replace(/^@/, '').toLowerCase().trim();

  useEffect(() => {
    let isMounted = true;
    const fetchLivePortfolio = async () => {
      try {
        const res: any = await api.getPublicPortfolio(cleanHandle);
        const payload = res?.data || res;
        if (isMounted && payload && payload.user) {
          setData(payload);
        }
      } catch (err) {
        // Fallback remains active
      }
    };

    fetchLivePortfolio();
    return () => {
      isMounted = false;
    };
  }, [cleanHandle]);

  const user = data?.user || {};
  const isPrivate = data?.isPrivate;

  const rawName = user?.name || cleanHandle;
  const cleanName = rawName.replace(/^%40/i, '').replace(/^@/, '');
  const avatarLetter = cleanName.charAt(0).toUpperCase() || 'D';

  const headline =
    user?.headline ||
    (user?.college
      ? `${user?.degree ? `${user.degree} • ` : ''}${user.college}`
      : 'Software Engineering Scholar & Systems Builder');

  const handleCopyProfile = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/@${cleanHandle}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = encodeURIComponent(`https://www.devascentacademy.me/@${cleanHandle}`);
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
        '_blank',
        'width=600,height=600'
      );
    }
  };

  if (isPrivate) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070913] text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Private Developer Profile</h2>
            <p className="text-xs text-slate-400">
              @{cleanHandle} has configured their DevAscent portfolio to private mode.
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
  const lors = data?.lorDocuments || (data?.academicDocuments || []).filter((d: any) => d.type === 'LOR');
  const capstones = data?.verifiedCapstones || [];
  const customProjects = Array.isArray(user?.customProjects) ? user.customProjects : [];
  const achievements = Array.isArray(user?.achievements) ? user.achievements : [];
  const skills: string[] = user?.skills || [];
  const activeTracks = data?.activeTracks || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          
          {/* ─── 1. HERO IDENTITY & VERIFIED SCHOLAR BANNER ─── */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0F1426] via-[#0B0F1E] to-[#070A14] border border-indigo-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left Identity Column */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 p-0.5 shadow-2xl">
                    <div className="w-full h-full rounded-[22px] bg-[#0A0D18] flex items-center justify-center text-3xl sm:text-4xl font-black text-white overflow-hidden">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={cleanName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{avatarLetter}</span>
                      )}
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-slate-950 border-2 border-[#0A0D18] shadow-md"
                    title="Verified DevAscent Scholar"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                      {cleanName}
                    </h1>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      @{user.username || cleanHandle}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-extrabold text-emerald-300 bg-emerald-500/15 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Verified Scholar</span>
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-200 max-w-2xl leading-snug">
                    {headline}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-400 font-mono">
                    {user.college && (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          {user.degree ? `${user.degree}, ` : ''}
                          {user.college}
                          {user.graduationYear ? ` (Class of '${user.graduationYear.slice(-2)})` : ''}
                        </span>
                      </span>
                    )}
                    {user.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{user.city}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {user.resumeUrl && (
                  <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </a>
                )}

                <button
                  onClick={handleShareLinkedIn}
                  className="px-4 py-2.5 rounded-2xl bg-[#0077B5] hover:bg-[#006399] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </button>

                <button
                  onClick={handleCopyProfile}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Share Portfolio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bio Narrative */}
            {user.bio && (
              <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                {user.bio}
              </div>
            )}

            {/* Social & Coding Platform Profiles Strip */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1">
                Verified Handles:
              </span>

              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-white" />
                  <span>GitHub</span>
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#0077B5]" />
                  <span>LinkedIn</span>
                </a>
              )}

              {user.leetcodeUrl && (
                <a
                  href={user.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>LeetCode</span>
                </a>
              )}

              {user.twitterUrl && (
                <a
                  href={user.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <TwitterIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Twitter/X</span>
                </a>
              )}

              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Personal Site</span>
                </a>
              )}
            </div>

            {/* Technical Skills Categorized Strip */}
            {skills.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1">
                  Stack:
                </span>
                {skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-300 font-mono font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ─── 2. OFFICIAL LETTER OF RECOMMENDATION (IF ISSUED) ─── */}
          {lors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Official Letter of Recommendation (LOR)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lors.map((lor: any) => (
                  <div
                    key={lor.id}
                    className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-[#0E1222] to-[#0A0D18] border border-purple-500/30 space-y-4 shadow-xl relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                          Company Recommendation
                        </span>
                        <h3 className="text-lg font-bold text-white pt-1">
                          {lor.courseTitle || 'Virtual Internship Track'}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Awarded on official DevAscent Academy letterhead by Founder &amp; Systems Architect.
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-purple-400 shrink-0" />
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 font-mono text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Document ID:</span>
                        <span className="text-purple-300 font-bold">{lor.docId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Issued On:</span>
                        <span className="text-slate-300">
                          {new Date(lor.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="truncate pt-0.5">
                        <span className="text-[10px] text-slate-500 block">SHA-256 Hash:</span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {lor.sha256Hash}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <Link
                        href={`/documents/verify/${lor.docId}`}
                        className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold text-center transition-all shadow-sm"
                      >
                        Verify Academic Ledger
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 3. ACHIEVEMENTS & HACKATHONS SHOWCASE ─── */}
          {achievements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Honors &amp; Hackathon Achievements
                  </h2>
                </div>
                <span className="text-xs font-mono text-amber-400/80 bg-amber-950/40 border border-amber-800/60 px-3 py-1 rounded-full">
                  {achievements.length} Verified Milestones
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach: any, idx: number) => (
                  <div
                    key={ach.id || idx}
                    className="p-5 rounded-2xl bg-[#0D1222] border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                          {ach.issuer || 'Hackathon / Organization'}
                        </span>
                        <h3 className="text-sm font-bold text-white pt-0.5">
                          {ach.title}
                        </h3>
                      </div>
                      {ach.date && (
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {ach.date}
                        </span>
                      )}
                    </div>

                    {ach.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {ach.description}
                      </p>
                    )}

                    {ach.proofUrl && (
                      <a
                        href={ach.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono font-semibold"
                      >
                        <span>View Proof / Certificate</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 4. PROJECTS & CAPSTONES (PROOF OF WORK) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (7 cols): Projects */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Proof-of-Work Projects
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setActiveProjectTab('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeProjectTab === 'all'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({capstones.length + customProjects.length})
                  </button>
                  <button
                    onClick={() => setActiveProjectTab('capstones')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeProjectTab === 'capstones'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Capstones ({capstones.length})
                  </button>
                  {customProjects.length > 0 && (
                    <button
                      onClick={() => setActiveProjectTab('personal')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        activeProjectTab === 'personal'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Personal ({customProjects.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Capstones List */}
              {(activeProjectTab === 'all' || activeProjectTab === 'capstones') &&
                capstones.map((cap: any) => (
                  <div
                    key={cap.id}
                    className="p-6 rounded-3xl bg-[#0D1222] border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 shadow-lg group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                            {cap.course?.title || 'DevAscent Capstone'}
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Code Reviewed &amp; Approved
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white pt-1">
                          {cap.projectName || 'Production Full-Stack Capstone'}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">
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
                          <GithubIcon className="w-3.5 h-3.5 text-white" />
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
                          <LinkedinIcon className="w-3.5 h-3.5 text-[#0077B5]" />
                          <span>LinkedIn Demo</span>
                          <ExternalLink className="w-3 h-3 text-indigo-400" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

              {/* Custom Personal Projects List */}
              {(activeProjectTab === 'all' || activeProjectTab === 'personal') &&
                customProjects.map((p: any, idx: number) => (
                  <div
                    key={p.id || idx}
                    className="p-6 rounded-3xl bg-[#0D1222] border border-slate-800 hover:border-teal-500/50 transition-all space-y-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                          Independent Project
                        </span>
                        <h3 className="text-lg font-bold text-white pt-0.5">{p.title}</h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.description}
                    </p>

                    {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {p.techStack.map((t: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {p.liveDemoUrl && (
                        <a
                          href={p.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-teal-950/60 border border-teal-800/80 hover:border-teal-600 text-xs font-mono font-bold text-teal-300 flex items-center gap-1.5 transition-all"
                        >
                          <Globe className="w-3.5 h-3.5 text-teal-400" />
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3 text-teal-400" />
                        </a>
                      )}

                      {p.githubRepoUrl && (
                        <a
                          href={p.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-white" />
                          <span>Source Code</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

              {/* Graceful Empty State for 1st Year Students */}
              {capstones.length === 0 && customProjects.length === 0 && (
                <div className="p-8 rounded-3xl bg-[#0D1222] border border-slate-800 text-center space-y-3">
                  <Terminal className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-200">
                    Capstone Milestone In Progress
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    @{cleanHandle} is currently implementing semester foundational codebases and preparing their production architecture capstone for code review.
                  </p>
                </div>
              )}

              {/* Active Enrolled Tracks */}
              {activeTracks.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Enrolled Cohorts &amp; Programs</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTracks.map((trk: any) => (
                      <div
                        key={trk.id}
                        className="p-4 rounded-2xl bg-[#0D1222] border border-slate-800 space-y-1"
                      >
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                          Cohort #{trk.course?.cohortNumber || 1}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {trk.course?.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {trk.course?.durationWeeks || 8} Weeks Immersive
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (5 cols): Cryptographic Credentials Ledger */}
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

                      <div className="pt-1">
                        <Link
                          href={`/verify/${cert.certId}`}
                          className="block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center transition-all shadow-sm"
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
                  <p className="text-xs font-bold text-slate-300">
                    In Active Certification Phase
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Cryptographic credentials mint automatically upon mentor capstone review.
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
                  All projects, credentials, and achievements listed on this profile have been verified against real code commits, architecture reviews, and immutable hash registries.
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

