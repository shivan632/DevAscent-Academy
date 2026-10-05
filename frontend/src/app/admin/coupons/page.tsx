'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  TrendingDown,
  Sparkles,
  X,
  Layers,
  BookOpen,
  Filter,
} from 'lucide-react';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { useDebounce } from '../../../lib/hooks/useDebounce';

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex items-start gap-3 shadow-lg">
      <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-0.5">{label}</p>
        <p className="text-xl font-black text-white">{value}</p>
        <p className="text-[10px] text-white/35 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminCouponsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Create Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENT' as 'PERCENT' | 'FLAT',
    discountValue: 20, // 20% or ₹200
    maxUses: 50,
    expiresAt: '',
    courseId: '',
  });

  const debouncedSearch = useDebounce(searchInput, 350);

  // Fetch Coupons
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/coupons?page=${page}&limit=${limit}&status=${statusFilter}&search=${debouncedSearch}`,
    () =>
      api.admin.getCoupons({
        page,
        limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: debouncedSearch || undefined,
      }),
    { revalidateOnFocus: false },
  );

  // Fetch Courses for Target Dropdown & Live Preview
  const { data: coursesData } = useSWR('/courses', () => api.getCourses(), {
    revalidateOnFocus: false,
  });

  const courses = useMemo(() => {
    return Array.isArray(coursesData)
      ? coursesData
      : Array.isArray(coursesData?.courses)
      ? coursesData.courses
      : [];
  }, [coursesData]);

  // Selected Course for preview
  const previewCourse = useMemo(() => {
    if (formData.courseId) {
      return courses.find((c: any) => c.id === formData.courseId) || courses[0];
    }
    return courses[0] || {
      title: 'Full-Stack Accelerator',
      earlyBirdPriceInPaise: 149900,
    };
  }, [formData.courseId, courses]);

  // Calculate live preview amounts
  const previewCalculations = useMemo(() => {
    const originalPriceInRupees = (previewCourse?.earlyBirdPriceInPaise || 149900) / 100;
    let discountInRupees = 0;

    if (formData.discountType === 'PERCENT') {
      const pct = Math.min(100, Math.max(0, Number(formData.discountValue) || 0));
      discountInRupees = Math.round((originalPriceInRupees * pct) / 100);
    } else {
      // Flat discount in rupees
      const flat = Math.max(0, Number(formData.discountValue) || 0);
      discountInRupees = Math.min(flat, originalPriceInRupees);
    }

    const finalPriceInRupees = Math.max(0, originalPriceInRupees - discountInRupees);

    return {
      courseTitle: previewCourse?.title || 'Full-Stack Accelerator',
      originalPriceInRupees,
      discountInRupees,
      finalPriceInRupees,
    };
  }, [formData.discountType, formData.discountValue, previewCourse]);

  // Copy helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Deactivate coupon
  const handleDeactivate = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to deactivate coupon "${code}"?`)) return;
    try {
      await api.admin.deactivateCoupon(id);
      mutate();
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate coupon');
    }
  };

  // Submit Create Coupon
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanCode = formData.code.trim().toUpperCase();
    if (!cleanCode || !/^[A-Z0-9]{4,20}$/.test(cleanCode)) {
      setFormError('Coupon code must be 4-20 uppercase alphanumeric characters (no spaces).');
      return;
    }

    const val = Number(formData.discountValue);
    if (isNaN(val) || val <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }

    if (formData.discountType === 'PERCENT' && val > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    setIsSubmitting(true);
    try {
      // For FLAT discount, backend expects paise
      const backendDiscountValue =
        formData.discountType === 'FLAT' ? Math.round(val * 100) : Math.round(val);

      await api.admin.createCoupon({
        code: cleanCode,
        description: formData.description || undefined,
        discountType: formData.discountType,
        discountValue: backendDiscountValue,
        maxUses: Number(formData.maxUses) || 1,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        courseId: formData.courseId || undefined,
        isAutoApply: false,
      });

      setFormSuccess(`Coupon ${cleanCode} created successfully!`);
      mutate();
      setTimeout(() => {
        setIsCreateOpen(false);
        setFormSuccess(null);
        setFormData({
          code: '',
          description: '',
          discountType: 'PERCENT',
          discountValue: 20,
          maxUses: 50,
          expiresAt: '',
          courseId: '',
        });
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = data?.stats || {
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
    totalDiscountGivenInPaise: 0,
  };

  const couponsList = data?.coupons || [];

  return (
    <div className="space-y-6">
      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Tag className="w-5 h-5" />
            </span>
            Coupon Management
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Create and track promotional discount vouchers for cohort admissions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* ─── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Coupons"
          value={stats.totalCoupons.toLocaleString()}
          sub="Generated all-time"
          icon={Tag}
          color="bg-indigo-500/15 text-indigo-400"
        />
        <KpiCard
          label="Active Coupons"
          value={stats.activeCoupons.toLocaleString()}
          sub="Ready for redemption"
          icon={CheckCircle2}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <KpiCard
          label="Total Redemptions"
          value={stats.totalRedemptions.toLocaleString()}
          sub="Students claimed"
          icon={Users}
          color="bg-sky-500/15 text-sky-400"
        />
        <KpiCard
          label="Discount Given"
          value={`₹${Math.round(stats.totalDiscountGivenInPaise / 100).toLocaleString()}`}
          sub="Total fee waived"
          icon={TrendingDown}
          color="bg-amber-500/15 text-amber-400"
        />
      </div>

      {/* ─── Search & Filters Bar ──────────────────────────────────────────── */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-full md:w-auto overflow-x-auto">
          {(['all', 'active', 'expired', 'inactive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              {tab === 'all' ? 'All Coupons' : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search code or description..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* ─── Coupons Table / List ──────────────────────────────────────────── */}
      <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader rows={5} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-sm">
            Failed to load coupons. Please try again.
          </div>
        ) : couponsList.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Tag}
              title="No coupons found"
              description={
                searchInput || statusFilter !== 'all'
                  ? 'No coupons match your filter criteria.'
                  : 'You have not created any discount coupons yet.'
              }
              action={
                searchInput || statusFilter !== 'all'
                  ? undefined
                  : {
                      label: 'Create First Coupon',
                      onClick: () => setIsCreateOpen(true),
                    }
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40 font-semibold bg-white/[0.02]">
                  <th className="px-5 py-3.5">Coupon Code</th>
                  <th className="px-5 py-3.5">Discount</th>
                  <th className="px-5 py-3.5">Scope</th>
                  <th className="px-5 py-3.5">Usage / Limit</th>
                  <th className="px-5 py-3.5">Status & Expiry</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {couponsList.map((coupon: any) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isExhausted = coupon.usedCount >= coupon.maxUses;
                  const isActive = coupon.isActive && !isExpired && !isExhausted;

                  const usagePct = Math.min(
                    100,
                    Math.round((coupon.usedCount / coupon.maxUses) * 100),
                  );

                  return (
                    <tr key={coupon.id} className="hover:bg-white/[0.02] transition">
                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            title="Copy code"
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-white/40 mt-1 max-w-xs truncate">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white flex items-center gap-1">
                          {coupon.discountType === 'PERCENT' ? (
                            <>
                              <Percent className="w-3.5 h-3.5 text-purple-400" />
                              <span>{coupon.discountValue}% OFF</span>
                            </>
                          ) : (
                            <>
                              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                              <span>₹{(coupon.discountValue / 100).toLocaleString()} FLAT</span>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] text-white/35">
                          {coupon.discountType === 'PERCENT' ? 'Percentage' : 'Flat Deduction'}
                        </span>
                      </td>

                      {/* Scope */}
                      <td className="px-5 py-4">
                        {coupon.course ? (
                          <div className="flex items-center gap-1.5 text-white/80 max-w-xs">
                            <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span className="truncate">{coupon.course.title}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <Layers className="w-3.5 h-3.5 shrink-0" />
                            <span>All Cohorts</span>
                          </div>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-4">
                        <div className="space-y-1.5 max-w-[140px]">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-semibold text-white">
                              {coupon.usedCount} / {coupon.maxUses}
                            </span>
                            <span className="text-white/40">{usagePct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isExhausted
                                  ? 'bg-rose-500'
                                  : usagePct > 80
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-500'
                              }`}
                              style={{ width: `${usagePct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div>
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : isExhausted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <XCircle className="w-3 h-3" /> Exhausted
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock className="w-3 h-3" /> Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                              Inactive
                            </span>
                          )}
                          <p className="text-[10px] text-white/35 mt-1">
                            {coupon.expiresAt
                              ? `Expires ${new Date(coupon.expiresAt).toLocaleDateString()}`
                              : 'No expiration'}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {coupon.isActive && !isExpired && (
                          <button
                            onClick={() => handleDeactivate(coupon.id, coupon.code)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Create Coupon Modal with Live Preview ──────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D1117] border border-white/[0.12] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Tag className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Create New Coupon</h3>
                  <p className="text-xs text-white/40">
                    Define discount parameters and verify preview before saving.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Coupon Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DEVBATCH20"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })
                    }
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm font-mono font-bold tracking-wider text-indigo-300 placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <span className="text-[10px] text-white/35 mt-1 block">
                    Uppercase alphanumeric, 4–20 characters.
                  </span>
                </div>

                {/* Course Target */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Applicable Course
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#161B22] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="">All Courses & Cohorts</option>
                    {courses.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (₹{((c.earlyBirdPriceInPaise || 149900) / 100).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'PERCENT' | 'FLAT',
                        discountValue: e.target.value === 'PERCENT' ? 20 : 300,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#161B22] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    {formData.discountType === 'PERCENT' ? 'Discount % (1-100)' : 'Discount Amount (₹)'}{' '}
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={formData.discountType === 'PERCENT' ? 100 : 50000}
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Max Redemptions <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUses: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Expiry & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Internal Note / Campaign Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Special 20% discount for Hackathon winners"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* ─── LIVE COUPON PREVIEW CARD (Improvement 1 Requirement) ──── */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/40 border border-indigo-500/25">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Live Student Checkout Preview
                  </span>
                  <span className="text-[10px] text-white/40">Catches typos before launch</span>
                </div>

                <div className="bg-[#090D14] border border-white/[0.08] rounded-xl p-3.5 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-white/70">
                    <span className="truncate pr-2">{previewCalculations.courseTitle}</span>
                    <span className="shrink-0">
                      ₹{previewCalculations.originalPriceInRupees.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>
                      {formData.code || 'COUPONCODE'} (
                      {formData.discountType === 'PERCENT'
                        ? `${formData.discountValue}% off`
                        : `₹${formData.discountValue} flat`}
                      )
                    </span>
                    <span>-₹{previewCalculations.discountInRupees.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-dashed border-white/15 pt-2 flex justify-between text-white font-bold text-sm">
                    <span>Final Amount:</span>
                    <span className="text-indigo-400">
                      ₹{previewCalculations.finalPriceInRupees.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? 'Creating Coupon...' : 'Save & Publish Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
