"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  AlertCircle, 
  Users, 
  Trophy, 
  ShieldAlert, 
  KeyRound,
  FileSpreadsheet,
  BadgeCheck,
  Code2,
  CheckCircle,
  BedDouble,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const journeyStages = [
  {
    step: "01",
    title: "Online Pre-Registration",
    badge: "MANDATORY ONLINE",
    badgeColor: "bg-sky-500/15 text-sky-300 border-sky-400/30",
    desc: "Form your squad of 3 to 5 builders, select your preferred track domain, and enter every member's name exactly as printed on their Student ID card.",
    icon: FileSpreadsheet,
  },
  {
    step: "02",
    title: "Receive Team Code",
    badge: "INSTANT PASS",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    desc: "Get an instant verifiable digital pass with your unique Team Code (URAN26-REG-XXXX) dispatched to your email. Save this code for check-in.",
    icon: KeyRound,
  },
  {
    step: "03",
    title: "On-Site ID Verification",
    badge: "AT PMIST DESK",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    desc: "Arrive at PMIST Campus with all squad members present. Present your Team Code and physical Student ID Cards to pass identity verification.",
    icon: BadgeCheck,
  },
  {
    step: "04",
    title: "Pay On-Spot & Sprint",
    badge: "₹250 / BUILDER",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    desc: "Pay the ₹250 registration fee on-spot at the desk, collect delegate kits, unlock computing lab workstations, and begin your build sprint.",
    icon: Code2,
  },
  {
    step: "05",
    title: "Stage Pitch & Honors",
    badge: "GRAND FINALE",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    desc: "Submit your code at 5:00 PM sharp, pitch your prototype before academic and industry judges, and compete for trophies and track honors.",
    icon: Trophy,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>The Builder&apos;s Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-3">
            How URAN’26 Works
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            The complete 5-stage lifecycle from online team registration to on-spot desk verification, sprint build, and final stage pitch.
          </p>
        </div>

        {/* 5-Stage Journey Grid with Connected Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative mb-10">
          {journeyStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group text-left relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl font-display font-black text-slate-500 group-hover:text-sky-400 transition-colors">
                      {stage.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className={cn(
                    "text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border inline-block mb-2",
                    stage.badgeColor
                  )}>
                    {stage.badge}
                  </span>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                {idx < 4 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-slate-700">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 6-Step Fast Verification Pipeline Strip */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center mb-12">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
            The Crystal-Clear 6-Step Verification &amp; Entry Pipeline
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 font-bold border border-slate-800">1. Register Online</span>
            <span className="text-slate-600">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-sky-300 font-bold border border-slate-800">2. Get Team Code</span>
            <span className="text-slate-600">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 font-bold border border-slate-800">3. Arrive at PMIST</span>
            <span className="text-slate-600">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 font-bold border border-slate-800">4. Show Code + IDs</span>
            <span className="text-slate-600">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-300 font-bold border border-slate-800">5. Verify &amp; Pay ₹250</span>
            <span className="text-slate-600">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">6. Enter Hackathon</span>
          </div>
        </div>

        {/* DEDICATED RULEBOOK: Team Registration & On-Site Verification */}
        <div className="rounded-3xl bg-[#080e1a] border-2 border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left">
          {/* Ambient header glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandatory Rulebook</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                  Team Registration &amp; Verification Rules
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                  Strict guidelines to ensure seamless on-site check-in at PMIST without verification bottlenecks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>₹250 On-Spot Pay</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>25th Night Stay (Paid)</span>
                </span>
              </div>
            </div>

            {/* 3 Core Rule Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              
              {/* Rule 1: Exact Name Match */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/40 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    1. Exact ID Card Name Match
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Enter every team member&apos;s name <strong>exactly as printed on their College/University Student ID Card</strong>. Any mismatching or proxy information may result in rejection or disqualification during desk verification.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                  Zero tolerance for ID discrepancies
                </div>
              </div>

              {/* Rule 2: Save Your Team Code */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-sky-500/40 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/50 flex items-center justify-center text-sky-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    2. Save Your Team Code
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Upon online registration, a unique <strong>Team Code</strong> (e.g. <code className="text-sky-300 font-mono">URAN26-REG-XXXX</code>) is generated and emailed. <strong>SAVE YOUR TEAM CODE</strong> — it is required to retrieve your squad records at the PMIST verification counter.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-sky-300 uppercase tracking-wider font-bold">
                  Mandatory for desk lookup
                </div>
              </div>

              {/* Rule 3: All Members Present with IDs */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/40 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    3. All Members Present with IDs
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    <strong>All team members must be present together with their valid physical Student IDs</strong>. Verification happens before payment. Once verified, ₹250/participant is collected on-spot and official badges are handed over.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-300 uppercase tracking-wider font-bold">
                  Physical presence required
                </div>
              </div>

            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 text-center sm:text-left">
                Ready to register your squad with exact ID card details?
              </span>
              <a
                href="#register"
                className="px-5 py-2 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Pre-Register Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
