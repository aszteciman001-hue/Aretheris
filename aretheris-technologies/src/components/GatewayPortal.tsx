import React from "react";
import { motion } from "motion/react";
import AretherisLogo from "./AretherisLogo";
import { Shield, Network, Zap, Cpu } from "lucide-react";

interface GatewayPortalProps {
  onEnter: () => void;
}

export default function GatewayPortal({ onEnter }: GatewayPortalProps) {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between overflow-hidden px-6 md:px-12 py-8 font-sans select-none">
      
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto border-b border-slate-900/60 pb-5">
        <div className="flex items-center space-x-2">
          <AretherisLogo size={24} interactive={true} />
          <span className="font-display font-black tracking-tight text-slate-100 text-lg">
            ARETHERIS
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-500 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-900">
          NODE STATUS: <span className="text-emerald-400">ACTIVE</span>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 py-12 md:py-16">
        
        {/* Left: Text Content and Button */}
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8 text-left">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 px-3 py-1 rounded-full"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-[11px] text-cyan-400 font-medium tracking-wider uppercase">
                Secure Quantum-Neural Cloud Portal
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-extrabold tracking-tight text-4xl sm:text-6xl text-slate-100 leading-none"
            >
              Aretheris <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
                Technologies
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-400 font-light text-base sm:text-lg max-w-lg leading-relaxed"
            >
              Welcome to the digital gateway of Aretheris Technologies. Initialize our core interface to explore decentralized computing simulations, quantum mesh networks, and the 2026 Eduverse roadmap.
            </motion.p>
          </div>

          {/* Interactive Get Started Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full sm:w-auto"
          >
            <button
              onClick={onEnter}
              className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-[1px] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative px-8 py-4 bg-slate-950 rounded-[11px] transition-colors duration-300 group-hover:bg-slate-950/80 flex items-center justify-center space-x-3">
                <span className="font-mono text-xs sm:text-sm tracking-[0.2em] font-bold text-slate-100">
                  GET STARTED // INITIALIZE
                </span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="text-cyan-400"
                >
                  &rarr;
                </motion.span>
              </div>
            </button>
          </motion.div>

          {/* Feature Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-900/60 w-full"
          >
            {[
              { icon: Cpu, label: "Quantum Mesh" },
              { icon: Shield, label: "AES-GCM-256" },
              { icon: Network, label: "Edge Clusters" },
              { icon: Zap, label: "Low Latency" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2.5 text-slate-500">
                <item.icon size={14} className="text-blue-500/70" />
                <span className="font-mono text-[10px] tracking-wider uppercase">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Immersive Logo Canvas Accent */}
        <div className="w-full lg:w-1/2 flex justify-center items-center relative py-6 md:py-12">
          {/* Circular Orbiting Ring Shadows */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[320px] h-[320px] rounded-full border border-dashed border-slate-900/80 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-900/40 animate-[spin_90s_linear_infinite_reverse]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, type: "spring" }}
            className="relative"
          >
            <AretherisLogo size={360} interactive={true} />
          </motion.div>
        </div>

      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-slate-900/60 pt-5 text-[10px] text-slate-500 font-mono gap-3">
        <div>
          ARETHERIS SECURITY VERIFICATION LEDGERS &copy; {new Date().getFullYear()} // ALL RIGHTS RESERVED.
        </div>
        <div className="flex space-x-4">
          <span>SECURE PROTOCOL v2.4</span>
          <span className="text-cyan-500/60">SYS_CORRELATION: ONLINE</span>
        </div>
      </footer>

    </div>
  );
}