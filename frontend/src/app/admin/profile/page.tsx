'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../lib/store/authStore';
import {
  UserCircle,
  Mail,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Key,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Section wrapper ──────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-black text-white">{title}</h2>
        {subtitle && <p className="text-[11px] text-white/35 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', placeholder, disabled, icon: Icon,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
  icon?: React.ElementType;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-wider text-white/40 block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />}
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 bg-white/[0.03] border border-white/[0.09] rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
          >
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function AdminProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const isSuperAdmin =
    user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ||
    user?.email === 'shivrom.2020@gmail.com';

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [savedProfile, setSavedProfile] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [savedPw, setSavedPw] = useState(false);

  const handleSaveProfile = async () => {
    // TODO: call API
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleSavePassword = async () => {
    setPwError('');
    if (!currentPw) { setPwError('Enter your current password.'); return; }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    // TODO: call API
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setSavedPw(true);
    setTimeout(() => setSavedPw(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-violet-500/12 border border-violet-500/20">
          <UserCircle className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Profile</h1>
          <p className="text-xs text-white/35 mt-0.5">Manage your admin account and credentials</p>
        </div>
      </div>

      {/* Identity Card */}
      <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/50 to-indigo-600/50 border border-violet-500/30 flex items-center justify-center text-2xl font-black text-violet-200 shrink-0">
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-white truncate">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${
              isSuperAdmin
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                : 'bg-violet-500/15 text-violet-300 border-violet-500/25'
            }`}>
              {isSuperAdmin ? <ShieldAlert className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
            <span className="text-[9px] text-white/25 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              Joined DevAscent
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <Section title="Profile Information" subtitle="Update your display name and contact details">
        <div className="space-y-4">
          <Field label="Full Name" value={name} onChange={setName} icon={UserCircle} placeholder="Your full name" />
          <Field label="Email Address" value={user?.email || ''} type="email" icon={Mail} disabled />
          <Field label="Phone Number" value={phone} onChange={setPhone} icon={Key} placeholder="+91 98765 43210" />

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-black text-violet-300 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
            {savedProfile && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
        </div>
      </Section>

      {/* Change Password */}
      <Section title="Change Password" subtitle="Use a strong password with letters, numbers, and symbols">
        <div className="space-y-4">
          <Field label="Current Password" value={currentPw} onChange={setCurrentPw} type="password" icon={Lock} placeholder="Enter current password" />
          <Field label="New Password" value={newPw} onChange={setNewPw} type="password" icon={Lock} placeholder="Min. 8 characters" />
          <Field label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} type="password" icon={Lock} placeholder="Repeat new password" />

          {pwError && (
            <p className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {pwError}
            </p>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSavePassword}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-black text-violet-300 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              Update Password
            </button>
            {savedPw && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Password updated!
              </span>
            )}
          </div>
        </div>
      </Section>

      {/* Role Info */}
      <Section title="Role & Permissions" subtitle="Your access level within the DevAscent admin system">
        <div className="space-y-3">
          {[
            { label: 'Manage Students', granted: true },
            { label: 'Approve Submissions', granted: true },
            { label: 'Issue Certificates', granted: true },
            { label: 'View Payment Ledger', granted: true },
            { label: 'Process Refunds', granted: true },
            { label: 'Upload Course Content', granted: true },
            { label: 'Promote Other Admins', granted: isSuperAdmin },
            { label: 'Delete Records (Hard)', granted: false },
          ].map(({ label, granted }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-xs text-white/60">{label}</span>
              <span className={`flex items-center gap-1 text-[10px] font-bold ${granted ? 'text-emerald-400' : 'text-white/25'}`}>
                {granted
                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> Granted</>
                  : <>✕ Restricted</>
                }
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Session" subtitle="Manage your active admin session">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-black text-rose-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Admin Portal
        </button>
      </Section>
    </div>
  );
}
