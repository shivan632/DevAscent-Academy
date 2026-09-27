'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { SkeletonLoader } from '../../../components/admin/SkeletonLoader';
import { EmptyState } from '../../../components/admin/EmptyState';
import { ConfirmModal } from '../../../components/admin/ConfirmModal';
import { Shield, UserCog, Download, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { data, isLoading, mutate } = useSWR('/admin/all-users', () =>
    api.admin.getStudents({ limit: 100 })
  );

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'primary';
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    variant: 'primary',
    onConfirm: async () => {},
  });

  const handleRoleSelect = (student: any, role: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Update Role for ${student.name}?`,
      description: `Are you sure you want to change ${student.name}'s role to ${role}? This alters their access permissions across the system.`,
      confirmText: `Promote to ${role}`,
      variant: role === 'ADMIN' ? 'warning' : 'primary',
      onConfirm: async () => {
        await api.admin.updateRole(student.id, role);
        await mutate();
      },
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Settings</h1>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            System Config
          </span>
        </div>
        <p className="text-xs text-white/40 mt-1">
          Role elevation, audit data exports, and security perimeter enforcement.
        </p>
      </div>

      {/* Exports Section */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Compliance & Financial Exports</h2>
            <p className="text-xs text-white/40">Download ledger records for taxation and audit verification</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={api.admin.exportStudentsUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs text-white/80 hover:text-white font-semibold rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export All Students (CSV)</span>
          </a>
          <a
            href={api.admin.exportRevenueUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs text-white/80 hover:text-white font-semibold rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Revenue Ledger (CSV)</span>
          </a>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
            <UserCog className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Role Delegation</h2>
            <p className="text-xs text-white/40">Assign Admin or Instructor permissions to verified team members</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader type="table" rows={4} cols={3} />
        ) : !data?.data?.length ? (
          <EmptyState
            icon={UserCog}
            title="No users available"
            description="No users found to manage roles."
          />
        ) : (
          <div className="space-y-2">
            {data.data.map((student: any) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-white">{student.name}</p>
                  <p className="text-[11px] text-white/40">{student.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    {student.role || 'STUDENT'}
                  </span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleRoleSelect(student, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1.5 bg-[#0F1420] border border-white/10 rounded-lg text-xs text-white/70 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                  >
                    <option value="">Promote role…</option>
                    <option value="ADMIN">Promote to Admin</option>
                    <option value="INSTRUCTOR">Make Instructor</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Architecture */}
      <div className="bg-[#0F1420] border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Security Perimeter & Audit Policy</h2>
            <p className="text-xs text-white/40">Multi-tier protection mechanisms active on this deployment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Edge JWT Auth Guard', status: 'Enforced', desc: 'Pre-flight signature validation at CDN edge before reaching application server' },
            { label: 'RolesGuard (RBAC)', status: 'Active', desc: 'All backend /admin/* controllers strictly verified for ADMIN claim in claims token' },
            { label: 'Immutable Audit Trail', status: 'Logging', desc: 'All mutations logged to AuditLog table with admin ID, timestamp, IP, and UA' },
            { label: 'Financial Integrity Lock', status: 'Protected', desc: 'Strict soft-delete policy prevents hard deletion of paid student enrollments' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">{item.label}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{item.desc}</p>
              </div>
              <span className="shrink-0 text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />
    </div>
  );
}
