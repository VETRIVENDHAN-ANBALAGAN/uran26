"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building,
  Phone,
  Mail,
  FileSpreadsheet,
  LogOut,
  KeyRound,
  BedDouble,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  Check,
  ChevronRight,
  Shield,
  Layers,
  Award,
  Wallet,
} from "lucide-react";
import { TeamRegistration, AdminStats, AuditLogRecord } from "@/lib/db/types";

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Dashboard Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string>("ALL");
  const [selectedCheckInStatus, setSelectedCheckInStatus] = useState<string>("ALL");

  // Selected Team for Inspection / Check-In Modal
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [checkInPaymentMode, setCheckInPaymentMode] = useState<"CASH" | "UPI_ON_SPOT">("UPI_ON_SPOT");
  const [collectedByName, setCollectedByName] = useState<string>("PMIST Check-in Desk");
  const [checkInNotes, setCheckInNotes] = useState<string>("");
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Desk Fast Scanner Token
  const [scanToken, setScanToken] = useState<string>("");
  const [scanResult, setScanResult] = useState<TeamRegistration | null>(null);
  const [scanError, setScanError] = useState<string>("");

  // Check saved admin key on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("uran26_admin_key");
    if (saved) {
      setAdminKey(saved);
      validateAndLoadData(saved);
    }
  }, []);

  const validateAndLoadData = async (key: string) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const [statsRes, teamsRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { "x-admin-key": key } }),
        fetch("/api/admin/teams", { headers: { "x-admin-key": key } }),
      ]);

      if (statsRes.status === 401 || teamsRes.status === 401) {
        throw new Error("Invalid Organizer Passcode. Access denied.");
      }

      const statsData = await statsRes.json();
      const teamsData = await teamsRes.json();

      if (statsData.success && teamsData.success) {
        setStats(statsData.stats);
        setTeams(teamsData.teams);
        setIsAuthenticated(true);
        sessionStorage.setItem("uran26_admin_key", key);
      } else {
        throw new Error(statsData.error || teamsData.error || "Failed to load telemetry.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to connect to organizer console.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setAdminKey(inputKey.trim());
    validateAndLoadData(inputKey.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("uran26_admin_key");
    setAdminKey("");
    setIsAuthenticated(false);
    setStats(null);
    setTeams([]);
  };

  const refreshData = () => {
    if (adminKey) {
      validateAndLoadData(adminKey);
    }
  };

  // Perform fast on-spot check-in
  const executeCheckIn = async (team: TeamRegistration) => {
    setIsCheckingIn(true);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          token: team.registrationToken,
          amountPaid: team.totalPayableOnSpot,
          paymentMode: checkInPaymentMode,
          collectedBy: collectedByName,
          notes: checkInNotes,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Check-in failed.");
      }

      setActionMessage({
        type: "success",
        text: `Team "${team.teamName}" verified! Receipt #${data.receipt?.receiptNo} issued. Fee ₹${team.totalPayableOnSpot} received.`,
      });

      // Update local states
      setIsCheckInModalOpen(false);
      refreshData();
      if (scanResult && scanResult.registrationToken === team.registrationToken) {
        setScanResult(data.team);
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Check-in failed." });
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Quick lookup at check-in desk
  const handleScanLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setScanError("");
    setScanResult(null);

    const query = scanToken.trim().toLowerCase();
    if (!query) return;

    const matched = teams.find(
      (t) =>
        t.registrationToken.toLowerCase() === query ||
        t.registrationToken.toLowerCase().includes(query) ||
        t.leaderPhone.replace(/\D/g, "").includes(query.replace(/\D/g, "")) ||
        t.teamName.toLowerCase().includes(query)
    );

    if (matched) {
      setScanResult(matched);
    } else {
      setScanError(`No registration found matching "${scanToken}". Check digits or Team Code.`);
    }
  };

  // Filtered roster list
  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.teamName.toLowerCase().includes(q) ||
      t.leaderName.toLowerCase().includes(q) ||
      t.leaderPhone.includes(q) ||
      t.leaderEmail.toLowerCase().includes(q) ||
      t.college.toLowerCase().includes(q) ||
      t.registrationToken.toLowerCase().includes(q);

    const matchesTrack = selectedTrack === "ALL" || t.preferredTrack.includes(selectedTrack);
    const matchesCheckIn = selectedCheckInStatus === "ALL" || t.checkInStatus === selectedCheckInStatus;

    return matchesSearch && matchesTrack && matchesCheckIn;
  });

  // Export CSV
  const handleExportCsv = () => {
    window.open(`/api/admin/export?adminKey=${encodeURIComponent(adminKey)}`, "_blank");
  };

  // ------------------- LOGIN SCREEN ------------------- //
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#040813] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
        {/* Background glow & grid */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="w-96 h-96 bg-sky-500/10 rounded-full blur-3xl absolute top-1/4 left-1/4 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-semibold mb-4">
              <Shield className="w-3.5 h-3.5" />
              PMIST ORGANIZING COMMITTEE
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">URAN’26 Command Center</h1>
            <p className="text-sm text-slate-400">Department of Computer Applications • Administrative & Desk Portal</p>
          </div>

          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  Organizer Access Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Enter PMIST organizer key..."
                    className="w-full bg-[#060c18] border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors font-mono placeholder:text-slate-600"
                    autoFocus
                  />
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Default dev key: <code className="text-sky-400 font-mono">uran26_pmist_organizer_secret_key</code>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Console
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
                ← Return to URAN’26 Public Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- AUTHENTICATED COMMAND CENTER ------------------- //
  return (
    <div className="min-h-screen bg-[#040813] text-white font-sans selection:bg-sky-500 selection:text-black">
      {/* Top HUD Navigation */}
      <header className="sticky top-0 z-30 bg-[#070e1e]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-black">
              U26
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">URAN’26 ORGANIZER COMMAND</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  LIVE DESK ACTIVE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Department of Computer Applications • PMIST Campus</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-400" : ""}`} />
              Refresh
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-xs text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Roster
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              Public Site ↗
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-400 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Banner Alert if any action happened */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
              actionMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs opacity-70 hover:opacity-100 font-mono"
            >
              ✕ DISMISS
            </button>
          </div>
        )}

        {/* Telemetry Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Total Teams */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Pre-Registered Teams</div>
              <div className="text-3xl font-black text-white">{stats.totalTeams}</div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>{stats.totalParticipants} total builders</span>
              </div>
              <div className="absolute right-3 top-3 w-12 h-12 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Check-In Progress */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Physical Check-Ins</div>
              <div className="text-3xl font-black text-emerald-400">
                {stats.checkedInTeams} <span className="text-sm font-semibold text-slate-400">/ {stats.totalTeams}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{stats.checkedInParticipants} builders verified</span>
              </div>
            </div>

            {/* Fees Collected On-Spot */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Revenue Collected</div>
              <div className="text-3xl font-black text-amber-400">₹{stats.totalRevenueCollected.toLocaleString()}</div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>₹{stats.totalRevenueProjected.toLocaleString()} projected</span>
              </div>
            </div>

            {/* Accommodation Requests */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Accommodation (25th)</div>
              <div className="text-3xl font-black text-indigo-400">{stats.accommodationRequestsCount}</div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-indigo-400" />
                <span>Night stay requested</span>
              </div>
            </div>

            {/* Pending Desk Check-ins */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 relative overflow-hidden col-span-2 md:col-span-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Pending Check-Ins</div>
              <div className="text-3xl font-black text-slate-300">{stats.pendingCheckIns}</div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Yet to report at PMIST</span>
              </div>
            </div>
          </div>
        )}

        {/* ON-SPOT RAPID CHECK-IN DESK TERMINAL */}
        <div className="bg-gradient-to-r from-[#0b1428] via-[#091020] to-[#0b1428] border-2 border-sky-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                VENUE DESK • RAPID VERIFICATION ENGINE
              </div>
              <h2 className="text-xl font-black text-white">On-Spot Check-In & Student ID Verification</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Type Team Code (e.g. <code className="text-sky-300 font-mono">URAN26-TEAM-...</code>) or Leader Mobile to instantly verify physical IDs and collect ₹250/participant.
              </p>
            </div>

            {/* Fast Scanner Bar */}
            <form onSubmit={handleScanLookup} className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={scanToken}
                  onChange={(e) => setScanToken(e.target.value)}
                  placeholder="Enter Team Code or Mobile..."
                  className="w-full bg-[#050b16] border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white font-mono focus:outline-none focus:border-sky-400 placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                Scan Team
              </button>
            </form>
          </div>

          {scanError && (
            <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Quick Desk Matched Result Card */}
          {scanResult && (
            <div className="bg-[#060c18] border border-sky-500/50 rounded-xl p-5 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white">{scanResult.teamName}</span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                      {scanResult.registrationToken}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        scanResult.checkInStatus === "CHECKED_IN"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {scanResult.checkInStatus === "CHECKED_IN" ? "✓ CHECKED IN" : "⏳ PENDING CHECK-IN"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Leader: <strong className="text-white">{scanResult.leaderName}</strong> ({scanResult.leaderPhone}) • {scanResult.college}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {scanResult.checkInStatus !== "CHECKED_IN" ? (
                    <button
                      onClick={() => {
                        setSelectedTeam(scanResult);
                        setIsCheckInModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Verify IDs & Collect ₹{scanResult.totalPayableOnSpot}
                    </button>
                  ) : (
                    <div className="text-right">
                      <div className="text-xs font-mono text-emerald-400 font-bold">PAID ON-SPOT & VERIFIED</div>
                      <div className="text-[11px] text-slate-400">Receipt: {scanResult.paymentReceipt?.receiptNo}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Members Student ID Checklist */}
              <div className="pt-4">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Mandatory Student ID Match Verification (Physical Cards Required):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {scanResult.members?.map((m, idx) => (
                    <div key={idx} className="bg-[#0b1222] border border-slate-800 rounded-lg p-3 text-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{m.name}</span>
                        <span className="text-[10px] text-sky-400 font-mono">{idx === 0 ? "LEADER" : `MEMBER ${idx + 1}`}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">ID Card match check</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TEAMS REGISTRATION ROSTER & CONTROLS */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                Delegate Registration Roster ({filteredTeams.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full directory of all pre-registered collegiate teams for URAN’26.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, leader, token..."
                  className="w-full bg-[#060c18] border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Track filter */}
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="bg-[#060c18] border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">All Tracks</option>
                <option value="EdTech">01 EdTech</option>
                <option value="AgriTech">02 AgriTech</option>
                <option value="FinTech">03 FinTech</option>
                <option value="CyberTech">04 CyberTech</option>
                <option value="HealthTech">05 HealthTech</option>
              </select>

              {/* Status filter */}
              <select
                value={selectedCheckInStatus}
                onChange={(e) => setSelectedCheckInStatus(e.target.value)}
                className="bg-[#060c18] border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">All Check-In Status</option>
                <option value="NOT_CHECKED_IN">Pending Check-In</option>
                <option value="CHECKED_IN">Checked-In</option>
                <option value="DISQUALIFIED">Disqualified</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#08101e] text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Team Code / Team</th>
                  <th className="py-3 px-4">Leader & Contact</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Squad</th>
                  <th className="py-3 px-4">Accomm.</th>
                  <th className="py-3 px-4">Payable</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#060c18]">
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                      No registrations found matching the current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Code & Team */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{team.teamName}</div>
                        <div className="font-mono text-[10px] text-sky-400">{team.registrationToken}</div>
                      </td>

                      {/* Leader & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">{team.leaderName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {team.leaderPhone}
                        </div>
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 max-w-[180px] truncate" title={team.college}>
                        {team.college}
                      </td>

                      {/* Track */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {team.preferredTrack.slice(0, 12)}...
                        </span>
                      </td>

                      {/* Squad Size */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {team.teamSize} <span className="text-slate-500 font-normal">ppl</span>
                      </td>

                      {/* Accommodation */}
                      <td className="py-3.5 px-4">
                        {team.accommodationRequested ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            <BedDouble className="w-3 h-3" />
                            25th Night
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-600">None</span>
                        )}
                      </td>

                      {/* Payable */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        ₹{team.totalPayableOnSpot}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            team.checkInStatus === "CHECKED_IN"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : team.checkInStatus === "DISQUALIFIED"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {team.checkInStatus === "CHECKED_IN" ? "CHECKED IN" : team.checkInStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedTeam(team)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Inspect Team & Squad"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {team.checkInStatus !== "CHECKED_IN" && (
                            <button
                              onClick={() => {
                                setSelectedTeam(team);
                                setIsCheckInModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Check-In
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: TEAM DETAIL & SQUAD ID INSPECTION DRAWER */}
      {selectedTeam && !isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">Squad Dossier</span>
                <h3 className="text-xl font-black text-white">{selectedTeam.teamName}</h3>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <div className="text-slate-400">Team Code</div>
                  <div className="font-mono font-bold text-sky-400 mt-0.5">{selectedTeam.registrationToken}</div>
                </div>
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <div className="text-slate-400">Fee Due On-Spot</div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">₹{selectedTeam.totalPayableOnSpot}</div>
                </div>
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <div className="text-slate-400">Track</div>
                  <div className="font-semibold text-white mt-0.5 truncate">{selectedTeam.preferredTrack}</div>
                </div>
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl col-span-2">
                  <div className="text-slate-400">College / Institution</div>
                  <div className="font-medium text-white mt-0.5">{selectedTeam.college}</div>
                </div>
                <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl">
                  <div className="text-slate-400">Accommodation</div>
                  <div className="font-medium text-white mt-0.5">
                    {selectedTeam.accommodationRequested ? "Yes (25th Sept Night)" : "No"}
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div>
                <div className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  Registered Squad Builders ({selectedTeam.members?.length || selectedTeam.teamSize}):
                </div>
                <div className="space-y-2">
                  {selectedTeam.members?.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#060c18] border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{m.name}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-400">
                            {idx === 0 ? "Leader" : `Member ${idx + 1}`}
                          </span>
                        </div>
                        {m.email && <div className="text-[11px] text-slate-400 font-mono mt-0.5">{m.email}</div>}
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Physical ID Card Required
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-in Receipt Details if already checked in */}
              {selectedTeam.paymentReceipt && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-emerald-400 uppercase font-mono">Official Check-In Receipt</div>
                  <div className="text-slate-300">Receipt No: <strong className="font-mono text-white">{selectedTeam.paymentReceipt.receiptNo}</strong></div>
                  <div className="text-slate-300">Paid: <strong className="text-white">₹{selectedTeam.paymentReceipt.amountPaid} via {selectedTeam.paymentReceipt.paymentMode}</strong></div>
                  <div className="text-slate-300">Timestamp: <span className="font-mono text-white">{selectedTeam.paymentReceipt.paidAt}</span></div>
                  <div className="text-slate-400 text-[11px]">Desk Officer: {selectedTeam.paymentReceipt.collectedBy}</div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedTeam.checkInStatus !== "CHECKED_IN" && (
                <button
                  onClick={() => setIsCheckInModalOpen(true)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Proceed to Check-In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RAPID CHECK-IN & ON-SPOT PAYMENT COLLECTION MODAL */}
      {selectedTeam && isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1222] border-2 border-emerald-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Desk Check-In & Clearance</h3>
                  <p className="text-xs text-slate-400">Team: {selectedTeam.teamName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-4">
              {/* Fee Notice */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                <div className="text-xs text-amber-300 uppercase font-mono tracking-wider font-bold">
                  ₹250 / Builder • Total Due On-Spot
                </div>
                <div className="text-3xl font-black text-white mt-1">
                  ₹{selectedTeam.totalPayableOnSpot} INR
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  ({selectedTeam.teamSize} verified builders present with Student IDs)
                </div>
              </div>

              {/* ID Confirmation checkbox reminder */}
              <div className="p-3 bg-[#060c18] border border-slate-800 rounded-xl text-xs text-slate-300">
                <div className="font-bold text-white mb-1">Physical ID Clearance Check:</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Confirm you have physically inspected college identity cards for all {selectedTeam.members?.length || selectedTeam.teamSize} members:
                </p>
                <div className="mt-2 space-y-1">
                  {selectedTeam.members?.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                      <span className="text-white font-medium">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  Payment Collection Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckInPaymentMode("UPI_ON_SPOT")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      checkInPaymentMode === "UPI_ON_SPOT"
                        ? "bg-sky-500/20 border-sky-500 text-sky-400 shadow-md"
                        : "bg-[#060c18] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    UPI QR (On-Spot)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckInPaymentMode("CASH")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      checkInPaymentMode === "CASH"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md"
                        : "bg-[#060c18] border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    Cash (Desk Counter)
                  </button>
                </div>
              </div>

              {/* Desk Officer Name */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">
                  Desk Officer Name / Station
                </label>
                <input
                  type="text"
                  value={collectedByName}
                  onChange={(e) => setCollectedByName(e.target.value)}
                  className="w-full bg-[#060c18] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCheckInModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeCheckIn(selectedTeam)}
                disabled={isCheckingIn}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCheckingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    Confirm & Issue Receipt
                    <Check className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
