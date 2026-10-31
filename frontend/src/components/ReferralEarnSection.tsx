'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  Users,
  Copy,
  Check,
  IndianRupee,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function ReferralEarnSection() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Payout Form State
  const [upiId, setUpiId] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState('');
  const [payoutError, setPayoutError] = useState('');

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const res = await api.getMyReferralSummary();
      if (res) {
        setData(res);
        if (res.payoutUpiId) setUpiId(res.payoutUpiId);
      }
    } catch (err) {
      console.error('Failed to load referral stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  const handleCopyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(data.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');
    setPayoutSuccess('');

    if (!upiId.trim() || !upiId.includes('@')) {
      setPayoutError('Please enter a valid UPI address (e.g. name@okhdfcbank)');
      return;
    }

    if ((data?.walletBalancePaise || 0) < 10000) {
      setPayoutError('Minimum payout withdrawal is ₹100.');
      return;
    }

    try {
      setIsRequesting(true);
      await api.requestReferralPayout(upiId.trim());
      setPayoutSuccess('Payout request submitted! Admin will transfer funds to your UPI ID.');
      await loadReferralData();
    } catch (err: any) {
      setPayoutError(err?.message || 'Failed to request payout.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
        Loading referral rewards and wallet...
      </div>
    );
  }

  const walletRupees = (data?.walletBalancePaise || 0) / 100;
  const totalEarnedRupees = (data?.totalEarnedPaise || 0) / 100;

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Ambassador &amp; Peer Rewards</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Refer &amp; Earn ₹100 Cash per Friend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Give ₹100 off on any track to your college batchmates and get ₹100 direct UPI cash in your student wallet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>₹{walletRupees} Available</span>
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">Withdrawable Balance</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-0.5">
            <IndianRupee className="w-5 h-5 text-emerald-500" />
            <span>{walletRupees}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Referrals</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-1">
            <Users className="w-5 h-5 text-indigo-500" />
            <span>{data?.totalReferrals || 0}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">Lifetime Earnings</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-0.5">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>₹{totalEarnedRupees}</span>
          </div>
        </div>
      </div>

      {/* Main Action Block: Referral Code & Link + UPI Withdrawal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Custom Referral Link Box */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-[#0F1426] via-[#0C101F] to-[#0A0D18] text-white border border-indigo-500/30 shadow-xl space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                Your Unique Invite Code
              </span>
              <h4 className="text-2xl font-black font-mono tracking-tight text-white mt-1">
                {data?.referralCode}
              </h4>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 block">Sharable Referral Link:</label>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <input
                type="text"
                readOnly
                value={data?.referralLink || ''}
                className="bg-transparent border-0 text-xs font-mono text-indigo-300 flex-1 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>How It Works:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              When a peer uses your link or enters <strong>{data?.referralCode}</strong> at checkout, they save ₹100 immediately. Once their enrollment completes, ₹100 is automatically credited to your student wallet.
            </p>
          </div>
        </div>

        {/* Right 5 cols: Request UPI Payout */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-500" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Instant UPI Withdrawal
            </h4>
          </div>

          <form onSubmit={handleRequestPayout} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Your UPI ID (VPA):
              </label>
              <input
                type="text"
                placeholder="e.g. yourname@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            {payoutError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{payoutError}</span>
              </div>
            )}

            {payoutSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{payoutSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isRequesting || walletRupees < 100}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isRequesting ? 'Submitting...' : `Withdraw ₹${walletRupees} via UPI`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Min. ₹100 withdrawal. Approved within 24 business hours directly to UPI.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

