"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  GraduationCap, 
  Sprout, 
  Coins, 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Layers,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const tracksData = [
  {
    id: "track-1",
    trackNumber: "01",
    title: "EdTech & Inclusive Innovation",
    theme: "Education, Accessibility & Adaptive Learning",
    icon: GraduationCap,
    description:
      "Education, accessibility, adaptive learning, digital inclusion, and technology-enabled learning for every learner.",
    challenges: [
      "Vernacular AI tutors & multilingual speech-to-speech learning interfaces",
      "Assistive accessibility screen interfaces for visually & hearing impaired students",
      "Adaptive competency assessment engines and zero-bandwidth offline educational sync",
    ],
    techStack: ["AI/ML & NLP", "Next.js / Web", "Python / FastAPI", "Offline PWAs", "Cloud & DBs"],
  },
  {
    id: "track-2",
    trackNumber: "02",
    title: "AgriTech & Rural Innovation",
    theme: "Agriculture, Rural Communities & Sustainable Supply Chains",
    icon: Sprout,
    description:
      "Agriculture, rural development, farmers, rural communities, supply chains, and sustainable ecological solutions.",
    challenges: [
      "Mobile edge computer vision for automated crop disease & soil pathology",
      "Precision sensor IoT networks for micro-irrigation and weather telemetry",
      "Transparent farm-to-table supply chains & perishable waste reduction networks",
    ],
    techStack: ["IoT & Edge Computing", "Computer Vision", "Python", "Mobile Apps", "GIS & Sensors"],
  },
  {
    id: "track-3",
    trackNumber: "03",
    title: "FinTech & Digital Economy",
    theme: "Financial Technology, Digital Payments & Financial Inclusion",
    icon: Coins,
    description:
      "Financial technology, digital payments, financial inclusion, digital commerce, and economic solutions for individuals and micro-merchants.",
    challenges: [
      "Vernacular automated bookkeeping and ledger digitization for informal MSMEs",
      "Real-time transaction anomaly analysis and synthetic identity fraud detection",
      "Alternative creditworthiness scoring engines for non-salaried gig workers",
    ],
    techStack: ["Full-Stack Engineering", "Distributed DBs", "Payment APIs", "AI/ML", "Cloud Systems"],
  },
  {
    id: "track-4",
    trackNumber: "04",
    title: "CyberTech & Digital Trust",
    theme: "Cybersecurity, Privacy, Digital Identity & Secure Systems",
    icon: ShieldCheck,
    description:
      "Cybersecurity, privacy, digital identity, secure systems, digital safety, and building resilient trust in digital ecosystems.",
    challenges: [
      "Decentralized digital identity, zero-trust auth, and cryptographic credentials",
      "Automated threat telemetry, vulnerability discovery & proactive malware triage",
      "Privacy-preserving computation, data anonymization & anti-phishing rails",
    ],
    techStack: ["Cybersecurity Tools", "Cryptography", "Network Telemetry", "Python / Rust", "Cloud Security"],
  },
  {
    id: "track-5",
    trackNumber: "05",
    title: "HealthTech & Well-being",
    theme: "Healthcare, Preventative Care, Accessibility & Wellness",
    icon: HeartPulse,
    description:
      "Healthcare, preventive care, accessibility, wellness, health services, and technology-enabled holistic well-being.",
    challenges: [
      "Smart triage and vitals telemetry alert models from smartphone sensor feeds",
      "Low-bandwidth rural telemedicine rails and automated EHR coordination",
      "Community mental wellness platforms and personalized preventative health trackers",
    ],
    techStack: ["Health Informatics", "Mobile & WebRTC", "AI / PyTorch", "FastAPI", "Cloud Infrastructure"],
  },
];

export function Tracks() {
  const [selectedTrack, setSelectedTrack] = useState(tracksData[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yAmbient = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const yGrid = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={containerRef} id="tracks" className="py-24 bg-slate-900/60 border-t border-slate-800/80 relative overflow-hidden">
      {/* Floating Ambient Parallax Glow */}
      <motion.div 
        style={{ y: yAmbient }} 
        className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none parallax-layer" 
      />
      <motion.div 
        style={{ y: yGrid }} 
        className="absolute -bottom-24 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none parallax-layer" 
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>URAN’26 Problem Domains</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white">
              The 5 Hackathon Tracks
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Teams choose one of the five official problem domains to build impactful solutions during the 12-hour single-day sprint.
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-sky-300 font-mono">
              <Code2 className="w-3.5 h-3.5" />
              <span>Complete tech stack freedom: AI/ML, Full-Stack, IoT, Cloud & more.</span>
            </div>
          </div>
        </div>

        {/* Interactive Track Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Track Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {tracksData.map((track) => {
              const Icon = track.icon;
              const isSelected = selectedTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-center justify-between border group",
                    isSelected
                      ? "bg-slate-800/95 border-sky-500/60 shadow-[0_10px_30px_rgba(56,189,248,0.15)] scale-[1.02]"
                      : "glass border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors font-mono font-bold text-sm",
                        isSelected ? "bg-white text-slate-950 shadow-md" : "bg-slate-950 text-slate-400 group-hover:text-white"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400">Track {track.trackNumber}</span>
                      </div>
                      <h3 className="font-bold text-base text-white group-hover:text-slate-200">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{track.theme}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isSelected ? "text-sky-300 translate-x-1" : "text-slate-600 group-hover:text-slate-400"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Track Details Preview Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTrack.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-3xl p-6 sm:p-9 border border-slate-700/80 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-mono">
                      Official Track {selectedTrack.trackNumber}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                      {selectedTrack.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">{selectedTrack.theme}</p>
                  </div>
                </div>

                <div className="py-6">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Track Scope & Description</h4>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    {selectedTrack.description}
                  </p>

                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Key Focus Areas & Challenges</h4>
                  <div className="space-y-2.5 mb-8">
                    {selectedTrack.challenges.map((challenge, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{challenge}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Applicable Technologies (Unrestricted)</h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedTrack.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-medium text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    <span className="px-3 py-1.5 rounded-lg bg-sky-950/60 border border-sky-800/80 text-xs font-semibold text-sky-300">
                      + Any Modern Framework / Tech
                    </span>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      🎯 Participants are free to choose appropriate tech stacks depending on their solution.
                    </div>
                    <a
                      href="#register"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Pre-Register Team</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
