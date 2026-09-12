"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Check, Terminal, ShieldCheck, 
  Sparkles, QrCode, Copy, CheckCheck, 
  ArrowRight, Printer, AlertCircle, BedDouble, 
  Users, Building2, Phone, Mail, CheckCircle2,
  Calendar, MapPin, Clock, Info, ShieldAlert,
  ExternalLink, Download
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DelegateBadgeModal } from "./DelegateBadge";
import { generateQrDataUrl, getVerificationUrl } from "@/lib/qrcode";

const preferredTrackOptions = [
  "01 — EdTech & Inclusive Innovation",
  "02 — AgriTech & Rural Innovation",
  "03 — FinTech & Digital Economy",
  "04 — CyberTech & Digital Trust",
  "05 — HealthTech & Well-being",
];

const memberCountOptions = [3, 4, 5];

export interface RegistrationPassData {
  registrationToken: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  teamSize: number;
  perPerson: number;
  totalPayableOnSpot: number;
  preferredTrack: string;
  accommodationRequested: boolean;
  registeredAt: string;
  members?: Array<{
    name: string;
    role?: string;
    email?: string;
    phone?: string;
  }>;
}

export function SpecialRegistrationTerminal() {
  const printRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationPassData | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [previewQrDataUrl, setPreviewQrDataUrl] = useState("");

  useEffect(() => {
    const token = registrationData?.registrationToken || "URAN26-TEAM-PREVIEW";
    const url = getVerificationUrl(token);
    generateQrDataUrl(url, { width: 300, margin: 1 }).then((data) => {
      setPreviewQrDataUrl(data);
    });
  }, [registrationData?.registrationToken]);

  // Form State
  const [formData, setFormData] = useState({
    teamName: "VisionForge",
    leaderName: "Aravind Kumar",
    leaderEmail: "aravind.k@college.edu",
    leaderPhone: "+91 90251 16795",
    college: "PMIST, Vallam, Thanjavur",
    teamSize: 4,
    preferredTrack: "01 — EdTech & Inclusive Innovation",
    accommodationRequested: false,
    hasValidStudentIds: true,
  });

  const [memberNames, setMemberNames] = useState<string[]>([
    "Aravind Kumar",
    "Bala Murugan",
    "Chandran S",
    "Dinesh R",
    "Ezhil V",
  ]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberNameChange = (index: number, val: string) => {
    setMemberNames((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const membersPayload = memberNames.slice(0, formData.teamSize).map((name, idx) => ({
        name: (idx === 0 ? formData.leaderName : name).trim(),
        role: idx === 0 ? "Team Leader" : `Builder ${idx + 1}`,
      }));

      const res = await fetch("/api/registration/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          members: membersPayload,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to submit pre-registration.");
      }

      setRegistrationData(data.registration);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#10b981", "#ffffff", "#f59e0b", "#a855f7"],
        });
      } catch (err) {
        // Safe fallback
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToken = () => {
    if (!registrationData?.registrationToken) return;
    navigator.clipboard.writeText(registrationData.registrationToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPayable = formData.teamSize * 250; // ₹250 per participant

  return (
    <section id="register" className="py-24 bg-[#040813] relative overflow-hidden text-white selection:bg-white selection:text-black">
      {/* Precision Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Terminal Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-10 border-b border-slate-800/80 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-white font-bold tracking-wider uppercase">
              URAN’26 // NATIONAL_PRE_REGISTRATION_TERMINAL
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              PAYMENT_MODE: ON_SPOT_AT_PMIST
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">RATE: ₹250 / PARTICIPANT</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400">26 SEPT 2026 (7 AM – 7 PM)</span>
          </div>
        </div>

        {/* Title Bar & Critical Alert Banner */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Official Online Pre-Registration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white mb-3">
            Pre-Register Your Team
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Students from colleges and universities across India can participate. Team size: 3–5 members.
          </p>

          {/* Prominent High-Impact Notice Box */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900/95 to-sky-500/15 border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.2)] flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs sm:text-sm font-mono font-black text-amber-300 uppercase tracking-wide">
                ₹250/participant — ON-SPOT PAYMENT | PRE-REGISTRATION MANDATORY
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                <strong>Pre-registration online is mandatory</strong> before the hackathon begins. No online payment is processed on this website. The ₹250 registration fee is collected on-spot at the PMIST venue check-in desk when your team arrives.
              </p>
            </div>
          </div>
        </div>

        {/* Split Screen Terminal: Pre-Registration Form (Left) & Real-time Live Badge (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Pre-Registration Form / Confirmed Digital Pass */}
          <div className="lg:col-span-7 bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            
            {isSuccess && registrationData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
                ref={printRef}
              >
                <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/30">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs font-mono font-bold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PRE-REGISTRATION SECURED & CONFIRMED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
                  Official Check-In Pass Issued!
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                  Congratulations <strong className="text-white">{registrationData.teamName}</strong> (Lead: {registrationData.leaderName})! Your digital pass has also been dispatched to <strong className="text-white font-mono">{registrationData.leaderEmail}</strong>.
                </p>

                {/* PROMINENT SAVE YOUR TEAM CODE ALERT */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-slate-900 to-amber-500/20 border-2 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.25)] max-w-lg mx-auto mb-6 text-left">
                  <div className="flex items-start gap-3.5">
                    <ShieldAlert className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <div className="font-mono text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                        SAVE YOUR TEAM CODE
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        Your Team Code is required for on-site verification. <strong>All team members must be present with their valid Student IDs.</strong>
                      </p>
                      
                      {/* Crystal-Clear 6-Step Verification Pipeline */}
                      <div className="pt-2.5 border-t border-slate-700/80">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-sky-300 mb-1.5 font-bold">
                          Verification & Entry Process:
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400">Register</span>
                          <span className="text-slate-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-sky-300 font-bold">Get Team Code</span>
                          <span className="text-slate-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300">Arrive</span>
                          <span className="text-slate-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-bold">Show Code + IDs</span>
                          <span className="text-slate-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 font-bold">Verify</span>
                          <span className="text-slate-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 font-bold">Pay ₹250/person</span>
                          <span className="text-slate-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Enter Hackathon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Token & On-Spot Due Box */}
                <div className="bg-[#060c18] border border-slate-700/80 rounded-2xl p-5 mb-6 max-w-lg mx-auto text-left font-mono space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Pre-Registration Token / Team Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-black text-sm tracking-wider">{registrationData.registrationToken}</span>
                      <button
                        onClick={copyToken}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title="Copy Token"
                      >
                        {copiedToken ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="text-amber-300 font-bold">PAYABLE ON-SPOT AT VENUE</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Total Fee Due at Check-In:</span>
                    <span className="text-emerald-400 font-black text-base">
                      ₹{registrationData.totalPayableOnSpot} INR <span className="text-[11px] font-normal text-slate-400">({registrationData.teamSize} × ₹250)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Campus Accommodation:</span>
                    <span className={registrationData.accommodationRequested ? "text-amber-300 font-semibold" : "text-slate-400"}>
                      {registrationData.accommodationRequested ? "Requested for 25th Sept night (Subject to availability & additional payment on-spot)" : "Not Requested"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Reporting Venue:</span>
                    <span className="text-slate-200">PMIST Campus, Vallam, Thanjavur</span>
                  </div>
                </div>

                {/* Important On-Spot Instructions */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 max-w-lg mx-auto text-left text-xs text-slate-300 space-y-1.5 mb-6">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-[13px]">
                    <Info className="w-4 h-4 text-sky-400" />
                    <span>Venue Check-In & Verification Checklist:</span>
                  </div>
                  <p>1. Present your <strong>Team Code ({registrationData.registrationToken})</strong> at the PMIST registration desk.</p>
                  <p>2. <strong>All 3–5 team members must be present</strong> with physical Student IDs matching registered names exactly.</p>
                  <p>3. Pay the registration fee of <strong>₹{registrationData.totalPayableOnSpot}</strong> on-spot after identity verification.</p>
                  <p>4. Collect official delegate badges and proceed to assigned computing lab workstation.</p>
                </div>

                {/* Action Buttons: Badges, Print, Download, Verify */}
                <div className="space-y-3 max-w-lg mx-auto">
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                    <button
                      type="button"
                      onClick={() => setIsBadgeModalOpen(true)}
                      className="px-6 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-black transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      <span>Print / Download Delegate Badges (PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-5 py-3.5 rounded-full bg-white hover:bg-slate-200 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print A4 Pass</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                    <Link
                      href={`/verify/${encodeURIComponent(registrationData.registrationToken)}`}
                      target="_blank"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                      <span>Test QR Verification Live ↗</span>
                    </Link>

                    <a
                      href="#schedule"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>12h Schedule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="mt-6 text-[11px] text-slate-400">
                  Questions? Call <a href="tel:9025116795" className="text-sky-400 font-mono font-bold hover:underline">9025116795</a> or email <a href="mailto:join.uran26@gmail.com" className="text-sky-400 font-mono hover:underline">join.uran26@gmail.com</a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Team / Project Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange("teamName", e.target.value)}
                      className="w-full bg-[#060c18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400 transition-all font-medium"
                      placeholder="e.g. VisionForge"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Team Lead Full Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.leaderName}
                      onChange={(e) => handleInputChange("leaderName", e.target.value)}
                      className="w-full bg-[#060c18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400 transition-all font-medium"
                      placeholder="e.g. Aravind Kumar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Official Email ID (Pass Delivery) *</label>
                    <input
                      required
                      type="email"
                      value={formData.leaderEmail}
                      onChange={(e) => handleInputChange("leaderEmail", e.target.value)}
                      className="w-full bg-[#060c18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400 transition-all font-medium"
                      placeholder="lead@college.edu"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Phone / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      value={formData.leaderPhone}
                      onChange={(e) => handleInputChange("leaderPhone", e.target.value)}
                      className="w-full bg-[#060c18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400 transition-all font-mono"
                      placeholder="+91 90251 16795"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">College / University Name & City *</label>
                  <input
                    required
                    type="text"
                    value={formData.college}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    className="w-full bg-[#060c18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400 transition-all font-medium"
                    placeholder="e.g. Periyar Maniammai Institute of Science and Technology (PMIST)"
                  />
                </div>

                {/* Squad Size & Preferred Track */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Squad Size (3–5 Members) *</label>
                      <span className="text-[10px] text-amber-300 font-mono">₹250 / participant</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {memberCountOptions.map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleInputChange("teamSize", count)}
                          className={cn(
                            "py-2 px-1 rounded-xl text-center font-bold border transition-all text-[11px] sm:text-xs",
                            formData.teamSize === count
                              ? "bg-white text-slate-950 border-white shadow"
                              : "bg-[#060c18] border-slate-800 text-slate-400 hover:text-white"
                          )}
                        >
                          <span className="block sm:inline">{count} {count === 1 ? "Person" : "Members"}</span>
                          <span className="block sm:inline sm:ml-1 text-[10px] sm:text-xs opacity-80">(₹{count * 250})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Preferred Track Domain *</label>
                    <select
                      value={formData.preferredTrack}
                      onChange={(e) => handleInputChange("preferredTrack", e.target.value)}
                      className="w-full bg-[#060c18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-medium"
                    >
                      {preferredTrackOptions.map((track) => (
                        <option key={track} value={track} className="bg-slate-900 text-white">
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Squad Member Names (Must Match Physical ID Card) */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>Squad Builder Names ({formData.teamSize} Members) — Enter Name Exactly as on Student ID</span>
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono">Physical ID Verification at PMIST</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {Array.from({ length: formData.teamSize }).map((_, idx) => (
                      <div key={idx} className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                          <span>{idx === 0 ? "Builder 1 (Lead)" : `Builder ${idx + 1}`}</span>
                          {idx === 0 && <span className="text-sky-400 font-mono text-[10px]">Team Lead</span>}
                        </label>
                        <input
                          required
                          type="text"
                          value={idx === 0 ? formData.leaderName : memberNames[idx] || ""}
                          onChange={(e) => {
                            if (idx === 0) {
                              handleInputChange("leaderName", e.target.value);
                            } else {
                              handleMemberNameChange(idx, e.target.value);
                            }
                          }}
                          className="w-full bg-[#060c18] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-medium placeholder:text-slate-600"
                          placeholder={`Full Name of Builder ${idx + 1} (as on Student ID)`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accommodation Request Option */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.accommodationRequested}
                      onChange={(e) => handleInputChange("accommodationRequested", e.target.checked)}
                      className="mt-1 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-700"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white flex items-center gap-2">
                        <BedDouble className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Request Campus Accommodation on 25th September night (Subject to availability & additional payment)</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Accommodation is <strong>not included</strong> in the ₹250 registration fee. Provided on 25th September night before the hackathon on request, subject to availability & additional payment.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Student ID Confirmation */}
                <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.hasValidStudentIds}
                      onChange={(e) => handleInputChange("hasValidStudentIds", e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                    />
                    <span>All team members have valid college / university student ID cards.</span>
                  </label>
                </div>

                {/* BIG WARNING DIRECTLY ABOVE SUBMIT BUTTON */}
                <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.2)] text-left">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-mono font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <span>IMPORTANT: ID Card Name Matching Rule</span>
                      </div>
                      <p className="text-slate-100 font-medium leading-relaxed">
                        Enter every team member&apos;s name <strong>exactly as printed on their Student ID Card</strong>. Any incorrect or mismatching information may result in rejection or disqualification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown & Submit Action */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left font-mono">
                    <div className="text-[11px] text-slate-400">Total Registration Fee (Due On-Spot):</div>
                    <div className="text-xl font-bold text-emerald-400">
                      ₹{totalPayable} <span className="text-xs font-normal text-slate-400">INR ({formData.teamSize} × ₹250)</span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold">
                      Payable on-spot at PMIST check-in desk
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Generating Pass...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Confirm Pre-Registration (₹{totalPayable} On-Spot)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: Real-time Live Holographic Digital NFC Badge Generator */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm">
              <div className="text-center mb-3 font-mono text-[11px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Live Delegate Badge Preview</span>
              </div>

              {/* Holographic NFC Lanyard Badge */}
              <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-500/80 via-slate-700/40 to-slate-900 shadow-2xl">
                {/* Lanyard Clip */}
                <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto mb-3 border border-slate-700 shadow-inner" />

                <div className="bg-[#080e1a] rounded-[2.2rem] p-6 border border-slate-800/80 shadow-2xl relative overflow-hidden text-left">
                  {/* Holographic Shimmer Highlight */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-radial-[circle_at_top_right,_rgba(255,255,255,0.08),_transparent_70%] pointer-events-none" />

                  {/* Badge Header with Tamil Logo */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="relative h-7 w-16">
                        <Image
                          src="/uran-logo.png"
                          alt="உரன் Logo"
                          fill
                          className="object-contain brightness-125"
                        />
                      </div>
                      <div>
                        <span className="font-display font-black text-sm text-white tracking-tight block">
                          URAN’26
                        </span>
                        <span className="text-[9px] text-sky-400 block font-mono">12H SINGLE-DAY HACKATHON</span>
                      </div>
                    </div>

                    <div className={cn(
                      "px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase",
                      isSuccess 
                        ? "bg-emerald-500 text-slate-950 shadow-md" 
                        : "bg-amber-400 text-slate-950"
                    )}>
                      {isSuccess ? "PASS ISSUED" : "ON-SPOT PAY"}
                    </div>
                  </div>

                  {/* Dynamic Team Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Team Name</div>
                      <div className="text-2xl font-display font-black text-white truncate">
                        {formData.teamName || "Team Name"}
                      </div>
                      <div className="text-xs font-mono text-slate-300">Lead: {formData.leaderName || "Lead Builder"}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[9px] font-mono uppercase text-slate-500">Squad Size</div>
                        <div className="font-bold text-slate-200">{formData.teamSize} Builders</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase text-slate-500">On-Spot Fee</div>
                        <div className="font-bold text-emerald-400">
                          ₹{formData.teamSize * 250} (Due at Check-in)
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="text-[9px] font-mono uppercase text-slate-500">Track Domain</div>
                      <div className="font-bold text-white text-xs truncate mt-0.5">{formData.preferredTrack}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        <span>Institution: <strong className="text-slate-300 truncate">{formData.college}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                      <span>Accommodation:</span>
                      <span className={formData.accommodationRequested ? "text-amber-300 font-bold" : "text-slate-500"}>
                        {formData.accommodationRequested ? "REQUESTED (25TH NIGHT • PAID)" : "NOT REQUIRED"}
                      </span>
                    </div>
                  </div>

                  {/* Footer Barcode & Real Scannable Verification QR */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="font-mono text-[9px] text-slate-500 space-y-0.5">
                      <div>VENUE: PMIST_THANJAVUR</div>
                      <div className={isSuccess ? "text-emerald-400 font-bold" : "text-amber-400"}>
                        STATUS: {isSuccess ? "VERIFIED_CONFIRMED" : "PRE_REGISTRATION_DRAFT"}
                      </div>
                      <div className="text-[8px] text-sky-400">SCAN TO VERIFY PMIST ACCREDITATION</div>
                    </div>
                    <div className="p-1 bg-white rounded-lg shadow-md flex-shrink-0">
                      {previewQrDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewQrDataUrl}
                          alt="Real QR Code"
                          className="w-10 h-10 object-contain rounded"
                        />
                      ) : (
                        <QrCode className="w-8 h-8 text-slate-950" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PMIST Department of Computer Applications</span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Delegate Badge Modal */}
      {registrationData && (
        <DelegateBadgeModal
          isOpen={isBadgeModalOpen}
          onClose={() => setIsBadgeModalOpen(false)}
          registration={registrationData}
        />
      )}
    </section>
  );
}
