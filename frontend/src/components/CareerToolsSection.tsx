'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Download,
  Gauge,
  X,
  FileCode,
  Check,
} from 'lucide-react';

export default function CareerToolsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('aiml');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.toLowerCase();
      if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.txt')) {
        setError('Please choose a PDF (.pdf), Word (.docx), or plain text (.txt) file.');
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setError('Please select a resume file (PDF, DOCX, or TXT).');
        return;
      }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('target_role', targetRole);

        const res = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.detail || 'ATS service unreachable. Make sure the Python service is running on port 8000.');
        }

        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
        } else {
          throw new Error(json.detail || 'Could not parse resume results.');
        }
      } catch (err: any) {
        setError(err.message || 'ATS scan failed. Please verify your connection.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!resumeText.trim() || resumeText.trim().length < 30) {
        setError('Please paste at least 30 characters of your resume text to scan.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: resumeText,
            target_role: targetRole,
          }),
        });

        if (!res.ok) {
          throw new Error('ATS scoring server unreachable. Make sure the Python service is running on port 8000.');
        }

        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
        } else {
          throw new Error(json.detail || 'Could not parse resume results.');
        }
      } catch (err: any) {
        setError(err.message || 'ATS scan failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="relative py-16 sm:py-24 bg-[#0B0F19] border-t border-slate-800/80 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span>DevAscent Career Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-sans">
            ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">CHECKER</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Free high-impact diagnostic tools to help DevAscent students pass automated enterprise filters, identify skill gaps, and land engineering interviews.
          </p>
        </div>

        {/* ─── 2-Card Layout ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: ATS Resume Checker */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#131B2E]/90 to-[#0B0F19]/90 border border-cyan-500/25 hover:border-cyan-500/60 shadow-xl hover:shadow-[0_0_35px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-105 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
                PDF &amp; DOCX Support &bull; TF-IDF Model
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Scan Your Resume with ATS Checker
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Upload your PDF or DOCX resume. Get scored against AI/ML, Data Science, Python, and Full-Stack job roles with pinpoint missing skills and step-by-step corrections.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-400 font-mono">
                <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">✓ PDF &amp; DOCX Parsing</span>
                <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">✓ Missing Skills List</span>
                <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">✓ Step-by-Step Fixes</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
              >
                <span>Upload &amp; Scan Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/ats-checker"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Full ATS Suite</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Verified Resume Template */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#131B2E]/90 to-[#0B0F19]/90 border border-indigo-500/20 hover:border-indigo-500/50 shadow-xl hover:shadow-[0_0_35px_rgba(99,102,241,0.2)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                ATS-Optimized Hierarchy
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                DevAscent Verified Resume Template
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Download the single-column engineering format proven to pass recruiter parsers. Features clear section headers and links to public verified portfolios.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-400 font-mono">
                <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">✓ 1-Page Layout</span>
                <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">✓ Verified Portfolio Link</span>
                <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">✓ Recruiter Approved</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <Link
                href="https://www.devascentacademy.me/@raja2012"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Open Resume Template</span>
              </Link>
              <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">
                Free Forever
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── ATS Scanner Modal ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => { setModalOpen(false); setResult(null); setError(''); }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">ATS Resume Diagnostic</h3>
                <p className="text-xs text-slate-400">PDF, DOCX, or text analysis with role benchmark comparison.</p>
              </div>
            </div>

            {/* Scan Form */}
            {!result ? (
              <form onSubmit={handleScan} className="space-y-4">
                {/* Target Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Role Benchmark
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="aiml">AI &amp; Machine Learning Engineer (TensorFlow / CNN / NLP / RAG)</option>
                    <option value="data_science">Data Scientist &amp; Analytics Engineer (SQL / Pandas / ETL / MySQL)</option>
                    <option value="python">Python &amp; Backend Systems Engineer (FastAPI / REST APIs / SQL)</option>
                    <option value="fullstack">Full-Stack AI &amp; Cloud Engineer (React / Next.js / FastAPI / Supabase)</option>
                    <option value="frontend">Frontend React &amp; Next.js Engineer (TypeScript / Tailwind CSS)</option>
                    <option value="backend">Backend Cloud &amp; Microservices Engineer (PostgreSQL / Docker / APIs)</option>
                  </select>
                </div>

                {/* Tab Switcher */}
                <div className="flex rounded-xl bg-[#1E293B] p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeTab === 'upload' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Upload Document (.PDF / .DOCX)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('paste')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeTab === 'paste' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>

                {activeTab === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center cursor-pointer bg-[#1E293B]/40 transition-colors"
                    >
                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <FileCode className="w-8 h-8 text-emerald-400 mb-1" />
                          <span className="text-xs font-bold text-white">{selectedFile.name}</span>
                          <span className="text-[11px] text-slate-400">Click to replace file</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="w-8 h-8 text-cyan-400 mb-1" />
                          <span className="text-xs font-bold text-slate-200">Click to select PDF or DOCX resume</span>
                          <span className="text-[11px] text-slate-400">Supports .pdf, .docx, .txt up to 10MB</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={7}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your full resume text here..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                  >
                    {loading ? 'Evaluating...' : 'Run ATS Diagnostic'}
                  </button>
                </div>
              </form>
            ) : (
              /* Results View inside Modal */
              <div className="space-y-5">
                {/* Score Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/30 p-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
                      Role: {result.target_role?.title}
                    </span>
                    <h4 className="text-2xl font-black text-white mt-0.5">
                      ATS Score: <span className="text-cyan-400">{result.score}/100</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Grade: <strong className="text-emerald-400 font-bold">{result.grade}</strong> ({result.grade_label})
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500 flex items-center justify-center font-black text-xl text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    {result.score}%
                  </div>
                </div>

                {/* Executive Summary */}
                {result.executive_summary && (
                  <p className="text-xs text-slate-300 bg-[#1E293B]/70 p-3 rounded-xl border border-slate-700/80 leading-relaxed">
                    {result.executive_summary}
                  </p>
                )}

                {/* Missing Elements */}
                {result.missing_points?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Missing Points &amp; Gaps:</span>
                    </h5>
                    <div className="space-y-2">
                      {result.missing_points.slice(0, 2).map((mp: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs">
                          <strong className="text-white block">{mp.title}</strong>
                          <span className="text-slate-300 text-[11px]">{mp.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Correction Points */}
                {result.correction_points?.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correction Points:</span>
                    </h5>
                    <ul className="space-y-1.5">
                      {result.correction_points.slice(0, 3).map((cp: any, idx: number) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-[#1E293B]/60 p-2.5 rounded-xl border border-slate-700/60">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cp.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  >
                    ← Scan Another Resume
                  </button>
                  <Link
                    href="/ats-checker"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                  >
                    Open Full Diagnostic Report
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
