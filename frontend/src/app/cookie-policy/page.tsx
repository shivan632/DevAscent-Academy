'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Cookie,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const COOKIE_TYPES = [
  {
    category: 'Essential / Strictly Necessary',
    badge: 'Always Active',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    desc: 'Mandatory for core platform functionality, security, and authentication. The website cannot function properly without these cookies.',
    examples: [
      { name: 'accessToken / refreshToken', purpose: 'Secure student login state and session validation via HTTP-only JWTs', duration: 'Session / 7 Days' },
      { name: 'csrf_token', purpose: 'Protects forms and API endpoints from Cross-Site Request Forgery attacks', duration: 'Session' },
      { name: 'checkout_session', purpose: 'Maintains order id and course selection during Razorpay payment checkout', duration: '1 Hour' },
    ],
  },
  {
    category: 'Functional & Preferences',
    badge: 'Recommended',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    desc: 'Enhance your learning experience by remembering your UI preferences and video player playback positions.',
    examples: [
      { name: 'devascent-theme', purpose: 'Remembers Dark Mode or Light Mode preference in ThemeProvider', duration: '1 Year' },
      { name: 'sidebar-state', purpose: 'Stores student navigation drawer collapsed or expanded state', duration: '6 Months' },
      { name: 'devascent_cookie_consent', purpose: 'Stores your cookie preference acknowledgement so the banner is not repeated', duration: '1 Year' },
    ],
  },
  {
    category: 'Analytics & Performance',
    badge: 'Anonymous',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    desc: 'Aggregated, non-identifiable telemetry used to monitor API latency, course video load speeds, and error rates.',
    examples: [
      { name: '_perf_ping', purpose: 'Measures round-trip API latency to backend services for quality assurance', duration: 'Session' },
      { name: '_err_telemetry', purpose: 'Captures anonymous client-side rendering crashes to assist engineering fixes', duration: 'Session' },
    ],
  },
  {
    category: 'Advertising & Marketing Trackers',
    badge: 'Not Used (Zero Ad-Trackers)',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    desc: 'We respect student focus and digital sovereignty. DevAscent Academy DOES NOT use third-party ad retargeting pixels, spyware, or cross-site commercial ad networks.',
    examples: [
      { name: 'Third-party ad networks', purpose: 'None. We do not sell student attention or license behavioral profiles.', duration: 'N/A' },
    ],
  },
];

const COOKIE_FAQS = [
  {
    q: 'Why does DevAscent Academy use cookies?',
    a: 'We use cookies primarily to keep you securely signed in to your learning dashboard, maintain your lesson video playback progress, and process course enrollments safely through 256-bit encrypted gateways.',
  },
  {
    q: 'Does DevAscent Academy sell or trade student cookie data?',
    a: 'No. In strict accordance with the Digital Personal Data Protection (DPDP) Act 2023, we never sell, rent, or trade student cookies or activity logs with third-party advertising companies.',
  },
  {
    q: 'How can I disable or delete cookies?',
    a: 'You can modify your browser settings (Chrome, Firefox, Safari, Edge) to block or delete cookies at any time. Please note that blocking Essential cookies will prevent you from signing in to your student dashboard or accessing enrolled courses.',
  },
  {
    q: 'What is the difference between Session and Persistent cookies?',
    a: 'Session cookies are temporary and are erased automatically as soon as you close your web browser. Persistent cookies remain in your browser storage until they expire or are manually cleared, helping remember preferences such as Dark Mode.',
  },
];

export default function CookiePolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ─── Hero Header ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Cookie className="w-4 h-4 text-indigo-400" />
              <span>Transparent Telemetry &amp; Cookie Governance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Cookie{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Effective Date: <strong className="text-slate-200">January 1, 2026</strong> • Last Updated: <strong className="text-slate-200">October 2026</strong>
              <br />
              Explaining how DevAscent Academy uses cookies, local storage, and session tokens to secure your learning portal.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 max-w-2xl mx-auto text-xs text-slate-400 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Zero third-party advertising cookies. Minimal essential cookies only.</span>
              </div>
              <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 font-bold whitespace-nowrap">
                Privacy Policy →
              </Link>
            </div>
          </div>

          {/* ─── What are Cookies ─── */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-black">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">What Are Cookies and Local Storage?</h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-0 sm:pl-11">
              <p>
                Cookies are small text files placed on your computer or mobile device when you access websites. Similar web technologies include <strong>LocalStorage</strong> and <strong>SessionStorage</strong>, which store encrypted state directly in your modern web browser.
              </p>
              <p>
                These technologies enable <strong>DevAscent Academy</strong> to verify that your account has authorization to view paid course materials, remember your dark mode preference, and safeguard payments made through Razorpay.
              </p>
            </div>
          </div>

          {/* ─── Breakdown of Cookie Categories ─── */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Categories of Cookies We Use</h2>
            </div>

            <div className="space-y-5">
              {COOKIE_TYPES.map((type, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>{type.category}</span>
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${type.badgeColor}`}>
                      {type.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {type.desc}
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2 pr-4 font-semibold">Identifier</th>
                          <th className="py-2 pr-4 font-semibold">Purpose &amp; Scope</th>
                          <th className="py-2 font-semibold">Retention</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {type.examples.map((ex, exIdx) => (
                          <tr key={exIdx} className="hover:bg-slate-950/40">
                            <td className="py-2.5 pr-4 font-mono text-indigo-300 text-[11px] whitespace-nowrap">
                              {ex.name}
                            </td>
                            <td className="py-2.5 pr-4 text-slate-400 leading-relaxed">
                              {ex.purpose}
                            </td>
                            <td className="py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                              {ex.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Managing Your Cookie Preferences ─── */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs font-black">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">How You Can Control and Delete Cookies</h2>
            </div>
            
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 pl-0 sm:pl-11">
              <p>
                Most modern browsers allow you to manage cookie settings in their security preferences:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies.</li>
                <li><strong>Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Enhanced Tracking Protection.</li>
                <li><strong>Apple Safari:</strong> Preferences → Privacy → Manage Website Data.</li>
                <li><strong>Microsoft Edge:</strong> Settings → Cookies and Site Permissions.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2 mt-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Note: Disabling Essential cookies will log you out and prevent curriculum access.</span>
              </div>
            </div>
          </div>

          {/* ─── Frequently Asked Questions ─── */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Frequently Asked Cookie Questions</span>
            </div>

            <div className="space-y-3">
              {COOKIE_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/40 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Contact Desk ─── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-xl text-xs sm:text-sm text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Questions About Our Cookie Practices?</span>
            </h3>
            <p className="leading-relaxed">
              If you have any questions regarding how we store session states or handle telemetry, reach out directly to our Data Protection Officer:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <a
                href="mailto:devascentacademy@gmail.com"
                className="text-indigo-400 hover:underline"
              >
                devascentacademy@gmail.com
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="tel:+919935806722"
                className="text-emerald-400 hover:underline"
              >
                +91 99358 06722
              </a>
              <span className="text-slate-600">•</span>
              <Link href="/contact" className="text-cyan-400 hover:underline">
                Contact Desk
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
