'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { KpiSkeleton, EmptyState } from '../../../components/admin/AdminUI';
import {
  IndianRupee,
  Search,
  Sparkles,
  Check,
  Loader2,
  ExternalLink,
  Tag,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';

export default function CoursePriceManagementPage() {
  const { data, isLoading, mutate } = useSWR('/admin/courses', () => api.admin.getCourseStats());

  const courses: any[] = useMemo(() => {
    return data?.courses || data?.data?.courses || (Array.isArray(data) ? data : []);
  }, [data]);

  // Local state for editing prices per course slug
  // Record<slug, { priceInRupees: number; earlyBirdPriceInRupees: number; isSaving: boolean; isSaved: boolean }>
  const [editedPrices, setEditedPrices] = useState<Record<string, { price: number; offer: number }>>({});
  const [savingSlugs, setSavingSlugs] = useState<Record<string, boolean>>({});
  const [savedSlugs, setSavedSlugs] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'price-asc' | 'price-desc' | 'discount'>('title');

  // Bulk Adjustment Modal
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkOfferPrice, setBulkOfferPrice] = useState<number>(1499);
  const [bulkRegularPrice, setBulkRegularPrice] = useState<number>(4999);
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  // Get domains for filtering
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.domain) set.add(c.domain);
    });
    return Array.from(set);
  }, [courses]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q) ||
          c.domain?.toLowerCase().includes(q)
      );
    }

    if (selectedDomain !== 'all') {
      list = list.filter((c) => c.domain === selectedDomain);
    }

    list.sort((a, b) => {
      const aPrice = (a.earlyBirdPriceInPaise || a.priceInPaise || 0) / 100;
      const bPrice = (b.earlyBirdPriceInPaise || b.priceInPaise || 0) / 100;
      const aReg = (a.priceInPaise || 0) / 100;
      const bReg = (b.priceInPaise || 0) / 100;
      const aDisc = aReg > 0 ? (aReg - aPrice) / aReg : 0;
      const bDisc = bReg > 0 ? (bReg - bPrice) / bReg : 0;

      if (sortBy === 'price-asc') return aPrice - bPrice;
      if (sortBy === 'price-desc') return bPrice - aPrice;
      if (sortBy === 'discount') return bDisc - aDisc;
      return (a.title || '').localeCompare(b.title || '');
    });

    return list;
  }, [courses, searchQuery, selectedDomain, sortBy]);

  // Calculate live KPI stats
  const kpiStats = useMemo(() => {
    if (!courses.length) return { total: 0, avgReg: 0, avgOffer: 0, maxDiscount: 0 };
    const total = courses.length;
    let sumReg = 0;
    let sumOffer = 0;
    let maxDisc = 0;

    courses.forEach((c) => {
      const reg = Math.round((c.priceInPaise || 0) / 100);
      const off = Math.round((c.earlyBirdPriceInPaise || c.priceInPaise || 0) / 100);
      sumReg += reg;
      sumOffer += off;
      if (reg > 0 && off < reg) {
        const disc = Math.round(((reg - off) / reg) * 100);
        if (disc > maxDisc) maxDisc = disc;
      }
    });

    return {
      total,
      avgReg: Math.round(sumReg / total),
      avgOffer: Math.round(sumOffer / total),
      maxDiscount: maxDisc,
    };
  }, [courses]);

  // Helper to get current edited or stored value
  const getValues = (course: any) => {
    const edited = editedPrices[course.slug];
    const defaultReg =
      course.priceInPaise !== undefined && course.priceInPaise !== null
        ? Math.round(course.priceInPaise / 100)
        : 999;
    const defaultOffer =
      course.earlyBirdPriceInPaise !== undefined && course.earlyBirdPriceInPaise !== null
        ? Math.round(course.earlyBirdPriceInPaise / 100)
        : 299;

    return {
      reg: edited ? edited.price : defaultReg,
      offer: edited ? edited.offer : defaultOffer,
      isDirty: !!edited && (edited.price !== defaultReg || edited.offer !== defaultOffer),
    };
  };

  const handlePriceChange = (slug: string, field: 'price' | 'offer', value: number) => {
    const course = courses.find((c) => c.slug === slug);
    if (!course) return;

    const current = getValues(course);
    setEditedPrices((prev) => ({
      ...prev,
      [slug]: {
        price: field === 'price' ? value : current.reg,
        offer: field === 'offer' ? value : current.offer,
      },
    }));
  };

  const handleResetCourse = (slug: string) => {
    setEditedPrices((prev) => {
      const copy = { ...prev };
      delete copy[slug];
      return copy;
    });
  };

  const handleSaveCourse = async (course: any) => {
    const { reg, offer } = getValues(course);
    const slug = course.slug;

    if (offer < 0 || reg < 0) {
      setToastMessage({ text: 'Prices cannot be negative numbers', type: 'error' });
      return;
    }

    try {
      setSavingSlugs((prev) => ({ ...prev, [slug]: true }));

      await api.admin.updateCourseDetails(slug, {
        priceInPaise: Math.round(reg * 100),
        earlyBirdPriceInPaise: Math.round(offer * 100),
      });

      // Clear dirty state
      handleResetCourse(slug);

      // Flash success
      setSavedSlugs((prev) => ({ ...prev, [slug]: true }));
      setTimeout(() => {
        setSavedSlugs((prev) => ({ ...prev, [slug]: false }));
      }, 3000);

      setToastMessage({
        text: `Updated price for "${course.title}" to ₹${offer.toLocaleString('en-IN')}`,
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 4000);

      mutate();
    } catch (err: any) {
      setToastMessage({
        text: err?.message || 'Failed to update course price',
        type: 'error',
      });
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSavingSlugs((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const handleApplyBulk = async () => {
    if (bulkOfferPrice < 0 || bulkRegularPrice < 0) return;
    setIsBulkSaving(true);
    let successCount = 0;

    try {
      for (const course of filteredCourses) {
        // Skip free courses like react if desired, or update all
        await api.admin.updateCourseDetails(course.slug, {
          priceInPaise: Math.round(bulkRegularPrice * 100),
          earlyBirdPriceInPaise: Math.round(bulkOfferPrice * 100),
        });
        successCount++;
      }

      setEditedPrices({});
      setIsBulkOpen(false);
      setToastMessage({
        text: `Successfully updated pricing for ${successCount} courses in bulk!`,
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 4000);
      mutate();
    } catch (err: any) {
      setToastMessage({
        text: err?.message || 'Failed during bulk price update',
        type: 'error',
      });
    } finally {
      setIsBulkSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Course Price Management</h1>
              <p className="text-sm text-white/50">
                Manage live standard tuition, early-bird offer prices, and promotional savings across all 12 courses.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Bulk Price Tool</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-white/[0.08] rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">Total Catalog</p>
          <p className="text-2xl font-black text-white">{kpiStats.total} Courses</p>
          <p className="text-xs text-indigo-400/80 mt-1 font-medium">All tracks active in database</p>
        </div>

        <div className="bg-[#0D1117] border border-white/[0.08] rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">Avg Regular Price</p>
          <p className="text-2xl font-black text-white">₹{kpiStats.avgReg.toLocaleString('en-IN')}</p>
          <p className="text-xs text-white/40 mt-1">Standard full tuition fee</p>
        </div>

        <div className="bg-[#0D1117] border border-white/[0.08] rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">Avg Offer Price</p>
          <p className="text-2xl font-black text-emerald-400">₹{kpiStats.avgOffer.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-400/70 mt-1 font-medium">Current student checkout rate</p>
        </div>

        <div className="bg-[#0D1117] border border-white/[0.08] rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">Peak Student Discount</p>
          <p className="text-2xl font-black text-amber-400">{kpiStats.maxDiscount}% OFF</p>
          <p className="text-xs text-amber-400/70 mt-1 font-medium">Maximum savings highlight</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D1117] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course name, slug, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-white/40" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-[#161B22] text-white">All Domains</option>
              {availableDomains.map((d) => (
                <option key={d} value={d} className="bg-[#161B22] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-white/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer pr-2"
            >
              <option value="title" className="bg-[#161B22] text-white">Alphabetical</option>
              <option value="price-asc" className="bg-[#161B22] text-white">Offer Price: Low to High</option>
              <option value="price-desc" className="bg-[#161B22] text-white">Offer Price: High to Low</option>
              <option value="discount" className="bg-[#161B22] text-white">Highest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Pricing Table / Cards */}
      {isLoading ? (
        <KpiSkeleton />
      ) : !filteredCourses.length ? (
        <EmptyState message="No courses found matching your search criteria." />
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const { reg, offer, isDirty } = getValues(course);
            const isSaving = savingSlugs[course.slug] || false;
            const isSaved = savedSlugs[course.slug] || false;
            const discountPct = reg > 0 && offer < reg ? Math.round(((reg - offer) / reg) * 100) : 0;
            const isFree = offer === 0;

            return (
              <div
                key={course.id || course.slug}
                className={`bg-[#0D1117] border rounded-2xl p-4 transition-all duration-200 shadow-md ${
                  isDirty
                    ? 'border-indigo-500/50 bg-indigo-950/10'
                    : isSaved
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Course Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/25 flex items-center justify-center shrink-0 shadow-sm">
                      <Tag className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                          {course.domain || 'Engineering'}
                        </span>
                        {isFree ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            FREE COURSE
                          </span>
                        ) : discountPct > 0 ? (
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {discountPct}% OFF
                          </span>
                        ) : null}
                      </div>

                      <h3 className="text-base font-bold text-white truncate">{course.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/40 mt-0.5">
                        <code className="text-white/30 text-[11px]">/{course.slug}</code>
                        <span>•</span>
                        <span>Level: {course.level || 'All Levels'}</span>
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 ml-1"
                        >
                          <span>Preview on Web</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right: Editable Price Inputs */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                    {/* Regular / Original Price Input */}
                    <div className="w-32">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                        Original (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs font-semibold">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={reg}
                          onChange={(e) =>
                            handlePriceChange(course.slug, 'price', Math.max(0, Number(e.target.value)))
                          }
                          className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-7 pr-2.5 py-1.5 text-sm font-bold text-white/80 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Offer / Early Bird Price Input */}
                    <div className="w-36">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 mb-1 flex items-center justify-between">
                        <span>Offer / Deal (₹)</span>
                        <button
                          type="button"
                          onClick={() => handlePriceChange(course.slug, 'offer', 0)}
                          className="text-[9px] lowercase text-white/40 hover:text-emerald-300 underline"
                        >
                          set ₹0
                        </button>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={offer}
                          onChange={(e) =>
                            handlePriceChange(course.slug, 'offer', Math.max(0, Number(e.target.value)))
                          }
                          className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl pl-7 pr-2.5 py-1.5 text-sm font-black text-emerald-300 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/10 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end">
                      {isDirty && (
                        <button
                          type="button"
                          onClick={() => handleResetCourse(course.slug)}
                          title="Reset changes"
                          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isSaving || !isDirty}
                        onClick={() => handleSaveCourse(course)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSaved
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : isDirty
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                            : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isSaved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <span>Update</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Price Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in-50">
          <div className="bg-[#0D1117] border border-white/[0.12] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white">Bulk Price Update</h3>
              </div>
              <button
                onClick={() => setIsBulkOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/50 leading-relaxed">
              This will update the standard tuition and offer checkout price for all{' '}
              <strong className="text-white">{filteredCourses.length} currently filtered courses</strong> at once in the
              live database.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                  Set Regular / Original Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={bulkRegularPrice}
                    onChange={(e) => setBulkRegularPrice(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-8 pr-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  Set Discount / Offer Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={bulkOfferPrice}
                    onChange={(e) => setBulkOfferPrice(Number(e.target.value))}
                    className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl pl-8 pr-3 py-2 text-sm font-black text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {bulkRegularPrice > 0 && bulkOfferPrice < bulkRegularPrice && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>
                    Resulting Discount:{' '}
                    <strong>{Math.round(((bulkRegularPrice - bulkOfferPrice) / bulkRegularPrice) * 100)}% OFF</strong>{' '}
                    to all students.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkSaving}
                onClick={handleApplyBulk}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 disabled:opacity-50"
              >
                {isBulkSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying to all...</span>
                  </>
                ) : (
                  <span>Apply to {filteredCourses.length} Courses</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
