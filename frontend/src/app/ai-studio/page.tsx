'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Sparkles,
  Bot,
  FileText,
  HelpCircle,
  Map,
  FileCheck,
  Mic,
  Send,
  Zap,
  CheckCircle2,
  Copy,
  BookOpen,
  ArrowRight,
  Code2,
  Terminal,
  Cpu,
  Volume2
} from 'lucide-react';

type ToolId = 'notes' | 'qa' | 'roadmap' | 'pdf' | 'voice';

export default function AiStudioPage() {
  const [activeTool, setActiveTool] = useState<ToolId>('notes');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: 'notes' as ToolId,
      name: 'AI Study Notes Generator',
      tag: 'Smart Notes',
      icon: FileText,
      desc: 'Transforms complex code snippets, lectures, or tech topics into bulleted conceptual cheat sheets with ASCII diagrams.',
      placeholder: 'Enter a topic (e.g. Prisma Relation Indexes vs Table Scans, NestJS Dependency Injection)...',
      sampleOutput: `### 🚀 Executive Engineering Summary: Prisma Indexes & Performance

1. **Sequential Scan vs B-Tree Lookup:**
   - Default query on \`userId\` on 100,000 rows executes a sequential scan (~85ms).
   - Adding \`@@index([userId, courseId])\` creates an indexed B-Tree in PostgreSQL, lowering query time to **sub-2ms**.

2. **Compound Index Rule:**
   \`\`\`prisma
   model Enrollment {
     id        String   @id @default(uuid())
     userId    String
     courseId  String
     status    EnrollmentStatus @default(ACTIVE)

     @@index([userId, courseId])
   }
   \`\`\`

3. **Key Takeaway:** Always index foreign keys and composite filter queries for student progress checks.`,
    },
    {
      id: 'qa' as ToolId,
      name: 'AI Q&A Grilling Interviewer',
      tag: 'Mock Tech Interview',
      icon: HelpCircle,
      desc: 'Simulates a Tier-1 senior architect interview. Asks probing questions, critiques your answers, and tests your edge-case reasoning.',
      placeholder: 'Ask to be grilled on Next.js 15 Server Actions, Microservices with Redis, or Razorpay Webhooks...',
      sampleOutput: `### 🎯 Senior Architect Challenge Question:
**Scenario:** In an e-learning platform, a student completes a payment via Razorpay. The webhook triggers twice simultaneously due to network retry. 

**Probing Questions for You:**
1. How does your NestJS backend guarantee that the student is not enrolled twice?
2. What database constraint or Redis lock do you employ to ensure idempotency?
3. How do you handle transaction rollback if the certificate generator service fails during the webhook payload execution?

*Tip: Formulate your answer considering ACID transaction isolation levels.*`,
    },
    {
      id: 'roadmap' as ToolId,
      name: 'AI Career Roadmap Generator',
      tag: 'Personalized Path',
      icon: Map,
      desc: 'Generates a customized week-by-week career blueprint based on your current degree (BCA, MCA, BTech) and target tech role.',
      placeholder: 'Enter your background (e.g. BCA 3rd Year student targeting Full-Stack Remote role in 3 months)...',
      sampleOutput: `### 🗺️ 90-Day Full-Stack Engineer Roadmap (BCA to High-Impact Role)

- **Weeks 1–3: Architectural TypeScript & Next.js 15 App Router**
  - Master Discriminated Unions, Generics, Server Components, and Tailwind Design Systems.
- **Weeks 4–6: Enterprise NestJS Microservices & PostgreSQL**
  - Model clean relational data with Prisma ORM, configure DTO pipes, and write compound indexes.
- **Weeks 7–9: Payment Pipelines & Cryptographic Credentials**
  - Build Razorpay HMAC webhooks and SHA-256 digital certificate registry.
- **Weeks 10–12: Containerization & Cloud Portfolio Live Ship**
  - Multi-stage Docker Compose, AWS/Render deployment, and resume GitHub showcase.`,
    },
    {
      id: 'pdf' as ToolId,
      name: 'Technical PDF Summarizer',
      tag: 'Doc Copilot',
      icon: FileCheck,
      desc: 'Summarizes dense technical whitepapers, RFC documentation, or syllabus PDFs into high-retention architectural summaries.',
      placeholder: 'Paste technical documentation text or RFC excerpt to extract architecture decisions...',
      sampleOutput: `### 📄 Technical Architecture Summary:
- **Core Abstraction:** Next.js 15 Server Actions provide RPC-like server execution directly from UI buttons.
- **Security Boundary:** httpOnly cookies eliminate token theft attack vectors via XSS.
- **Latency Optimization:** Turbopack compilation compiles frontend bundles 5x faster than legacy webpack.`,
    },
    {
      id: 'voice' as ToolId,
      name: 'Voice Code Assistant & Audio Notes',
      tag: 'Audio Studio',
      icon: Mic,
      desc: 'Converts lecture notes into natural-sounding audio summaries for listening on the go.',
      placeholder: 'Enter lesson notes to generate an interactive voice audio briefing...',
      sampleOutput: `🎙️ Audio Briefing Generated (1m 45s)
Topic: "How Razorpay HMAC-SHA256 Webhook Verification Works"
[Playing Audio Stream: 24kHz High-Fidelity Voice]

"Welcome back, engineer. In today's audio sprint, we review why plain webhook endpoints are vulnerable without cryptographic HMAC verification..."`,
    },
  ];

  const currentTool = tools.find((t) => t.id === activeTool) || tools[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(currentTool.sampleOutput);
    }, 1200);
  };

  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DevAscent AI Copilot Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                AI Study Studio & Engineering Copilot
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
                Accelerate your full-stack learning with dedicated AI tooling: generate concise architectural notes, practice senior interview grillings, and create custom career roadmaps.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="relative z-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Main Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Tools Navigation */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 block">
                AI Copilot Capabilities
              </span>
              
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool.id);
                        setGeneratedOutput(null);
                        setInputPrompt('');
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                        isActive
                          ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-100'
                          : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{tool.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{tool.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Interactive Workspace */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <currentTool.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-900">{currentTool.name}</h2>
                    <p className="text-xs text-slate-500">{currentTool.tag}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded border border-emerald-200">
                  Ready to assist
                </span>
              </div>

              {/* Prompt Input Box */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Input / Question / Topic:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder={currentTool.placeholder}
                    className="w-full p-4 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    💡 Tip: Be specific for deeper code architecture and PostgreSQL examples.
                  </span>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all ${
                      isGenerating ? 'bg-indigo-400 cursor-not-allowed' : ''
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>AI Analyzing & Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Run Copilot Engine</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Output Canvas */}
              {(generatedOutput || isGenerating) && (
                <div className="space-y-3 pt-4 border-t border-slate-100 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Copilot Synthesis:</span>
                    </span>

                    {generatedOutput && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Notes</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {isGenerating ? (
                    <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-slate-500">Synthesizing full-stack response with technical best practices...</p>
                    </div>
                  ) : (
                    <div className="bg-[#0B0F19] text-slate-200 p-6 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 whitespace-pre-wrap">
                      {generatedOutput}
                    </div>
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
