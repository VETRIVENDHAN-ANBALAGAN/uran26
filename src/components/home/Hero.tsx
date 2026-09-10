"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  CloudLightning 
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);

  // Parallax Scroll Engine
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const scaleBackground = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const yMidground = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const yForeground = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacityForeground = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scaleForeground = useTransform(scrollYProgress, [0, 0.75], [1, 0.95]);

  // Countdown Logic targeting 26 Sept 2026 07:00 AM
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 8,
    minutes: 6,
    seconds: 20,
  });

  useEffect(() => {
    const targetDate = new Date("2026-09-26T07:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic subtle lightning flash simulation matching storm rhythm
  useEffect(() => {
    const triggerLightning = () => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 90);
      setTimeout(() => setLightningFlash(true), 170);
      setTimeout(() => setLightningFlash(false), 290);
    };

    const lightningInterval = setInterval(() => {
      if (isPlaying && Math.random() > 0.4) {
        triggerLightning();
      }
    }, 6000);

    return () => clearInterval(lightningInterval);
  }, [isPlaying]);

  // Play / Pause video & audio control
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      if (isSoundOn && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  // Toggle audio
  const toggleSound = () => {
    if (!videoRef.current) return;
    
    if (!isSoundOn) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.85;

      if (audioRef.current) {
        audioRef.current.volume = 0.85;
        audioRef.current.currentTime = videoRef.current.currentTime || 0;
        audioRef.current.play().catch(() => {});
      }

      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      setIsSoundOn(true);
    } else {
      videoRef.current.muted = true;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsSoundOn(false);
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-36 sm:pt-44 pb-20 sm:pb-24"
      id="about"
    >
      {/* ========================================================================= */}
      {/* PARALLAX LAYER 0: CINEMATIC DRONE VIDEO & MONUMENT (Moves at ~0.3x speed) */}
      {/* ========================================================================= */}
      <motion.div 
        style={{ y: yBackground, scale: scaleBackground }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none parallax-layer"
      >
        {/* Fallback Poster Image */}
        <Image
          src="/images/periyar-poster.jpg"
          alt="Periyar Monument in Rainy Night"
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-1000",
            isVideoLoaded ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Looping Cinematic Drone Video */}
        <video
          ref={videoRef}
          src="/videos/periyar-hero.mp4"
          poster="/images/periyar-poster.jpg"
          autoPlay
          loop
          muted={!isSoundOn}
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000",
            isVideoLoaded ? "opacity-90" : "opacity-0"
          )}
        />

        {/* Fallback audio element */}
        <audio
          ref={audioRef}
          src="/audio/storm-ambiance.mp3"
          loop
          preload="auto"
        />

        {/* Cold navy color grading blend */}
        <div className="absolute inset-0 bg-slate-950/45 mix-blend-multiply" />

        {/* Heavy Vignette Mask for text contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 65% at 50% 48%, rgba(2,6,23,0.18) 0%, rgba(2,6,23,0.65) 52%, rgba(2,6,23,0.95) 85%, #020617 100%)`,
          }}
        />

        {/* Edge Gradient Blends */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
      </motion.div>

      {/* ========================================================================= */}
      {/* PARALLAX LAYER 1: ATMOSPHERIC LIGHTING & CYBER GRID (Moves at ~0.5x speed) */}
      {/* ========================================================================= */}
      <motion.div 
        style={{ y: yMidground }}
        className="absolute inset-0 z-[1] pointer-events-none overflow-hidden parallax-layer"
      >
        {/* Lightning Flash Pulse */}
        <div 
          className={cn(
            "absolute inset-0 bg-sky-300/15 mix-blend-screen transition-opacity duration-75",
            lightningFlash ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Cold Electric Rim Glow behind Headline */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-sky-900/15 rounded-full blur-[130px]" />

        {/* Technical Micro-Grid for Cybernetic Depth */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />
      </motion.div>

      {/* ========================================================================= */}
      {/* PARALLAX LAYER 2: FOREGROUND DECLUTTERED CONTENT (Smooth elevation & fade) */}
      {/* ========================================================================= */}
      <motion.div 
        style={{ y: yForeground, opacity: opacityForeground, scale: scaleForeground }}
        className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center text-center max-w-4xl parallax-layer"
      >
        {/* Official Tamil Logo Crest Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full glass mb-4 border border-slate-700/80 shadow-xl backdrop-blur-xl bg-slate-950/70"
        >
          <div className="relative h-5 w-12 flex items-center justify-center">
            <Image
              src="/uran-logo.png"
              alt="உரன் Logo"
              fill
              className="object-contain brightness-125"
            />
          </div>
          <div className="h-3.5 w-px bg-slate-700" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-slate-100 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-sky-400" />
            Dept. of Computer Applications • PMIST, Thanjavur
          </span>
        </motion.div>

        {/* Punchy Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight mb-2 leading-[1.05] text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
        >
          URAN<span className="text-sky-400">’26</span>
        </motion.h1>

        {/* Subtitle & Motto */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-1 mb-6"
        >
          <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-wide uppercase">
            National-Level Inter-Collegiate Hackathon
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-sky-300 font-bold uppercase">
            Think • Build • Transform • Saturday, 26 September 2026
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-7 justify-center"
        >
          <a
            href="#register"
            className="group px-7 py-3.5 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
          >
            <span>Pre-Register Team (3–5 Members)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#tracks"
            className="px-6 py-3.5 rounded-full glass hover:bg-slate-800/90 font-bold text-sm sm:text-base text-slate-100 hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-700/80 backdrop-blur-xl shadow-xl hover:scale-105 cursor-pointer"
          >
            Explore 5 Tracks
          </a>
        </motion.div>

        {/* Streamlined Single Cybernetic HUD Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-3xl glass-card rounded-2xl p-3 sm:p-4 border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl bg-slate-950/85 flex flex-col md:flex-row items-center justify-between gap-3 text-left"
        >
          {/* Key Parameters */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-1.5">
                <span>26 Sept 2026</span>
                <span className="text-slate-500">•</span>
                <span className="text-sky-300 font-mono text-[11px]">7 AM – 7 PM (12 Hours)</span>
              </div>
              <div className="text-[11px] text-slate-300 flex flex-wrap items-center gap-1 mt-0.5 font-medium">
                <span>PMIST Campus, Thanjavur</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-300 font-semibold">₹250 On-Spot Pay (Pre-Reg Mandatory)</span>
              </div>
            </div>
          </div>

          {/* Compact Countdown timer */}
          <div className="flex items-center gap-1.5 bg-slate-900/95 px-3 py-1.5 rounded-xl border border-slate-700/90 shadow-inner shrink-0 font-mono">
            {[
              { label: "D", value: timeLeft.days },
              { label: "H", value: timeLeft.hours },
              { label: "M", value: timeLeft.minutes },
              { label: "S", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-0.5">
                <span className="font-black text-xs sm:text-sm text-white">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] text-slate-400 font-bold mr-1">
                  {item.label}
                </span>
                {idx < 3 && <span className="text-slate-600 text-xs mr-0.5">:</span>}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* FLOATING ATMOSPHERE CONTROLS (Bottom-Right Corner)                        */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2"
      >
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-slate-800/80 bg-slate-950/60 backdrop-blur-md text-[11px] font-mono text-slate-400">
          <CloudLightning className="w-3.5 h-3.5 text-sky-400" />
          <span>STORM AMBIANCE</span>
        </div>

        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass bg-slate-950/80 border border-slate-700/80 hover:border-slate-500 text-xs text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-lg cursor-pointer"
          aria-label={isPlaying ? "Pause cinematic background" : "Play cinematic background"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="text-[10px] font-mono font-semibold uppercase">{isPlaying ? "PAUSE" : "PLAY"}</span>
        </button>

        <button
          onClick={toggleSound}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border text-xs transition-all backdrop-blur-md shadow-lg cursor-pointer",
            isSoundOn 
              ? "bg-sky-950/90 border-sky-400 text-sky-200 ring-2 ring-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.35)]" 
              : "bg-slate-950/80 border-slate-700/80 hover:border-slate-500 text-slate-400 hover:text-slate-200"
          )}
          aria-label={isSoundOn ? "Mute video storm audio" : "Play video storm audio"}
        >
          {isSoundOn ? <Volume2 className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-mono font-semibold uppercase">{isSoundOn ? "AUDIO ON" : "AUDIO OFF"}</span>
        </button>
      </motion.div>
    </section>
  );
}
