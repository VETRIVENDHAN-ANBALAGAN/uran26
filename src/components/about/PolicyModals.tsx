"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShieldCheck, 
  Scale, 
  Lock, 
  RefreshCw, 
  Home, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Info,
  Building2,
  Calendar,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PolicyType = 
  | "rulebook" 
  | "privacy" 
  | "ipr" 
  | "cancellation" 
  | "accommodation" 
  | "conduct";

interface PolicyModalsProps {
  activePolicy: PolicyType | null;
  onClose: () => void;
}

export function PolicyModals({ activePolicy, onClose }: PolicyModalsProps) {
  if (!activePolicy) return null;

  const renderContent = () => {
    switch (activePolicy) {
      case "rulebook":
        return (
          <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200">
              <strong>Core Premise:</strong> URAN’26 is a 12-hour continuous collegiate hackathon where registered teams design, develop, and present functional prototypes addressing one of the 5 official problem domains.
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">1. Team Composition &amp; Eligibility</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Participation is open to currently enrolled students from recognized colleges, polytechnics, and universities across India.</li>
                <li>Teams must consist of exactly <strong>3 to 5 members</strong>. Individual participation is not permitted.</li>
                <li>Cross-departmental and cross-year teams within an institution are allowed and encouraged.</li>
                <li>Every team member must produce their physical College/University Student ID card during venue check-in.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">2. Build Sprint &amp; Submission</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>All software coding, model training, and system assembly must occur during the official hackathon window (07:00 AM – 05:00 PM).</li>
                <li>Pre-written project code bases are strictly prohibited. Teams may utilize publicly available open-source libraries, frameworks, boilerplate templates, and APIs.</li>
                <li>Git repositories must be initialized fresh on the event day with commits pushed throughout the sprint.</li>
                <li><strong>Code Freeze is at 05:00 PM sharp</strong>. No commits pushed after 05:00 PM will be evaluated by the jury.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">3. Workstation &amp; Fair Play</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Each squad is assigned a dedicated team pod in PMIST computing labs with network connectivity and power outlets.</li>
                <li>Plagiarism, decompiling others&apos; projects, or attempting to compromise the event network will lead to immediate disqualification.</li>
                <li>The decision of the jury panel and PMIST academic evaluators is final and binding on all teams.</li>
              </ul>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200">
              <strong>Draft Event Policy Notice:</strong> This privacy policy represents the draft event operational terms. Final formal wording is subject to administrative review and approval by Periyar Maniammai Institute of Science and Technology (PMIST).
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">1. Information We Collect</h4>
              <p>During online pre-registration and venue check-in, URAN’26 collects:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Team name, leader &amp; builder names as printed on institutional ID cards.</li>
                <li>Contact information: Primary email address and mobile/WhatsApp phone number.</li>
                <li>Academic institution name, department, and year of study.</li>
                <li>Selected problem track and optional accommodation requirements.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">2. Purpose of Processing</h4>
              <p>Your information is used strictly for event coordination, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Generating verifiable digital pre-registration passes and unique Team Codes.</li>
                <li>Issuing official PMIST delegate badges and participation certificates.</li>
                <li>Dispatching operational email alerts and emergency SMS notifications.</li>
                <li>Allotting computing lab workstations and accommodation requests.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">3. Data Retention &amp; Sharing</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>We do <strong>not</strong> sell, lease, or monetize participant data to external marketing vendors.</li>
                <li>Data is stored in secure academic databases managed by the Department of Computer Applications.</li>
                <li>Aggregated, non-personal metrics (e.g. number of participating colleges) may be published in official institutional hackathon reports.</li>
              </ul>
            </div>
          </div>
        );

      case "ipr":
        return (
          <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200">
              <strong>100% Participant Ownership:</strong> All intellectual property created by your squad before, during, or after URAN’26 remains the exclusive property of the team members who built it.
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">1. Project Ownership</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Neither PMIST nor the Department of Computer Applications claims ownership, patent rights, or equity in any software, hardware, or documentation created by participating teams.</li>
                <li>Teams are free to continue developing, open-sourcing, or commercializing their solutions after the hackathon.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">2. Third-Party Resources &amp; AI Tools</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Teams may use publicly accessible third-party APIs, open-source SDKs, pretrained ML models, and generative AI developer tools (e.g., GitHub Copilot, ChatGPT) provided appropriate attribution is maintained.</li>
                <li>All external dependencies must be disclosed in the project repository&apos;s <code>README.md</code>.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">3. Media &amp; Showcase Rights</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>By participating, teams grant PMIST a non-exclusive license to take photographs, capture demo video snippets, and publish project summaries for institutional promotional and academic archive purposes.</li>
              </ul>
            </div>
          </div>
        );

      case "cancellation":
        return (
          <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="p-3.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-200">
              <strong>Transparent Operational Structure:</strong>
              <div className="mt-1.5 font-mono text-xs text-white">
                Online: Pre-Registration Only → No Upfront Payment<br/>
                Venue: Check-In → ID Verification → ₹250/person On-Spot Payment → Participation
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">1. Zero Upfront Financial Risk</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Online pre-registration is free of charge. No credit card, debit card, or UPI transaction is collected on this website.</li>
                <li>If your team is unable to attend, simply notify the organizers via email (<code>join.uran26@gmail.com</code>) to release your slot to waitlisted teams. There is zero financial loss.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">2. On-Spot Payment &amp; Policy</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>The registration fee of <strong>₹250 per participant</strong> is paid in person at the PMIST registration desk strictly <em>after</em> physical Student ID verification is completed.</li>
                <li>Once paid on-spot at the venue desk, delegate kits and dining coupons are issued immediately. Due to immediate logistical provisioning (food, lab seating, kit issuance), on-spot fee payments are non-refundable once the team enters the event hall.</li>
                <li>In the unlikely event of event cancellation or rescheduling by the institution, any on-spot fees collected will be fully refunded.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              *Draft event policy subject to final PMIST Administration and Finance Department verification.
            </div>
          </div>
        );

      case "accommodation":
        return (
          <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-200">
              <strong>Accommodation Details:</strong> Provided on the night prior to the hackathon (<strong>25th September night</strong>) for outstation teams, subject to campus hostel availability and separate payment.
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">1. General Policy</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Accommodation is <strong>not included</strong> in the ₹250 hackathon registration fee.</li>
                <li>Separate hostel facilities are provided for male and female participants within the secure PMIST campus.</li>
                <li>Check-in window on 25th September: 05:00 PM to 09:30 PM.</li>
                <li>Check-out timing on 26th September: 07:00 AM (prior to the hackathon inauguration).</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">2. Charges &amp; Facilities</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Exact nominal hostel maintenance charges (per person / night) will be finalized and communicated to teams who check the accommodation box during pre-registration.</li>
                <li>Facilities include secure rooms, cot/bedding, clean washrooms, 24/7 security, and campus surveillance.</li>
                <li>Participants are advised to bring personal toiletries and lockable bags.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">3. Campus Regulations</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>All guests must strictly abide by PMIST hostel rules and curfew guidelines.</li>
                <li>Possession of banned substances, alcohol, or disorderly conduct will result in immediate disqualification and campus escort.</li>
              </ul>
            </div>
          </div>
        );

      case "conduct":
        return (
          <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200">
              <strong>Zero-Tolerance Code of Conduct:</strong> URAN’26 is dedicated to providing a safe, welcoming, respectful, and inclusive environment for every participant, mentor, judge, and volunteer.
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">1. Professional Behavior</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Treat fellow participants, mentors, organizers, and campus staff with dignity and mutual respect.</li>
                <li>Harassment, intimidation, offensive comments, discriminatory behavior, or inappropriate conduct of any kind will not be tolerated.</li>
                <li>Maintain academic integrity: do not misrepresent existing work, copy code without attribution, or disrupt other teams.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">2. Campus Care &amp; Cleanliness</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>Respect PMIST computing hardware, specialty halls, lab furniture, and electrical equipment.</li>
                <li>Dispose of food packaging, beverage cups, and trash in designated recycling bins.</li>
                <li>Smoking, vaping, alcohol, and narcotic substances are strictly prohibited on the entire PMIST campus.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase font-mono tracking-wider">3. Reporting Violations</h4>
              <p>
                If you experience or witness any violation of this Code of Conduct, immediately contact the on-site Faculty Coordinator or call the emergency helpline at <strong className="text-white font-mono">9025116795</strong>. Organizers will take immediate action, up to and including disqualification and removal from the premises.
              </p>
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (activePolicy) {
      case "rulebook": return { title: "Official Participation Rulebook", icon: FileText, badge: "RULES & REGULATIONS" };
      case "privacy": return { title: "Participant Privacy Policy", icon: Lock, badge: "DATA PROTECTION" };
      case "ipr": return { title: "Intellectual Property Rights (IPR)", icon: Scale, badge: "IP OWNERSHIP" };
      case "cancellation": return { title: "Cancellation & On-Spot Payment Policy", icon: RefreshCw, badge: "PAYMENT TERMS" };
      case "accommodation": return { title: "Campus Accommodation Policy", icon: Home, badge: "HOSTEL GUIDELINES" };
      case "conduct": return { title: "Code of Conduct & Ethics", icon: ShieldCheck, badge: "CAMPUS ETHICS" };
    }
  };

  const info = getTitle();
  const Icon = info.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-[#090f1d] border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 block">
                  {info.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-display font-black text-white">
                  {info.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(85vh-140px)]">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              PMIST Department of Computer Applications • URAN’26
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all shadow cursor-pointer"
            >
              Understood &amp; Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
