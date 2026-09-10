"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const faqList = [
  {
    q: "Is payment done online or on-spot?",
    a: "Payment is strictly ON-SPOT. Pre-registration online is mandatory before the event commences, but the registration fee of ₹250 per participant is collected at the PMIST venue check-in desk when your team arrives. No online payment is collected through this website.",
  },
  {
    q: "What are the event dates, duration, and venue?",
    a: "URAN’26 takes place on Saturday, 26 September 2026 at the PMIST Campus, Vallam, Thanjavur, Tamil Nadu – 613403. It is an intensive 12-hour single-day hackathon (7:00 AM – 7:00 PM). The coding sprint concludes at 5:00 PM sharp, followed immediately by jury evaluation, presentations, and the valedictory awards ceremony.",
  },
  {
    q: "Who is eligible to participate and what is the team size?",
    a: "Students currently enrolled in colleges and universities across India are eligible. Teams must comprise 3 to 5 members. Every participant must present a valid college/university student ID during venue verification.",
  },
  {
    q: "What are the strict rules for team names, student IDs, and verification?",
    a: "1. Enter every team member's name exactly as printed on their Student ID Card. Any mismatch may result in rejection or disqualification. 2. SAVE YOUR TEAM CODE — it is required for on-site verification. 3. All team members must be present together with their physical Student IDs. 4. Verification flow: Register → Get Team Code → Arrive → Show Team Code + IDs → Verify → Pay ₹250/person → Enter Hackathon.",
  },
  {
    q: "What is the registration fee and what does it include?",
    a: "The registration fee is ₹250 per participant (e.g. ₹750 for 3 members, ₹1,000 for 4 members, ₹1,250 for 5 members), collected on-spot at check-in. The fee covers lab workstation access, network connectivity, delegate kits, and complimentary food provided during the event.",
  },
  {
    q: "How does accommodation work?",
    a: "Campus accommodation is provided on the night before the hackathon (25th September night) upon request, subject to room availability and additional payment. Accommodation is NOT included in the ₹250 registration fee. You can indicate your accommodation requirement during online pre-registration, and charges/allotment will be finalized on-spot with the event organizers.",
  },
  {
    q: "What are the 5 hackathon tracks and tech stack requirements?",
    a: "The 5 tracks are: (1) EdTech & Inclusive Innovation, (2) AgriTech & Rural Innovation, (3) FinTech & Digital Economy, (4) CyberTech & Digital Trust, and (5) HealthTech & Well-being. The tracks define the problem domain; participants are completely free to use any modern technology including AI/ML, Full-Stack Development, Cloud, Cybersecurity, Databases, IoT, Mobile, etc.",
  },
  {
    q: "What do participants receive upon completion?",
    a: "All verified participants receive official institutional Certificates of Participation, access to expert mentorship and industry interaction, complimentary food, and the opportunity to compete for attractive prizes, champion trophies, and track-level recognition.",
  },
  {
    q: "Who do I contact if I have questions or need assistance?",
    a: "For any queries regarding URAN’26, contact the organizing team directly via Phone/WhatsApp at 9025116795 or by Email at join.uran26@gmail.com. You can also reach the Department of Computer Applications, PMIST, Vallam, Thanjavur.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-300 uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Operational FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Essential information regarding pre-registration, on-spot payment, accommodation, and event rules.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 mb-12">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-slate-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0",
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
                      <div className="px-5 sm:px-6 pb-6 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Query Contact Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-white font-bold text-base mb-1">Still have questions about URAN’26?</h4>
            <p className="text-slate-400 text-xs">Our organizing desk at PMIST is ready to assist you.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:9025116795"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold border border-slate-700 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>9025116795</span>
            </a>
            <a
              href="mailto:join.uran26@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold transition-all shadow"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>join.uran26@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
