'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import {
  IndianRupee,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Wallet,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminReferralsPage() {
  const { data: payouts, isLoading, mutate } = useSWR(
    '/referrals/admin/payouts',
    () => api.admin.getReferralPayouts(),
    { revalidateOnFocus: true }
  );

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    type: 'APPROVE' | 'REJECT';
    payout: any;
  } | null>(null);
  const [txReference, setTxReference] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const list: any[] = Array.isArray(payouts) ? payouts : payouts?.data || [];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered items
  const filteredList = list.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.user?.name?.toLowerCase().includes(q);
      const matchEmail = p.user?.email?.toLowerCase().includes(q);
      const matchUpi = p.upiId?.toLowerCase().includes(q);
      const matchTx = p.txReference?.toLowerCase().includes(q);
      const matchUsername = p.user?.username?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchUpi && !matchTx && !matchUsername) return false;
    }
    return true;
  });

  // Analytics calculation
  const totalPaidOutPaise = list
    .filter((p) => p.status === 'APPROVED')
    .reduce((acc, p) => acc + (p.amountPaise || 0), 0);

  const pendingList = list.filter((p) => p.status === 'PENDING');
  const pendingCount = pendingList.length;
  const pendingAmountPaise = pendingList.reduce((acc, p) => acc + (p.amountPaise || 0), 0);

  const handleProcess = async () => {
    if (!activeModal) return;
    setProcessing(true);
    setErrorMessage('');

    if (activeModal.type === 'APPROVE' && !txReference.trim()) {
      setErrorMessage('Please provide a UPI Transaction / UTR Reference number for student audit records.');
      setProcessing(false);
      return;
    }

    try {
      await api.admin.processReferralPayout(activeModal.payout.id, {
        action: activeModal.type,
        txReference: activeModal.type === 'APPROVE' ? txReference.trim() : undefined,
        adminNote: adminNote.trim() || undefined,
      });

      setActiveModal(null);
      setTxReference('');
      setAdminNote('');
      await mutate();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to process payout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </span>
            Student Referral Payouts
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Review and clear peer-to-peer campus ambassador UPI reward disbursements.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Pending Payouts</p>
            <p className="text-xl font-black text-white mt-0.5">
              ₹{(pendingAmountPaise / 100).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-amber-400/80 font-medium">{pendingCount} request{pendingCount === 1 ? '' : 's'} waiting</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Total Disbursed</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              ₹{(totalPaidOutPaise / 100).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-white/40">Approved & settled</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1420] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Total Requests</p>
            <p className="text-xl font-black text-white mt-0.5">{list.length}</p>
            <p className="text-[10px] text-white/40">Campus referral ecosystem</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by student, username, UPI ID, or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F1420] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex rounded-xl bg-[#0F1420] p-1 border border-white/10 self-start md:self-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s
                  ? s === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : s === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : s === 'REJECTED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
              {s === 'PENDING' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500/30 text-amber-300 rounded text-[9px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={6} cols={5} />
          </div>
        ) : filteredList.length === 0 ? (
          <EmptyState
            icon={IndianRupee}
            title="No payout requests found"
            description={
              search || statusFilter !== 'ALL'
                ? 'No requests match your current search or status filter.'
                : 'No student referral payout requests have been submitted yet.'
            }
            action={
              search || statusFilter !== 'ALL'
                ? {
                    label: 'Reset Filters',
                    onClick: () => {
                      setSearch('');
                      setStatusFilter('ALL');
                    },
                  }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] font-extrabold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Requested Amount</th>
                  <th className="px-4 py-3.5">UPI ID (Recipient)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Requested On</th>
                  <th className="px-4 py-3.5">Audit / Reference</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                {filteredList.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{p.user?.name || 'Student'}</p>
                          {p.user?.username && (
                            <Link
                              href={`/@${p.user.username}`}
                              target="_blank"
                              className="px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-300 font-mono hover:bg-violet-500/20 transition-colors"
                            >
                              @{p.user.username}
                            </Link>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40">{p.user?.email}</p>
                        {p.user?.phone && (
                          <p className="text-[10px] text-white/30">{p.user.phone}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono font-bold text-base text-emerald-400">
                        ₹{((p.amountPaise || 0) / 100).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 font-mono text-xs text-white">
                        <span>{p.upiId}</span>
                        <button
                          onClick={() => copyToClipboard(p.upiId, p.id)}
                          title="Copy UPI ID"
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          {copiedId === p.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          p.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : p.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {p.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {p.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {p.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-white/50 text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="px-4 py-4">
                      {p.status === 'APPROVED' ? (
                        <div className="space-y-0.5">
                          <p className="font-mono text-[11px] text-white/80">UTR: {p.txReference || '—'}</p>
                          {p.adminNote && <p className="text-[10px] text-white/40 italic">{p.adminNote}</p>}
                        </div>
                      ) : p.status === 'REJECTED' ? (
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-rose-300">Refunded to Wallet</p>
                          {p.adminNote && <p className="text-[10px] text-white/40 italic">{p.adminNote}</p>}
                        </div>
                      ) : (
                        <span className="text-[11px] text-white/30 italic">Pending Transfer</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {p.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setActiveModal({ type: 'APPROVE', payout: p });
                              setTxReference('');
                              setAdminNote('');
                              setErrorMessage('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ type: 'REJECT', payout: p });
                              setTxReference('');
                              setAdminNote('');
                              setErrorMessage('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-white/30 font-mono">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F1420] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeModal.type === 'APPROVE' ? 'Approve UPI Payout' : 'Reject Payout Request'}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Student: <strong className="text-white">{activeModal.payout.user?.name}</strong> • ₹{((activeModal.payout.amountPaise || 0) / 100).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">UPI Destination</p>
              <p className="font-mono text-sm text-emerald-400 font-bold">{activeModal.payout.upiId}</p>
            </div>

            {activeModal.type === 'APPROVE' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Bank / UPI Transaction Reference (UTR Number) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 423589124018"
                    value={txReference}
                    onChange={(e) => setTxReference(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/20 border border-white/10 rounded-xl text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                  <p className="text-[10px] text-white/40 mt-1">
                    Transfer the ₹{((activeModal.payout.amountPaise || 0) / 100).toLocaleString('en-IN')} via your UPI app (GPay, PhonePe, Paytm, BHIM) to the student's UPI ID, then paste the 12-digit UTR here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Internal Admin Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paid via ICICI Bank UPI"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/20 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  <p className="font-bold">Important Refund Policy</p>
                  <p className="text-[11px] text-rose-300/80 mt-0.5">
                    Rejecting this request will immediately credit ₹{((activeModal.payout.amountPaise || 0) / 100).toLocaleString('en-IN')} back to the student's referral wallet so they can re-enter their UPI ID.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Reason for Rejection (Visible to student) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. UPI ID is invalid or inactive. Please verify and re-request."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/20 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 resize-none"
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleProcess}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeModal.type === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                } disabled:opacity-50`}
              >
                {processing ? 'Processing...' : activeModal.type === 'APPROVE' ? 'Confirm Approval' : 'Reject & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

