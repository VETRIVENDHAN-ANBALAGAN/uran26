"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Layers, 
  Trophy, 
  HelpCircle, 
  Info,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about", icon: Info },
    { name: "5 Tracks", href: "/#tracks", icon: Layers },
    { name: "12h Journey", href: "/#how-it-works", icon: Flame, highlight: true },
    { name: "Perks & Awards", href: "/#prizes", icon: Trophy },
    { name: "Schedule", href: "/#schedule", icon: Clock },
    { name: "FAQ", href: "/#faq", icon: HelpCircle },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none",
        isScrolled ? "py-2.5 sm:py-3" : "py-3 sm:py-5"
      )}
    >
      <div className="container mx-auto px-3 sm:px-6 max-w-7xl pointer-events-auto">
        <nav
          className={cn(
            "relative flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl sm:rounded-full transition-all duration-300",
            "bg-slate-950/80 backdrop-blur-2xl border",
            isScrolled
              ? "border-sky-500/25 bg-slate-950/90 shadow-[0_12px_40px_rgba(2,6,23,0.9),0_0_20px_rgba(56,189,248,0.12)]"
              : "border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Brand Logo & Event Tag */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-9 w-20 sm:h-10 sm:w-24 flex items-center justify-center p-1 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-inner group-hover:border-sky-500/50 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all">
              <Image
                src="/uran-logo.png"
                alt="உரன் - URAN'26 Logo"
                fill
                className="object-contain p-1 brightness-110 group-hover:scale-105 transition-transform"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  URAN<span className="text-sky-400 font-light">’26</span>
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  <Flame className="w-3 h-3 text-amber-400" />
                  12H Single-Day
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                26 Sept 2026 • 7 AM – 7 PM • PMIST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                  link.highlight
                    ? "text-sky-300 hover:text-white hover:bg-sky-500/15"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                {link.highlight && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Action Trigger & Urgency Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Payment & Venue Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>₹250 / Participant • On-Spot</span>
            </div>

            {/* High-Impact Register CTA */}
            <Link
              href="/#register"
              className="relative group overflow-hidden px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-sky-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center gap-1.5 sm:gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Pre-Register</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-1 transition-transform hidden xs:inline-block" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 bg-slate-950/95 backdrop-blur-2xl rounded-2xl border border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-2.5 overflow-hidden"
            >
              {/* Event Quick Info Banner */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Date & Timing</span>
                <span className="text-sky-300 font-bold">26 Sept • 7 AM – 7 PM (12h)</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                        link.highlight
                          ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                          : "text-slate-300 hover:text-white hover:bg-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{link.name}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <Link
                href="/#register"
                onClick={() => setIsOpen(false)}
                className="mt-2 text-center px-5 py-3 rounded-xl bg-gradient-to-r from-white via-sky-100 to-sky-200 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pre-Register Online (Pay On-Spot)</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
