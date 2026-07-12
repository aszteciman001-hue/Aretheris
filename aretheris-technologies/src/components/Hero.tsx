/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import IconRenderer from "./IconRenderer";
import ParticleBackground from "./ParticleBackground";

interface HeroProps {
  onExplore: () => void;
  onInquire: () => void;
}

export default function Hero({ onExplore, onInquire }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax translation effects based on scroll position
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityY = useTransform(scrollY, [0, 400], [1, 0]);
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);

  // Multilayered Parallax Layers
  const fastShapeY = useTransform(scrollY, [0, 800], [0, -220]);
  const midShapeY = useTransform(scrollY, [0, 800], [0, -110]);
  const slowShapeY = useTransform(scrollY, [0, 800], [0, 75]);
  
  const fastRot = useTransform(scrollY, [0, 1000], [0, -240]);
  const slowRot = useTransform(scrollY, [0, 1000], [0, 90]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden pt-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Visual Background Pattern - Grid & Glow */}
      <motion.div
        id="hero-bg-parallax"
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        {/* Futuristic Laser Grid Floor */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2563eb 1px, transparent 1px),
              linear-gradient(to bottom, #2563eb 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)",
          }}
        />

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      </motion.div>

      {/* Interactive Background Particle Network ("Neural Fabric") */}
      <ParticleBackground />

      {/* Layer 2: Slow-moving deep background tech grid */}
      <motion.div
        style={{ y: slowShapeY, rotate: slowRot }}
        className="absolute top-[15%] right-[12%] w-64 h-64 border border-indigo-500/10 rounded-full border-dashed pointer-events-none z-0 hidden lg:flex items-center justify-center"
      >
        <div className="w-48 h-48 border border-indigo-500/5 rounded-full" />
        <div className="w-32 h-32 border border-dashed border-indigo-500/5 rounded-full" />
        <div className="absolute w-2 h-2 rounded-full bg-indigo-500/20 top-8 left-12" />
      </motion.div>

      {/* Layer 3: Mid-speed floating structural node left */}
      <motion.div
        style={{ y: fastShapeY, rotate: fastRot }}
        className="absolute bottom-[25%] left-[6%] w-24 h-24 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md pointer-events-none z-5 hidden md:flex flex-col items-center justify-center p-4 shadow-2xl shadow-blue-500/5"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
          <IconRenderer name="Network" size={16} />
        </div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">MESH 01</span>
      </motion.div>

      {/* Layer 4: Medium-speed floating structural telemetry badge right */}
      <motion.div
        style={{ y: midShapeY }}
        className="absolute top-[30%] left-[8%] w-40 h-16 bg-slate-900/40 border border-slate-800/50 rounded-xl backdrop-blur-sm pointer-events-none z-5 hidden lg:flex items-center space-x-3 px-4 py-2"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-slate-400 block font-bold leading-none">LATENCY CORE</span>
          <span className="text-[9px] font-mono text-slate-500 block leading-none">0.85ms Edge Active</span>
        </div>
      </motion.div>

      <motion.div
        style={{ y: midShapeY, rotate: slowRot }}
        className="absolute bottom-[20%] right-[8%] w-32 h-32 bg-slate-900/40 border border-slate-800/60 rounded-full backdrop-blur-md pointer-events-none z-5 hidden md:flex items-center justify-center shadow-xl"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="3" fill="transparent" />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#2563eb"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="175.9"
              strokeDashoffset="35"
              strokeLinecap="round"
            />
          </svg>
          <IconRenderer name="BrainCircuit" className="text-blue-400" size={18} />
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ y: textY, opacity: opacityY }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Micro Tech Banner */}
        <motion.div
          id="hero-banner-pill"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-3.5 py-1.5 mb-8 shadow-inner"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-blue-400 tracking-wider uppercase">
            ARETHERIS MESH v2.4 AVAILABLE
          </span>
        </motion.div>

        {/* Headings */}
        <h1 id="hero-title" className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-100 mb-6 leading-[1.1]">
          The Decentralized
          <span className="block mt-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Neural Fabric
          </span>
        </h1>

        <p id="hero-subtitle" className="text-lg sm:text-xl text-slate-400 font-sans max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Scale intelligence across a collaborative quantum-neural mesh. 
          Unifying container compute, federated learning, and zero-trust 
          encryption at absolute edge nodes.
        </p>

        {/* Call To Actions */}
        <div id="hero-actions" className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            id="hero-primary-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 text-white font-display font-semibold tracking-wide shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:bg-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Explore Core Products</span>
            <IconRenderer name="ArrowRight" size={16} />
          </motion.button>

          <motion.button
            id="hero-secondary-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInquire}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 font-display font-semibold tracking-wide hover:bg-slate-800/40 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Access Command Center</span>
            <IconRenderer name="Terminal" size={16} className="text-slate-500" />
          </motion.button>
        </div>
      </motion.div>

      {/* Decorative Floating Components or Tech Accents */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-40">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Scroll to deploy</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-slate-700 flex justify-center pt-1"
        >
          <div className="w-1 h-2 bg-blue-500 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
