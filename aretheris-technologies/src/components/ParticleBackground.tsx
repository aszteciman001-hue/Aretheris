/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalVx: number;
  originalVy: number;
  size: number;
  color: string;
  rgb: string; // Base rgb string for line connections, e.g. "59, 130, 246"
  alpha: number;
  pulseSpeed: number;
  pulseTime: number;
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = window.matchMedia("(pointer: coarse)").matches ? 12 : 30; // Limit for optimal performance and zero lag
    const connectionDistance = 110;
    const attractRadius = 220;

    const colors = [
      { rgb: "59, 130, 246", hex: "#3b82f6" },   // Blue
      { rgb: "99, 102, 241", hex: "#6366f1" },   // Indigo
      { rgb: "168, 85, 247", hex: "#a855f7" },   // Purple
      { rgb: "16, 185, 129", hex: "#10b981" },   // Emerald/Teal
    ];

    // Track mouse coordinates relative to the canvas container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // If the mouse is within the viewport bounds of this container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.active = true;
      } else {
        mouseRef.current.active = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initialize particles
    const createParticles = (width: number, height: number) => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        const colorObj = colors[Math.floor(Math.random() * colors.length)];
        const vx = (Math.random() - 0.5) * 0.5;
        const vy = (Math.random() - 0.5) * 0.5;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          originalVx: vx,
          originalVy: vy,
          size: Math.random() * 2 + 1,
          color: colorObj.hex,
          rgb: colorObj.rgb,
          alpha: Math.random() * 0.4 + 0.2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          pulseTime: Math.random() * Math.PI * 2,
        });
      }
    };

    let dimensions = { width: 0, height: 0 };

    // Set up ResizeObserver to handle container element resizing properly
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const width = entry.contentRect.width || container.clientWidth;
      const height = entry.contentRect.height || container.clientHeight;

      dimensions = { width, height };

      // Set high-DPI resolution (capped for maximum rendering performance)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // (Re)create particles when resized if they haven't been initialized
      if (particles.length === 0) {
        createParticles(width, height);
      } else {
        // Adapt existing particles to new bounding box limits
        particles.forEach((p) => {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      }
    });

    resizeObserver.observe(container);

    // Physics update & rendering loop
    const tick = () => {
      const { width, height } = dimensions;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Step 1: Draw mouse attractor connection highlights (before drawing nodes)
      const mouse = mouseRef.current;

      // Step 2: Update and draw individual particles
      particles.forEach((p) => {
        // Ambient drift update
        p.pulseTime += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulseTime) * 0.1;

        // Physics attraction calculations
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < attractRadius) {
            // Stronger pull when closer, up to a ceiling limit
            const force = (attractRadius - dist) / attractRadius;
            p.vx += (dx / dist) * force * 0.08;
            p.vy += (dy / dist) * force * 0.08;

            // Draw clean subtle filament lines from tech cursor to nearby particles
            if (dist < attractRadius * 0.6) {
              const attractorLineAlpha = (1 - dist / (attractRadius * 0.6)) * 0.15;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(p.x, p.y);
              ctx.strokeStyle = `rgba(${p.rgb}, ${attractorLineAlpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }

        // Apply friction/drag to slow down particle overshoot
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Restore fractional original ambient drift vector
        p.vx += (p.originalVx - p.vx) * 0.04;
        p.vy += (p.originalVy - p.vy) * 0.04;

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Boundary safety wrap-around or bounce
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render point/node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb}, ${currentAlpha})`;
        ctx.fill();

        // Draw a simulated glow for mouse-proximate particles using a secondary larger arc, infinitely faster than canvas shadowBlur
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          if (mdx * mdx + mdy * mdy < 10000) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.rgb}, ${currentAlpha * 0.25})`;
            ctx.fill();
          }
        }
      });

      // Step 3: Draw local mesh network connections ("Neural Fabric")
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistance * connectionDistance) {
            const dist = Math.sqrt(distSq);
            // Linear falloff alpha based on proximity
            const lineAlpha = (1 - dist / connectionDistance) * 0.12;
            
            // Set mixed gradient or simple color line
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(${pi.rgb}, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-particle-system-container"
      className="absolute inset-0 w-full h-full pointer-events-none z-1"
      style={{ mixBlendMode: "screen" }}
    >
      <canvas
        ref={canvasRef}
        id="hero-particle-canvas"
        className="w-full h-full block opacity-75"
      />
    </div>
  );
}
