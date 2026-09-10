"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  FileCheck, 
  Sparkles, 
  Utensils, 
  BedDouble, 
  GraduationCap, 
  Users, 
  Rocket, 
  Briefcase,
  CheckCircle2
} from "lucide-react";

const perks = [
  {
    icon: Utensils,
    title: "Food & Refreshments",
    desc: "Lunch and morning/evening refreshments provided during the event.",
    badge: "Included",
    color: "text-emerald-400",
  },
  {
    icon: BedDouble,
    title: "Accommodation on 25th Night",
    desc: "Available before the hackathon on request (Subject to availability & additional payment).",
    badge: "Available (Paid)",
    color: "text-indigo-400",
  },
  {
    icon: GraduationCap,
    title: "Mentorship & Guidance",
    desc: "Desk-side reviews with experienced technical mentors and domain experts.",
    badge: "Industry Mentors",
    color: "text-purple-400",
  },
  {
    icon: Rocket,
    title: "Live Prototype Showcase",
    desc: "Stage opportunity to demonstrate your working solution directly before the jury.",
    badge: "Stage Pitch",
    color: "text-amber-300",
  },
  {
    icon: Users,
    title: "Collegiate Networking",
    desc: "Collaborate and connect with student builder teams from across India.",
    badge: "National Network",
    color: "text-sky-400",
  },
  {
    icon: Briefcase,
    title: "Industry Exposure",
    desc: "Interact with senior tech evaluators, academic leaders, and recruiters.",
    badge: "Visibility",
    color: "text-rose-400",
  },
];

export function Prizes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yAmbient = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={containerRef} id="prizes" className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      {/* Floating ambient background glow with parallax */}
      <motion.div 
        style={{ y: yAmbient }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none parallax-layer" 
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Rewards, Perks & Recognition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-2.5">
            What Participants Get
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Attractive prizes, track-level recognition, PMIST certificates, full meal hospitality, and expert mentorship.
          </p>
        </div>

        {/* High-Density 3-Column Awards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 1. Grand Champion */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-900 border-2 border-amber-400/80 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  CHAMPIONS
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Attractive Prizes & Trophies</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prestigious rolling champion trophies, direct cash awards, and institutional accolades awarded during the valedictory ceremony.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/30 text-[11px] text-amber-300 font-mono font-semibold">
              Grand Cash Trophy + Valedictory Honors
            </div>
          </div>

          {/* 2. Track-Level Recognition */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-sky-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-black text-lg">
                  <Medal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-700">
                  5 TRACKS
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Track-Level Recognition</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated distinction awards recognizing standout prototypes across each of the 5 official hackathon track domains.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-300 font-mono">
              Honors across All 5 Problem Domains
            </div>
          </div>

          {/* 3. Participation Certificates */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                  <FileCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  ALL SQUADS
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Participation Certificates</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Official institutional Certificates of Participation issued by PMIST for all eligible student builders attending the hackathon.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
              Authenticated Institutional Credentials
            </div>
          </div>
        </div>

        {/* Compact Perks Grid (2x3 on Mobile/Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${p.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{p.title}</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
