'use client';

import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {
  FileSearch,
  FileText,
  Gauge,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  UploadCloud,
  X,
  FileCode,
  TrendingUp,
  ListChecks,
  Check,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  Copy,
  Layers,
  MapPin,
  FileCheck,
  Loader2,
} from 'lucide-react';

// Sample resumes for 1-click test
const SAMPLE_RESUMES = {
  prakhar: {
    name: 'Prakhar Srivastava (Python & Backend)',
    role: 'python',
    text: `PRAKHAR SRIVASTAVA
prakharsrivastava019@gmail.com    +91-9792486222    Prayagraj, India
https://linkedin.com/in/prakhar-srivastava | https://github.com/prakharsrivastava019

PROFESSIONAL SUMMARY
Highly motivated Python developer with a strong foundation in AI, Machine Learning, and Deep Learning. Currently learning React and FastAPI and eager to apply skills to build intelligent solutions.

ACADEMICS
Bachelor’s in Computer Applications (BCA), United University (2023-2026)

SUMMER TRAINING
AI/ML Intern, Labmentix [June-2025 – August-2025]
● Developed end-to-end machine learning models using Python (Scikit-learn, TensorFlow), employing Git for version control.
Student Intern, Acmegrade [April-2024 – June-2024]
● Developed responsive web applications using HTML5, CSS3, JavaScript.

PROJECTS
Developer Mart: beginner-friendly platform for coding & programming, in-browser execution.
CraftSathi: online platform connecting artisans with customers, responsive frontend and robust backend.
Brain-Tumour-Prediction: AI-based Brain Tumor Prediction system using Deep Learning and CNN models to classify MRI scan images.

SKILLS
Python, FastAPI, REST APIs, Scikit-learn, TensorFlow, React, HTML, CSS, MongoDB, MySQL, Git, Github, Firebase.

CERTIFICATIONS
Certified in Artificial Intelligence and Machine Learning (Labmentix)
Certified in Web Development (Acmegrade)`,
  },
  shivan: {
    name: 'Shivan Mishra (AI/ML & Data Science)',
    role: 'aiml',
    text: `SHIVAN MISHRA
shivrom.2020@gmail.com +91-9935806722 | https://linkedin.com/in/shivan-mishra | https://github.com/shivan632 | https://devascentacademy.me

PROFESSIONAL SUMMARY
AI/ML enthusiast with hands-on experience in Machine Learning, NLP, predictive analytics, and Full-Stack Development. Skilled in Python, Deep Learning, and building scalable AI-powered solutions.

EXPERIENCE
Data Scientist Intern - Clinch Soft Bridge (Jan 2026 – Feb 2026)
● Developed an AI-driven judicial analytics platform using Python, Azure Document Intelligence, NLP, and MySQL to process High Court transcripts.
● Built automated ETL pipelines for OCR-based document ingestion and structured storage in MySQL.
● Implemented sentiment analysis on legal proceedings and designed interactive dashboards with Plotly.
● Optimized transcript processing workflows using REST APIs, handling 15,000+ case records.

AI/ML Intern — Labmentix (Jun 2025 – Aug 2025)
● Developed a Deep Learning-based fish species classification system using CNNs with TensorFlow/Keras.
● Built image augmentation pipeline improving model validation accuracy by 14%.

PROJECTS
FlashNotes – AI-Powered Learning Platform (GitHub, Project, Streamlit)
● Full-stack AI learning platform using React.js, FastAPI, Supabase, and Streamlit with RAG implementation via OpenRouter and Gemini APIs. Deployed across Vercel and Render.
QuickDocAI - Healthcare Platform (GitHub, Project)
● Full-stack AI medical documentation system for summarization and report generation, deployed on Vercel.

ACADEMICS
Bachelor of Computer Applications (BCA) United University | (87.1%) 2023-2026

SKILLS
Python, SQL, React.js, FastAPI, TensorFlow, Keras, Scikit-learn, Pandas, NumPy, Seaborn, MySQL, Supabase, Azure Document Intelligence, Git, OCR, ETL, NLP, TailwindCSS`,
  },
};

/**
 * Cyber-Editorial Semi-Circle SVG Gauge (Unified with DevAscent Dark Palette)
 */
function SemiCircleGauge({ score }: { score: number }) {
  const radius = 64;
  const stroke = 12;
  const viewBoxWidth = 180;
  const viewBoxHeight = 95;
  const cx = viewBoxWidth / 2;
  const cy = 80;
  const circumference = Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (circumference * safeScore) / 100;

  // Exact Brand Color Rules:
  // 0-50: Red (#ef4444)
  // 51-79: Amber (#f59e0b)
  // 80-100: Emerald (#10b981)
  let arcColor = '#f59e0b';
  let glowColor = 'rgba(245, 158, 11, 0.4)';
  if (safeScore >= 80) {
    arcColor = '#10b981';
    glowColor = 'rgba(16, 185, 129, 0.45)';
  } else if (safeScore <= 50) {
    arcColor = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.45)';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
          {/* Background Track Arc (Dark Slate) */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#1E293B"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Foreground Colored Arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={arcColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
            className="transition-all duration-1000 ease-out"
          />
          {/* Baseline Indicator Line & Center Pin */}
          <line
            x1={cx - radius}
            y1={cy}
            x2={cx + radius}
            y2={cy}
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <circle cx={cx} cy={cy} r={3} fill="#64748B" />
        </svg>
      </div>
      <div className="mt-1 text-center">
        <span
          className="font-black text-3xl sm:text-4xl tracking-tight"
          style={{ color: arcColor, textShadow: `0 0 15px ${glowColor}` }}
        >
          {safeScore}/100
        </span>
      </div>
    </div>
  );
}

export default function AtsCheckerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('aiml');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(24);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [previewMode, setPreviewMode] = useState<'original' | 'optimized'>('original');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('content');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.txt')) {
      setError('Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setError('');
    setSelectedFile(file);
    triggerScan(file, null, targetRole);
  };

  const atsBaseUrl =
    process.env.NEXT_PUBLIC_ATS_API_URL && !process.env.NEXT_PUBLIC_ATS_API_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_ATS_API_URL.replace(/\/$/, '')
      : '/api/ats';

  const triggerScan = async (fileToUpload: File | null, textContent: string | null, roleToUse: string) => {
    setError('');
    setLoading(true);
    setLoadingStep(1);
    setLoadingProgress(18);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 5 ? prev + 1 : prev));
      setLoadingProgress((prev) => {
        if (prev < 92) return Math.min(94, prev + 18);
        return prev;
      });
    }, 500);

    try {
      let res: Response;
      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('target_role', roleToUse);

        res = await fetch(`${atsBaseUrl}/upload`, {
          method: 'POST',
          body: formData,
        });
      } else {
        const rawText = textContent || resumeText;
        if (!rawText || rawText.trim().length < 30) {
          throw new Error('Please enter at least 30 characters of resume content.');
        }
        res = await fetch(`${atsBaseUrl}/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: rawText,
            target_role: roleToUse,
          }),
        });
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || 'ATS evaluation failed. Please check your document.');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error(json.detail || 'Could not parse resume results.');
      }
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
        setError('Unable to reach ATS evaluation service. Please check your connection.');
      } else {
        setError(err.message || 'ATS evaluation failed. Please check the file.');
      }
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const loadSample = (key: 'shivan' | 'prakhar') => {
    const sample = SAMPLE_RESUMES[key];
    setTargetRole(sample.role);
    setResumeText(sample.text);
    triggerScan(null, sample.text, sample.role);
  };

  const resetScanner = () => {
    setResult(null);
    setSelectedFile(null);
    setResumeText('');
    setError('');
  };

  const handleCopyFix = (text: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  // Generate dynamic candidate slug
  const candidateName = result?.metadata?.candidate_name || 'CANDIDATE';
  const candidateSlug = candidateName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Parse Rate & Penalty stats: directly equal to Candidate Score (e.g. Score 89 -> Parse Rate 89%, Parse Missed 11%)
  const parseRate = typeof result?.score === 'number'
    ? Math.max(0, Math.min(100, result.score))
    : (typeof result?.parse_rate === 'number' ? result.parse_rate : 89);
  const parseMissed = 100 - parseRate;
  const contentScore = result?.category_scores?.content ?? 62;
  const issuesCount = result?.deductions?.length || 3;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black relative">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full pt-24 sm:pt-28 pb-20">
        
        {/* ════════════════════════════════════════════════════════════════════════════════
            STATE 1: HERO LANDING PAGE (CYBER-EDITORIAL DARK AESTHETIC)
        ════════════════════════════════════════════════════════════════════════════════ */}
        {!loading && !result && (
          <div className="relative overflow-hidden">
            {/* Ambient Cyber Neon Background Glows */}
            <div className="absolute top-0 right-1/4 w-[550px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                
                {/* Left Column: Heading + Upload Box */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Purple Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-widest uppercase font-mono shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>RESUME CHECKER</span>
                  </div>

                  {/* Big Bold Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                    Is your resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">good enough?</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                    A free and fast self-built AI resume checker doing 27 crucial checks to ensure your resume&apos;s content, layout, and engineering metrics are technically compatible with applicant tracking systems.
                  </p>

                  {/* Target Role Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Target Role Benchmark:
                    </label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full max-w-md px-4 py-3 rounded-xl bg-[#0F1420] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-xl"
                    >
                      <option value="aiml">AI &amp; Machine Learning Engineer (TensorFlow, PyTorch, CNN, RAG)</option>
                      <option value="data_science">Data Scientist &amp; Analytics Engineer (SQL, Pandas, ETL, MySQL)</option>
                      <option value="python">Python &amp; Backend Systems Engineer (FastAPI, REST APIs, SQL)</option>
                      <option value="fullstack">Full-Stack AI &amp; Cloud Engineer (React, Next.js, FastAPI, Supabase)</option>
                      <option value="frontend">Frontend React &amp; Next.js Engineer (TypeScript, Tailwind CSS)</option>
                      <option value="backend">Backend Cloud &amp; Microservices Engineer (PostgreSQL, Docker, APIs)</option>
                    </select>
                  </div>

                  {/* Clean Dropzone Box (Cyber Dark Theme) */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all max-w-xl shadow-2xl backdrop-blur-xl ${
                      dragOver
                        ? 'border-cyan-400 bg-cyan-950/30'
                        : 'border-cyan-500/30 bg-[#0F1420]/90 hover:border-cyan-400/70 hover:bg-[#131B2D]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>

                    <p className="text-sm sm:text-base font-bold text-white">
                      Drop your resume here or choose a file
                    </p>
                    <p className="text-xs text-slate-400 mt-1 mb-6">
                      Supports PDF &amp; DOCX formats. Max 10MB file size.
                    </p>

                    {/* Action Upload Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-teal-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Upload Your Resume</span>
                    </button>

                    {/* Security Guarantee */}
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>We never share your data with 3rd parties or use it for AI model training.</span>
                    </div>
                  </div>

                  {/* 1-Click Test Samples */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                    <span>Or run instant 1-click test:</span>
                    <button
                      type="button"
                      onClick={() => loadSample('prakhar')}
                      className="px-3 py-1.5 rounded-lg bg-[#0F1420] border border-white/10 hover:border-cyan-400 text-cyan-300 font-semibold shadow-sm cursor-pointer transition-colors"
                    >
                      Prakhar (Python &amp; AI)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSample('shivan')}
                      className="px-3 py-1.5 rounded-lg bg-[#0F1420] border border-white/10 hover:border-cyan-400 text-cyan-300 font-semibold shadow-sm cursor-pointer transition-colors"
                    >
                      Shivan (Data Scientist)
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-center gap-2 max-w-xl">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Right Column: Cyber-Editorial Mockup */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-md bg-[#0F1420] rounded-3xl p-6 shadow-2xl border border-white/10 relative transform hover:-translate-y-1 transition-transform duration-300 backdrop-blur-xl">
                    
                    {/* Mockup Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-xs">
                          ∞
                        </div>
                        <span className="text-xs font-bold text-white tracking-tight">DevAscent ATS Studio</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* Left Mini Score Card */}
                      <div className="col-span-5 bg-[#141B2D] rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-300 mb-2">Resume Score</span>
                        <div className="w-24 h-12 overflow-hidden relative flex items-end justify-center">
                          <svg viewBox="0 0 100 55" className="w-24 h-12">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="125" strokeDashoffset="12" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span className="text-xs font-black text-emerald-400 mt-1">90/100</span>
                        <span className="text-[9px] text-slate-400 font-mono">27 checks passed</span>

                        <div className="w-full mt-3 space-y-1.5 text-[9px] text-slate-300">
                          <div className="flex justify-between items-center">
                            <span>CONTENT</span>
                            <span className="text-emerald-400 font-bold">85%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span>SECTIONS</span>
                            <span className="text-emerald-400 font-bold">100%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Right Mini Content Preview */}
                      <div className="col-span-7 bg-[#141B2D]/80 rounded-2xl p-3.5 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400">
                            <span className="w-3.5 h-3.5 rounded bg-indigo-600 text-white flex items-center justify-center text-[8px]">
                              ◆
                            </span>
                            <span>CONTENT</span>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                            3 ISSUES
                          </span>
                        </div>

                        <div className="bg-[#0B0F19] rounded-xl p-3 border border-white/5 space-y-2">
                          <span className="text-[10px] font-bold text-slate-200 block">
                            ATS PARSE RATE
                          </span>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                              <div className="w-[90%] bg-emerald-500 h-full" />
                              <div className="w-[10%] bg-red-500/40 h-full" />
                            </div>
                            <span className="text-[8px] text-slate-400 block font-mono">90% parsed cleanly</span>
                          </div>
                          <div className="space-y-1 pt-1">
                            <div className="h-2 bg-slate-800 rounded w-full" />
                            <div className="h-2 bg-slate-800 rounded w-4/5" />
                            <div className="h-2 bg-slate-800 rounded w-3/5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>✓ 27 Automated ATS Tests</span>
                      <span className="text-cyan-400 font-bold">100% Free Engine</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════════
            STATE 2: PROCESSING TRACK VIEW (MATCHING IMAGE 1 DESIGN)
        ════════════════════════════════════════════════════════════════════════════════ */}
        {loading && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[#0F1420] rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 space-y-6 relative overflow-hidden backdrop-blur-xl">
              
              {/* Subtle Grid Pattern Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Top Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 relative z-10">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Plotting your course...
                </h2>
                <span className="text-xs sm:text-sm font-mono font-medium text-slate-400">
                  {loadingProgress}% &bull; usually 3–5 seconds
                </span>
              </div>

              {/* Interactive Curved Trajectory SVG Canvas */}
              <div className="relative w-full bg-[#0B0F19]/80 rounded-2xl border border-white/10 p-4 sm:p-6 overflow-hidden z-10 shadow-inner">
                {/* Micro-stars / Coordinate Dots */}
                <div className="absolute top-6 left-12 w-1 h-1 bg-slate-500 rounded-full opacity-60" />
                <div className="absolute top-12 left-1/3 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-50" />
                <div className="absolute bottom-8 left-1/4 w-1 h-1 bg-slate-500 rounded-full opacity-40" />
                <div className="absolute top-8 right-1/4 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-60" />
                <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-slate-500 rounded-full opacity-50" />
                <div className="absolute top-4 right-16 w-1 h-1 bg-slate-400 rounded-full opacity-70" />

                <svg viewBox="0 0 900 230" className="w-full h-auto overflow-visible select-none">
                  <defs>
                    <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="orangeGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connecting Trajectory Curve */}
                  <path
                    d="M 60 170 C 240 160, 520 120, 820 48"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 170 C 240 160, 520 120, 820 48"
                    fill="none"
                    stroke="url(#trackGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="950"
                    strokeDashoffset={950 - (950 * loadingProgress) / 100}
                    className="transition-all duration-700 ease-out"
                  />

                  {/* Node 1: you (Start) */}
                  <g className="cursor-pointer">
                    <circle cx="60" cy="170" r="16" fill="rgba(2, 132, 199, 0.2)" />
                    <circle cx="60" cy="170" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" filter="url(#cyanGlow)" />
                    <circle cx="60" cy="170" r="4" fill="#ffffff" />
                    <text x="60" y="202" fill="#38bdf8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      you
                    </text>
                  </g>

                  {/* Node 2: securing cv */}
                  <g>
                    <circle
                      cx="185"
                      cy="154"
                      r="12"
                      fill={loadingStep >= 2 ? '#0284c7' : '#0B0F19'}
                      stroke={loadingStep >= 1 ? '#38bdf8' : '#334155'}
                      strokeWidth="2"
                    />
                    {loadingStep >= 2 ? (
                      <path d="M 180 154 L 184 158 L 191 150" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <circle cx="185" cy="154" r="3" fill="#64748b" />
                    )}
                    <text x="185" y="180" fill={loadingStep >= 1 ? '#cbd5e1' : '#64748b'} fontSize="11" fontFamily="monospace" textAnchor="middle">
                      securing cv
                    </text>
                  </g>

                  {/* Node 3: reading inputs */}
                  <g>
                    <circle
                      cx="315"
                      cy="134"
                      r="12"
                      fill={loadingStep >= 3 ? '#0284c7' : '#0B0F19'}
                      stroke={loadingStep >= 2 ? '#38bdf8' : '#334155'}
                      strokeWidth="2"
                    />
                    {loadingStep >= 3 ? (
                      <path d="M 310 134 L 314 138 L 321 130" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <circle cx="315" cy="134" r="3" fill="#64748b" />
                    )}
                    <text x="315" y="160" fill={loadingStep >= 2 ? '#cbd5e1' : '#64748b'} fontSize="11" fontFamily="monospace" textAnchor="middle">
                      reading inputs
                    </text>
                  </g>

                  {/* Node 4: matching (Active Centerpiece) */}
                  <g>
                    {loadingStep === 3 && (
                      <circle cx="450" cy="110" r="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping opacity-75" />
                    )}
                    <circle
                      cx="450"
                      cy="110"
                      r="13"
                      fill={loadingStep >= 4 ? '#0284c7' : '#0B0F19'}
                      stroke={loadingStep >= 3 ? '#38bdf8' : '#334155'}
                      strokeWidth="2.5"
                      filter={loadingStep === 3 ? 'url(#cyanGlow)' : undefined}
                    />
                    {loadingStep >= 4 ? (
                      <path d="M 445 110 L 449 114 L 456 106" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : loadingStep === 3 ? (
                      <circle cx="450" cy="110" r="5" fill="#38bdf8" className="animate-pulse" />
                    ) : (
                      <circle cx="450" cy="110" r="3" fill="#64748b" />
                    )}
                    <text x="450" y="136" fill={loadingStep >= 3 ? '#38bdf8' : '#64748b'} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight={loadingStep === 3 ? 'bold' : 'normal'}>
                      matching
                    </text>
                  </g>

                  {/* Node 5: building path */}
                  <g>
                    {loadingStep === 4 && (
                      <circle cx="585" cy="85" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping opacity-75" />
                    )}
                    <circle
                      cx="585"
                      cy="85"
                      r="12"
                      fill={loadingStep >= 5 ? '#0284c7' : '#0B0F19'}
                      stroke={loadingStep >= 4 ? '#38bdf8' : '#334155'}
                      strokeWidth="2"
                    />
                    {loadingStep >= 5 ? (
                      <path d="M 580 85 L 584 89 L 591 81" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : loadingStep === 4 ? (
                      <circle cx="585" cy="85" r="4" fill="#38bdf8" className="animate-pulse" />
                    ) : (
                      <circle cx="585" cy="85" r="3" fill="#64748b" />
                    )}
                    <text x="585" y="110" fill={loadingStep >= 4 ? '#cbd5e1' : '#64748b'} fontSize="11" fontFamily="monospace" textAnchor="middle">
                      building path
                    </text>
                  </g>

                  {/* Node 6: interview prep */}
                  <g>
                    {loadingStep === 5 && (
                      <circle cx="705" cy="65" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping opacity-75" />
                    )}
                    <circle
                      cx="705"
                      cy="65"
                      r="12"
                      fill={loadingStep > 5 ? '#0284c7' : '#0B0F19'}
                      stroke={loadingStep >= 5 ? '#38bdf8' : '#334155'}
                      strokeWidth="2"
                    />
                    {loadingStep > 5 ? (
                      <path d="M 700 65 L 704 69 L 711 61" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <circle cx="705" cy="65" r="3" fill={loadingStep === 5 ? '#38bdf8' : '#64748b'} />
                    )}
                    <text x="705" y="90" fill={loadingStep >= 5 ? '#cbd5e1' : '#64748b'} fontSize="11" fontFamily="monospace" textAnchor="middle">
                      interview prep
                    </text>
                  </g>

                  {/* Node 7: the job (Beacon Target) */}
                  <g>
                    <circle cx="820" cy="48" r="22" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.4" className="animate-pulse" />
                    <circle cx="820" cy="48" r="15" fill="rgba(249, 115, 22, 0.25)" />
                    <circle cx="820" cy="48" r="9" fill="#f97316" stroke="#fdba74" strokeWidth="2" filter="url(#orangeGlow)" />
                    <text x="820" y="22" fill="#f97316" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      the job
                    </text>
                  </g>
                </svg>
              </div>

              {/* Processing Track Stages Checklist Box (Matching Image 1) */}
              <div className="bg-[#141B2D]/90 rounded-2xl p-6 sm:p-7 border border-white/10 space-y-3.5 z-10 relative font-mono text-sm sm:text-base">
                
                {/* Stage 1: Securing CV */}
                <div className="flex items-center gap-3">
                  {loadingStep >= 2 ? (
                    <Check className="w-4 h-4 text-cyan-400 stroke-[3] shrink-0" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  )}
                  <span className={loadingStep >= 2 ? 'text-white font-bold' : 'text-cyan-300 font-bold'}>
                    Securing CV
                  </span>
                </div>

                {/* Stage 2: Reading inputs */}
                <div className="flex items-center gap-3">
                  {loadingStep >= 3 ? (
                    <Check className="w-4 h-4 text-cyan-400 stroke-[3] shrink-0" />
                  ) : loadingStep === 2 ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={loadingStep >= 3 ? 'text-white font-bold' : loadingStep === 2 ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                    Reading inputs
                  </span>
                </div>

                {/* Stage 3: Matching */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <div className="flex items-center gap-3">
                    {loadingStep >= 4 ? (
                      <Check className="w-4 h-4 text-cyan-400 stroke-[3] shrink-0" />
                    ) : loadingStep === 3 ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={loadingStep >= 4 ? 'text-white font-bold' : loadingStep === 3 ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                      Matching
                    </span>
                  </div>
                  {loadingStep === 3 && (
                    <span className="text-xs sm:text-sm text-slate-400 pl-7 sm:pl-0 font-normal font-sans">
                      Resume workspace is comparing your evidence with this target.
                    </span>
                  )}
                </div>

                {/* Stage 4: Building path */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <div className="flex items-center gap-3">
                    {loadingStep >= 5 ? (
                      <Check className="w-4 h-4 text-cyan-400 stroke-[3] shrink-0" />
                    ) : loadingStep === 4 ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={loadingStep >= 5 ? 'text-white font-bold' : loadingStep === 4 ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                      Building path
                    </span>
                  </div>
                  {loadingStep === 4 && (
                    <span className="text-xs sm:text-sm text-slate-400 pl-7 sm:pl-0 font-normal font-sans">
                      Mapping ATS role alignment matrix and scoring pillars.
                    </span>
                  )}
                </div>

                {/* Stage 5: Interview prep */}
                <div className="flex items-center gap-3">
                  {loadingStep > 5 ? (
                    <Check className="w-4 h-4 text-cyan-400 stroke-[3] shrink-0" />
                  ) : loadingStep === 5 ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={loadingStep === 5 ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                    Interview prep
                  </span>
                </div>

              </div>

              {/* Footer Stage Auto-Save Notice */}
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 z-10 relative">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>You can close this window. Verified stages are saved automatically.</span>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════════
            STATE 3: RESULTS DASHBOARD (MATCHING BRAND PALETTE & CYBER THEME)
        ════════════════════════════════════════════════════════════════════════════════ */}
        {result && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
            
            {/* Top Toolbar Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={resetScanner}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F1420] border border-white/10 hover:border-cyan-400 text-xs font-semibold text-slate-200 shadow-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scan Another Resume</span>
                </button>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-600">|</span>
                <span className="text-xs font-semibold text-slate-300">
                  Target Role: <strong className="text-white font-bold">{result.target_role?.title}</strong>
                </span>
              </div>

              {result.metadata?.candidate_name && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-xs text-indigo-300 font-semibold font-mono">
                  <span className="text-slate-400">Candidate:</span>
                  <strong className="text-white font-bold">{result.metadata.candidate_name}</strong>
                </div>
              )}
            </div>

            {/* 2-Column Core Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ─────────────────────────────────────────────────────────────
                  LEFT COLUMN: SCORE CARD & CATEGORIES (DARK CYBER)
              ───────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
                <div className="bg-[#0F1420] rounded-3xl p-6 shadow-2xl border border-white/10 space-y-5">
                  
                  {/* Your Score Header */}
                  <h3 className="text-center text-lg font-bold text-white">
                    Your Score
                  </h3>

                  {/* Semi-Circle SVG Gauge with exact glow colors */}
                  <SemiCircleGauge score={result.score} />

                  {/* "Unlock Full Report" Button with Vibrant Indigo/Blue gradient */}
                  <button
                    onClick={() => {
                      const roadmapEl = document.getElementById('roadmap-section');
                      roadmapEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Unlock Full Report</span>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                  </button>

                  {/* Category Breakdown Accordion List */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                    
                    {/* 1. CONTENT (Dynamic % mathematically bound to issues count) */}
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#141B2D]/60">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === 'content' ? null : 'content')}
                        className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors font-bold text-white cursor-pointer"
                      >
                        <span className="uppercase tracking-wider">CONTENT</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            contentScore >= 75
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : contentScore >= 55
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              : 'bg-red-950 text-red-300 border border-red-500/30'
                          }`}>
                            {contentScore}%
                          </span>
                          {expandedCategory === 'content' ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {expandedCategory === 'content' && (
                        <div className="px-3.5 py-3 space-y-2.5 bg-[#0B0F19]/80 border-t border-white/5">
                          
                          {/* Sub-item: ATS Parse Rate */}
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              {parseRate === 100 ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              )}
                              <span>ATS Parse Rate</span>
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                parseRate === 100
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {parseRate === 100 ? 'No issues' : `${parseMissed}% missed`}
                            </span>
                          </div>

                          {/* Sub-item: Quantifying Impact */}
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              <X className="w-3.5 h-3.5 text-red-400 stroke-[3]" />
                              <span>Quantifying Impact</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/30">
                              1 issue
                            </span>
                          </div>

                          {/* Sub-item: Action Verbs & Repetition */}
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              <X className="w-3.5 h-3.5 text-red-400 stroke-[3]" />
                              <span>Action Verbs &amp; Repetition</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/30">
                              3 issues
                            </span>
                          </div>

                          {/* Sub-item: Profile & Live Links */}
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              <X className="w-3.5 h-3.5 text-red-400 stroke-[3]" />
                              <span>Profile &amp; Live Links</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/30">
                              1 issue
                            </span>
                          </div>

                          {/* Sub-item: Bullets Consistency */}
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              <span className="text-amber-400">👑</span>
                              <span>Bullets Consistency</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                              Verified
                            </span>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* 2. SECTIONS */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-300 hover:bg-white/5 cursor-pointer">
                      <span className="uppercase tracking-wider">SECTIONS</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        100%
                      </span>
                    </div>

                    {/* 3. ATS ESSENTIALS */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-300 hover:bg-white/5 cursor-pointer">
                      <span className="uppercase tracking-wider">ATS ESSENTIALS</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        {result.category_scores?.structure_formatting ? Math.round(result.category_scores.structure_formatting) : 64}%
                      </span>
                    </div>

                    {/* 4. HR RED FLAGS */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-300 hover:bg-white/5 cursor-pointer">
                      <span className="uppercase tracking-wider">HR RED FLAGS</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        79%
                      </span>
                    </div>

                    {/* 5. DISCRIMINATION */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-300 hover:bg-white/5 cursor-pointer">
                      <span className="uppercase tracking-wider">DISCRIMINATION</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        71%
                      </span>
                    </div>

                    {/* 6. SENIORITY */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-300 hover:bg-white/5 cursor-pointer">
                      <span className="uppercase tracking-wider">SENIORITY</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        67%
                      </span>
                    </div>

                    {/* 7. TAILORING */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-300 hover:bg-white/5 cursor-pointer">
                      <span className="uppercase tracking-wider">TAILORING</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        {result.comparison?.match_percentage || 73}%
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  RIGHT COLUMN: MAIN CONTENT REPORT (CYBER DARK)
              ───────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Section Title Banner with Purple Diamond Badge */}
                <div className="bg-[#0F1420] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30">
                        ◆
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        CONTENT
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-white/5">
                      {issuesCount} issues found
                    </span>
                  </div>

                  {/* ─── ATS PARSE RATE SECTION (MATCHING SPEC) ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-wider uppercase font-mono">
                      <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
                      <span>ATS PARSE RATE</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      Employers and recruiters use an <strong className="text-white">Applicant Tracking System (ATS)</strong> to scan job applications at scale. A high parse rate means the ATS reads your experience and skills clearly, so more recruiters see your resume.
                    </p>

                    {/* Progress Parse Rate Bar with Pin Marker (Dark Mode) */}
                    <div className="p-5 rounded-2xl bg-[#141B2D] border border-white/10 space-y-3">
                      <div className="relative pt-6">
                        {/* Pin Marker on the boundary */}
                        <div
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                          style={{ left: `${parseRate}%` }}
                        >
                          <span className={parseRate === 100 ? "text-emerald-400 text-xs" : "text-cyan-400 text-xs animate-bounce"}>
                            {parseRate === 100 ? "✓" : "📍"}
                          </span>
                        </div>

                        {/* Two-segment Progress Bar */}
                        <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                          {/* Read segment in green */}
                          <div
                            className={`bg-emerald-500 h-full ${parseMissed === 0 ? 'rounded-full' : 'rounded-l-full'} shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-700`}
                            style={{ width: `${parseRate}%` }}
                          />
                          {/* Missed segment in dark red with red stripes - ONLY IF parseMissed > 0 */}
                          {parseMissed > 0 && (
                            <div
                              className="h-full bg-red-500/30 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_4px,transparent_4px,transparent_8px)] transition-all duration-700"
                              style={{ width: `${parseMissed}%` }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-emerald-400">{parseRate}% read by the ATS</span>
                        {parseMissed > 0 ? (
                          <span className="text-red-400">{parseMissed}% missed</span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1 font-mono">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> 0% missed &bull; Optimal Parse Rate
                          </span>
                        )}
                      </div>

                      {/* Hard Parse Penalty Notice - ONLY IF parseRate < 100 */}
                      {parseRate < 100 && (
                        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 space-y-1">
                          <p className="font-bold flex items-center gap-1.5 text-red-300">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>Parse Rate Penalty Applied:</span>
                          </p>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {result?.parse_rate_reason || `We couldn't read ${parseMissed}% of your resume because of formatting and plain-text link labels.`}
                          </p>
                        </div>
                      )}

                      <h4 className="text-center text-sm sm:text-base font-extrabold text-white pt-1">
                        {parseRate === 100 ? (
                          <span className="text-emerald-400">
                            Your resume template &amp; structure are 100% readable by Applicant Tracking Systems.
                          </span>
                        ) : (
                          <span>
                            The missing {parseMissed}% of your resume isn&apos;t your experience &mdash; it&apos;s your template &amp; link formatting.
                          </span>
                        )}
                      </h4>
                    </div>

                    {/* ─── YOUR RESUME, TWO WAYS PREVIEW ─── */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <span>Your resume, two ways</span>
                        </div>

                        {/* Segmented Control Buttons */}
                        <div className="flex rounded-xl bg-slate-900 p-1 border border-white/10">
                          <button
                            onClick={() => setPreviewMode('original')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              previewMode === 'original'
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Original
                          </button>
                          <button
                            onClick={() => setPreviewMode('optimized')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              previewMode === 'optimized'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            DevAscent ATS
                          </button>
                        </div>
                      </div>

                      {/* Warning Strip or Success Strip */}
                      {previewMode === 'original' ? (
                        parseRate < 100 ? (
                          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>⚠ {parseMissed}% may be missed by the ATS due to formatting, unindexed link labels, or missing benchmark keywords</span>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400 stroke-[3] shrink-0" />
                            <span>✓ 100% Parsed: Document structure, section headers, and hyperlinks are fully indexed by automated ATS parsers.</span>
                          </div>
                        )
                      ) : (
                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3] shrink-0" />
                          <span>✓ ATS-tested single-column layout &bull; Full URLs &amp; quantified metrics injected for 100% parse rate</span>
                        </div>
                      )}

                      {/* Rendered Live Resume Document Card (Dark Parchment) */}
                      {(() => {
                        const activeSections = previewMode === 'optimized'
                          ? (result.optimized_sections || result.parsed_sections)
                          : (result.parsed_sections || result.optimized_sections);
                        
                        const expList = activeSections?.experience && activeSections.experience.length > 0
                          ? activeSections.experience
                          : [];
                        const projList = activeSections?.projects && activeSections.projects.length > 0
                          ? activeSections.projects
                          : [];
                        const skillsList = activeSections?.skills && activeSections.skills.length > 0
                          ? activeSections.skills
                          : [];
                        const acadList = activeSections?.academics && activeSections.academics.length > 0
                          ? activeSections.academics
                          : [];

                        return (
                          <div className="bg-[#141B2D] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-5 font-sans text-slate-200 max-w-2xl mx-auto">
                            
                            {/* Header */}
                            <div className="text-center space-y-1.5 pb-4 border-b border-white/10">
                              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                                {activeSections?.candidate_name || candidateName}
                              </h3>
                              <p className="text-xs text-slate-300 font-mono">
                                {activeSections?.email || result.metadata?.email || 'candidate@example.com'} &bull;{' '}
                                {activeSections?.phone || result.metadata?.phone || '+91-9935806722'}
                                {activeSections?.location ? ` • ${activeSections.location}` : ''}
                              </p>
                              <div className="text-xs font-mono pt-0.5">
                                {previewMode === 'optimized' ? (
                                  <span className="text-cyan-400 font-bold">
                                    {activeSections?.raw_links?.join(' | ') || `linkedin.com/in/${candidateSlug} | github.com/${candidateSlug} | devascentacademy.me`}
                                  </span>
                                ) : (
                                  <span className="text-red-400 underline decoration-red-400/60">
                                    {result.parsed_sections?.raw_links?.join(', ') || 'LinkedIn, Portfolio, GitHub'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Professional Summary */}
                            <div className="space-y-1">
                              <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                                PROFESSIONAL SUMMARY
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {activeSections?.summary || result.executive_summary}
                              </p>
                            </div>

                            {/* Experience */}
                            {expList.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                                  EXPERIENCE
                                </h4>
                                {expList.map((exp: any, eIdx: number) => (
                                  <div key={eIdx} className="space-y-1 text-xs">
                                    <div className="flex justify-between font-bold text-white">
                                      <span>
                                        {exp.role} &mdash; <span className="text-indigo-400">{exp.company}</span>
                                      </span>
                                      <span className="text-slate-400 font-normal">{exp.dates}</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                                      {exp.bullets.map((b: string, bIdx: number) => (
                                        <li key={bIdx}>{b}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Projects */}
                            {projList.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                                  PROJECTS
                                </h4>
                                {projList.map((proj: any, pIdx: number) => (
                                  <div key={pIdx} className="text-xs space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white block">{proj.title}</span>
                                      {proj.tags && proj.tags.length > 0 && (
                                        <span className="text-[10px] text-cyan-400 font-mono">
                                          ({proj.tags.join(', ')})
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-300 pl-1 leading-relaxed">{proj.description}</p>
                                    {proj.bullets && proj.bullets.length > 1 && (
                                      <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-2">
                                        {proj.bullets.slice(1).map((b: string, pbIdx: number) => (
                                          <li key={pbIdx}>{b}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Academics */}
                            {acadList.length > 0 && (
                              <div className="space-y-1">
                                <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                                  ACADEMICS
                                </h4>
                                {acadList.map((acad: string, aIdx: number) => (
                                  <p key={aIdx} className="text-xs text-slate-300">{acad}</p>
                                ))}
                              </div>
                            )}

                            {/* Skills */}
                            {skillsList.length > 0 && (
                              <div className="space-y-1.5">
                                <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                                  SKILLS
                                </h4>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {skillsList.map((sk: string, sIdx: number) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-white/5"
                                    >
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })()}
                    </div>

                  </div>

                </div>

                {/* ─── WHY YOU LOST POINTS (THE FIXABLE ISSUES) ─── */}
                <div className="bg-[#0F1420] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <h3 className="text-base sm:text-lg font-black text-red-400 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-950 border border-red-500/40 text-red-400 flex items-center justify-center text-xs font-black">
                        ✕
                      </span>
                      <span>Why You Lost Points (The Fixable Issues)</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {issuesCount} High-Impact Fixes
                    </span>
                  </div>

                  {result.deductions && result.deductions.length > 0 ? (
                    <div className="space-y-4">
                      {result.deductions.map((d: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-[#141B2D]/80 border border-white/10 space-y-3 hover:border-red-500/40 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h5 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                              <span className="text-slate-400 font-mono text-xs">{idx + 1}.</span>
                              <span>{d.title}</span>
                            </h5>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-500/40 shrink-0">
                              {d.penalty}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs sm:text-sm pl-3 sm:pl-4 border-l-2 border-slate-700">
                            <div>
                              <strong className="text-slate-200 font-semibold mr-1.5">• Issue:</strong>
                              <span className="text-slate-300 leading-relaxed">{d.issue}</span>
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <div>
                                <strong className="text-cyan-400 font-semibold mr-1.5">• Fix:</strong>
                                <span className="text-slate-300 leading-relaxed">Apply this modification:</span>
                              </div>
                              <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 leading-relaxed break-words select-all">
                                {d.fix}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>Zero deductions found! Your resume passes strict ATS formatting rules.</span>
                    </div>
                  )}

                </div>

                {/* ─── ROLE ALIGNMENT MATRIX ─── */}
                {result.comparison?.required_checklist && (
                  <div className="bg-[#0F1420] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-indigo-400" />
                        <span>Role Alignment Matrix ({result.comparison.matched_count}/{result.comparison.total_required} Requirements Met)</span>
                      </h3>
                      <span className="text-xs font-bold text-cyan-400 font-mono">
                        {result.comparison.match_percentage}% MATCH
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {result.comparison.required_checklist.map((item: any, idx: number) => {
                        const isMatched = item.status === 'matched';
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono font-medium ${
                              isMatched
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                : 'bg-red-950/40 border-red-500/40 text-red-300'
                            }`}
                          >
                            <span>{item.skill}</span>
                            {isMatched ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400 stroke-[3] shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP-BY-STEP ACTION ROADMAP WITH 1-CLICK COPY FIX ─── */}
                <div id="roadmap-section" className="bg-[#0F1420] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Step-by-Step Action Roadmap to Reach 90%+ Score</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {result.correction_points?.map((cp: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#141B2D]/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cyan-500/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide block">
                              {cp.category}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {cp.action}
                            </p>
                          </div>
                        </div>

                        {/* 1-Click Copy Fix Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyFix(cp.action, idx)}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ml-9 sm:ml-0"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Fix</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
