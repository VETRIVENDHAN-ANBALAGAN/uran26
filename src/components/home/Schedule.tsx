"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Calendar, Utensils, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

const timelineEvents = [
  {
    time: "07:00 AM – 08:00 AM",
    title: "Check-in & On-Spot Payment",
    desc: "Arrival at PMIST, pre-registration verification, ₹250 on-spot payment, and badge issuance.",
    tag: "Check-in",
    tagColor: "bg-sky-950/80 text-sky-300 border-sky-800",
  },
  {
    time: "08:00 AM – 09:00 AM",
    title: "Inauguration & Problem Drop",
    desc: "Opening ceremony by Dept. of Computer Applications; challenge statements unsealed across all 5 tracks.",
    tag: "Kickoff",
    tagColor: "bg-purple-950/80 text-purple-300 border-purple-800",
  },
  {
    time: "09:00 AM – 11:00 AM",
    title: "Ideation & Scaffolding",
    desc: "System blueprint mapping, database schema wiring, and Git repository initialization.",
    tag: "Sprint 1",
    tagColor: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
  },
  {
    time: "11:00 AM – 11:30 AM",
    title: "Morning Coffee Break",
    desc: "Filter coffee, tea, and energy snacks served at the computing lab foyer.",
    tag: "Break",
    tagColor: "bg-amber-950/80 text-amber-300 border-amber-800",
  },
  {
    time: "11:30 AM – 01:30 PM",
    title: "Core Feature Engineering",
    desc: "Active development sprint, model pipelines, API integrations, and UI components.",
    tag: "Sprint 2",
    tagColor: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
  },
  {
    time: "01:30 PM – 02:30 PM",
    title: "Buffet Networking Lunch",
    desc: "Nutritious lunch buffet provided for all participants in the campus dining hall.",
    tag: "Food",
    tagColor: "bg-amber-950/80 text-amber-300 border-amber-800",
  },
  {
    time: "02:30 PM – 04:00 PM",
    title: "Mentoring & Sanity Review",
    desc: "Desk-side reviews with academic and industry experts. Architecture check and demo consultation.",
    tag: "Mentoring",
    tagColor: "bg-blue-950/80 text-blue-300 border-blue-800",
  },
  {
    time: "04:00 PM – 04:30 PM",
    title: "Evening High Tea Break",
    desc: "High tea and light developer refreshments before the final build submission.",
    tag: "Break",
    tagColor: "bg-amber-950/80 text-amber-300 border-amber-800",
  },
  {
    time: "05:00 PM Sharp",
    title: "⚡ HACK ENDS & CODE FREEZE",
    desc: "Hackathon coding ends at 5:00 PM sharp. Repository commits locked and final deliverables submitted.",
    tag: "Hack End",
    tagColor: "bg-rose-950/90 text-rose-300 border-rose-700 font-bold",
  },
  {
    time: "05:00 PM – 06:15 PM",
    title: "Jury Evaluation & Demos",
    desc: "Jury evaluation begins at 5 PM: live stage prototype demos, judge testing, and defense Q&A.",
    tag: "Jury",
    tagColor: "bg-purple-950/80 text-purple-300 border-purple-800",
  },
  {
    time: "06:15 PM – 07:00 PM",
    title: "Valedictory & Awards",
    desc: "Announcement of winners, track honors, trophy handovers, certificate distribution, and wrap-up.",
    tag: "Awards",
    tagColor: "bg-amber-400/20 text-amber-300 border-amber-500/50 font-bold",
  },
];

export function Schedule() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  const laserHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="schedule" className="py-20 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10" ref={containerRef}>
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Single-Day Master Schedule</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-2.5">
            26 September 2026 Timeline
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base">
            7:00 AM to 7:00 PM (12 Hours) • Hack concludes at 5:00 PM sharp, followed by Jury Demos &amp; Awards.
          </p>

          {/* Quick Informational Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Saturday, 26 Sept 2026</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Hack ends 5 PM • Jury till 7 PM</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lunch &amp; Breaks Provided</span>
            </span>
          </div>

          {/* Accommodation Clarification Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-700/50 text-[11px] text-indigo-200">
            <BedDouble className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Accommodation is provided on <strong>25th September night</strong> before the hackathon (Subject to availability &amp; payment).</span>
          </div>
        </div>

        {/* Timeline Grid with Scroll-Linked Laser Rail */}
        <div className="relative pl-6 sm:pl-8">
          
          {/* Base Track Line */}
          <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-0.5 bg-slate-800" />

          {/* Glowing Animated Laser Progress Beam */}
          <motion.div 
            style={{ height: laserHeight }}
            className="absolute left-2 sm:left-3 top-2 w-0.5 bg-gradient-to-b from-sky-400 via-indigo-400 to-amber-400 shadow-[0_0_12px_rgba(56,189,248,0.9)] z-10 origin-top"
          />

          {/* Timeline Events Stack */}
          <div className="space-y-3">
            {timelineEvents.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="relative"
              >
                {/* Milestone Laser Node Pip */}
                <div className="absolute -left-[21px] sm:-left-[27px] top-4 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-slate-700 z-20 transition-colors group-hover:border-sky-400" />

                <div
                  className={cn(
                    "p-3.5 sm:p-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border",
                    item.tag === "Hack End"
                      ? "bg-rose-950/20 border-rose-700/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                      : item.tag === "Awards"
                      ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "glass-card border-slate-800/80 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs sm:text-sm font-black text-slate-200 shrink-0 min-w-[155px]">
                      {item.time}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border font-mono shrink-0", item.tagColor)}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex-1 sm:px-3 text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
