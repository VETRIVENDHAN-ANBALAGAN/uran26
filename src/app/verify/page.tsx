"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  ArrowLeft,
  QrCode,
  CheckCircle2,
  Users,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import Image from "next/image";

export default function VerifySearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    router.push(`/verify/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-sky-500 selection:text-black py-16 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Precision grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="w-96 h-96 bg-sky-500/10 rounded-full blur-3xl absolute top-1/4 left-1/3 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to URAN’26 Public Portal</span>
          </Link>

          <div className="flex justify-center mb-3">
            <div className="relative h-12 w-28">
              <Image
                src="/uran-logo.png"
                alt="URAN’26 Logo"
                fill
                className="object-contain brightness-125"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Verify Delegate Pass & Badge
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Periyar Maniammai Institute of Science and Technology • Official Registry Verifier
          </p>
        </div>

        <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-5">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300 flex items-start gap-2.5">
            <QrCode className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
            <p className="leading-relaxed">
              If your pass has a QR code, point your phone camera at it to verify automatically, or enter your <strong>Team Code</strong> below:
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Team Code or Mobile Number
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. URAN26-TEAM-..."
                  className="w-full bg-[#060c18] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-400 transition-colors"
                  autoFocus
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">
                Example: <code className="text-sky-400 font-mono">URAN26-TEAM-MTYNAHA6-4AAA</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={!query.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Verify & Open Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Haven’t pre-registered yet?{" "}
              <Link href="/#register" className="text-sky-400 font-bold hover:underline">
                Pre-Register Here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 font-mono">
          PMIST Department of Computer Applications • URAN’26 Security Protocol
        </div>
      </div>
    </div>
  );
}
