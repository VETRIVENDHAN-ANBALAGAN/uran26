"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, Trophy, Phone, Mail, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 items-start">
          {/* Brand & Mission (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-24 flex items-center justify-center p-1 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                <Image
                  src="/uran-logo.png"
                  alt="உரன் - URAN'26 Logo"
                  fill
                  className="object-contain p-1 brightness-110"
                />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white">
                  URAN<span className="text-sky-400 font-light">’26</span>
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  Think • Build • Transform
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              National-Level Inter-Collegiate Hackathon organized by the <strong>Department of Computer Applications</strong>, Periyar Maniammai Institute of Science and Technology (PMIST). A power-packed 12-hour single-day innovation challenge bringing collegiate builders together from across India.
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Department of Computer Applications, PMIST Campus, Vallam, Thanjavur – 613403, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:9025116795" className="hover:text-white font-mono">9025116795</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:join.uran26@gmail.com" className="hover:text-white font-mono">join.uran26@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Quick Navigation (Col 6-8) */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-xs text-white mb-4 uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About URAN’26 (Overview &amp; Rules)</Link></li>
              <li><Link href="/#tracks" className="hover:text-white transition-colors">5 Hackathon Tracks</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How URAN’26 Works</Link></li>
              <li><Link href="/#prizes" className="hover:text-white transition-colors">What Participants Get</Link></li>
              <li><Link href="/#schedule" className="hover:text-white transition-colors">26 Sept Timeline (7 AM – 7 PM)</Link></li>
              <li><Link href="/about#policies" className="hover:text-white transition-colors text-sky-400 font-medium">Participant Rulebook &amp; Policies</Link></li>
              <li><Link href="/about#faq" className="hover:text-white transition-colors">Operational FAQs (22)</Link></li>
              <li><Link href="/#register" className="hover:text-white transition-colors text-emerald-400 font-semibold">Pre-Register Team (Pay On-Spot) →</Link></li>
              <li><Link href="/admin" className="hover:text-sky-300 transition-colors text-slate-500 font-mono text-xs flex items-center gap-1 mt-1 pt-1 border-t border-slate-800/80">⚡ Organizer Command &amp; Desk →</Link></li>
            </ul>
          </div>

          {/* Event Blueprint Summary (Col 9-12) */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="font-mono text-sky-400 uppercase tracking-wider font-bold mb-3 flex items-center justify-between">
              <span>Event Blueprint Summary</span>
              <span className="text-emerald-400 text-[10px]">LIMITED SLOTS</span>
            </div>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Date: <strong>Saturday, 26 September 2026</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Duration: <strong>7:00 AM – 7:00 PM (12 Hours)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Venue: <strong>PMIST Campus, Vallam, Thanjavur</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fee: <strong>₹250 / Participant (On-Spot Payment)</strong></span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Food provided for participants during the event</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Accommodation: 25th Sept night (Paid, on request)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>
            © 2026 Department of Computer Applications, PMIST. URAN’26.
          </div>
          <div className="text-slate-400 font-mono">
            Register Before You Arrive. Pay When You Arrive. Build When It Begins.
          </div>
        </div>
      </div>
    </footer>
  );
}
