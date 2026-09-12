"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Printer,
  Download,
  Check,
  CheckCheck,
  Copy,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Users,
  Building,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  ArrowRight,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import { generateQrDataUrl, getVerificationUrl } from "@/lib/qrcode";

export interface DelegateBadgeData {
  registrationToken: string;
  teamName: string;
  leaderName: string;
  leaderEmail?: string;
  leaderPhone?: string;
  college: string;
  teamSize: number;
  preferredTrack: string;
  totalPayableOnSpot: number;
  ratePerPerson?: number;
  paymentStatus?: string;
  checkInStatus?: string;
  accommodationRequested?: boolean;
  registeredAt?: string;
  receiptNo?: string;
  members?: Array<{
    name: string;
    role?: string;
    email?: string;
    phone?: string;
  }>;
}

interface DelegateBadgeProps {
  registration: DelegateBadgeData;
  initialMemberIndex?: number;
  compact?: boolean;
  onClose?: () => void;
}

export function DelegateBadge({
  registration,
  initialMemberIndex = 0,
  compact = false,
  onClose,
}: DelegateBadgeProps) {
  const [activeTab, setActiveTab] = useState<"BADGE" | "PASS">("BADGE");
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(initialMemberIndex);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [verificationUrl, setVerificationUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const badgeCardRef = useRef<HTMLDivElement>(null);

  // Normalize members list
  const membersList =
    registration.members && registration.members.length > 0
      ? registration.members
      : [
          { name: registration.leaderName, role: "Team Leader" },
          ...Array.from({ length: Math.max(0, registration.teamSize - 1) }).map((_, i) => ({
            name: `Squad Member ${i + 2}`,
            role: `Builder ${i + 2}`,
          })),
        ];

  const currentMember = membersList[selectedMemberIdx] || membersList[0];
  const isLeader = selectedMemberIdx === 0 || currentMember.role?.toLowerCase().includes("leader");

  // Generate real, verifiable QR code pointing to /verify/[token]
  useEffect(() => {
    const url = getVerificationUrl(registration.registrationToken);
    setVerificationUrl(url);

    generateQrDataUrl(url, {
      width: 500,
      margin: 1,
      darkColor: "#050b14",
      lightColor: "#ffffff",
    }).then((data) => {
      setQrDataUrl(data);
    });
  }, [registration.registrationToken]);

  const copyVerificationLink = () => {
    if (!verificationUrl) return;
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Client-side HTML5 Canvas Delegate Badge Exporter
  const handleDownloadBadgeImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D canvas context");

      // Set high-res dimensions (1200 x 1800 px — 3:4 badge ratio at 300 DPI)
      const width = 1200;
      const height = 1800;
      canvas.width = width;
      canvas.height = height;

      // 1. Draw Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#050b16");
      bgGrad.addColorStop(0.5, "#0a1324");
      bgGrad.addColorStop(1, "#030712");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Outer Border with Rounded Rectangle
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Inner subtle border
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // 3. Top Lanyard Cutout Slot
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 140, 56, 280, 28, 14);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#334155";
      ctx.stroke();

      // 4. Header Section: Institution & Event
      ctx.textAlign = "center";
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY (PMIST)", width / 2, 140);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.fillText("DEPARTMENT OF COMPUTER APPLICATIONS • THANJAVUR", width / 2, 180);

      // Main Event Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 78px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("URAN’26", width / 2, 270);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 24px 'Courier New', monospace";
      ctx.fillText("12-HOUR NATIONAL-LEVEL INTER-COLLEGIATE HACKATHON", width / 2, 315);

      // Event Date Tag
      ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 260, 345, 520, 48, 24);
      ctx.fill();
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#e0f2fe";
      ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("SATURDAY, 26 SEPTEMBER 2026", width / 2, 377);

      // 5. Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 420);
      ctx.lineTo(width - 80, 420);
      ctx.stroke();

      // 6. Delegate Role Pill
      const roleText = (currentMember.role || (isLeader ? "TEAM LEADER" : "SQUAD BUILDER")).toUpperCase();
      ctx.fillStyle = isLeader ? "#10b981" : "#0284c7";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 180, 455, 360, 52, 26);
      ctx.fill();

      ctx.fillStyle = "#020617";
      ctx.font = "900 24px 'Courier New', monospace";
      ctx.fillText(`★  ${roleText}  ★`, width / 2, 490);

      // 7. Delegate Name (Prominent Typography)
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 68px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(currentMember.name, width / 2, 595);

      // Team Name & Token
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(`Team: "${registration.teamName}"`, width / 2, 650);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 32px 'Courier New', monospace";
      ctx.fillText(registration.registrationToken, width / 2, 700);

      // 8. Info Card (College & Track)
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.beginPath();
      ctx.roundRect(100, 740, width - 200, 160, 20);
      ctx.fill();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 20px 'Courier New', monospace";
      ctx.fillText("COLLEGE / INSTITUTION", width / 2, 780);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(registration.college, width / 2, 820);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(`Track: ${registration.preferredTrack}`, width / 2, 865);

      // 9. QR Code Section (Centerpiece with Scannable Border)
      const qrBoxSize = 420;
      const qrBoxX = width / 2 - qrBoxSize / 2;
      const qrBoxY = 940;

      // White QR Background Card for high contrast
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(qrBoxX - 24, qrBoxY - 24, qrBoxSize + 48, qrBoxSize + 48, 28);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Draw QR Image onto Canvas
      if (qrDataUrl) {
        const qrImage = new window.Image();
        qrImage.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImage.onload = resolve;
          qrImage.onerror = resolve;
        });
        ctx.drawImage(qrImage, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      }

      // QR Verification Instruction
      ctx.fillStyle = "#020617";
      ctx.font = "900 16px 'Courier New', monospace";
      ctx.fillText("SCAN WITH PHONE CAMERA TO VERIFY", width / 2, qrBoxY + qrBoxSize + 14);

      // 10. Fee & Reporting Footer
      ctx.fillStyle = "#94a3b8";
      ctx.font = "22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(`Squad Size: ${registration.teamSize} Builders  •  Fee: ₹${registration.totalPayableOnSpot} On-Spot (₹250/person)`, width / 2, 1490);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.fillText("REPORTING: 26 SEPT 2026 @ 07:00 AM • PMIST CAMPUS", width / 2, 1530);

      // 11. Security Authentication Strip
      ctx.fillStyle = "rgba(56, 189, 248, 0.1)";
      ctx.beginPath();
      ctx.roundRect(80, 1580, width - 160, 110, 20);
      ctx.fill();
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "900 24px 'Courier New', monospace";
      ctx.fillText("OFFICIAL PMIST ACCREDITED HACKATHON PASS", width / 2, 1625);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Mandatory: Present this pass with College Student ID at the Venue Check-in Counter.", width / 2, 1660);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        const cleanName = currentMember.name.replace(/[^a-zA-Z0-9]/g, "_");
        const cleanTeam = registration.teamName.replace(/[^a-zA-Z0-9]/g, "_");
        link.download = `URAN26_Delegate_Badge_${cleanTeam}_${cleanName}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, "image/png");
    } catch (err) {
      console.error("Failed to generate badge PNG:", err);
      alert("Failed to render badge image. You can use 'Print Badge' instead.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full text-white font-sans">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 print:hidden">
        {/* View Switcher: Badge vs Full Pass */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab("BADGE")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "BADGE"
                ? "bg-sky-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Delegate Badge (Lanyard)
          </button>
          <button
            onClick={() => setActiveTab("PASS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "PASS"
                ? "bg-sky-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            A4 Venue Pass (Check-in)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={copyVerificationLink}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy Public Verification Link"
          >
            {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Verify Link"}</span>
          </button>

          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Live Online Verification Page"
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>Test QR Link</span>
          </a>

          <button
            onClick={handleDownloadBadgeImage}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isDownloading ? "Generating PNG..." : "Download Badge (PNG)"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Member Selector Pill Tabs (Active in BADGE view) */}
      {activeTab === "BADGE" && (
        <div className="mb-6 print:hidden">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Select Squad Builder Badge to View / Download:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {membersList.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMemberIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedMemberIdx === idx
                    ? "bg-sky-500/20 border-sky-400 text-white shadow-md shadow-sky-500/10"
                    : "bg-[#0b1222] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    idx === 0 ? "bg-emerald-400" : "bg-sky-400"
                  }`}
                />
                <span className="truncate max-w-[130px]">{m.name}</span>
                <span className="font-mono text-[10px] opacity-70">
                  {idx === 0 ? "LEAD" : `#${idx + 1}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIEW 1: LANYARD DELEGATE BADGE ================= */}
      {activeTab === "BADGE" && (
        <div className="flex justify-center">
          <div
            ref={badgeCardRef}
            id="printable-delegate-badge"
            className="w-full max-w-sm rounded-[2.8rem] p-1 bg-gradient-to-b from-sky-400/80 via-slate-600/40 to-slate-900 shadow-2xl relative overflow-hidden"
          >
            {/* Lanyard Top Hanging Slot */}
            <div className="w-20 h-3.5 bg-slate-950 rounded-full mx-auto my-3 border border-slate-700 shadow-inner flex items-center justify-center">
              <span className="w-8 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Main Badge Body */}
            <div className="bg-[#070e1c] rounded-[2.5rem] p-6 sm:p-7 border border-slate-800/80 shadow-2xl relative text-left overflow-hidden">
              {/* Holographic Specular Highlight */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-radial-[circle_at_top_right,_rgba(56,189,248,0.15),_transparent_70%] pointer-events-none" />

              {/* Institution Header */}
              <div className="text-center pb-4 border-b border-slate-800/80 mb-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="relative h-8 w-16">
                    <Image
                      src="/uran-logo.png"
                      alt="URAN Logo"
                      fill
                      className="object-contain brightness-125"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-display font-black text-sm text-white tracking-tight leading-none">
                      URAN’26
                    </div>
                    <div className="text-[9px] text-sky-400 font-mono tracking-wider">
                      NATIONAL HACKATHON
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-300">
                  Periyar Maniammai Institute of Science & Technology
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Department of Computer Applications • Thanjavur
                </div>
              </div>

              {/* Role Indicator Banner */}
              <div className="flex justify-center mb-5">
                <span
                  className={`px-4 py-1 rounded-full font-mono text-[11px] font-black uppercase tracking-wider shadow-md ${
                    isLeader
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20"
                      : "bg-sky-400 text-slate-950 shadow-sky-400/20"
                  }`}
                >
                  ★ {currentMember.role || (isLeader ? "Team Leader" : "Squad Builder")} ★
                </span>
              </div>

              {/* Delegate Name */}
              <div className="text-center mb-5">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                  OFFICIAL DELEGATE
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight tracking-tight">
                  {currentMember.name}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Team: <strong className="text-sky-300">{registration.teamName}</strong>
                </div>
              </div>

              {/* Token Pill */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center mb-5 font-mono">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                  REGISTRATION TOKEN / ID
                </div>
                <div className="text-sm font-black text-sky-400 tracking-wider mt-0.5">
                  {registration.registrationToken}
                </div>
              </div>

              {/* College & Track Info */}
              <div className="space-y-2.5 mb-5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-[9px] font-mono text-slate-500 uppercase">Institution</div>
                  <div className="font-bold text-slate-200 mt-0.5 leading-snug line-clamp-2">
                    {registration.college}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="text-[9px] font-mono text-slate-500 uppercase">Track Domain</div>
                  <div className="font-semibold text-amber-300 mt-0.5 truncate">
                    {registration.preferredTrack}
                  </div>
                </div>
              </div>

              {/* Real Verifiable QR Code Centerpiece */}
              <div className="bg-white rounded-2xl p-3.5 mb-4 shadow-xl text-center border-2 border-sky-400/80">
                <div className="flex justify-center">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt={`Verify Pass for ${registration.registrationToken}`}
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-lg">
                      <QrCode className="w-12 h-12 text-slate-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-900 font-black tracking-wider uppercase mt-2">
                  Scan to Verify PMIST Credentials
                </div>
              </div>

              {/* Event Date & Security Footer */}
              <div className="pt-3 border-t border-slate-800/80 text-center space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 font-bold">
                  26 SEPTEMBER 2026 • 07:00 AM REPORTING
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  PRESENT WITH VALID COLLEGE ID CARD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: FULL A4 VENUE PASS ================= */}
      {activeTab === "PASS" && (
        <div className="max-w-2xl mx-auto">
          <div
            id="printable-registration-pass"
            className="bg-[#0b1222] border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left print:border-black print:bg-white print:text-black"
          >
            {/* Header with PMIST and URAN Logo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-black">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-20">
                  <Image
                    src="/uran-logo.png"
                    alt="URAN Logo"
                    fill
                    className="object-contain brightness-125 print:filter-none"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white print:text-black">
                    URAN’26 NATIONAL HACKATHON
                  </h1>
                  <p className="text-[11px] text-slate-400 print:text-slate-600">
                    Department of Computer Applications • PMIST Campus, Thanjavur
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-sky-400 print:text-black font-bold">OFFICIAL CHECK-IN PASS</div>
                <div className="text-slate-400 print:text-slate-600 text-[11px]">Single-Day 12h Event</div>
              </div>
            </div>

            {/* Official Registration Details Grid */}
            <div className="py-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl print:border-slate-300 print:bg-slate-50">
                  <span className="text-slate-500 print:text-slate-600 font-mono uppercase text-[10px]">Team Name</span>
                  <div className="text-base font-black text-white print:text-black mt-0.5">{registration.teamName}</div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl print:border-slate-300 print:bg-slate-50">
                  <span className="text-slate-500 print:text-slate-600 font-mono uppercase text-[10px]">Team Code / Token</span>
                  <div className="text-base font-mono font-black text-sky-400 print:text-black mt-0.5">
                    {registration.registrationToken}
                  </div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl print:border-slate-300 print:bg-slate-50">
                  <span className="text-slate-500 print:text-slate-600 font-mono uppercase text-[10px]">Fee Due On-Spot</span>
                  <div className="text-base font-mono font-black text-amber-400 print:text-black mt-0.5">
                    ₹{registration.totalPayableOnSpot} INR
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#060c18] border border-slate-800 rounded-xl print:border-slate-300 print:bg-slate-50">
                <span className="text-slate-500 print:text-slate-600 font-mono uppercase text-[10px]">College / University</span>
                <div className="text-sm font-bold text-white print:text-black mt-0.5">{registration.college}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl print:border-slate-300 print:bg-slate-50">
                  <span className="text-slate-500 print:text-slate-600 font-mono uppercase text-[10px]">Track Domain</span>
                  <div className="font-semibold text-white print:text-black mt-0.5">{registration.preferredTrack}</div>
                </div>

                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl print:border-slate-300 print:bg-slate-50">
                  <span className="text-slate-500 print:text-slate-600 font-mono uppercase text-[10px]">Reporting Date & Time</span>
                  <div className="font-semibold text-white print:text-black mt-0.5">26 Sept 2026 @ 07:00 AM</div>
                </div>
              </div>

              {/* Members Table */}
              <div className="pt-2">
                <div className="font-mono text-xs text-slate-300 print:text-black font-bold uppercase tracking-wider mb-2">
                  Registered Squad Builders ({membersList.length}):
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-800 print:border-slate-400">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 print:bg-slate-200 text-[10px] font-mono uppercase text-slate-400 print:text-black">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Builder Name</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3 text-right">Physical ID Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-slate-300 bg-[#060c18] print:bg-white">
                      {membersList.map((m, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-mono text-slate-500 print:text-black">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-white print:text-black">{m.name}</td>
                          <td className="py-2.5 px-3 font-mono text-sky-400 print:text-slate-700">
                            {idx === 0 ? "Team Leader" : m.role || `Builder ${idx + 1}`}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[11px] text-amber-400 print:text-black">
                            [ &nbsp; ] Verified
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scannable Verification Footer */}
              <div className="pt-4 border-t border-slate-800 print:border-slate-400 flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white print:text-black">Venue Desk Verification Seal</div>
                  <div className="text-[11px] text-slate-400 print:text-slate-600 leading-relaxed">
                    Present this printed pass along with physical Student ID cards at the PMIST registration desk.
                  </div>
                  <div className="font-mono text-[10px] text-sky-400 print:text-slate-800">
                    Verify Online: {verificationUrl}
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl shadow-md flex-shrink-0">
                  {qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="Verify Pass QR" className="w-24 h-24 object-contain" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DelegateBadgeModal({
  isOpen,
  onClose,
  registration,
}: {
  isOpen: boolean;
  onClose: () => void;
  registration: DelegateBadgeData;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b1222] border-2 border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <DelegateBadge registration={registration} onClose={onClose} />
      </div>
    </div>
  );
}
