'use client';

import React from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  User,
  Mail,
  Phone,
} from 'lucide-react';

interface GstInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    courseTitle?: string;
    amountInPaise: number;
    createdAt: string;
    status: string;
  };
  student: {
    name?: string;
    email?: string;
    phone?: string;
    college?: string;
  };
}

export default function GstInvoiceModal({
  isOpen,
  onClose,
  payment,
  student,
}: GstInvoiceModalProps) {
  if (!isOpen) return null;

  const invoiceNumber = `DA-INV-${(payment.razorpayPaymentId || payment.id || '0000').slice(-8).toUpperCase()}`;
  const totalAmount = payment.amountInPaise / 100;
  // Calculate taxable value assuming 18% GST included: Base = Total / 1.18
  const baseTaxableAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmount - baseTaxableAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;

  const invoiceDate = new Date(payment.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] text-slate-100 w-full max-w-3xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Controls Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <FileText className="w-4 h-4" />
            <span>Official GST Tax Invoice Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#090D16] print:bg-white print:text-black">
          
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800 print:border-gray-300">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="DevAscent Logo"
                  className="w-8 h-8 rounded-lg border border-indigo-500/30 bg-slate-900 p-0.5"
                />
                <span className="text-xl font-black text-white print:text-black tracking-tight">
                  DevAscent Academy
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 max-w-xs">
                DevAscent Academy Pvt. Ltd.<br />
                Technology Training &amp; Virtual Internships<br />
                Bengaluru, Karnataka, India • PIN: 560001<br />
                Support: <span className="text-indigo-400 print:text-gray-800">devascentacademy@gmail.com</span>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:border print:border-emerald-600 print:text-emerald-700">
                Tax Invoice / Receipt
              </span>
              <p className="text-sm font-mono font-bold text-white print:text-black pt-1">
                Invoice No: {invoiceNumber}
              </p>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Date: {invoiceDate}
              </p>
              <p className="text-[11px] text-slate-500 print:text-gray-500 font-mono">
                SAC Code: 999293 (Commercial Training)
              </p>
            </div>
          </div>

          {/* Bill To & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 print:bg-gray-50 print:border-gray-200 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500 block">
                Billed To (Student)
              </span>
              <p className="font-bold text-sm text-white print:text-black">
                {student.name || 'Verified Student'}
              </p>
              <p className="text-slate-300 print:text-gray-700">{student.email || '—'}</p>
              <p className="text-slate-400 print:text-gray-600">{student.phone || '—'}</p>
              {student.college && (
                <p className="text-slate-400 print:text-gray-600">{student.college}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500 block">
                Payment Verification
              </span>
              <p className="font-mono text-xs text-indigo-300 print:text-indigo-800">
                Razorpay ID: {payment.razorpayPaymentId || payment.id}
              </p>
              <p className="text-slate-400 print:text-gray-600">
                Method: Online Gateway (UPI / Card / NetBanking)
              </p>
              <div className="inline-flex items-center gap-1 text-emerald-400 print:text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Status: PAID</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-800 print:border-gray-300 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 print:bg-gray-100 text-slate-400 print:text-gray-600 border-b border-slate-800 print:border-gray-300">
                <tr>
                  <th className="p-3.5 font-bold">Item Description</th>
                  <th className="p-3.5 font-bold text-center">SAC Code</th>
                  <th className="p-3.5 font-bold text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                <tr>
                  <td className="p-3.5">
                    <p className="font-bold text-white print:text-black">
                      {payment.courseTitle || 'Virtual Internship & Full-Stack Acceleration Cohort'}
                    </p>
                    <p className="text-[11px] text-slate-400 print:text-gray-500">
                      Curriculum, AI Video Modules, Capstone Verification &amp; Tamper-Proof Certificate
                    </p>
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-400 print:text-gray-600">
                    999293
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-white print:text-black">
                    ₹{baseTaxableAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Grand Total */}
          <div className="flex justify-end text-xs">
            <div className="w-full sm:w-72 space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 print:bg-gray-50 print:border-gray-200">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Taxable Base Value:</span>
                <span className="font-mono text-slate-200 print:text-black font-semibold">
                  ₹{baseTaxableAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>CGST (9.0%):</span>
                <span className="font-mono text-slate-200 print:text-black">
                  ₹{cgst.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>SGST (9.0%):</span>
                <span className="font-mono text-slate-200 print:text-black">
                  ₹{sgst.toFixed(2)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 print:border-gray-300 flex justify-between items-baseline font-bold">
                <span className="text-white print:text-black text-sm">Grand Total (INR):</span>
                <span className="text-emerald-400 print:text-emerald-700 font-mono text-base font-black">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note & Seal */}
          <div className="pt-4 border-t border-slate-800/80 print:border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500 print:text-gray-500">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>This is a computer-generated tax invoice and requires no physical signature.</span>
            </p>
            <p>© {new Date().getFullYear()} DevAscent Academy Pvt. Ltd.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
