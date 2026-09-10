"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Layers, 
  Users, 
  Trophy, 
  Code2, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  Utensils, 
  BedDouble, 
  ChevronDown, 
  FileText, 
  Lock, 
  Scale, 
  RefreshCw, 
  Home as HomeIcon, 
  HelpCircle,
  Laptop,
  Wifi,
  Zap,
  Lightbulb,
  Award,
  Presentation,
  KeyRound,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PolicyModals, PolicyType } from "@/components/about/PolicyModals";
import { cn } from "@/lib/utils";

// 1. Why URAN Cards Data
const whyReasons = [
  {
    icon: Lightbulb,
    title: "Solve Meaningful Real-World Problems",
    desc: "Tackle high-impact challenges across agriculture, digital inclusion, fintech, cyber trust, and healthcare.",
    color: "text-amber-400",
  },
  {
    icon: Zap,
    title: "Build Under Time Constraints",
    desc: "Transform an idea from whiteboard sketch into a deployed, functional prototype in an intensive 12-hour build sprint.",
    color: "text-sky-400",
  },
  {
    icon: Code2,
    title: "Innovation Beyond Classrooms",
    desc: "Bridge academic coursework with hands-on systems engineering, API architectures, and live user flows.",
    color: "text-emerald-400",
  },
  {
    icon: Users,
    title: "Connect with Mentors & Evaluators",
    desc: "Receive direct desk-side guidance, architectural review, and technical consultation from experienced practitioners.",
    color: "text-purple-400",
  },
  {
    icon: Laptop,
    title: "Demonstrate Technical Rigor",
    desc: "Put your code, data models, and presentation skills on display before academic and industry evaluation panels.",
    color: "text-rose-400",
  },
  {
    icon: Trophy,
    title: "National Collaboration & Recognition",
    desc: "Compete with top student builders from institutions across India for trophies, certificates, and podium honors.",
    color: "text-yellow-400",
  },
];

// 2. The 10-Step Journey
const journeySteps = [
  { num: "01", label: "Register", desc: "Online pre-registration" },
  { num: "02", label: "Check-in & Verify", desc: "Show Team Code + IDs" },
  { num: "03", label: "Get Challenge", desc: "Problem statement drop" },
  { num: "04", label: "Ideate", desc: "Blueprint & architecture" },
  { num: "05", label: "Build", desc: "Active engineering sprint" },
  { num: "06", label: "Mentoring", desc: "Desk-side consultations" },
  { num: "07", label: "Submit", desc: "Code freeze at 5:00 PM" },
  { num: "08", label: "Jury", desc: "Evaluation begins 5:00 PM" },
  { num: "09", label: "Demo", desc: "Stage live prototype pitch" },
  { num: "10", label: "Win & Recognize", desc: "Valedictory honors" },
];

// 3. Tracks
const aboutTracks = [
  {
    id: "01",
    title: "EdTech & Inclusive Innovation",
    summary: "Technology for better, accessible, and inclusive education.",
    color: "from-sky-500/20 to-sky-950/40 border-sky-500/30 text-sky-300",
  },
  {
    id: "02",
    title: "AgriTech & Rural Innovation",
    summary: "Technology addressing agriculture and rural community challenges.",
    color: "from-emerald-500/20 to-emerald-950/40 border-emerald-500/30 text-emerald-300",
  },
  {
    id: "03",
    title: "FinTech & Digital Economy",
    summary: "Solutions transforming financial and digital economic systems.",
    color: "from-amber-500/20 to-amber-950/40 border-amber-500/30 text-amber-300",
  },
  {
    id: "04",
    title: "CyberTech & Digital Trust",
    summary: "Building safer, more secure, and trustworthy digital environments.",
    color: "from-purple-500/20 to-purple-950/40 border-purple-500/30 text-purple-300",
  },
  {
    id: "05",
    title: "HealthTech & Well-being",
    summary: "Technology-driven solutions for healthcare, wellness, and accessibility.",
    color: "from-rose-500/20 to-rose-950/40 border-rose-500/30 text-rose-300",
  },
];

// 4. Built for Builders
const builderPillars = [
  { title: "Build", desc: "Turn an idea into a working prototype with production code." },
  { title: "Learn", desc: "Get technical guidance from faculty and domain mentors." },
  { title: "Collaborate", desc: "Work with your team under real-world engineering constraints." },
  { title: "Present", desc: "Demonstrate your working solution directly to the evaluation jury." },
  { title: "Compete", desc: "Challenge yourself across five diverse innovation problem domains." },
  { title: "Get Recognized", desc: "Earn grand trophies, cash prizes, and track-level distinction." },
];

// 5. Evaluation Matrix
const evaluationCriteria = [
  {
    criterion: "Technical Implementation",
    weight: "25%",
    desc: "Code quality, architectural soundness, system design, effective tool stack usage, and technical difficulty.",
  },
  {
    criterion: "Innovation & Creativity",
    weight: "20%",
    desc: "Originality of the concept, unique angle of attack, and creative problem-solving approach.",
  },
  {
    criterion: "Functionality & Working Prototype",
    weight: "20%",
    desc: "End-to-end working features, stability during live demo, and delivery of core proposed capabilities.",
  },
  {
    criterion: "Problem Understanding & Domain Fit",
    weight: "15%",
    desc: "Depth of problem research, relevance to chosen track, and real-world value for target beneficiaries.",
  },
  {
    criterion: "UI/UX & User Experience",
    weight: "10%",
    desc: "Intuitive navigation, responsive design, visual clarity, and accessible interface structure.",
  },
  {
    criterion: "Presentation & Defense Q&A",
    weight: "10%",
    desc: "Clear demonstration, ability to answer jury questions, articulation of feasibility, and team coordination.",
  },
];

// 6. Comprehensive 22-Question FAQ
const comprehensiveFAQs = [
  {
    q: "Who can participate in URAN’26?",
    a: "Participation is open to currently enrolled students from recognized colleges, polytechnics, and universities across India. All undergraduate and postgraduate students from any branch or discipline are eligible.",
  },
  {
    q: "What is the team size requirement?",
    a: "Teams must consist of exactly 3 to 5 members. Individual participation is not permitted, as the hackathon emphasizes collegiate collaboration and team engineering.",
  },
  {
    q: "Is individual registration allowed?",
    a: "No, individual entries are not accepted. You must register as a team of 3 to 5 members with a designated Team Leader.",
  },
  {
    q: "Is pre-registration mandatory?",
    a: "Yes! Online pre-registration is strictly mandatory before the event commences. Teams cannot walk in and register on-spot without an active online pre-registration record.",
  },
  {
    q: "When do we pay the registration fee?",
    a: "Payment is strictly collected ON-SPOT. You do not pay anything on this website. The registration fee is paid in person at the PMIST venue check-in desk upon arrival and physical ID verification.",
  },
  {
    q: "How much is the registration fee?",
    a: "The registration fee is ₹250 per participant (e.g., ₹750 for 3 members, ₹1,000 for 4 members, ₹1,250 for 5 members).",
  },
  {
    q: "What should we bring to the hackathon?",
    a: "Each team member must bring their physical College/University Student ID card, personal laptop with charger, any required hardware peripherals, and personal notebooks. Power sockets and high-speed Wi-Fi will be provided at your workstation.",
  },
  {
    q: "Is the physical Student ID mandatory?",
    a: "Yes, 100% mandatory. Every participating student must carry their original institutional Student ID card. Soft copies or digital scans are subject to strict secondary scrutiny.",
  },
  {
    q: "What is the Team Code and why do I need it?",
    a: "Upon completing online pre-registration, a unique Team Code (e.g., URAN26-REG-XXXX) is generated and emailed to the Team Leader. You must present this Team Code at the PMIST desk to retrieve your registration records.",
  },
  {
    q: "What happens if my registered name doesn't match my ID Card?",
    a: "Names entered during online pre-registration must exactly match the name printed on the physical Student ID card. Discrepancies or proxy builder substitutions may result in rejection or disqualification at check-in.",
  },
  {
    q: "Can we change team members after registering?",
    a: "Minor member changes due to emergencies can be accommodated by emailing join.uran26@gmail.com at least 48 hours prior to the event, with updated ID proofs.",
  },
  {
    q: "What technologies and programming languages can we use?",
    a: "There are no tech-stack restrictions. Teams have complete freedom to use any modern programming languages, frameworks, AI/ML models, cloud platforms, databases, mobile frameworks, or IoT boards.",
  },
  {
    q: "Can we use AI developer tools (e.g., GitHub Copilot, ChatGPT)?",
    a: "Yes. Generative AI tools and coding assistants are permitted for scaffolding, debugging, and ideation. However, teams must understand and be able to defend every line of code before the jury.",
  },
  {
    q: "Are pre-existing projects allowed?",
    a: "No. All core project code must be written during the 12-hour build sprint. Pre-built prototypes will be disqualified. Open-source libraries, UI kits, and public APIs are permitted provided they are cited.",
  },
  {
    q: "Is food provided during the hackathon?",
    a: "Yes! Complimentary meals (including a nutritious buffet lunch and morning & evening tea/coffee refreshment breaks) are provided for all registered participants.",
  },
  {
    q: "Is accommodation available for outstation teams?",
    a: "Yes. Accommodation is provided on the night before the hackathon (25th September night) in the PMIST campus hostels upon request, subject to room availability and separate payment.",
  },
  {
    q: "Is accommodation included in the ₹250 registration fee?",
    a: "No. The ₹250 registration fee covers event entry, lab workstation access, delegate kits, and meals. Accommodation is separate and subject to a nominal hostel maintenance fee.",
  },
  {
    q: "What time should teams report at PMIST?",
    a: "Teams must report at the PMIST registration desk between 07:00 AM and 08:00 AM on Saturday, 26 September 2026 for verification and badge issuance.",
  },
  {
    q: "How does the jury judging process work?",
    a: "At 05:00 PM, code freeze takes effect. Starting at 05:00 PM, teams present live working prototype demos on stage before academic evaluators and industry judges, followed by technical Q&A.",
  },
  {
    q: "What are the awards and recognitions?",
    a: "Awards include overall Grand Champion podium trophies & cash prizes (Winner, Runner-up, 2nd Runner-up), plus specialized Track Winner honors for each of the 5 domains, alongside official PMIST certificates.",
  },
  {
    q: "What happens if our team submits code late?",
    a: "Code freeze is strictly at 05:00 PM sharp. Commits pushed to the repository after 05:00 PM will not be considered during evaluation.",
  },
  {
    q: "Who can we contact for queries or travel assistance?",
    a: "You can reach the organizing team by Phone/WhatsApp at 9025116795, or by Email at join.uran26@gmail.com. Organizers are also available at the PMIST Department of Computer Applications.",
  },
];

export default function AboutPage() {
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-slate-200 selection:text-slate-950">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO & STAT COUNTER STRIP                                              */}
      {/* ========================================================================= */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-slate-800/80 bg-slate-950">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-sky-900/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 text-center">
          
          {/* Institution Crest */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass mb-4 border border-slate-700/80 shadow-xl backdrop-blur-xl bg-slate-900/80">
            <div className="relative h-5 w-12 flex items-center justify-center">
              <Image
                src="/uran-logo.png"
                alt="உரன் Logo"
                fill
                className="object-contain brightness-125"
              />
            </div>
            <div className="h-3.5 w-px bg-slate-700" />
            <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
              Dept. of Computer Applications • PMIST, Thanjavur
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white mb-3">
            About URAN<span className="text-sky-400">’26</span>
          </h1>

          <p className="text-sm sm:text-base font-mono uppercase tracking-widest text-sky-300 font-bold mb-6">
            Think • Build • Transform • Saturday, 26 September 2026
          </p>

          {/* Core Introduction */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            URAN’26 is a <strong>National-Level Inter-Collegiate Hackathon</strong> that brings together student innovators from across India to transform real-world challenges into practical, technology-driven solutions.
          </p>

          {/* Big Number Stat Counter Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto mb-10 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-display font-black text-sky-400">12</div>
              <div className="text-xs font-mono font-bold uppercase text-slate-300 mt-1">Hours Sprint</div>
              <div className="text-[10px] text-slate-400">7:00 AM – 7:00 PM</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-display font-black text-purple-400">05</div>
              <div className="text-xs font-mono font-bold uppercase text-slate-300 mt-1">Problem Tracks</div>
              <div className="text-[10px] text-slate-400">Real-world domains</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-display font-black text-emerald-400">01</div>
              <div className="text-xs font-mono font-bold uppercase text-slate-300 mt-1">Power Single Day</div>
              <div className="text-[10px] text-slate-400">26 Sept 2026</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-display font-black text-amber-400">PAN</div>
              <div className="text-xs font-mono font-bold uppercase text-slate-300 mt-1">India Reach</div>
              <div className="text-[10px] text-slate-400">Colleges nationwide</div>
            </div>
          </div>

          {/* Jump Links Pill Rail */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <a href="#why" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              Why URAN’26
            </a>
            <a href="#journey" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              The Journey
            </a>
            <a href="#tracks" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              5 Tracks
            </a>
            <a href="#venue" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              Venue Experience
            </a>
            <a href="#evaluation" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              Judging Criteria
            </a>
            <a href="#policies" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 font-bold hover:text-white transition-colors">
              Rulebook &amp; Policies
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              FAQs (22)
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHY URAN’26? (6 Visual Cards)                                         */}
      {/* ========================================================================= */}
      <section id="why" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              Purpose &amp; Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Why URAN’26?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Engineered to foster rigorous engineering, cross-pollinate ideas, and bridge academia with production software.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyReasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="glass-card rounded-2xl p-6 border border-slate-800/90 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                      <Icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT HAPPENS AT URAN’26? (10-Step Journey)                            */}
      {/* ========================================================================= */}
      <section id="journey" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              What Happens at URAN’26?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Follow the complete participant lifecycle from registration to the final podium announcement.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-left mb-8">
            {journeySteps.map((s, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-black text-sky-400 block mb-1">
                    {s.num}
                  </span>
                  <div className="font-bold text-white text-sm leading-tight mb-1">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Flow Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] text-slate-300 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-slate-400">REGISTER</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">CHECK-IN &amp; VERIFY</span>
            <span className="text-slate-600">→</span>
            <span className="text-sky-300 font-bold">GET CHALLENGE</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">IDEATE</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-300 font-bold">BUILD</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">MENTORING</span>
            <span className="text-slate-600">→</span>
            <span className="text-amber-300 font-bold">SUBMIT (5 PM)</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-300">JURY</span>
            <span className="text-slate-600">→</span>
            <span className="text-purple-300 font-bold">DEMO</span>
            <span className="text-slate-600">→</span>
            <span className="text-amber-400 font-bold">WIN &amp; GET RECOGNIZED</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 5 INNOVATION TRACKS                                                */}
      {/* ========================================================================= */}
      <section id="tracks" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              Problem Domains
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Five Innovation Tracks
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Choose one core domain. Solve genuine operational or societal challenges with full modern tech stack freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            {aboutTracks.map((t) => (
              <div 
                key={t.id}
                className={cn(
                  "p-5 rounded-2xl bg-gradient-to-b border flex flex-col justify-between",
                  t.color
                )}
              >
                <div>
                  <span className="font-mono text-xs font-black tracking-widest text-slate-400 block mb-2">
                    TRACK // {t.id}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.summary}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 uppercase">
                  Tech Freedom: Full-Stack · AI · IoT · Cloud
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHO CAN PARTICIPATE & THE 12-HOUR CHALLENGE                            */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch text-left">
            
            {/* Left: Who Can Participate */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
                  Eligibility Criteria
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-3">
                  Who Can Participate?
                </h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Open to all active undergraduate and postgraduate students enrolled in colleges, polytechnics, and universities across India.
                </p>

                <div className="space-y-3 font-mono text-xs text-slate-200">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Team Size:</span>
                    <span className="font-bold text-white">3 to 5 Members / Squad</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Student ID:</span>
                    <span className="font-bold text-amber-300">Mandatory Physical ID Card</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Online Pre-Registration:</span>
                    <span className="font-bold text-emerald-400">Mandatory (Free Online)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Registration Fee:</span>
                    <span className="font-bold text-amber-300">₹250 / Participant (Pay On-Spot)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                Cross-department and inter-disciplinary teams are strongly encouraged.
              </div>
            </div>

            {/* Right: The 12-Hour Challenge */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-sky-950/20 border-2 border-sky-500/30 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Single-Day Experience</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
                  The 12-Hour Challenge
                </h3>
                <div className="text-lg sm:text-xl font-mono font-black text-sky-400 mb-4">
                  07:00 AM → 07:00 PM
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  The 12 hours cover the complete, seamless hackathon experience without overnight confusion:
                </p>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>07:00 AM – 08:00 AM: Arrival, ID check, on-spot payment &amp; kits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>08:00 AM – 09:00 AM: Inaugural keynote &amp; challenge statements drop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>09:00 AM – 05:00 PM: Ideation, build sprint, lunch &amp; mentoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>05:00 PM Sharp: ⚡ Hack ends &amp; code freeze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>05:00 PM – 07:00 PM: Live jury demos, evaluation &amp; awards</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
                Saturday, 26 September 2026 • PMIST Campus, Vallam, Thanjavur
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BUILT FOR BUILDERS (6 Pillars)                                         */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              The Participant Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Built for Builders
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Six foundational aspects that make URAN’26 a career-defining technical event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {builderPillars.map((p, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="text-xs font-mono font-bold uppercase text-sky-400 mb-1">
                  0{idx + 1} //
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. VENUE EXPERIENCE: BUILT FOR A 12-HOUR BUILD                            */}
      {/* ========================================================================= */}
      <section id="venue" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
              Infrastructure &amp; Amenities
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Built for a 12-Hour Build
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Hosted at the modern PMIST Speciality Hall and Computing Labs, designed specifically for intensive engineering without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-8">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400 mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">High-Quality Air Conditioning</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fully climate-controlled specialty hall ensuring maximum mental focus throughout the sprint.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Power Outlets at Every Pod</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated power strips and multi-plug sockets assigned to each individual squad table.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-3">
                <Wifi className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">High-Speed Campus Network</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Low-latency internet connectivity for API calls, dependency installations, and Git pushes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400 mb-3">
                <Presentation className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Jury &amp; AV Presentation Stage</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-definition projection screens, audio systems, and judge pods for live stage demonstrations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-300">
            <span>✓ Ambient Ergonomic Lighting</span>
            <span>•</span>
            <span>✓ Dedicated Dining Hall</span>
            <span>•</span>
            <span>✓ 24/7 Security &amp; Medical First Aid</span>
            <span>•</span>
            <span>✓ On-Site Technical Volunteers</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOD & ACCOMMODATION TRANSPARENCY                                     */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Food Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
                      INCLUDED IN ENTRY
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Complimentary Food &amp; Refreshments
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Participants do not need to leave the venue for meals. Full hospitality is provided:
                </p>

                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Morning Coffee &amp; Tea Break (11:00 AM)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nutritious Buffet Networking Lunch (01:30 PM – 02:30 PM)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evening High Tea &amp; Light Snacks (04:00 PM)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Provided for all verified registered participants.
              </div>
            </div>

            {/* Accommodation Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 block">
                      AVAILABLE ON REQUEST
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Campus Hostel Accommodation
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  Provided on the night before the hackathon (<strong>25th September night</strong>) for outstation teams:
                </p>

                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Separate secured hostels for male and female builders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Subject to room availability and nominal separate payment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Check-in 25th Sept (05:00 PM – 09:30 PM) • Check-out 26th Sept (07:00 AM)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Not included in ₹250 fee</span>
                <button
                  onClick={() => setActivePolicy("accommodation")}
                  className="px-3 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Accommodation Details →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. REGISTRATION & ON-SITE VERIFICATION                                    */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
            Verification Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-3">
            Registration &amp; Verification Flow
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Follow this clear 4-step sequence to guarantee immediate badge issuance at PMIST.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-left mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-black text-sky-400">01 //</span>
              <div className="font-bold text-white text-sm mt-1 mb-1">Register Online</div>
              <p className="text-xs text-slate-400">Complete pre-registration before the event commences.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-black text-purple-400">02 //</span>
              <div className="font-bold text-white text-sm mt-1 mb-1">Receive Team Code</div>
              <p className="text-xs text-slate-400">Save the unique code (URAN26-REG-XXXX) sent to email.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-black text-amber-400">03 //</span>
              <div className="font-bold text-white text-sm mt-1 mb-1">Verify at Venue</div>
              <p className="text-xs text-slate-400">Produce Team Code + physical Student IDs of all members.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-black text-emerald-400">04 //</span>
              <div className="font-bold text-white text-sm mt-1 mb-1">Pay &amp; Enter</div>
              <p className="text-xs text-slate-400">Pay ₹250/person on-spot and enter the specialty hall.</p>
            </div>
          </div>

          {/* Prominent ID Warning */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/60 text-left flex items-start gap-3.5 shadow-xl">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs sm:text-sm font-mono font-black text-amber-300 uppercase tracking-wide">
                MANDATORY ID MATCHING WARNING
              </div>
              <p className="text-xs sm:text-sm text-slate-100 mt-0.5 leading-relaxed font-medium">
                Names entered during registration must <strong>exactly match the respective Student ID Cards</strong>. Any incorrect or mismatching information may lead to rejection or disqualification during desk verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. JUDGING & RECOGNITION (Evaluation Matrix Table)                      */}
      {/* ========================================================================= */}
      <section id="evaluation" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              Jury Rubric
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Judging &amp; Recognition
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Transparent, weighted evaluation criteria ensuring objective scoring across technical and presentation benchmarks.
            </p>
          </div>

          {/* Criteria Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mb-8 text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="py-3.5 px-4 sm:px-6">Evaluation Parameter</th>
                    <th className="py-3.5 px-4 text-center">Weight</th>
                    <th className="py-3.5 px-4 sm:px-6">Scoring Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {evaluationCriteria.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                        {c.criterion}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-sky-400">
                        {c.weight}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-300 text-xs">
                        {c.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Awards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase mb-1">
                <Trophy className="w-4 h-4" />
                <span>Overall Podium Awards</span>
              </div>
              <div className="text-base font-bold text-white mb-1">
                Grand Champion Winner · Runner-up · Second Runner-up
              </div>
              <p className="text-xs text-slate-300">
                Institutional trophies, cash prizes, and championship certificates awarded to top overall squads.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/40">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-300 uppercase mb-1">
                <Award className="w-4 h-4" />
                <span>5 Track Honors</span>
              </div>
              <div className="text-base font-bold text-white mb-1">
                Track Winner Honors across all 5 Innovation Domains
              </div>
              <p className="text-xs text-slate-300">
                Dedicated category trophies recognizing domain excellence in EdTech, AgriTech, FinTech, CyberTech, and HealthTech.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. RULES & POLICIES INTERACTIVE HUB                                      */}
      {/* ========================================================================= */}
      <section id="policies" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              Legal &amp; Operational Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Rules &amp; Policies
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Click any policy below to view detailed conditions, intellectual property rights, and code of conduct.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            
            {/* Policy 1: Rulebook */}
            <button
              onClick={() => setActivePolicy("rulebook")}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                <span>📋 Participation Rulebook</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400">
                Squad composition (3–5), lab workstations, code freeze at 5 PM, and fair play norms.
              </p>
            </button>

            {/* Policy 2: Privacy */}
            <button
              onClick={() => setActivePolicy("privacy")}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                <span>🔐 Privacy Policy (Draft)</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400">
                How participant data is handled for pass issuance, certification, and verification.
              </p>
            </button>

            {/* Policy 3: IPR */}
            <button
              onClick={() => setActivePolicy("ipr")}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                <span>© Intellectual Property (IPR)</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400">
                100% code ownership retained by participants; open-source and third-party disclosure rules.
              </p>
            </button>

            {/* Policy 4: Cancellation */}
            <button
              onClick={() => setActivePolicy("cancellation")}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                <span>↩ Cancellation &amp; Payment</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400">
                Zero upfront payment risk; registration fee is collected on-spot strictly upon verification.
              </p>
            </button>

            {/* Policy 5: Accommodation */}
            <button
              onClick={() => setActivePolicy("accommodation")}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                <HomeIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                <span>🏠 Accommodation Policy</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400">
                Hostel guidelines for 25th September night stay, check-in window, and availability.
              </p>
            </button>

            {/* Policy 6: Code of Conduct */}
            <button
              onClick={() => setActivePolicy("conduct")}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                <span>⚠ Code of Conduct &amp; Ethics</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400">
                Campus ethics, harassment-free environment, property care, and grievance reporting.
              </p>
            </button>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. WHY PARTICIPATE? (Conversion Callout)                                 */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white mb-4">
            Don&apos;t just attend a hackathon.<br />
            <span className="text-sky-400">Build something worth showing.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            URAN’26 offers the rare blend of rigorous time-boxed engineering, deep peer collaboration, and direct spotlight before industry and academic judges.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left font-mono text-xs mb-10">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">01 / Real Problems</span>
              <span className="text-slate-300">Work on genuine domain challenges.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">02 / 12-Hour Build</span>
              <span className="text-slate-300">Turn an idea into a running system.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">03 / Mentorship</span>
              <span className="text-slate-300">Get guidance as you write code.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">04 / Industry Exposure</span>
              <span className="text-slate-300">Interact with expert evaluators.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-rose-400 font-bold block mb-1">05 / Recognition</span>
              <span className="text-slate-300">Compete for podium &amp; track awards.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-yellow-400 font-bold block mb-1">06 / National Network</span>
              <span className="text-slate-300">Meet collegiate builders nationwide.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. COMPREHENSIVE 22-QUESTION FAQ ACCORDION                                */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-2">
              Operational Clarity
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Everything you need to know about eligibility, payments, student IDs, accommodation, and event day rules.
            </p>
          </div>

          <div className="space-y-3">
            {comprehensiveFAQs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-slate-200 cursor-pointer"
                  >
                    <span>{idx + 1}. {item.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0",
                        isOpen && "rotate-180 text-white"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. READY TO BUILD? CONVERSION BANNER                                     */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-950 text-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/15 via-slate-900 to-amber-500/15 border-2 border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 block mb-2">
                SLOTS ARE LIMITED // ONLINE PRE-REGISTRATION MANDATORY
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white mb-4">
                Ready to Build at URAN’26?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Pre-register your squad online today to lock in your official workstation and Team Code. Registration fee (₹250/participant) is paid on-spot upon arrival.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#register"
                  className="px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <span>Pre-Register Your Team Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="px-6 py-4 rounded-full glass hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all border border-slate-700/80 cursor-pointer"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Policy Modal Overlay */}
      <PolicyModals 
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      <Footer />
    </main>
  );
}
