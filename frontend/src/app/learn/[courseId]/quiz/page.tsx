'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Code2,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function SkillQuizPage() {
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'Which method should be used in Next.js 15 App Router to securely mutate backend data and automatically revalidate cached UI without client API calls?',
      codeSnippet: `'use server';\nexport async function createTenant(formData: FormData) { ... }`,
      options: [
        'React useEffect hook with Axios',
        'Server Actions with revalidatePath()',
        'Traditional Redux Thunk dispatch',
        'window.location.reload()',
      ],
      correctIndex: 1,
      explanation: 'Server Actions in Next.js execute directly on the server, ensuring zero client bundle bloat and type-safe cache revalidation.',
    },
    {
      id: 2,
      question: 'Why should JWT access and refresh tokens be stored inside httpOnly cookies rather than localStorage?',
      options: [
        'To prevent client-side JavaScript from accessing the tokens during Cross-Site Scripting (XSS) attacks',
        'To increase cookie storage limit from 5MB to 50MB',
        'Because localStorage does not support JSON format',
        'Because PostgreSQL only accepts httpOnly cookies',
      ],
      correctIndex: 0,
      explanation: 'httpOnly cookies cannot be read by `document.cookie`, rendering stolen tokens via malicious XSS scripts impossible.',
    },
    {
      id: 3,
      question: 'How do you verify a Razorpay webhook payload signature in NestJS to prevent forged payment events?',
      codeSnippet: `const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');`,
      options: [
        'Compare expected HMAC-SHA256 digest against `x-razorpay-signature` header',
        'Decrypt using AES-256 with the public key',
        'Check if paymentId starts with "pay_"',
        'Trust all incoming POST requests from port 4000',
      ],
      correctIndex: 0,
      explanation: 'Razorpay signs each webhook event with an HMAC-SHA256 signature calculated from the raw JSON payload and your secret key.',
    },
    {
      id: 4,
      question: 'What is the advantage of using Prisma compound indexes like `@@index([userId, courseId])` in PostgreSQL?',
      options: [
        'It speeds up multi-column filter queries from sequential table scans to O(log N) B-Tree lookups',
        'It automatically sends email notifications upon update',
        'It prevents users from deleting their accounts',
        'It converts strings into integers',
      ],
      correctIndex: 0,
      explanation: 'Compound indexes optimize composite queries (`WHERE userId = $1 AND courseId = $2`) to sub-millisecond execution times.',
    },
    {
      id: 5,
      question: 'In multi-stage Docker builds, what is the primary benefit of the builder stage separation?',
      options: [
        'It leaves build tools, TypeScript compilers, and node_modules out of the final slim runtime image',
        'It makes the website load in dark mode',
        'It eliminates the need for PostgreSQL',
        'It allows running Docker without Linux',
      ],
      correctIndex: 0,
      explanation: 'Multi-stage builds dramatically reduce container footprint (e.g. from 1.2GB down to 140MB) and harden production security.',
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 4) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const score = calculateScore();
  const passed = score >= 4;
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h1 className="text-sm font-bold text-slate-900">Module Skill Assessment Quiz</h1>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Passing Threshold: <span className="text-emerald-600 font-bold">80% (4/5)</span>
        </span>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Final Milestone</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Full-Stack Architecture Verification Quiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Answer the 5 practical engineering questions below. Passing with 80% or higher generates your immutable SHA-256 certificate and publishes it to the public verification registry.
          </p>
        </div>

        {/* Score Summary if Submitted */}
        {submitted && (
          <div
            className={`rounded-2xl p-6 sm:p-8 border shadow-lg space-y-4 text-center ${
              passed
                ? 'bg-emerald-950 text-white border-emerald-500/40'
                : 'bg-amber-950 text-white border-amber-500/40'
            }`}
          >
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white/10">
              {passed ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <XCircle className="w-10 h-10 text-amber-400" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold">
                {passed ? '🎉 Distinction! You Passed the Assessment!' : 'Score: ' + score + '/5 — Almost There!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {passed
                  ? 'Your capstone projects and quiz performance qualify you for the Official Verifiable Certificate.'
                  : 'Review the explanations below and retry to achieve 80% or higher.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {passed ? (
                <Link
                  href="/verify/DEVASCENT-2025-VALID"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Claim & View Verifiable Certificate</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment Quiz</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    Question {idx + 1} of {questions.length}
                  </span>
                  {submitted && (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{q.question}</h3>

                {q.codeSnippet && (
                  <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Options */}
                <div className="space-y-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    let optStyle = 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700';

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isOptionSelected) {
                        optStyle = 'border-red-400 bg-red-50 text-red-900';
                      } else {
                        optStyle = 'border-slate-200 opacity-50 bg-slate-50 text-slate-500';
                      }
                    } else if (isOptionSelected) {
                      optStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold ring-1 ring-indigo-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-3 transition-all ${optStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        {!submitted && (
          <div className="text-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-8 py-4 rounded-xl text-white font-bold text-sm shadow-lg transition-all ${
                allAnswered
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {allAnswered ? 'Submit Assessment & Check Results' : `Answer All Questions (${Object.keys(selectedAnswers).length}/${questions.length})`}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
