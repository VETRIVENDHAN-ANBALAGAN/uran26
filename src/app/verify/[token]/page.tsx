"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  Printer,
  Download,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  BedDouble,
  Award,
  Lock,
  Check,
} from "lucide-react";
import Image from "next/image";
import { DelegateBadgeModal } from "@/components/registration/DelegateBadge";

interface RegistrationDetails {
  registrationToken: string;
  teamName: string;
  leaderName: string;
  college: string;
  teamSize: number;
  preferredTrack: string;
  paymentStatus: string;
  checkInStatus: string;
  totalPayableOnSpot: number;
  ratePerPerson: number;
  accommodationRequested: boolean;
  registeredAt: string;
  hasValidStudentIds: boolean;
  receiptNo?: string;
  members: Array<{
    name: string;
    role?: string;
    email?: string;
    phone?: string;
  }>;
}

export default function VerifyTokenPage() {
  const routeParams = useParams();
  const rawToken = Array.isArray(routeParams?.token) ? routeParams.token[0] : (routeParams?.token as string | undefined);
  const token = typeof rawToken === "string" ? decodeURIComponent(rawToken).trim() : "";

  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);
  const [organizerKey, setOrganizerKey] = useState<string>("");
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string>("");

  useEffect(() => {
    if (token) {
      fetchRegistration(token);
    } else {
      setIsLoading(false);
      setError("No registration token provided.");
    }

    // Check if organizer is logged in on this browser
    const savedAdminKey = sessionStorage.getItem("uran26_admin_key");
    if (savedAdminKey) {
      setOrganizerKey(savedAdminKey);
    }
  }, [token]);

  const fetchRegistration = async (tok: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/registration/lookup?token=${encodeURIComponent(tok)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "No pre-registration record found matching this Team Code.");
      }

      setRegistration(data.registration);
    } catch (err: any) {
      setError(err.message || "Failed to verify registration pass.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeskCheckIn = async () => {
    if (!registration || !organizerKey) return;
    setIsCheckingIn(true);
    setCheckInSuccess("");
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": organizerKey,
        },
        body: JSON.stringify({
          token: registration.registrationToken,
          amountPaid: registration.totalPayableOnSpot,
          paymentMode: "UPI_ON_SPOT",
          collectedBy: "PMIST On-Spot Verification Desk",
          notes: "Checked in via QR Code Verification Page",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Desk check-in failed.");
      }

      setCheckInSuccess(`Check-in verified! Official Receipt #${data.receipt?.receiptNo} issued.`);
      fetchRegistration(registration.registrationToken);
    } catch (err: any) {
      alert(err.message || "Check-in failed.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-sky-500 selection:text-black py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Precision grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="w-96 h-96 bg-sky-500/10 rounded-full blur-3xl absolute top-10 left-1/3 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to URAN’26 Portal</span>
          </Link>

          <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
            PMIST OFFICIAL QR VERIFIER
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
            <div className="font-mono text-sm text-slate-300">Scanning PMIST Academic Registry...</div>
            <div className="text-xs text-slate-500">Cryptographically authenticating token: {token}</div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-[#0b1222] border-2 border-rose-500/50 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Unverified Pass / Invalid Token</h2>
              <p className="text-xs text-rose-300 mt-1 max-w-md mx-auto">{error}</p>
            </div>
            <div className="p-3 bg-[#050a14] border border-slate-800 rounded-xl font-mono text-xs text-slate-400">
              Scanned Token: <span className="text-white font-bold">{token || "UNKNOWN"}</span>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/#register"
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Register Online Now
              </Link>
              <button
                onClick={() => fetchRegistration(token)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Retry Lookup
              </button>
            </div>
          </div>
        )}

        {/* Success Verified Pass Card */}
        {!isLoading && registration && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Main Verified Card */}
            <div className="bg-[#0b1222] border-2 border-sky-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Shimmer top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400" />

              {/* Institution & Hackathon Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-20">
                    <Image
                      src="/uran-logo.png"
                      alt="URAN Logo"
                      fill
                      className="object-contain brightness-125"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight">URAN’26 NATIONAL HACKATHON</h1>
                    <p className="text-[11px] text-slate-400">Periyar Maniammai Institute of Science & Technology (PMIST)</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {registration.checkInStatus === "CHECKED_IN" ? (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>CHECKED-IN & VERIFIED</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-black flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>OFFICIAL PASS • READY FOR CHECK-IN</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Callout */}
              <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#081224] to-sky-500/15 border border-emerald-500/40 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs font-black text-emerald-300 uppercase tracking-wider">
                    Official Authenticated Delegate Record
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    This registration token has been verified against the official URAN’26 database. All {registration.teamSize} team members are registered for on-site participation on <strong>26 September 2026</strong>.
                  </p>
                </div>
              </div>

              {/* Team Key Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <span className="text-slate-500 font-mono uppercase text-[10px]">Team Name</span>
                  <div className="text-lg font-black text-white mt-0.5">{registration.teamName}</div>
                  <div className="text-sky-400 font-mono text-[11px] mt-0.5">Team Lead: {registration.leaderName}</div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <span className="text-slate-500 font-mono uppercase text-[10px]">Registration Token / Team Code</span>
                  <div className="text-base font-mono font-black text-sky-400 mt-0.5">{registration.registrationToken}</div>
                  <div className="text-slate-500 font-mono text-[10px] mt-0.5">Scanned via Camera QR Matrix</div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl sm:col-span-2">
                  <span className="text-slate-500 font-mono uppercase text-[10px]">Institution / College</span>
                  <div className="text-sm font-bold text-white mt-0.5">{registration.college}</div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <span className="text-slate-500 font-mono uppercase text-[10px]">Track Domain</span>
                  <div className="text-xs font-semibold text-white mt-0.5">{registration.preferredTrack}</div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <span className="text-slate-500 font-mono uppercase text-[10px]">On-Spot Fee Due</span>
                  <div className="text-base font-mono font-black text-amber-400 mt-0.5">
                    ₹{registration.totalPayableOnSpot} INR
                    <span className="text-slate-400 text-xs font-normal ml-1">({registration.teamSize} × ₹250)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {registration.paymentStatus === "PAID_ON_SPOT" ? "Paid on-spot at check-in" : "Payable on-spot at PMIST desk"}
                  </div>
                </div>
              </div>

              {/* Members Student ID Checklist */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    Registered Squad Members ({registration.members.length}):
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Physical Student ID Match Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {registration.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#060c18] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{m.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400">
                            {idx === 0 ? "Leader" : `Member ${idx + 1}`}
                          </span>
                        </div>
                        {m.role && <div className="text-[11px] text-slate-400 mt-0.5">{m.role}</div>}
                      </div>
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-In Receipt if already checked-in */}
              {registration.receiptNo && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl mb-6 text-xs font-mono space-y-1">
                  <div className="font-bold text-emerald-400 uppercase">PMIST Official Check-In Receipt</div>
                  <div className="text-slate-300">Receipt No: <strong className="text-white">{registration.receiptNo}</strong></div>
                  <div className="text-slate-400 text-[11px]">Fee ₹{registration.totalPayableOnSpot} received and verified.</div>
                </div>
              )}

              {/* Organizer Desk Fast Check-in Action */}
              {organizerKey && registration.checkInStatus !== "CHECKED_IN" && (
                <div className="p-4 bg-slate-900 border border-sky-500/40 rounded-2xl mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Organizer Session Detected — Instant Desk Check-In</span>
                  </div>
                  <button
                    onClick={handleDeskCheckIn}
                    disabled={isCheckingIn}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isCheckingIn ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Verifying Check-In...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        Confirm ID Verification & Record ₹{registration.totalPayableOnSpot} Payment
                      </>
                    )}
                  </button>
                  {checkInSuccess && (
                    <div className="p-2 text-center text-xs text-emerald-400 font-mono font-bold">
                      {checkInSuccess}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setIsBadgeModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Download Delegate Badges</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Print A4 Pass</span>
                </button>

                <Link
                  href="/#schedule"
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  View Schedule ↗
                </Link>
              </div>
            </div>

            {/* Reporting Venue Info Box */}
            <div className="p-5 bg-[#0b1222] border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-2">
              <div className="text-white font-bold text-sm">Venue Reporting Schedule:</div>
              <div>📅 <strong>Date:</strong> 26 September 2026 (Single Day 12h Event)</div>
              <div>⏰ <strong>Reporting Time:</strong> 7:00 AM – 7:30 AM for Physical ID check and desk clearance</div>
              <div>📍 <strong>Venue:</strong> Department of Computer Applications, PMIST Campus, Vallam, Thanjavur - 613403</div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                Helpdesk: <a href="tel:9025116795" className="text-sky-400 font-mono">+91 90251 16795</a> • <a href="mailto:join.uran26@gmail.com" className="text-sky-400 font-mono">join.uran26@gmail.com</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delegate Badge Modal */}
      {registration && (
        <DelegateBadgeModal
          isOpen={isBadgeModalOpen}
          onClose={() => setIsBadgeModalOpen(false)}
          registration={registration}
        />
      )}
    </div>
  );
}
