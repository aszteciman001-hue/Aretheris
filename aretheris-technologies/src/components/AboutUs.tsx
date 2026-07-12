/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import IconRenderer from "./IconRenderer";

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  stats: { label: string; value: string }[];
  graphicType: "founding" | "nodes" | "neural";
}

const MILESTONES: Milestone[] = [
  {
    year: "2026",
    title: "Launch Eduverse Platform",
    subtitle: "A decentralized virtual education metaverse",
    description: "Our primary current roadmap target is the launch of Eduverse, a decentralized virtual education ecosystem. Built with real-time distributed simulations, low-latency physics execution on edge node clusters, and secure verified learning networks to make advanced, immersive classrooms accessible worldwide.",
    icon: "BookOpen",
    stats: [
      { label: "Partner Classrooms", value: "0" },
      { label: "Target Sim Latency", value: "< 15ms" },
      { label: "Educational Nodes", value: "2,500+" }
    ],
    graphicType: "nodes"
  }
];

const CORE_VALUES = [
  {
    title: "Radical Decentralization",
    description: "We believe computing power belongs at the edge. By removing centralized gatekeepers, we eliminate single points of failure and empower developers with absolute digital autonomy.",
    icon: "Network",
    color: "blue"
  },
  {
    title: "Quantum-Safe Guard",
    description: "Security is non-negotiable. Our architecture is built from the ground up utilizing post-quantum cryptographic primitives, protecting your intellectual property against future threats.",
    icon: "ShieldCheck",
    color: "indigo"
  },
  {
    title: "Eco-Active Intelligence",
    description: "Computing shouldn't cost the Earth. We actively route processor-heavy container workloads to clusters fueled by local solar, wind, and geothermal grids.",
    icon: "Zap",
    color: "purple"
  },
  {
    title: "Absolute Transparency",
    description: "Our core protocol is open, verifiable, and governed by collaborative consensus. Every node execution signature is cryptographically transparent and peer-validated.",
    icon: "Lock",
    color: "pink"
  }
];

export default function AboutUs() {
  const [activeYear, setActiveYear] = useState<string>("2026");
  const selectedMilestone = MILESTONES.find((m) => m.year === activeYear) || MILESTONES[0];

  return (
    <section id="about" className="py-24 bg-[#020617] border-t border-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Visual Grid & Glowing Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-blue-400 tracking-widest uppercase"
          >
            Our Architecture & Story
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-100 mt-2"
          >
            Decentralizing the Future of Compute
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto mt-4 font-light"
          >
            An ambitious group of cryptographers, distributed engineers, and visionaries, weaving a secure, low-latency computational fabric across the globe.
          </motion.p>
        </div>

        {/* Mission & Vision Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.25)" }}
            className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-500 pointer-events-none" />
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <IconRenderer name="Target" size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-100 uppercase tracking-wide">
                Our Mission
              </h3>
            </div>
            <p className="text-slate-400 font-light leading-relaxed text-base">
              To decentralize processing power globally, removing artificial latency barriers, and creating a highly secure, energy-positive digital fabric. We want computing power to be as fluid and accessible as oxygen.
            </p>
            <div className="mt-6 flex items-center space-x-2 text-xs font-mono text-blue-400 font-semibold">
              <span>ACTIVE OBJECTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, borderColor: "rgba(99, 102, 241, 0.25)" }}
            className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-500 pointer-events-none" />
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <IconRenderer name="Compass" size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-100 uppercase tracking-wide">
                Our Vision
              </h3>
            </div>
            <p className="text-slate-400 font-light leading-relaxed text-base">
              A world where secure high-performance computing is ambient, frictionless, and zero-carbon, powered dynamically by distributed collective intelligence. We see a future free of centralized server monopolies.
            </p>
            <div className="mt-6 flex items-center space-x-2 text-xs font-mono text-indigo-400 font-semibold">
              <span>GUIDING HORIZON</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* History / Timeline Visual Narrative */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-display font-bold text-slate-100">
              Our Active Roadmap Target
            </h3>
            {MILESTONES.length > 1 && (
              <p className="text-xs font-mono text-slate-500 mt-2">
                CLICK A YEAR TO TRACE OUR GRID EXPANSION
              </p>
            )}
          </div>

          {/* Interactive Year Selector line */}
          {MILESTONES.length > 1 && (
            <div className="flex justify-center mb-12 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-900 -translate-y-1/2 z-0 max-w-xl mx-auto hidden sm:block" />
              <div className="relative z-10 flex space-x-6 sm:space-x-16">
                {MILESTONES.map((m) => {
                  const isActive = activeYear === m.year;
                  return (
                    <button
                      key={m.year}
                      onClick={() => setActiveYear(m.year)}
                      className="focus:outline-none flex flex-col items-center group"
                    >
                      <motion.div
                        animate={{
                          scale: isActive ? 1.25 : 1,
                          borderColor: isActive ? "#2563eb" : "rgba(30, 41, 59, 1)",
                          backgroundColor: isActive ? "#0f172a" : "#020617"
                        }}
                        className="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg relative"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeYearRing"
                            className="absolute -inset-1 rounded-full border border-blue-500/50"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                        )}
                        <span className={`text-sm font-mono font-bold ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                          {m.year}
                        </span>
                      </motion.div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milestone Details Card & Graphic */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Text Content Block */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <IconRenderer name={selectedMilestone.icon} size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-blue-400 font-bold block">
                        {selectedMilestone.year === "2026"
                          ? "ACTIVE ROADMAP TARGET"
                          : "LONG-TERM VISION"}
                      </span>
                      <h4 className="text-2xl font-display font-bold text-slate-100">
                        {selectedMilestone.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm font-mono text-slate-500 italic">
                    {selectedMilestone.subtitle}
                  </p>

                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    {selectedMilestone.description}
                  </p>

                  {/* Micro Stats Row */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/50">
                    {selectedMilestone.stats.map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-2xl font-display font-bold text-slate-100 tracking-tight">
                          {stat.value}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engaging Interactive Graphic / Diagram Block */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-[320px] aspect-square rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent opacity-50" />
                    
                    {/* Render custom graphic based on active narrative */}
                    {selectedMilestone.graphicType === "founding" && (
                      <div className="relative flex items-center justify-center w-full h-full">
                        {/* Orbiting Ring Diagram */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="w-40 h-40 rounded-full border border-dashed border-blue-500/30 flex items-center justify-center"
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -top-1.25" />
                        </motion.div>
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="w-28 h-28 rounded-full border border-dashed border-indigo-500/30 flex items-center justify-center absolute"
                        >
                          <div className="w-2 h-2 rounded-full bg-indigo-400 absolute -bottom-1" />
                        </motion.div>
                        {/* Core Nucleus */}
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center z-10">
                          <IconRenderer name="Award" className="text-blue-400" size={24} />
                        </div>
                      </div>
                    )}

                    {selectedMilestone.graphicType === "nodes" && (
                      <div className="relative flex items-center justify-center w-full h-full">
                        {/* Connected Mesh Map Grid Visual */}
                        <div className="grid grid-cols-4 gap-6 relative z-10 p-6">
                          {[...Array(12)].map((_, i) => {
                            const isNodeActive = i % 3 !== 0;
                            return (
                              <motion.div
                                key={i}
                                animate={isNodeActive ? { scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] } : {}}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                className={`w-3.5 h-3.5 rounded-md border ${
                                  isNodeActive
                                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                    : "bg-slate-950 border-slate-800 text-slate-800"
                                } flex items-center justify-center`}
                              >
                                {isNodeActive && <div className="w-1 h-1 rounded-full bg-blue-400" />}
                              </motion.div>
                            );
                          })}
                        </div>
                        {/* Connecting lasers lines background */}
                        <svg className="absolute inset-0 w-full h-full stroke-blue-500/10 stroke-1 pointer-events-none">
                          <line x1="10%" y1="20%" x2="90%" y2="80%" />
                          <line x1="90%" y1="10%" x2="20%" y2="90%" />
                          <line x1="50%" y1="0%" x2="50%" y2="100%" />
                        </svg>
                      </div>
                    )}

                    {selectedMilestone.graphicType === "neural" && (
                      <div className="relative flex items-center justify-center w-full h-full">
                        {/* Interactive Neural Nodes */}
                        <div className="relative w-44 h-44">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                          >
                            {/* Orbiting Node dots */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px] font-mono font-bold">1</div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-mono font-bold">2</div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px] font-mono font-bold">3</div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-white text-[8px] font-mono font-bold">4</div>
                          </motion.div>
                          
                          {/* Pulsing Synapse center */}
                          <div className="absolute inset-10 rounded-full bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-14 h-14 rounded-full bg-indigo-600/10 border border-indigo-400/50 flex items-center justify-center text-indigo-400"
                            >
                              <IconRenderer name="BrainCircuit" size={24} />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Core Values Grid */}
        <div>
          <div className="text-center mb-16">
            <h3 className="text-2xl font-display font-bold text-slate-100">
              Our Operational Core Values
            </h3>
            <p className="text-slate-400 max-w-lg mx-auto mt-2 text-sm font-light">
              The foundational codes embedded inside our culture and engineering protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const borderHoverColor =
                val.color === "blue"
                  ? "hover:border-blue-500/30"
                  : val.color === "indigo"
                  ? "hover:border-indigo-500/30"
                  : val.color === "purple"
                  ? "hover:border-purple-500/30"
                  : "hover:border-pink-500/30";

              const textClassColor =
                val.color === "blue"
                  ? "text-blue-400"
                  : val.color === "indigo"
                  ? "text-indigo-400"
                  : val.color === "purple"
                  ? "text-purple-400"
                  : "text-pink-400";

              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`bg-slate-900/30 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${borderHoverColor}`}
                >
                  <div className="space-y-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-950 border border-slate-800 transition-colors group-hover:border-slate-700 ${textClassColor}`}>
                      <IconRenderer name={val.icon} size={20} />
                    </div>
                    <h4 className="text-base font-display font-bold text-slate-200 group-hover:text-white transition-colors">
                      {val.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
