/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { METRICS } from "../data";
import IconRenderer from "./IconRenderer";

export default function TechMetrics() {
  // Simulated dynamic incremental counting stats for interactive feel
  const [nodesCount, setNodesCount] = useState(12410);
  const [computePower, setComputePower] = useState(84.3);
  const [avoidanceIndex, setAvoidanceIndex] = useState(94.1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Shifting stats slightly to feel live
      setNodesCount((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
      setComputePower((prev) => parseFloat((prev + (Math.random() * 0.1 - 0.04)).toFixed(1)));
      setAvoidanceIndex((prev) => parseFloat((prev + (Math.random() * 0.05 - 0.02)).toFixed(1)));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Helper dictionary of coordinates for sparkline drawings
  const sparklines: Record<string, string> = {
    "Global Mesh Nodes": "M 0 35 Q 20 20, 40 40 T 80 15 T 120 5",
    "Active Compute Power": "M 0 30 Q 15 45, 45 25 T 90 10 T 120 18",
    "Network Congestion Status": "M 0 40 Q 30 15, 60 20 T 90 45 T 120 38",
    "Carbon Avoidance Index": "M 0 38 Q 20 40, 50 15 T 90 28 T 120 8"
  };

  const getStatValue = (label: string, fallback: number) => {
    if (label === "Global Mesh Nodes") return nodesCount;
    if (label === "Active Compute Power") return computePower;
    if (label === "Carbon Avoidance Index") return avoidanceIndex;
    return fallback;
  };

  return (
    <section id="metrics" className="py-24 bg-[#020617] border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">
            Staging telemetry & targets
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-100 mt-2">
            Protocol Performance Targets
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mt-4 font-light">
            Live telemetry of our active sandbox testnets alongside projected metrics and operational targets as we scale.
          </p>
        </div>

        {/* Numeric Telemetry Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {METRICS.map((metric, idx) => {
            const val = getStatValue(metric.label, metric.value);
            const pathData = sparklines[metric.label] || "M 0 20 L 120 20";
            
            return (
              <motion.div
                key={idx}
                id={`metric-stat-card-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.25)" }}
                className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual gradient backdrop */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                    {metric.label}
                  </span>
                  
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-display font-bold text-slate-100 tracking-tight">
                      {val.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">{metric.unit}</span>
                  </div>
                </div>

                {/* Trend sparkline overlay */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-blue-400 font-semibold">
                    <IconRenderer name="TrendingUp" size={14} />
                    <span>+{metric.change}%</span>
                  </div>

                  {/* High fidelity SVG sparkline */}
                  <svg className="w-20 h-10 overflow-visible opacity-60">
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={`${pathData} L 120 40 L 0 40 Z`}
                      fill="url(#sparkline-gradient)"
                      className="opacity-15"
                    />
                    
                    <defs>
                      <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* High Tech Radial Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Detailed Metric Description (5 Cols) */}
          <div className="col-span-1 lg:col-span-5 bg-slate-900/20 border border-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase block">
                Mesh Protocol Target
              </span>
              <h3 className="text-2xl font-display font-bold text-slate-100 leading-snug">
                Power-to-Inference Synthesis
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Our network operates on active heat dissipation harvesting. Compute cycles are automatically routed into regions with optimal solar and thermal energy capacity coefficients.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <IconRenderer name="Check" className="text-blue-400" size={16} />
                <span>Zero-carbon dynamic execution protocols</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <IconRenderer name="Check" className="text-blue-400" size={16} />
                <span>Optimal packet clustering isolation</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <IconRenderer name="Check" className="text-blue-400" size={16} />
                <span>Distributed consensus power matching</span>
              </div>
            </div>
          </div>

          {/* Interactive Radial Progress Widgets (7 Cols) */}
          <div className="col-span-1 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Widget 1 */}
            <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col items-center justify-between text-center relative overflow-hidden group">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                Mesh Efficiency
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#3b82f6"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 - (301.6 * 98.6) / 100}
                    strokeLinecap="round"
                    className="group-hover:stroke-blue-400 transition-colors"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-xl font-display font-bold text-slate-100">98.6%</span>
                  <span className="text-[9px] font-mono text-slate-500 block">PUE Limit</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-4 font-mono">Consolidated Nodes</span>
            </div>

            {/* Widget 2 */}
            <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col items-center justify-between text-center relative overflow-hidden group">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                Neural Sync Rate
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#6366f1"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 - (301.6 * 84.2) / 100}
                    strokeLinecap="round"
                    className="group-hover:stroke-indigo-400 transition-colors"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-xl font-display font-bold text-slate-100">84.2%</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Federated</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-4 font-mono">Active Convergence</span>
            </div>

            {/* Widget 3 */}
            <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col items-center justify-between text-center relative overflow-hidden group">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                Crypto Lattice
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#a855f7"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 - (301.6 * 100) / 100}
                    strokeLinecap="round"
                    className="group-hover:stroke-purple-400 transition-colors"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-xl font-display font-bold text-slate-100">100%</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Isolated</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-4 font-mono">Quantum Hardened</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
