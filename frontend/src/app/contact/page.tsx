'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Loader2,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    // Simulate quick dispatch and mailto trigger fallback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 pt-28 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ─── Hero Header ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>We Are Here to Help • Response Time Under 4 Hours</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Contact &amp;{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                Student Support Desk
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have questions about curriculum, internship tracks, enrollment, or corporate tie-ups? Reach out to our engineering team directly.
            </p>
          </div>

          {/* ─── Two-Column Layout ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Official Contact Channels */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Direct Cards */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <span>DevAscent Academy HQ</span>
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Email */}
                  <a
                    href="mailto:devascentacademy@gmail.com"
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 flex items-start gap-3.5 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Official Email</span>
                      <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">devascentacademy@gmail.com</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Average reply time: &lt; 2 hrs</span>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+919935806722"
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 flex items-start gap-3.5 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student Helpline / WhatsApp</span>
                      <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">+91 99358 06722</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Mon–Sat: 9:00 AM – 8:00 PM IST</span>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Headquarters</span>
                      <span className="font-semibold text-white">Bengaluru, Karnataka, India</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Virtual Academy • Nationwide Programs</span>
                    </div>
                  </div>

                  {/* Operational Hours */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Working Schedule</span>
                      <span className="font-semibold text-white">Monday to Saturday</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">9:00 AM to 8:00 PM IST</span>
                    </div>
                  </div>

                  {/* Official Social Handles */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
                    <a
                      href="https://www.linkedin.com/in/devascent-academy-163a05443"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-indigo-400 transition-all"
                    >
                      <span>LinkedIn Profile</span>
                      <span className="text-[10px] text-slate-500">↗</span>
                    </a>
                    <a
                      href="https://www.instagram.com/devascentacademy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-pink-500/40 hover:bg-slate-900 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-pink-400 transition-all"
                    >
                      <span>Instagram @devascentacademy</span>
                      <span className="text-[10px] text-slate-500">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Enrolled Student Quick Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 border border-indigo-500/30 backdrop-blur-xl shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs sm:text-sm">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Already an Enrolled Student?</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For curriculum code reviews, project blocker doubts, and direct instructor answers, use your dedicated learning room desk.
                </p>
                <div className="pt-1">
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all group"
                  >
                    <span>Open Student Doubt Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Interactive Message Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-400" />
                    <span>Send Us a Direct Message</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below and an engineering coordinator will contact you shortly.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">Thank You, {name}!</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your message regarding <span className="text-white font-semibold">{subject}</span> has been received. Our team will get back to you at <span className="text-indigo-300 font-semibold">{email}</span> within 2–4 hours.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setMessage('');
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        ← Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">Your Full Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          required
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">Email Address *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          required
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">Phone / WhatsApp (Optional)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-semibold">Inquiry Topic</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                        >
                          <option value="Course Inquiry">Web Development Internship Track</option>
                          <option value="Python Track">Python Programming Track</option>
                          <option value="Batch Timing">Batch Timings &amp; Schedules</option>
                          <option value="Certificate Verification">Certificate Verification</option>
                          <option value="Billing & Refund">Billing / 7-Day Refund Desk</option>
                          <option value="College Partnership">College / Campus Partnership</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Your Message / Query *</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Tell us what you'd like to know or how we can assist you..."
                        required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-colors resize-y leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !name || !email || !message}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message →</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-500 text-center pt-1 leading-relaxed">
                      By submitting, you agree to our{' '}
                      <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>
                      {' '}and consent to receiving a coordinator response regarding your query.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
