/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import IconRenderer from "./IconRenderer";
import AretherisLogo from "./AretherisLogo";

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
}

export default function Footer({ onScrollTo }: FooterProps) {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as YYYY-MM-DD HH:MM:SS UTC
      const yyyy = now.getUTCFullYear();
      const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(now.getUTCDate()).padStart(2, "0");
      const hh = String(now.getUTCHours()).padStart(2, "0");
      const min = String(now.getUTCMinutes()).padStart(2, "0");
      const ss = String(now.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const footerLinks = {
    Solutions: [
      { label: "Aether Compute", id: "products" },
      { label: "Synapse Neural Core", id: "products" },
      { label: "Aegis Cyber-Shield", id: "products" }
    ],
    Resource: [
      { label: "About Us", id: "about" },
      { label: "Command Topology", id: "visualizer" },
      { label: "Systems Metrics", id: "metrics" },
      { label: "Secure Integration", id: "contact" }
    ],
    Legal: [
      { label: "Lattice Compliance", id: "contact" },
      { label: "Zero-Knowledge Policy", id: "products" },
      { label: "Service Level Standard", id: "metrics" }
    ]
  };

  return (
    <footer id="footer-container" className="bg-[#020617] border-t border-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-900">
          
          {/* Logo & Pitch (5 columns on large screen) */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <button
              onClick={() => onScrollTo("hero")}
              className="flex items-center space-x-2 group focus:outline-none"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-900 border border-slate-800">
                <AretherisLogo size={20} interactive={true} />
              </div>
              <span className="font-display font-bold tracking-tight text-slate-200 text-base">
                ARETHERIS
              </span>
            </button>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Decentralizing global computation grids with quantum-hardened security and low-latency synaptic inference fabrics.
            </p>
          </div>

          {/* Links sections (7 columns on large screen) */}
          <div className="col-span-1 md:col-span-7 grid grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-4">
                <h4 className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <button
                        onClick={() => onScrollTo(link.id)}
                        className="text-xs text-slate-500 hover:text-blue-400 font-sans transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Lower footer (telemetry timestamps & copyright) */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="text-xs font-mono text-slate-600">
              © {new Date().getFullYear()} Aretheris Technologies Inc.
            </span>
            <span className="hidden sm:inline text-slate-800">|</span>
            <span className="text-xs font-mono text-slate-500 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Mesh Status: Fully Operational</span>
            </span>
          </div>

          {/* Clock and Return to Top */}
          <div className="flex items-center space-x-6">
            <span className="text-xs font-mono text-slate-600 select-all" title="Secure local UTC heartbeat">
              {utcTime}
            </span>
            <button
              onClick={() => onScrollTo("hero")}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all duration-300 focus:outline-none"
              title="Return to home gateway"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
