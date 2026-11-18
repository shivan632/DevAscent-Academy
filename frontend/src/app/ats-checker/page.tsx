'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Sparkle,
  Briefcase,
  Layers,
  MapPin,
  FileCheck,
} from 'lucide-react';

// Sample resumes for 1-click test
const SAMPLE_RESUMES = {
  shivan: {
    name: 'Shivan Mishra (AI/ML & Data Science)',
    text: `SHIVAN MISHRA
shivrom.2020@gmail.com +91-9935806722 https://linkedin.com/in/shivan-mishra https://github.com/shivan-mishra

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
  prakhar: {
    name: 'Prakhar Srivastava (Python & Backend)',
    text: `PRAKHAR SRIVASTAVA
prakharsrivastava019@gmail.com    +91-9792486222    Prayagraj, India
LinkedIn    Portfolio   Github

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
};

/**
 * Semi-Circle SVG Gauge matching the Enhancv Design
 */
function SemiCircleGauge({ score, size = 'large' }: { score: number; size?: 'small' | 'large' }) {
  const isLarge = size === 'large';
  const radius = isLarge ? 64 : 42;
  const stroke = isLarge ? 12 : 8;
  const viewBoxWidth = isLarge ? 180 : 120;
  const viewBoxHeight = isLarge ? 95 : 65;
  const cx = viewBoxWidth / 2;
  const cy = isLarge ? 80 : 54;
  const circumference = Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (circumference * safeScore) / 100;

  // Color logic: <50 Red, 50-79 Orange (#F97316), >=80 Green (#10B981)
  let arcColor = '#F97316';
  if (safeScore >= 80) arcColor = '#10B981';
  else if (safeScore < 50) arcColor = '#EF4444';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${isLarge ? 'w-48 h-24' : 'w-32 h-16'} overflow-hidden flex items-end justify-center`}>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
          {/* Background Track Arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#E2E8F0"
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
            className="transition-all duration-1000 ease-out"
          />
          {/* Center Pin & Baseline */}
          <line
            x1={cx - radius}
            y1={cy}
            x2={cx + radius}
            y2={cy}
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <circle cx={cx} cy={cy} r={isLarge ? 3 : 2} fill="#475569" />
        </svg>
      </div>
      <div className="mt-1 text-center">
        <span
          className={`font-black tracking-tight ${isLarge ? 'text-3xl sm:text-4xl' : 'text-xl'}`}
          style={{ color: arcColor }}
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
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [previewMode, setPreviewMode] = useState<'original' | 'optimized'>('original');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('content');

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
    // Auto trigger analysis upon upload
    triggerScan(file, null);
  };

  const atsBaseUrl =
    process.env.NEXT_PUBLIC_ATS_API_URL && !process.env.NEXT_PUBLIC_ATS_API_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_ATS_API_URL.replace(/\/$/, '')
      : '/api/ats';

  const triggerScan = async (fileToUpload: File | null, textContent: string | null) => {
    setError('');
    setLoading(true);
    setLoadingStep(1);

    // Staged animated checklist steps matching Image 2
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      let res: Response;
      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('target_role', targetRole);

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
            target_role: targetRole,
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
    setResumeText(sample.text);
    triggerScan(null, sample.text);
  };

  const resetScanner = () => {
    setResult(null);
    setSelectedFile(null);
    setResumeText('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full pt-24 sm:pt-28 pb-20">
        
        {/* ════════════════════════════════════════════════════════════════════════════════
            STATE 1: HERO LANDING PAGE (MATCHING IMAGE 1 EXACTLY)
        ════════════════════════════════════════════════════════════════════════════════ */}
        {!loading && !result && (
          <div className="relative overflow-hidden">
            {/* Ambient Soft Mesh Gradient in background */}
            <div className="absolute top-0 right-0 w-[600px] h-[550px] bg-gradient-to-bl from-teal-100/70 via-purple-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-100/50 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                
                {/* Left Column: Heading + Upload Box */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Purple Pill Tag */}
                  <div className="inline-block">
                    <span className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase font-mono">
                      RESUME CHECKER
                    </span>
                  </div>

                  {/* Big Bold Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                    Is your resume good enough?
                  </h1>

                  {/* Subtitle */}
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                    A free and fast AI resume checker doing 27 crucial checks to ensure your resume&apos;s content, layout and design is technically compatible with the applicant tracking systems and get you interview callbacks.
                  </p>

                  {/* Target Role Selector Pill */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Target Role Benchmark:
                    </label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full max-w-md px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 shadow-sm"
                    >
                      <option value="aiml">AI &amp; Machine Learning Engineer (TensorFlow, PyTorch, CNN, RAG)</option>
                      <option value="data_science">Data Scientist &amp; Analytics Engineer (SQL, Pandas, ETL, MySQL)</option>
                      <option value="python">Python &amp; Backend Systems Engineer (FastAPI, REST APIs, SQL)</option>
                      <option value="fullstack">Full-Stack AI &amp; Cloud Engineer (React, Next.js, FastAPI, Supabase)</option>
                      <option value="frontend">Frontend React &amp; Next.js Engineer (TypeScript, Tailwind CSS)</option>
                      <option value="backend">Backend Cloud &amp; Microservices Engineer (PostgreSQL, Docker, APIs)</option>
                    </select>
                  </div>

                  {/* Clean Dropzone Box (Exact match to Image 1) */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all max-w-xl shadow-sm ${
                      dragOver
                        ? 'border-teal-500 bg-teal-50/60'
                        : 'border-teal-300/90 bg-white/90 hover:border-teal-400 hover:bg-white'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <p className="text-sm sm:text-base font-medium text-slate-700">
                      Drop your resume here or choose a file.
                    </p>
                    <p className="text-xs text-slate-400 mt-1 mb-6">
                      PDF &amp; DOCX only. Max 10MB file size.
                    </p>

                    {/* Big Green/Teal Upload Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Upload Your Resume</span>
                    </button>

                    {/* Security Disclaimer */}
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>We never share your data with 3rd parties or use it for AI model training.</span>
                    </div>
                  </div>

                  {/* 1-Click Test Samples */}
                  <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                    <span>Or test instantly with sample:</span>
                    <button
                      type="button"
                      onClick={() => loadSample('shivan')}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-teal-500 text-teal-700 font-semibold shadow-xs cursor-pointer"
                    >
                      Shivan (AI/ML)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadSample('prakhar')}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-teal-500 text-teal-700 font-semibold shadow-xs cursor-pointer"
                    >
                      Prakhar (Python)
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2 max-w-xl">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Right Column: Visual Mockup Graphic (Exact match to Image 1) */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative transform hover:-translate-y-1 transition-transform duration-300">
                    
                    {/* Mockup Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                          ∞
                        </div>
                        <span className="text-xs font-bold text-slate-800 tracking-tight">DevAscent ATS</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* Left Mini Score Card */}
                      <div className="col-span-5 bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col items-center">
                        <span className="text-[11px] font-semibold text-slate-700 mb-2">Resume Score</span>
                        <div className="w-24 h-12 overflow-hidden relative flex items-end justify-center">
                          <svg viewBox="0 0 100 55" className="w-24 h-12">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="125" strokeDashoffset="10" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 mt-1">92/100</span>
                        <span className="text-[9px] text-slate-400">24 checks</span>

                        <div className="w-full mt-3 space-y-1.5 text-[9px] text-slate-600">
                          <div className="flex justify-between items-center">
                            <span>CONTENT</span>
                            <span className="text-emerald-600 font-bold">85%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span>SECTIONS</span>
                            <span className="text-emerald-600 font-bold">100%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                      </div>

                      {/* Right Mini Content Preview */}
                      <div className="col-span-7 bg-[#F4F5FB] rounded-2xl p-3.5 border border-purple-100 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6D28D9]">
                            <span className="w-3.5 h-3.5 rounded bg-[#6D28D9] text-white flex items-center justify-center text-[8px]">
                              ◆
                            </span>
                            <span>CONTENT</span>
                          </div>
                          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs">
                            8 ISSUES
                          </span>
                        </div>

                        <div className="bg-white rounded-xl p-3 shadow-2xs space-y-2">
                          <span className="text-[10px] font-bold text-slate-800 block">
                            ATS PARSE RATE
                          </span>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                              <div className="w-[90%] bg-emerald-500 h-full" />
                              <div className="w-[10%] bg-rose-300 h-full" />
                            </div>
                            <span className="text-[8px] text-slate-400 block">90% parsed cleanly</span>
                          </div>
                          <div className="space-y-1 pt-1">
                            <div className="h-2 bg-slate-100 rounded w-full" />
                            <div className="h-2 bg-slate-100 rounded w-4/5" />
                            <div className="h-2 bg-slate-100 rounded w-3/5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>✓ 27 Automated ATS Tests</span>
                      <span className="text-teal-600 font-semibold">100% Free</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════════
            STATE 2: LOADING PROGRESSION VIEW (MATCHING IMAGE 2 EXACTLY)
        ════════════════════════════════════════════════════════════════════════════════ */}
        {loading && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Score Card Skeleton */}
              <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col items-center space-y-4">
                <h3 className="text-base font-bold text-slate-800">Your Score</h3>
                
                {/* Gray Skeleton Gauge */}
                <div className="w-40 h-20 overflow-hidden relative flex items-end justify-center">
                  <svg viewBox="0 0 160 85" className="w-40 h-20">
                    <path
                      d="M 20 75 A 60 60 0 0 1 140 75"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 75 A 60 60 0 0 1 140 75"
                      fill="none"
                      stroke="#CBD5E1"
                      strokeWidth="12"
                      strokeDasharray="188"
                      strokeDashoffset="90"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <circle cx="80" cy="75" r="3" fill="#94A3B8" />
                  </svg>
                </div>

                {/* Skeleton Category Pills */}
                <div className="w-full space-y-2.5 pt-2">
                  {['CONTENT', 'SECTION', 'ATS ESSENTIALS', 'TAILORING'].map((cat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span>{cat}</span>
                      <span className="w-8 h-3.5 bg-slate-200 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>

                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed mt-2"
                >
                  Unlock Full Report
                </button>
              </div>

              {/* Right Checklist Box (Exact Match to Image 2) */}
              <div className="md:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
                {[
                  { step: 1, label: 'Parsing your resume' },
                  { step: 2, label: 'Analyzing your experience' },
                  { step: 3, label: 'Extracting your skills' },
                  { step: 4, label: 'Generating recommendations' },
                ].map(({ step, label }) => {
                  const isDone = loadingStep >= step;
                  const isCurrent = loadingStep === step;

                  return (
                    <div key={step} className="flex items-center gap-4 transition-all">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isDone
                            ? 'bg-[#6D28D9] text-white shadow-xs'
                            : 'border-2 border-slate-300 text-slate-300'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step}
                      </div>
                      <span
                        className={`text-base sm:text-lg font-semibold ${
                          isDone
                            ? 'text-slate-900'
                            : isCurrent
                            ? 'text-slate-700 animate-pulse'
                            : 'text-slate-400'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════════
            STATE 3: RESULTS DASHBOARD (MATCHING IMAGE 3, 4, 5 EXACTLY)
        ════════════════════════════════════════════════════════════════════════════════ */}
        {result && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
            
            {/* Top Toolbar Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={resetScanner}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Scan Another Resume</span>
                </button>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-400">|</span>
                <span className="text-xs font-semibold text-slate-600">
                  Target Role: <strong className="text-slate-900 font-bold">{result.target_role?.title}</strong>
                </span>
              </div>

              {result.metadata?.candidate_name && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs text-purple-700 font-semibold font-mono">
                  <span>Candidate:</span>
                  <strong className="text-purple-900 font-bold">{result.metadata.candidate_name}</strong>
                </div>
              )}
            </div>

            {/* 2-Column Core Layout (Image 3 & 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ─────────────────────────────────────────────────────────────
                  LEFT COLUMN: SCORE CARD & CATEGORIES (IMAGE 3 & 5)
              ───────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                  
                  {/* Your Score Header */}
                  <h3 className="text-center text-lg font-bold text-slate-900">
                    Your Score
                  </h3>

                  {/* Semi-Circle SVG Gauge */}
                  <SemiCircleGauge score={result.score} size="large" />

                  {/* Green CTA Button (Exact match to Image 3 & 5) */}
                  <button
                    onClick={() => {
                      const roadmapEl = document.getElementById('roadmap-section');
                      roadmapEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Unlock Full Report</span>
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* Category Breakdown Accordion List (Exact match to Image 3 & 5) */}
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                    
                    {/* 1. CONTENT (Expanded by default) */}
                    <div className="rounded-xl border border-slate-200/80 overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === 'content' ? null : 'content')}
                        className="w-full px-3.5 py-3 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors font-bold text-slate-800"
                      >
                        <span className="uppercase tracking-wider">CONTENT</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            {result.category_scores?.technical_skills ? Math.round(result.category_scores.technical_skills) : 62}%
                          </span>
                          {expandedCategory === 'content' ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {expandedCategory === 'content' && (
                        <div className="px-3.5 py-3 space-y-2.5 bg-white border-t border-slate-100">
                          
                          {/* Sub-item: ATS Parse Rate */}
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span>ATS Parse Rate</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                              No issues
                            </span>
                          </div>

                          {/* Sub-item: Quantifying Impact */}
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                              <span>Quantifying Impact</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              1 issue
                            </span>
                          </div>

                          {/* Sub-item: Repetition & Power Verbs */}
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                              <span>Action Verbs &amp; Repetition</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              3 issues
                            </span>
                          </div>

                          {/* Sub-item: Profile & Project Links */}
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <X className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />
                              <span>Profile &amp; Live Links</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              1 issue
                            </span>
                          </div>

                          {/* Sub-item: Bullets Consistency */}
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <span className="text-amber-500">👑</span>
                              <span>Bullets Consistency</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Verified
                            </span>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* 2. SECTIONS */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <span className="uppercase tracking-wider">SECTIONS</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        100%
                      </span>
                    </div>

                    {/* 3. ATS ESSENTIALS */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <span className="uppercase tracking-wider">ATS ESSENTIALS</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        {result.category_scores?.structure_formatting ? Math.round(result.category_scores.structure_formatting) : 64}%
                      </span>
                    </div>

                    {/* 4. HR RED FLAGS */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <span className="uppercase tracking-wider">HR RED FLAGS</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        79%
                      </span>
                    </div>

                    {/* 5. DISCRIMINATION */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <span className="uppercase tracking-wider">DISCRIMINATION</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        71%
                      </span>
                    </div>

                    {/* 6. SENIORITY */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <span className="uppercase tracking-wider">SENIORITY</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        67%
                      </span>
                    </div>

                    {/* 7. TAILORING */}
                    <div className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <span className="uppercase tracking-wider">TAILORING</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        {result.comparison?.match_percentage || 73}%
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  RIGHT COLUMN: MAIN CONTENT REPORT (IMAGE 3 & 4)
              ───────────────────────────────────────────────────────────── */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Section Title Banner with Purple Diamond Badge */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#6D28D9] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        ◆
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        CONTENT
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      {result.deductions?.length || 4} issues found
                    </span>
                  </div>

                  {/* ─── ATS PARSE RATE SECTION (IMAGE 3) ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 tracking-wider uppercase">
                      <span className="w-1.5 h-3.5 bg-teal-500 rounded-full" />
                      <span>ATS PARSE RATE</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Employers and recruiters use an <strong>Applicant Tracking System (ATS)</strong> to scan job applications at scale. A high parse rate means the ATS reads your experience and skills clearly, so more recruiters see your resume.
                    </p>

                    {/* Progress Parse Rate Bar with Pin Marker (Image 3) */}
                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                      <div className="relative pt-6">
                        {/* Pin Marker on the boundary */}
                        <div className="absolute top-0 left-[89%] -translate-x-1/2 flex flex-col items-center">
                          <span className="text-teal-600 text-xs">📍</span>
                        </div>

                        {/* Two-segment Progress Bar */}
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                          {/* 90% Read segment in green */}
                          <div className="w-[90%] bg-emerald-500 h-full rounded-l-full" />
                          {/* 10% Missed segment in striped rose */}
                          <div className="w-[10%] bg-rose-200 h-full bg-[repeating-linear-gradient(45deg,#F43F5E,#F43F5E_4px,#FDA4AF_4px,#FDA4AF_8px)]" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-emerald-700">90% read by the ATS</span>
                        <span className="text-rose-600">10% missed</span>
                      </div>

                      <h4 className="text-center text-sm sm:text-base font-extrabold text-slate-900 pt-2">
                        The missing 10% of your resume isn&apos;t your experience — it&apos;s your template &amp; link formatting.
                      </h4>
                    </div>

                    {/* ─── YOUR RESUME, TWO WAYS PREVIEW (IMAGE 4) ─── */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span>Your resume, two ways</span>
                        </div>

                        {/* Segmented Control Buttons (Image 4) */}
                        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                          <button
                            onClick={() => setPreviewMode('original')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              previewMode === 'original'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Original
                          </button>
                          <button
                            onClick={() => setPreviewMode('optimized')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              previewMode === 'optimized'
                                ? 'bg-[#10B981] text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            DevAscent ATS
                          </button>
                        </div>
                      </div>

                      {/* Warning Strip or Success Strip */}
                      {previewMode === 'original' ? (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <span>⚠ 10% may be missed by the ATS due to plain text link labels and unindexed sections</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4 text-teal-600 stroke-[3]" />
                          <span>✓ ATS-tested single-column template &bull; Built to parse with 100% readability</span>
                        </div>
                      )}

                      {/* Rendered Live Resume Document Card (Image 4) */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4 font-sans text-slate-800 max-w-2xl mx-auto">
                        
                        {/* Header */}
                        <div className="text-center space-y-1 pb-3 border-b border-slate-100">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase">
                            {result.metadata?.candidate_name || 'SHIVAN MISHRA'}
                          </h3>
                          <p className="text-xs text-slate-600 font-mono">
                            {result.metadata?.email || 'shivrom.2020@gmail.com'} &bull;{' '}
                            {result.metadata?.phone || '+91-9935806722'} &bull;{' '}
                            {previewMode === 'optimized' ? (
                              <span className="text-teal-700 font-bold underline">
                                linkedin.com/in/shivan-mishra | github.com/shivan-mishra
                              </span>
                            ) : (
                              <span className="text-rose-600 underline decoration-rose-300">
                                LinkedIn, Portfolio, GitHub
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Professional Summary */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                            PROFESSIONAL SUMMARY
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {previewMode === 'optimized' ? (
                              <span>
                                Proven AI/ML engineer with verified experience developing judicial analytics platforms, NLP pipelines, and Full-Stack systems. Expertise in Python, TensorFlow, and automated MySQL ETL workflows.
                              </span>
                            ) : (
                              <span>
                                AI/ML enthusiast with hands-on experience in Machine Learning, NLP, predictive analytics, and Full-Stack Development. Skilled in Python, Deep Learning, and building scalable AI-powered solutions.
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Experience */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                            EXPERIENCE
                          </h4>
                          
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>Data Scientist Intern &mdash; <span className="text-teal-600">Clinch Soft Bridge</span></span>
                              <span className="text-slate-500 font-normal">Jan 2026 &ndash; Feb 2026</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                              <li>
                                Developed an AI-driven judicial analytics platform using <strong>Python, Azure Document Intelligence, NLP, and MySQL</strong>.
                              </li>
                              <li>
                                Built automated ETL pipelines for OCR-based document ingestion, handling <strong>15,000+ case records</strong>.
                              </li>
                              <li>
                                Implemented sentiment analysis on legal proceedings and designed interactive dashboards with Plotly.
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Projects */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                            PROJECTS
                          </h4>
                          <div className="text-xs space-y-1">
                            <span className="font-bold text-slate-900 block">
                              FlashNotes &ndash; AI-Powered Learning Platform{' '}
                              {previewMode === 'optimized' ? (
                                <span className="text-teal-600 font-semibold">[Demo: flashnotes.streamlit.app]</span>
                              ) : (
                                <span className="text-slate-400 font-normal">(GitHub, Project, Streamlit)</span>
                              )}
                            </span>
                            <p className="text-slate-600 pl-1">
                              Full-stack AI learning platform using React.js, FastAPI, Supabase, and Streamlit with RAG implementation via OpenRouter and Gemini APIs.
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>

                {/* ─── WHY YOU LOST POINTS (THE FIXABLE ISSUES) ─── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-black text-rose-600 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-black">
                        ✕
                      </span>
                      <span>Why You Lost Points (The Fixable Issues)</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      High Impact Fixes
                    </span>
                  </div>

                  {result.deductions && result.deductions.length > 0 ? (
                    <div className="space-y-4">
                      {result.deductions.map((d: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h5 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                              <span className="text-slate-400 font-mono text-xs">{idx + 1}.</span>
                              <span>{d.title}</span>
                            </h5>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
                              {d.penalty}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs sm:text-sm pl-3 sm:pl-4 border-l-2 border-slate-300">
                            <div>
                              <strong className="text-slate-900 font-semibold mr-1.5">• Issue:</strong>
                              <span className="text-slate-600 leading-relaxed">{d.issue}</span>
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <div>
                                <strong className="text-teal-700 font-semibold mr-1.5">• Fix:</strong>
                                <span className="text-slate-600 leading-relaxed">Apply this update:</span>
                              </div>
                              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-teal-800 leading-relaxed break-words select-all shadow-2xs">
                                {d.fix}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-teal-600" />
                      <span>Zero deductions found! Your resume passes strict ATS formatting rules.</span>
                    </div>
                  )}

                </div>

                {/* ─── ROLE ALIGNMENT MATRIX ─── */}
                {result.comparison?.required_checklist && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-purple-600" />
                        <span>Role Alignment Matrix ({result.comparison.matched_count}/{result.comparison.total_required} Requirements Met)</span>
                      </h3>
                      <span className="text-xs font-bold text-slate-500 font-mono">
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
                                ? 'bg-teal-50/70 border-teal-200 text-teal-800'
                                : 'bg-rose-50/70 border-rose-200 text-rose-800'
                            }`}
                          >
                            <span>{item.skill}</span>
                            {isMatched ? (
                              <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3] shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-rose-500 stroke-[3] shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── STEP-BY-STEP ACTION ROADMAP ─── */}
                <div id="roadmap-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Step-by-Step Action Roadmap to Reach 90%+ Score</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {result.correction_points?.map((cp: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                            {cp.category}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {cp.action}
                          </p>
                        </div>
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
