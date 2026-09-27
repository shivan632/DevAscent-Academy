'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  requireReason?: boolean;
  reasonPlaceholder?: string;
  minReasonLength?: number;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  requireReason = false,
  reasonPlaceholder = 'Please provide a detailed reason (minimum 10 characters)...',
  minReasonLength = 10,
  isLoading = false,
}: ConfirmModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isReasonValid = !requireReason || reason.trim().length >= minReasonLength;
  const isPending = isLoading || isSubmitting;

  const handleConfirm = async () => {
    if (!isReasonValid || isPending) return;
    setIsSubmitting(true);
    try {
      await onConfirm(requireReason ? reason.trim() : undefined);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantStyles = {
    danger: {
      icon: AlertCircle,
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      btn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 disabled:bg-rose-900/50',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 disabled:bg-amber-900/50',
    },
    primary: {
      icon: Info,
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 disabled:bg-indigo-900/50',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;
  const Icon = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#0F1420] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border ${currentVariant.iconBg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{description}</p>
          </div>
        </div>

        {requireReason && (
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-white/70 block">
              Reason for this action <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              rows={3}
              disabled={isPending}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
            <div className="flex justify-between items-center text-[10px]">
              <span className={reason.trim().length >= minReasonLength ? 'text-emerald-400' : 'text-amber-400'}>
                {reason.trim().length < minReasonLength
                  ? `Need ${minReasonLength - reason.trim().length} more characters`
                  : 'Valid reason'}
              </span>
              <span className="text-white/30">{reason.trim().length}/{minReasonLength} min</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isReasonValid || isPending}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${currentVariant.btn}`}
          >
            {isPending && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <span>{isPending ? 'Processing…' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
