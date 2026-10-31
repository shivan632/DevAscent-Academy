'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store/authStore';
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
  ExternalLink,
  MessageCircle,
  Send,
} from 'lucide-react';

export default function ReferralEarnSection() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [computedShareLink, setComputedShareLink] = useState('');

  // Payout Form State
  const [upiId, setUpiId] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState('');
  const [payoutError, setPayoutError] = useState('');

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const res = await api.getMyReferralSummary();
      const summaryData = res?.data || res;
      if (summaryData) {
        setData(summaryData);
        if (summaryData.payoutUpiId) setUpiId(summaryData.payoutUpiId);
        
        const code = summaryData.referralCode || (user as any)?.referralCode;
        if (code) {
          const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.devascentacademy.me';
          setComputedShareLink(`${origin}/courses?ref=${code}`);
        }
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

  const activeCode = data?.referralCode || (user as any)?.referralCode || '';
  const activeLink =
    computedShareLink ||
    data?.referralLink ||
    (activeCode ? `${typeof window !== 'undefined' ? window.location.origin : 'https://www.devascentacademy.me'}/courses?ref=${activeCode}` : '');

  const handleCopyLink = () => {
    if (activeLink) {
      navigator.clipboard.writeText(activeLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (activeCode) {
      navigator.clipboard.writeText(activeCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (!activeCode && !activeLink) {
      alert('Generating your referral invite link, please try in 2 seconds.');
      return;
    }
    const msg = `Hey! Use my referral code *${activeCode}* to get an instant ₹100 discount on DevAscent courses and tech cohorts:\n\n${activeLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleTelegramShare = () => {
    if (!activeCode && !activeLink) {
      alert('Generating your referral invite link, please try in 2 seconds.');
      return;
    }
    const text = `Get ₹100 instant discount on DevAscent courses using my code ${activeCode}!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(activeLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share && activeLink) {
      try {
        await navigator.share({
          title: 'DevAscent ₹100 Student Discount',
          text: `Use my invite code ${activeCode} to save ₹100 on DevAscent cohorts:`,
          url: activeLink,
        });
      } catch {}
    } else {
      handleCopyLink();
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
      setPayoutSuccess('Payout request submitted! Admin will verify and transfer funds to your UPI ID.');
      await loadReferralData();
    } catch (err: any) {
      setPayoutError(err?.message || 'Failed to request payout.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading && !data && !activeCode) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
        Loading referral rewards and wallet...
      </div>
    );
  }

  const walletRupees = (data?.walletBalancePaise || 0) / 100;
  const totalEarnedRupees = (data?.totalEarnedPaise || 0) / 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0C1022] via-[#10142D] to-[#0A0D1A] border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Ambassador &amp; Peer Rewards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Refer &amp; Earn ₹100 Cash per Friend
          </h2>
          <p className="text-xs text-white/60 max-w-xl">
            Give ₹100 off on any track to your college batchmates and get ₹100 direct UPI cash in your student wallet.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sm font-mono font-bold px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
            <IndianRupee className="w-4 h-4" />
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
          <p className="text-[10px] text-slate-400">Directly withdrawable to any UPI</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Referrals</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-1">
            <Users className="w-5 h-5 text-indigo-500" />
            <span>{data?.totalReferrals || 0}</span>
          </div>
          <p className="text-[10px] text-slate-400">Peers joined using your link</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">Lifetime Earnings</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-0.5">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>₹{totalEarnedRupees}</span>
          </div>
          <p className="text-[10px] text-slate-400">Total rewards unlocked</p>
        </div>
      </div>

      {/* Main Action Block: Referral Code & Link + UPI Withdrawal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Custom Referral Link Box */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0F1426] via-[#0C101F] to-[#0A0D18] text-white border border-indigo-500/30 shadow-xl space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                Your Unique Invite Code
              </span>
              <h4 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-1">
                {activeCode || 'GENERATING...'}
              </h4>
            </div>
            <button
              onClick={handleCopyCode}
              disabled={!activeCode}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Sharable Referral Link:</label>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80">
              <input
                type="text"
                readOnly
                value={activeLink}
                placeholder="Generating referral link..."
                className="bg-transparent border-0 text-xs font-mono text-indigo-300 flex-1 outline-none truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                disabled={!activeLink}
                className="p-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors cursor-pointer disabled:opacity-40"
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 1-Click Social Share Buttons */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[11px] text-white/50 font-semibold block">Instant Share to Batchmates:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                disabled={!activeCode && !activeLink}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleTelegramShare}
                disabled={!activeCode && !activeLink}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                disabled={!activeLink}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              >
                <Share2 className="w-4 h-4 text-indigo-300" />
                <span>Share Link</span>
              </button>
            </div>
          </div>

          {/* How It Works Explainer */}
          <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/25 text-xs text-indigo-200/90 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>How Referral Payout Works:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              When a peer registers using your link or enters code <strong className="text-white font-mono">{activeCode || 'your code'}</strong> at checkout, they save ₹100 immediately. Once their cohort enrollment completes, ₹100 is credited to your student wallet for UPI withdrawal.
            </p>
          </div>
        </div>

        {/* Right 5 cols: Request UPI Payout */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Instant UPI Withdrawal
            </h3>
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
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isRequesting ? 'Submitting...' : `Withdraw ₹${walletRupees} via UPI`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Min. ₹100 withdrawal. Admin approves and transfers funds within 24 business hours directly to UPI.
            </p>
          </form>

          {/* Referral History / Pending List */}
          {data?.history && data.history.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Recent Referral Activity
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                {data.history.slice(0, 5).map((h: any) => (
                  <div key={h.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{h.referredName}</span>
                    <span className="font-mono font-bold text-emerald-500">+₹{(h.rewardPaise || 0) / 100}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
