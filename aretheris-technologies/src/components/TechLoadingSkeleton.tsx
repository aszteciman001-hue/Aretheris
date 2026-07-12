import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import AretherisLogo from "./AretherisLogo";
import { Volume2, VolumeX } from "lucide-react";

interface TechLoadingSkeletonProps {
  onComplete: () => void;
}

export default function TechLoadingSkeleton({ onComplete }: TechLoadingSkeletonProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("aretheris_muted") === "true";
  });
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem("aretheris_volume");
    return stored ? parseInt(stored, 10) : 40;
  });

  const audioContextRef = React.useRef<AudioContext | null>(null);
  const masterGainRef = React.useRef<GainNode | null>(null);
  const humOsc1Ref = React.useRef<OscillatorNode | null>(null);
  const humOsc2Ref = React.useRef<OscillatorNode | null>(null);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("aretheris_muted", String(next));
      if (!next && volume === 0) {
        setVolume(40);
        localStorage.setItem("aretheris_volume", "40");
      }
      return next;
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    localStorage.setItem("aretheris_volume", String(val));
    if (val > 0) {
      setIsMuted(false);
      localStorage.setItem("aretheris_muted", "false");
    } else {
      setIsMuted(true);
      localStorage.setItem("aretheris_muted", "true");
    }
  };

  // Web Audio Ambient Synthesizer
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    let ctx: AudioContext;
    try {
      ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Could not initialize AudioContext", e);
      return;
    }

    audioContextRef.current = ctx;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 1. Core Sub Bass Ambient Hum (55Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(55, ctx.currentTime);

    // 2. Warmer Rich Harmonic (110Hz triangle wave with lowpass)
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(110, ctx.currentTime);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(140, ctx.currentTime);
    lowpass.Q.setValueAtTime(1.5, ctx.currentTime);

    const osc1Gain = ctx.createGain();
    osc1Gain.gain.setValueAtTime(0.4, ctx.currentTime);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.18, ctx.currentTime);

    // Connect nodes
    osc1.connect(osc1Gain);
    osc1Gain.connect(masterGain);

    osc2.connect(lowpass);
    lowpass.connect(osc2Gain);
    osc2Gain.connect(masterGain);

    // Start oscillators
    try {
      osc1.start(0);
      osc2.start(0);
    } catch (e) {
      console.error(e);
    }

    humOsc1Ref.current = osc1;
    humOsc2Ref.current = osc2;

    // 3. High-frequency diagnostics data sparkle pulses
    const triggerSparkle = () => {
      if (!ctx || ctx.state === "suspended") return;

      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      const sparkleFilter = ctx.createBiquadFilter();

      sparkleOsc.type = "sine";
      const frequencies = [880, 1320, 1760, 2200];
      const selectedFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
      sparkleOsc.frequency.setValueAtTime(selectedFreq, ctx.currentTime);

      sparkleFilter.type = "bandpass";
      sparkleFilter.frequency.setValueAtTime(selectedFreq, ctx.currentTime);
      sparkleFilter.Q.setValueAtTime(12, ctx.currentTime);

      sparkleGain.gain.setValueAtTime(0, ctx.currentTime);
      sparkleGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      sparkleOsc.connect(sparkleFilter);
      sparkleFilter.connect(sparkleGain);
      sparkleGain.connect(masterGain);

      try {
        sparkleOsc.start(0);
        sparkleOsc.stop(ctx.currentTime + 1.5);
      } catch (e) {
        console.error(e);
      }
    };

    const intervalId = setInterval(triggerSparkle, 4000);
    triggerSparkle(); // Initial sparkle

    return () => {
      clearInterval(intervalId);
      try {
        if (masterGain) {
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        }
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            ctx.close();
          } catch (_) {}
        }, 400);
      } catch (_) {
        try {
          ctx.close();
        } catch (__) {}
      }
    };
  }, []);

  // Update volume when mute status or volume level changes
  useEffect(() => {
    const masterGain = masterGainRef.current;
    const ctx = audioContextRef.current;
    if (!masterGain || !ctx) return;

    if (ctx.state === "suspended" && !isMuted) {
      ctx.resume().catch((err) => console.warn("Context resume failed", err));
    }

    // Smoothly interpolate to avoid any audio popping sound
    const targetVolume = isMuted ? 0 : (volume / 100) * 0.2;
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.1);
  }, [isMuted, volume]);

  const logs = [
    "INITIALIZING ARETHERIS QUANTUM CORE...",
    "ESTABLISHING DECENTRALIZED SYMMETRIC KEYPAIR...",
    "MAPPING EDGE NODES & CLASSROOM PORTALS...",
    "CALIBRATING CORE NEURAL TOPOLOGY...",
    "ACTIVATING POST-QUANTUM CRYPTOGRAPHIC PROTOCOLS...",
    "ARETHERIS MESH v2.4 CONNECTION SECURED.",
  ];

  // Progress bar simulation over exactly 30 seconds
  useEffect(() => {
    const startTime = Date.now();
    const duration = 30000; // 30 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setProgress(calculatedProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Sync log indexes with progress ranges
  useEffect(() => {
    if (progress === 0) setLogIndex(0);
    else if (progress < 20) setLogIndex(1);
    else if (progress < 40) setLogIndex(2);
    else if (progress < 60) setLogIndex(3);
    else if (progress < 80) setLogIndex(4);
    else setLogIndex(5);

    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 500); // Small pause at 100% for readability
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-[#020617] text-slate-100 font-mono px-6 md:px-12 py-8 overflow-hidden select-none"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* SKELETON WIREFRAME INTERFACE */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between z-10">
        
        {/* Header Wireframe */}
        <div className="w-full flex items-center justify-between border-b border-slate-900 pb-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="w-4 h-4 rounded-full border border-blue-500/30 border-t-cyan-400 animate-spin" />
            </div>
            <div className="h-4 w-32 bg-slate-900 rounded-md animate-pulse" />
          </div>
          <div className="hidden md:flex space-x-8">
            <div className="h-3 w-16 bg-slate-900/80 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-900/80 rounded animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="h-3 w-16 bg-slate-900/80 rounded animate-pulse" style={{ animationDelay: "300ms" }} />
            <div className="h-3 w-16 bg-slate-900/80 rounded animate-pulse" style={{ animationDelay: "450ms" }} />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-900/60 px-3 py-1.5 rounded-lg">
              <button
                onClick={handleToggleMute}
                className="text-cyan-400 hover:text-cyan-300 focus:outline-none flex items-center space-x-1 cursor-pointer"
                title={isMuted ? "Unmute Ambient Diagnostics Sound" : "Mute Ambient Diagnostics Sound"}
              >
                {isMuted ? (
                  <VolumeX size={13} className="text-rose-400 shrink-0" />
                ) : (
                  <Volume2 size={13} className="text-cyan-400 animate-pulse shrink-0" />
                )}
              </button>

              {/* Futuristic Cyberpunk Volume Range Slider */}
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none hover:accent-cyan-400"
                  style={{
                    WebkitAppearance: "none",
                  }}
                />
                <span className="font-mono text-[9px] text-slate-400 w-6 text-right select-none">
                  {isMuted ? "0%" : `${volume}%`}
                </span>
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-900/60 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Center content / Core loader */}
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          {/* Pulsing Core Glyph */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.03, 1]
              }}
              transition={{
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10"
            >
              <AretherisLogo size={90} interactive={false} />
            </motion.div>
          </div>

          <div className="text-center max-w-md w-full space-y-4">
            <h2 className="text-sm font-semibold tracking-[0.25em] text-cyan-400 uppercase">
              ARETHERIS RECONSTRUCTION
            </h2>
            
            {/* Pulsing skeleton bars mimicking content loading */}
            <div className="space-y-2 px-6">
              <div className="h-3 w-3/4 mx-auto bg-slate-900 rounded animate-pulse" />
              <div className="h-2 w-1/2 mx-auto bg-slate-900/80 rounded animate-pulse" style={{ animationDelay: "200ms" }} />
            </div>

            {/* Futuristic Progress Tracker */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
                <span className="text-blue-400">CONNECTIVITY LINK: READY</span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lower Terminal Diagnostics Logging */}
        <div className="w-full border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-[11px]">
          <div className="space-y-1 w-full md:max-w-xl">
            <div className="text-slate-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>DIAGNOSTIC TELEMETRY PORT // SECURE</span>
            </div>
            
            {/* Rolling log outputs */}
            <div className="bg-slate-950/80 border border-slate-900/60 rounded-lg p-3 min-h-[72px] font-mono flex flex-col justify-end space-y-1 text-slate-400 shadow-inner">
              {logs.slice(Math.max(0, logIndex - 2), logIndex + 1).map((log, idx, arr) => {
                const isLatest = idx === arr.length - 1;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center space-x-2 ${isLatest ? "text-cyan-400 font-medium" : "text-slate-600"}`}
                  >
                    <span>&gt;</span>
                    <span className="truncate">{log}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-slate-600 text-right font-mono flex flex-col space-y-0.5 select-none">
            <span>NODE_ID: {Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
            <span>EDUVERSE CORRELATION: v2.4</span>
            <span>SYSTEM AUDIT: COMPLIANT</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
