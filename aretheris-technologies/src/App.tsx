/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Products from "./components/Products";
import VisualizerDemo from "./components/VisualizerDemo";
import TechMetrics from "./components/TechMetrics";
import InquiryForm from "./components/InquiryForm";
import Footer from "./components/Footer";
import AretherisCursor from "./components/AretherisCursor";
import TechLoadingSkeleton from "./components/TechLoadingSkeleton";
import GatewayPortal from "./components/GatewayPortal";

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  // Keep HTML root class in sync with theme state
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Disable body scroll when loading is active or gateway portal is open to lock scroll
  useEffect(() => {
    if (!hasStarted || isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasStarted, isLoading]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Dynamic viewport scroll-spy listener to update Navbar highlighted link
  useEffect(() => {
    const sections = ["hero", "about", "products", "visualizer", "metrics", "contact"];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.3; // 30% viewport offset for active state
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial calculation
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler
  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  if (!hasStarted) {
    return (
      <div className="bg-[#020617] min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-blue-300 md:cursor-none">
        {/* Global Tech Cursor */}
        <AretherisCursor />
        <GatewayPortal onEnter={() => setHasStarted(true)} />
      </div>
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-blue-300 md:cursor-none">
      <AnimatePresence mode="wait">
        {isLoading && (
          <TechLoadingSkeleton onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Global Tech Cursor */}
      <AretherisCursor />

      {!isLoading && (
        <>
          {/* Sticky navigation bar */}
          <Navbar 
            onScrollTo={handleScrollTo} 
            activeSection={activeSection} 
            theme={theme} 
            onToggleTheme={handleToggleTheme} 
            onTriggerDiagnostics={() => setIsLoading(true)} 
          />

          {/* Main sections */}
          <main>
            {/* Parallax Hero section (immediately active on page load) */}
            <Hero 
              onExplore={() => handleScrollTo("products")} 
              onInquire={() => handleScrollTo("visualizer")} 
            />

            {/* Animated About Us section */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.6 }}
            >
              <AboutUs />
            </motion.div>

            {/* Bento Products listing */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.6, delay: 0.05 }}
            >
              <Products />
            </motion.div>

            {/* Dynamic Topology Interactive Visualizer */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.6 }}
            >
              <VisualizerDemo />
            </motion.div>

            {/* Stats gauges and efficiency metric meters */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.6 }}
            >
              <TechMetrics />
            </motion.div>

            {/* Secure Lattice Inquiry Contact Portal */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.6 }}
            >
              <InquiryForm />
            </motion.div>
          </main>

          {/* Detailed tech footer */}
          <Footer onScrollTo={handleScrollTo} />
        </>
      )}
    </div>
  );
}
