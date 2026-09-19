'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { TableSkeleton, EmptyState } from '../../../components/admin/AdminUI';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';
import { Shield, UserCog, Download } from 'lucide-react';

export default function SettingsPage() {
  const { data, isLoading, mutate } = useSWR('/admin/all-users', () =>
    api.admin.getStudents({ limit: 100 })
  );

  const [confirm, setConfirm] = useState<{
    open: boolean; userId: string; userName: string; newRole: string;
  }>({ open: false, userId: '', userName: '', newRole: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const handleRoleChange = useCallback(async () => {
    setActionLoading(true);
    try {
      await api.admin.updateRole(confirm.userId, confirm.newRole);
      await mutate();
      setConfirm((c) => ({ ...c, open: false }));
    } catch (e: any) {
      alert(e.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  }, [confirm, mutate]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Settings</h1>
        <p className="text-sm text-white/35 mt-0.5">Platform configuration and role management</p>
      </div>

      {/* Exports Section */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Data Exports</h2>
            <p className="text-xs text-white/35">Download reports for GST filings and audits</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={api.admin.exportStudentsUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm text-white/70 hover:text-white font-medium rounded-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Export All Students (CSV)
          </a>
          <a
            href={api.admin.exportRevenueUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm text-white/70 hover:text-white font-medium rounded-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Export Revenue Report (CSV)
          </a>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
            <UserCog className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Role Management</h2>
            <p className="text-xs text-white/35">Promote students to Admin or Instructor</p>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : !data?.data?.length ? (
          <EmptyState message="No users found." />
        ) : (
          <div className="space-y-2">
            {data.data.map((student: any) => (
              <div key={student.id} className="flex items-center justify-between gap-4 px-4 py-3 bg-white/3 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">{student.name}</p>
                  <p className="text-xs text-white/40">{student.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    STUDENT
                  </span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setConfirm({ open: true, userId: student.id, userName: student.name, newRole: e.target.value });
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="">Change role…</option>
                    <option value="ADMIN">Promote to Admin</option>
                    <option value="INSTRUCTOR">Make Instructor</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Info */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Security</h2>
            <p className="text-xs text-white/35">Access control layers active</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Edge Middleware', status: 'Active', desc: 'JWT verified at the CDN edge before page loads' },
            { label: 'Client Guard', status: 'Active', desc: 'Role checked in layout.tsx before rendering admin UI' },
            { label: 'Backend RolesGuard', status: 'Active', desc: 'All /admin/* API routes require ADMIN role in JWT' },
            { label: 'Audit Logging', status: 'Active', desc: 'Every admin action stored with admin ID, IP, and metadata' },
            { label: 'Throttling', status: 'Active', desc: '100 requests/min limit on all API routes' },
          ].map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={`Change Role to ${confirm.newRole}?`}
        description={`This will change ${confirm.userName}'s role to ${confirm.newRole}. They will gain ${confirm.newRole === 'ADMIN' ? 'full admin access to all platform data and actions' : 'instructor capabilities'}. This is logged in the audit trail.`}
        confirmLabel={`Yes, Make ${confirm.newRole}`}
        variant={confirm.newRole === 'ADMIN' ? 'danger' : 'warning'}
        isLoading={actionLoading}
        onConfirm={handleRoleChange}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </div>
  );
}
