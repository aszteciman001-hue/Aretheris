/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import aretherisLogoImg from "../assets/images/aretheris_logo_official_1783868280406.jpg";

interface AretherisLogoProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export default function AretherisLogo({ className = "", size = 32, interactive = true }: AretherisLogoProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    e.preventDefault();
    setIsViewerOpen(true);
  };

  const handleDownloadLogo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(aretherisLogoImg);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "aretheris_logo_official.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const link = document.createElement("a");
      link.href = aretherisLogoImg;
      link.download = "aretheris_logo_official.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} ${interactive ? "cursor-pointer hover:scale-105 transition-transform duration-300 active:scale-95" : ""}`}
        onClick={handleLogoClick}
        title={interactive ? "Click to view Aretheris Logo" : undefined}
      >
        <defs>
          <linearGradient id="gradientTop" x1="250" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
            <stop offset="100%" stopColor="#ec4899" /> {/* Magenta */}
          </linearGradient>
          <linearGradient id="gradientRight" x1="250" y1="250" x2="415" y2="345" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ec4899" /> {/* Magenta */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
          </linearGradient>
          <linearGradient id="gradientLeft" x1="85" y1="345" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer backing glow */}
        <circle cx="250" cy="250" r="140" fill="url(#coreGlow)" className="opacity-40" />

        {/* Symmetric Rotated Lobes (Triquetra) */}
        <g filter="url(#neonGlow)">
          {/* LOBE 1: Top (0 degrees rotation) */}
          <g transform="rotate(0, 250, 250)">
            {/* Outer Boundary */}
            <path d="M 250,230 C 180,210 160,140 250,50 C 340,140 320,210 250,230 Z" stroke="url(#gradientTop)" strokeWidth="3" fill="none" opacity="0.9" />
            {/* Inner Boundary */}
            <path d="M 250,210 C 200,195 185,145 250,80 C 315,145 300,195 250,210 Z" stroke="url(#gradientTop)" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Spine */}
            <line x1="250" y1="210" x2="250" y2="80" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
            {/* Lattice Cross-bars */}
            <line x1="220" y1="90" x2="225" y2="115" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.6" />
            <line x1="280" y1="90" x2="275" y2="115" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.6" />
            <line x1="195" y1="135" x2="205" y2="155" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.6" />
            <line x1="305" y1="135" x2="295" y2="155" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.6" />
            <line x1="185" y1="180" x2="210" y2="190" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.6" />
            <line x1="315" y1="180" x2="290" y2="190" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.6" />
            
            <line x1="250" y1="80" x2="220" y2="90" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
            <line x1="250" y1="80" x2="280" y2="90" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
            <line x1="225" y1="115" x2="195" y2="135" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
            <line x1="275" y1="115" x2="305" y2="135" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
            <line x1="205" y1="155" x2="185" y2="180" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
            <line x1="295" y1="155" x2="315" y2="180" stroke="url(#gradientTop)" strokeWidth="1" opacity="0.5" />
          </g>

          {/* LOBE 2: Bottom-Right (120 degrees rotation) */}
          <g transform="rotate(120, 250, 250)">
            {/* Outer Boundary */}
            <path d="M 250,230 C 180,210 160,140 250,50 C 340,140 320,210 250,230 Z" stroke="url(#gradientRight)" strokeWidth="3" fill="none" opacity="0.9" />
            {/* Inner Boundary */}
            <path d="M 250,210 C 200,195 185,145 250,80 C 315,145 300,195 250,210 Z" stroke="url(#gradientRight)" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Spine */}
            <line x1="250" y1="210" x2="250" y2="80" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
            {/* Lattice Cross-bars */}
            <line x1="220" y1="90" x2="225" y2="115" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.6" />
            <line x1="280" y1="90" x2="275" y2="115" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.6" />
            <line x1="195" y1="135" x2="205" y2="155" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.6" />
            <line x1="305" y1="135" x2="295" y2="155" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.6" />
            <line x1="185" y1="180" x2="210" y2="190" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.6" />
            <line x1="315" y1="180" x2="290" y2="190" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.6" />
            
            <line x1="250" y1="80" x2="220" y2="90" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
            <line x1="250" y1="80" x2="280" y2="90" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
            <line x1="225" y1="115" x2="195" y2="135" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
            <line x1="275" y1="115" x2="305" y2="135" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
            <line x1="205" y1="155" x2="185" y2="180" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
            <line x1="295" y1="155" x2="315" y2="180" stroke="url(#gradientRight)" strokeWidth="1" opacity="0.5" />
          </g>

          {/* LOBE 3: Bottom-Left (240 degrees rotation) */}
          <g transform="rotate(240, 250, 250)">
            {/* Outer Boundary */}
            <path d="M 250,230 C 180,210 160,140 250,50 C 340,140 320,210 250,230 Z" stroke="url(#gradientLeft)" strokeWidth="3" fill="none" opacity="0.9" />
            {/* Inner Boundary */}
            <path d="M 250,210 C 200,195 185,145 250,80 C 315,145 300,195 250,210 Z" stroke="url(#gradientLeft)" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Spine */}
            <line x1="250" y1="210" x2="250" y2="80" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
            {/* Lattice Cross-bars */}
            <line x1="220" y1="90" x2="225" y2="115" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.6" />
            <line x1="280" y1="90" x2="275" y2="115" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.6" />
            <line x1="195" y1="135" x2="205" y2="155" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.6" />
            <line x1="305" y1="135" x2="295" y2="155" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.6" />
            <line x1="185" y1="180" x2="210" y2="190" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.6" />
            <line x1="315" y1="180" x2="290" y2="190" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.6" />
            
            <line x1="250" y1="80" x2="220" y2="90" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
            <line x1="250" y1="80" x2="280" y2="90" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
            <line x1="225" y1="115" x2="195" y2="135" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
            <line x1="275" y1="115" x2="305" y2="135" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
            <line x1="205" y1="155" x2="185" y2="180" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
            <line x1="295" y1="155" x2="315" y2="180" stroke="url(#gradientLeft)" strokeWidth="1" opacity="0.5" />
          </g>

          {/* Central Atomic Orbits */}
          <g>
            <ellipse cx="250" cy="250" rx="75" ry="25" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" fill="none" transform="rotate(30, 250, 250)" opacity="0.8" />
            <ellipse cx="250" cy="250" rx="75" ry="25" stroke="#ec4899" strokeWidth="1.5" fill="none" transform="rotate(150, 250, 250)" opacity="0.7" />
            <ellipse cx="250" cy="250" rx="75" ry="25" stroke="#8b5cf6" strokeWidth="1.5" fill="none" transform="rotate(270, 250, 250)" opacity="0.75" />

            {/* Orbiting Qubits (Electrons) */}
            <g transform="rotate(30, 250, 250)">
              <circle cx="325" cy="250" r="5" fill="#ffffff" stroke="#22d3ee" strokeWidth="1.5" className="animate-pulse" />
            </g>
            <g transform="rotate(150, 250, 250)">
              <circle cx="175" cy="250" r="5" fill="#ffffff" stroke="#ec4899" strokeWidth="1.5" />
            </g>
            <g transform="rotate(270, 250, 250)">
              <circle cx="325" cy="250" r="5" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.5" />
            </g>
          </g>

          {/* Quantum core central glowing node */}
          <circle cx="250" cy="250" r="14" fill="url(#coreGlow)" />
          <circle cx="250" cy="250" r="6" fill="#ffffff" />
        </g>
      </svg>

      {/* High-tech Interactive Lightbox Viewer */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl"
            onClick={() => setIsViewerOpen(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors z-10"
              onClick={() => setIsViewerOpen(false)}
              aria-label="Close viewer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-2xl w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row gap-8 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated high-tech grid background inside the modal */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

              {/* Glowing decorative blobs */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

              {/* High-res Generated Logo Container */}
              <div className="relative shrink-0 w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950 p-2 shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={aretherisLogoImg}
                  alt="Aretheris Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Branding / Details text */}
              <div className="flex-grow space-y-4 text-center md:text-left relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase">
                    Official Brand Identity
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-white tracking-tight mt-2">
                    Aretheris Technologies
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    M-GLYPH RECONSTRUCTION // V3.4
                  </p>
                </div>

                <div className="h-px bg-slate-800/80" />

                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  The Aretheris Mesh glyph represents a decentralized, self-healing quantum-neural network. 
                  The triangular lattice outlines our post-quantum cryptographic core, connecting globally distributed edge nodes 
                  through zero-knowledge communication channels.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                    <span className="block text-[10px] font-mono text-slate-500">GRID COLOR</span>
                    <span className="text-xs font-mono font-semibold text-blue-400">#38BDF8 / #6366F1</span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
                    <span className="block text-[10px] font-mono text-slate-500">ARCHITECTURE</span>
                    <span className="text-xs font-mono font-semibold text-indigo-400">Lattice Mesh</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer"
                    onClick={handleDownloadLogo}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Logo</span>
                  </button>
                  <button
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-all duration-300 cursor-pointer"
                    onClick={() => setIsViewerOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
