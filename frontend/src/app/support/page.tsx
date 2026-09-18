'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, MessageSquare, HelpCircle, CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>DevAscent Help & Support Desk</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              We're Here to Help You Succeed
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Have questions about the cohort, curriculum, payments, or your certificate? Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Contact Channels */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Direct Support Channels</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Email Support</span>
                      <a href="mailto:support@devascent.io" className="text-indigo-600 hover:underline">
                        support@devascent.io
                      </a>
                      <p className="text-slate-400 text-[11px]">Response within 4 business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Discord Community</span>
                      <p className="text-slate-600">Active mentor channels & peer review</p>
                      <p className="text-slate-400 text-[11px]">Live 24/7 for enrolled students</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400">Quick Links</span>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li>
                    <Link href="/refund-policy" className="hover:text-white transition-colors flex items-center justify-between">
                      <span>7-Day Money-Back Guarantee Policy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/verify/DEVASCENT-2025-VALID" className="hover:text-white transition-colors flex items-center justify-between">
                      <span>Public Certificate Verification Registry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Send us a Message</h3>
                <p className="text-xs text-slate-500">We respond to every single student message.</p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-slate-900">Message Received!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you, <span className="font-semibold">{name || 'Student'}</span>. Our support team will reply to <span className="font-semibold">{email}</span> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Shivan Mishra"
                        className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Course Inquiry">Cohort #4 Curriculum & Batch Inquiry</option>
                      <option value="Payment & Billing">Payment / Razorpay Question</option>
                      <option value="7-Day Refund">7-Day Refund Request</option>
                      <option value="Certificate Verification">Certificate Verification Support</option>
                      <option value="Technical Support">Classroom / Coding Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you today?"
                      className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Support Desk</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
