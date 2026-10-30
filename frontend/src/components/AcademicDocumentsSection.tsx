'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface AcademicDocumentsSectionProps {
  studentName?: string;
}

export default function AcademicDocumentsSection({ studentName }: AcademicDocumentsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ documents: any[]; activeEnrollments: any[] }>({
    documents: [],
    activeEnrollments: [],
  });
  const [generatingOfferLetter, setGeneratingOfferLetter] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.getMyDocuments();
      if (res && res.documents) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load academic documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreateOfferLetter = async (courseId: string) => {
    try {
      setGeneratingOfferLetter(courseId);
      await api.generateOfferLetter(courseId);
      await fetchDocs();
    } catch (err) {
      console.error('Failed to issue offer letter:', err);
    } finally {
      setGeneratingOfferLetter(null);
    }
  };

  const offerLetters = data.documents.filter((d) => d.type === 'OFFER_LETTER');
  const lors = data.documents.filter((d) => d.type === 'LOR');

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Academic &amp; Placement Credentials</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Internship Letters &amp; Recommendations (LOR)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official, digitally verifiable documents for college HOD approvals and academic semester credits.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          Loading academic credentials...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Internship Offer Letter */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Internship Offer Letter
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Immediate Proof of Appointment for College HOD
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
                Official Letterhead
              </span>
            </div>

            {offerLetters.length > 0 ? (
              <div className="space-y-3 pt-2">
                {offerLetters.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {doc.courseTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          {doc.docId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {new Date(doc.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={api.getDocumentDownloadUrl(doc.docId)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : data.activeEnrollments.length > 0 ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Ready to mint for your active enrolled track. Generate your formal appointment letter instantly:
                </p>
                {data.activeEnrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {enr.course.title}
                    </span>
                    <button
                      onClick={() => handleCreateOfferLetter(enr.course.id)}
                      disabled={generatingOfferLetter === enr.course.id}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shrink-0 transition-all shadow-sm"
                    >
                      {generatingOfferLetter === enr.course.id ? 'Minting...' : 'Generate Offer Letter'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Enroll in any track to automatically unlock your official offer letter.
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Letter of Recommendation (LOR) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Letter of Recommendation (LOR)
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Signed by Shivan Mishra (Principal Architect)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                Merit-Based
              </span>
            </div>

            {lors.length > 0 ? (
              <div className="space-y-3 pt-2">
                {lors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {doc.courseTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {doc.docId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {new Date(doc.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={api.getDocumentDownloadUrl(doc.docId)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download LOR</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Unlocked Upon Capstone Approval</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Submit your public GitHub capstone repository and pass mentor code review with a passing grade to receive your official recommendation letter.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
