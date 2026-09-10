"use client";

import { useRef } from "react";
import { Printer, Download, X, CheckCircle, ShieldCheck, QrCode } from "lucide-react";
import Image from "next/image";

export interface PaymentReceiptData {
  orderId: string;
  paymentId: string;
  utr: string;
  invoiceNo: string;
  amount: number;
  perPerson: number;
  teamSize: number;
  method: string;
  paidAt: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  preferredTrack: string;
  emailStatus?: string;
}

interface TaxInvoiceReceiptProps {
  receipt: PaymentReceiptData;
  onClose: () => void;
}

export function TaxInvoiceReceipt({ receipt, onClose }: TaxInvoiceReceiptProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold">OFFICIAL TAX INVOICE & DELEGATE RECEIPT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div ref={invoiceRef} className="p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-24 bg-slate-950 rounded-xl p-1 flex items-center justify-center">
                <Image
                  src="/uran-logo.png"
                  alt="உரன் Logo"
                  fill
                  className="object-contain p-1 brightness-110"
                />
              </div>
              <div>
                <h2 className="font-display font-black text-xl tracking-tight text-slate-950">
                  URAN 26
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Dept. of Computer Applications / Science
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <div className="text-xs font-bold text-slate-400 uppercase">Tax Invoice</div>
              <div className="text-base font-black text-slate-900">{receipt.invoiceNo}</div>
              <div className="text-xs text-slate-500">{receipt.paidAt}</div>
            </div>
          </div>

          {/* Payment Status Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>PAYMENT CONFIRMED • WORKSTATION RESERVED</span>
            </div>
            <span className="font-mono text-xs text-emerald-700 font-bold">
              {receipt.utr}
            </span>
          </div>

          {/* Team and Invoice Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-mono text-slate-400 uppercase tracking-wider block mb-1">Billed To (Team Lead):</span>
              <div className="font-bold text-sm text-slate-900">{receipt.leaderName}</div>
              <div className="text-slate-600 font-medium">Team: {receipt.teamName}</div>
              <div className="text-slate-600">{receipt.college}</div>
              <div className="text-slate-500 font-mono mt-0.5">{receipt.leaderEmail}</div>
            </div>

            <div className="sm:text-right">
              <span className="font-mono text-slate-400 uppercase tracking-wider block mb-1">Event Logistics:</span>
              <div className="font-bold text-slate-900">Sept 26, 2026 (Check-in: 07:30 AM)</div>
              <div className="text-slate-600">12-Hour Single-Day Hackathon Window</div>
              <div className="text-slate-600">Track: {receipt.preferredTrack}</div>
              <div className="text-slate-500 font-mono mt-0.5">Method: {receipt.method.toUpperCase()}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-center">Squad Builders</th>
                  <th className="py-3 px-4 text-right">Fee / Builder</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <div>URAN 26 Innovation Hackathon Registration Pass</div>
                    <div className="text-[11px] text-slate-400">Includes workstation, dual leased-line access, 4 meal services (breakfast, lunch, high tea & dinner) & continuous hydration</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {receipt.teamSize} Members
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    ₹{receipt.perPerson}.00
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{receipt.amount}.00
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-sm text-slate-900">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right font-medium text-slate-600">
                    Total Amount Paid (Inclusive of Taxes):
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-base text-slate-950">
                    ₹{receipt.amount}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Check-in Token & Verification QR */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Official Check-In Token</div>
              <div className="text-xl font-mono font-black tracking-widest text-emerald-400">
                URAN26-TEAM-20SLOT
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Present this token at the lab registration foyer on Sept 26, 07:30 AM
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white text-slate-950 px-3 py-2 rounded-xl">
              <QrCode className="w-9 h-9" />
              <div className="text-[9px] font-mono font-bold leading-tight">
                DIGITAL PASS<br />VERIFIED
              </div>
            </div>
          </div>

          {/* Institutional Stamp & Signature */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Computer-generated official tax invoice. Authorized by Department Organizing Committee.</span>
            </div>
            <div className="mt-2 sm:mt-0 font-mono">
              STATUS: PAID // SEAT_RESERVED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
