'use client';

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Download,
  Eye,
  EyeOff,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
} from 'lucide-react';

interface EmbeddedDocViewerProps {
  url?: string | null;
  title?: string;
  description?: string;
  accentColor?: 'violet' | 'amber' | 'indigo' | 'emerald';
  defaultOpen?: boolean;
}

/**
 * Extracts and formats any Google Drive or document link into a clean embeddable & direct URL.
 */
export function getEmbeddableDocUrl(rawUrl?: string | null): {
  embedUrl: string;
  directUrl: string;
  isGoogleDrive: boolean;
  fileId: string | null;
} {
  if (!rawUrl || !rawUrl.trim()) {
    return { embedUrl: '', directUrl: '', isGoogleDrive: false, fileId: null };
  }

  const cleanUrl = rawUrl.trim();

  // Match Google Drive file ID (/file/d/ID/...)
  const driveFileMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      directUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
      isGoogleDrive: true,
      fileId,
    };
  }

  // Match Google Drive query ID (e.g. ?id=... or open?id=...)
  const driveIdQueryMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdQueryMatch && driveIdQueryMatch[1] && cleanUrl.includes('drive.google.com')) {
    const fileId = driveIdQueryMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      directUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
      isGoogleDrive: true,
      fileId,
    };
  }

  // Match Google Docs document
  const docsMatch = cleanUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch && docsMatch[1]) {
    const docId = docsMatch[1];
    return {
      embedUrl: `https://docs.google.com/document/d/${docId}/preview`,
      directUrl: cleanUrl,
      isGoogleDrive: true,
      fileId: docId,
    };
  }

  // Match Google Slides presentation
  const slidesMatch = cleanUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch && slidesMatch[1]) {
    const slideId = slidesMatch[1];
    return {
      embedUrl: `https://docs.google.com/presentation/d/${slideId}/preview`,
      directUrl: cleanUrl,
      isGoogleDrive: true,
      fileId: slideId,
    };
  }

  // Standard direct PDF or cloud link
  if (cleanUrl.toLowerCase().endsWith('.pdf')) {
    return {
      embedUrl: `${cleanUrl}#toolbar=1`,
      directUrl: cleanUrl,
      isGoogleDrive: false,
      fileId: null,
    };
  }

  return {
    embedUrl: cleanUrl,
    directUrl: cleanUrl,
    isGoogleDrive: cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com'),
    fileId: null,
  };
}

export default function EmbeddedDocViewer({
  url,
  title = 'Topic Exercise Material & Architecture Rubric',
  description = 'Step-by-step exercise implementation guide, architectural diagrams, and rubric.',
  accentColor = 'violet',
  defaultOpen = false,
}: EmbeddedDocViewerProps) {
  const [showEmbed, setShowEmbed] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!url || !url.trim()) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2 text-slate-400">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
          <FileText className="w-5 h-5" />
        </div>
        <p className="text-xs font-medium text-slate-300">Exercise Material Not Uploaded Yet</p>
        <p className="text-[11px] text-slate-500">The instructor has not attached an exercise PDF or drive link for this section yet.</p>
      </div>
    );
  }

  const { embedUrl, directUrl, isGoogleDrive } = getEmbeddableDocUrl(url);

  const colorStyles = {
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
      badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
      btnPrimary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20',
      btnSecondary: 'bg-slate-800 hover:bg-slate-700 text-violet-300 hover:text-white border-slate-700',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20',
      btnSecondary: 'bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border-slate-700',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20',
      btnSecondary: 'bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border-slate-700',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
      btnSecondary: 'bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border-slate-700',
    },
  }[accentColor];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-4 p-5 sm:p-6 transition-all">
      {/* Top Resource Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-xl ${colorStyles.bg} ${colorStyles.border} border flex items-center justify-center ${colorStyles.text} shrink-0 mt-0.5`}>
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorStyles.badge}`}>
                {isGoogleDrive ? 'Google Drive Resource' : 'PDF Document'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Official Curriculum Guide</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full md:w-auto">
          {/* Primary 1-Click Drive Opener (0 CSP errors, instant new tab) */}
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${colorStyles.btnPrimary}`}
          >
            <span>{isGoogleDrive ? 'Open in Google Drive' : 'Open in New Tab'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Toggle In-App Preview */}
          <button
            type="button"
            onClick={() => setShowEmbed(!showEmbed)}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${colorStyles.btnSecondary}`}
          >
            {showEmbed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showEmbed ? 'Hide Preview' : 'Preview In-App'}</span>
          </button>

          {/* Copy Link button */}
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy Direct Document Link"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Optional In-App Embedded Frame (Toggled by user) */}
      {showEmbed && (
        <div className="pt-2 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/10] sm:aspect-[4/3] w-full shadow-inner">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3 z-10">
                <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-slate-400">Loading document preview...</p>
              </div>
            )}

            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-0 relative z-20"
              onLoad={() => setIframeLoaded(true)}
              allow="autoplay; encrypted-media; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
          </div>

          {/* Drive Viewing Advice */}
          {isGoogleDrive && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-300">Viewing Tip:</strong> Google Drive files open best in a separate tab with zoom and print controls. Click <a href={directUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold hover:text-indigo-300">Open in Google Drive ↗</a> anytime.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
