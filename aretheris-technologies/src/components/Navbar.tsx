/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Cpu } from "lucide-react";
import IconRenderer from "./IconRenderer";
import AretherisLogo from "./AretherisLogo";

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  activeSection: string;
  theme: string;
  onToggleTheme: () => void;
  onTriggerDiagnostics: () => void;
}

export default function Navbar({ onScrollTo, activeSection, theme, onToggleTheme, onTriggerDiagnostics }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Overview", id: "hero" },
    { label: "About Us", id: "about" },
    { label: "Core Products", id: "products" },
    { label: "Command Center", id: "visualizer" },
    { label: "Performance Stats", id: "metrics" },
    { label: "Inquire", id: "contact" }
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollTo(id);
  };

  return (
    <>
      <motion.header
        id="navbar-container"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/60 py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              id="navbar-logo-btn"
              onClick={() => handleNavClick("hero")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNavClick("hero");
                }
              }}
              className="flex items-center space-x-2 group focus:outline-none cursor-pointer select-none"
            >
              <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700/80 group-hover:border-blue-500/50 transition-all duration-300">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0.5 rounded bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 opacity-60"
                />
                <AretherisLogo size={24} className="relative z-10" interactive={true} />
              </div>
              <span className="font-display font-bold tracking-tight text-lg text-slate-100 group-hover:text-blue-300 transition-colors duration-300">
                ARETHERIS
              </span>
            </div>
            {/* Desktop Navigation */}
            <nav id="desktop-nav" className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-md focus:outline-none ${
                      isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-slate-900/60 border border-slate-800/80 rounded-md -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* CTA Desktop & Theme Switcher */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                id="diagnostics-toggle-btn"
                onClick={onTriggerDiagnostics}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/30 font-mono text-xs tracking-wider transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] focus:outline-none flex items-center space-x-1.5 cursor-pointer"
                title="Run Core Quantum Diagnostics Simulation"
              >
                <Cpu size={14} className="animate-pulse" />
                <span>DIAGNOSTICS</span>
              </button>

              <button
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all hover:border-slate-700 focus:outline-none flex items-center justify-center cursor-pointer"
                title={theme === "dark" ? "Switch to High-Contrast Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-indigo-600" />
                )}
              </button>

              <motion.button
                id="navbar-cta"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick("contact")}
                className="relative overflow-hidden group px-4 py-2 rounded-lg bg-blue-600 text-white font-display font-semibold text-sm tracking-wide shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                Inquire Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-400 hover:text-slate-100 p-1.5 focus:outline-none"
              >
                <IconRenderer name={mobileMenuOpen ? "X" : "Menu"} size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[60px] left-0 right-0 z-40 bg-[#020617]/95 backdrop-blur-lg border-b border-slate-900 md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-blue-400 border border-slate-800/80"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-2 border-t border-slate-900 space-y-2">
                <button
                  id="mobile-diagnostics-toggle"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onTriggerDiagnostics();
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-sm transition-all focus:outline-none cursor-pointer"
                >
                  <span>RUN CORE DIAGNOSTICS</span>
                  <Cpu size={16} className="animate-pulse" />
                </button>

                <button
                  id="mobile-theme-toggle"
                  onClick={onToggleTheme}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium text-sm transition-all focus:outline-none cursor-pointer"
                >
                  <span>{theme === "dark" ? "High-Contrast Light Mode" : "Dark Space Mode"}</span>
                  {theme === "dark" ? (
                    <Sun size={18} className="text-amber-400" />
                  ) : (
                    <Moon size={18} className="text-indigo-400" />
                  )}
                </button>

                <button
                  id="mobile-nav-cta"
                  onClick={() => handleNavClick("contact")}
                  className="w-full py-3 rounded-md bg-blue-600 text-white font-display font-semibold text-center text-sm shadow-md"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
