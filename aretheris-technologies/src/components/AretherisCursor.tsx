import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function AretherisCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // High precision mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth trail spring configuration - ultra high sensitivity and zero lag rate
  const springConfig = { damping: 20, stiffness: 1200, mass: 0.02 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices (where hover / mousemove is not applicable)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    if (mediaQuery.matches) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Visibility handlers for document focus / window bounds
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, [data-interactive="true"], label');
      setIsHovered(!!interactive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer techy bracket/ring tracker - follows smoothly with lag */}
      <motion.div
        id="tech-cursor-outer"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 1.4 : isHovered ? 1.6 : 1,
          rotate: isHovered ? 90 : isClicked ? 45 : 0,
          borderColor: isHovered ? "rgba(96, 165, 250, 0.8)" : "rgba(59, 130, 246, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 950, damping: 25 }}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] hidden md:flex items-center justify-center border rounded-full"
      >
        {/* Subtle crosshair hair lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-500/15" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-blue-500/15" />
        
        {/* Techy outer dots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full" />
      </motion.div>

      {/* Inner pinpoint high-tech arrow pointer - snaps directly to raw mouse position */}
      <motion.div
        id="tech-cursor-inner"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-2px",
          translateY: "-2px",
        }}
        animate={{
          scale: isClicked ? 0.85 : isHovered ? 1.15 : 1,
        }}
        transition={{ type: "tween", duration: 0.08, ease: "easeOut" }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)] filter dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.9)]"
        >
          {/* Neon inner Arrow path styled with clean border */}
          <path
            d="M3 2 L3 17 L7.5 12.5 L12 21 L14.5 19.5 L10 11 L15.5 11 Z"
            fill="url(#cursorGradient)"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </>
  );
}
