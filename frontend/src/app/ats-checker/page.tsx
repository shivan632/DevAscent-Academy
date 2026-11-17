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
  Cpu,
  Layers,
  ListChecks,
  Check,
  ShieldCheck,
  Zap,
  RefreshCw,
  Award,
  BookOpen,
} from 'lucide-react';

// Sample resumes for 1-click test
const SAMPLE_RESUMES = {
  prakhar: {
    name: 'Prakhar Srivastava (Python & AI/ML Intern)',
    text: `PRAKHAR SRIVASTAVA
prakharsrivastava019@gmail.com    +91-9792486222    Prayagraj, India
LinkedIn    Portfolio   Github
PROFESSIONAL SUMMARY
Highly motivated Python developer with a strong foundation in AI, Machine Learning, and Deep Learning. Currently learning React and FastAPI and eager to apply skills to build intelligent solutions.
ACADEMICS
Bachelor’s in Computer Applications (BCA), United University (2023-2026)
SUMMER TRAINING
AI/ML Intern, Labmentix [June-2025 – August-2025]
Developed end-to-end machine learning models using Python (Scikit-learn, TensorFlow), employing Git for version control.
Student Intern, Acmegrade [April-2024 – June-2024]
Developed responsive web applications using HTML5, CSS3, JavaScript.
PROJECTS
Developer Mart: beginner-friendly platform for coding & programming, in-browser execution.
CraftSathi: online platform connecting artisans with customers, responsive frontend and robust backend.
Brain-Tumour-Prediction: AI-based Brain Tumor Prediction system using Deep Learning and CNN models to classify MRI scan images. Implemented image preprocessing, model training with TensorFlow/Keras.
SKILLS
Python, FastAPI, REST APIs, Scikit-learn, TensorFlow, React, HTML, CSS, MongoDB, MySQL, Git, Github, Firebase.
CERTIFICATIONS
Certified in Artificial Intelligence and Machine Learning (Labmentix)
Certified in Web Development (Acmegrade)`
  },
  shivan: {
    name: 'Shivan Mishra (Data Scientist & AI/ML Intern)',
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
PROJECTS
FlashNotes – AI-Powered Learning Platform (GitHub, Project, Streamlit)
● Full-stack AI learning platform using React.js, FastAPI, Supabase, and Streamlit with RAG implementation via OpenRouter and Gemini APIs. Deployed across Vercel and Render.
QuickDocAI - Healthcare Platform (GitHub, Project)
● Full-stack AI medical documentation system for summarization and report generation, deployed on Vercel.
ACADEMICS
Bachelor of Computer Applications (BCA) United University | (87.1%) 2023-2026
SKILLS
Python, SQL, React.js, FastAPI, TensorFlow, Keras, Scikit-learn, Pandas, NumPy, Seaborn, MySQL, Supabase, Azure Document Intelligence, Git, OCR, ETL, NLP, TailwindCSS`
  }
};

export default function AtsCheckerPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'builder'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('aiml');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

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
      setError('Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const loadSample = (key: 'prakhar' | 'shivan') => {
    setActiveTab('paste');
    setResumeText(SAMPLE_RESUMES[key].text);
    setError('');
  };

  const atsBaseUrl = (process.env.NEXT_PUBLIC_ATS_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setError('Please drop or select a resume file (.pdf, .docx, or .txt).');
        return;
      }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('target_role', targetRole);

        const res = await fetch(`${atsBaseUrl}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.detail || 'ATS scoring engine unreachable. Ensure the service is running.');
        }

        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
        } else {
          throw new Error(json.detail || 'Could not parse resume results.');
        }
      } catch (err: any) {
        setError(err.message || 'ATS evaluation failed. Please check the file.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!resumeText.trim() || resumeText.trim().length < 30) {
        setError('Please paste at least 30 characters of resume content.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${atsBaseUrl}/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: resumeText,
            target_role: targetRole,
          }),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.detail || 'ATS service unreachable on port 8000.');
        }

        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
        } else {
          throw new Error(json.detail || 'Could not evaluate resume text.');
        }
      } catch (err: any) {
        setError(err.message || 'ATS scan failed. Please verify your connection.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Main Container with generous top padding so fixed navbar NEVER clips anything */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20">
        
        {/* ─── Hero Section ─── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          
          {/* Live System Badge with Glowing Pulse */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span>DevAscent Career Intelligence &bull; Production ATS Engine</span>
          </div>

          {/* Clean Modern Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase font-sans">
            ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">CHECKER</span>
          </h1>

          <p className="mt-3.5 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Upload your resume in <span className="text-cyan-300 font-semibold">PDF, DOCX, or text</span> format. Our self-built AI engine benchmarks your profile against real industry roles, identifies missing skills, and provides actionable correction points.
          </p>

          {/* Trust Value Props Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Free &amp; Private
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Self-Built TF-IDF Model
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Real PDF &amp; DOCX Parsing
            </span>
          </div>

          {/* Segmented Control Mode Tabs */}
          <div className="flex items-center justify-center gap-1.5 mt-8 p-1.5 rounded-2xl bg-[#0C1222] border border-slate-800/90 max-w-md mx-auto shadow-inner">
            <button
              onClick={() => { setActiveTab('upload'); setError(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => { setActiveTab('paste'); setError(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'paste'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => { setActiveTab('builder'); setError(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'builder'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Template</span>
            </button>
          </div>
        </div>

        {/* ─── TAB 1 & 2: SCANNER (UPLOAD OR PASTE) ─── */}
        {(activeTab === 'upload' || activeTab === 'paste') && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0D1322]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      ATS Candidate Diagnostic Studio
                    </h2>
                    <p className="text-xs text-slate-400">
                      Evaluates technical skills, power verbs, project links, and section structure.
                    </p>
                  </div>
                </div>

                {/* 1-Click Sample Pill */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Quick Test:</span>
                  <button
                    type="button"
                    onClick={() => loadSample('shivan')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Shivan (AI/ML)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSample('prakhar')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Prakhar (Python)
                  </button>
                </div>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-6">
                
                {/* 1. Target Job Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Target Job Role Benchmark
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#141B2D] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-medium transition-all"
                  >
                    <option value="aiml">AI &amp; Machine Learning Engineer (TensorFlow, PyTorch, CNN, RAG, NLP)</option>
                    <option value="data_science">Data Scientist &amp; Analytics Engineer (SQL, Pandas, NumPy, ETL, MySQL)</option>
                    <option value="python">Python &amp; Backend Systems Engineer (FastAPI, REST APIs, SQL, Git)</option>
                    <option value="fullstack">Full-Stack AI &amp; Cloud Engineer (React, Next.js, FastAPI, Supabase, Tailwind)</option>
                    <option value="frontend">Frontend React &amp; Next.js Engineer (TypeScript, Tailwind CSS, UI/UX)</option>
                    <option value="backend">Backend Cloud &amp; Microservices Engineer (PostgreSQL, Docker, REST APIs)</option>
                  </select>
                </div>

                {/* 2. Upload Document Dropzone */}
                {activeTab === 'upload' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Upload Resume Document (.PDF, .DOCX, or .TXT)
                    </label>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
                        dragOver
                          ? 'border-cyan-400 bg-cyan-950/30'
                          : selectedFile
                          ? 'border-emerald-500/60 bg-emerald-950/15'
                          : 'border-slate-700/80 hover:border-cyan-500/60 bg-[#121829]/70 hover:bg-[#121829]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {selectedFile ? (
                        <div className="flex flex-col items-center justify-center space-y-2.5">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <FileCode className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-base block">{selectedFile.name}</span>
                            <span className="text-xs text-emerald-400 font-medium">
                              {(selectedFile.size / 1024).toFixed(1)} KB &bull; File Loaded &bull; Click to replace
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center mb-1">
                            <UploadCloud className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-bold text-white">
                              Drop your resume here, or <span className="text-cyan-400 underline underline-offset-4">browse files</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Supports PDF, DOCX (Word), and TXT formats up to 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Paste Text Mode */}
                {activeTab === 'paste' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Paste Full Resume Text
                    </label>
                    <textarea
                      rows={9}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste resume content here including Contact info, Professional Summary, Academics, Experience, Projects, Skills, and Certifications..."
                      className="w-full px-4 py-3.5 rounded-xl bg-[#141B2D] border border-slate-700/80 text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed"
                    />
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Zero third-party tracking &bull; Instant local analysis
                  </span>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Evaluating Resume Architecture...</span>
                      </>
                    ) : (
                      <>
                        <Gauge className="w-4 h-4 text-slate-950" />
                        <span>Run ATS Diagnostic</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* ─── LIVE ATS RESULTS VIEW ─── */}
            {result && (
              <div className="rounded-3xl p-6 sm:p-8 bg-[#0D1322]/95 border border-cyan-500/40 shadow-2xl space-y-8 animate-fadeIn">
                
                {/* 1. Score & Grade Hero Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Target Role: {result.target_role?.title}
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ATS Score: <span className="text-cyan-400">{result.score}/100</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Screening Verdict:{' '}
                      <strong className="text-emerald-400 font-bold">{result.grade}</strong> &bull; {result.grade_label}
                    </p>
                    {result.metadata?.candidate_name && (
                      <p className="text-xs text-slate-400">
                        Candidate: <strong className="text-white">{result.metadata.candidate_name}</strong>
                        {result.metadata.detected_degree && ` &bull; ${result.metadata.detected_degree}`}
                        {result.metadata.detected_percentage && ` (${result.metadata.detected_percentage})`}
                      </p>
                    )}
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-cyan-500 flex flex-col items-center justify-center font-black text-3xl sm:text-4xl text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] bg-slate-950">
                      <span>{result.score}%</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">MATCH</span>
                    </div>
                  </div>
                </div>

                {/* 2. Executive Recruiter Summary */}
                {result.executive_summary && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#141B2D]/90 border border-slate-700/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Executive Recruiter Summary</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {result.executive_summary}
                    </p>
                  </div>
                )}

                {/* 3. 4-Pillar Score Breakdown */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>4-Pillar Engineering Metrics</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tech Skills */}
                    <div className="p-4 rounded-xl bg-[#141B2D]/80 border border-slate-700/60">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-300">Technical Skills Match (40%)</span>
                        <span className="font-mono text-cyan-400 font-bold">{result.category_scores?.technical_skills}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                          style={{ width: `${result.category_scores?.technical_skills}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Verbs */}
                    <div className="p-4 rounded-xl bg-[#141B2D]/80 border border-slate-700/60">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-300">Action Verbs &amp; Impact (20%)</span>
                        <span className="font-mono text-blue-400 font-bold">{result.category_scores?.action_verbs}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${result.category_scores?.action_verbs}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Evidence */}
                    <div className="p-4 rounded-xl bg-[#141B2D]/80 border border-slate-700/60">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-300">Project &amp; Production Proof (25%)</span>
                        <span className="font-mono text-teal-400 font-bold">{result.category_scores?.project_evidence}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${result.category_scores?.project_evidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Structure */}
                    <div className="p-4 rounded-xl bg-[#141B2D]/80 border border-slate-700/60">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-300">Structure &amp; Section Hierarchy (15%)</span>
                        <span className="font-mono text-emerald-400 font-bold">{result.category_scores?.structure_formatting}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${result.category_scores?.structure_formatting}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Target Role Checklist Comparison */}
                {result.comparison?.required_checklist && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-indigo-400" />
                      <span>Role Alignment Matrix ({result.comparison.matched_count}/{result.comparison.total_required} Core Requirements Met)</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {result.comparison.required_checklist.map((item: any, idx: number) => {
                        const isMatched = item.status === 'matched';
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono font-medium ${
                              isMatched
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                : 'bg-red-950/30 border-red-500/40 text-red-300'
                            }`}
                          >
                            <span>{item.skill}</span>
                            {isMatched ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Missing Points Identification */}
                {result.missing_points?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>Identified Gaps &amp; Deductions ({result.missing_points.length})</span>
                    </h4>
                    <div className="space-y-3">
                      {result.missing_points.map((mp: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                              {mp.type}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white">{mp.title}</span>
                          </div>
                          <p className="text-xs text-slate-300 pl-1">{mp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Actionable Correction Points Roadmap */}
                {result.correction_points?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Step-by-Step Action Roadmap to Reach 90%+ Score</span>
                    </h4>
                    <div className="space-y-2.5">
                      {result.correction_points.map((cp: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#141B2D]/90 border border-slate-700/80 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                              {cp.category}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                              {cp.action}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => { setResult(null); setSelectedFile(null); setResumeText(''); }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  >
                    ← Check Another Resume
                  </button>
                  <Link
                    href="https://www.devascentacademy.me/@raja2012"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md"
                  >
                    <span>View ATS-Optimized Portfolio Template</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: RESUME TEMPLATE ─── */}
        {activeTab === 'builder' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="rounded-3xl p-8 sm:p-12 bg-[#0D1322]/90 border border-cyan-500/30 shadow-2xl text-center backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                DevAscent Recruiter-Approved Resume Template
              </h2>
              <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Engineered specifically to pass enterprise ATS screeners. Features single-column hierarchy, explicit skill keywords, verified GitHub links, and live public portfolio verification.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://www.devascentacademy.me/@raja2012"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <span>View Sample Verified Portfolio</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
                >
                  <span>Upload &amp; Scan My Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
