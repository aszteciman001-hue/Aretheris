/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../data";
import { TechProduct } from "../types";
import IconRenderer from "./IconRenderer";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<"all" | "compute" | "neural" | "security">("all");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(PRODUCTS[0].id);
  const [workloadSlider, setWorkloadSlider] = useState<number>(40);

  const handleSelectProduct = (id: string) => {
    setSelectedProduct(id);
    setWorkloadSlider(id === "aether-compute" ? 40 : id === "synapse-neural" ? 60 : 75);
  };

  const filteredProducts = PRODUCTS.filter(
    (product) => activeCategory === "all" || product.category === activeCategory
  );

  const categories = [
    { label: "All Tech", value: "all" },
    { label: "Mesh Compute", value: "compute" },
    { label: "Neural Nets", value: "neural" },
    { label: "Cyber Security", value: "security" }
  ];

  return (
    <section id="products" className="py-24 bg-[#020617] border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-blue-400 tracking-widest uppercase"
          >
            Capabilities Spectrum
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-100 mt-2"
          >
            Enterprise Infrastructure Suite
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto mt-4 font-light"
          >
            Engineered with military-grade resilience and decentralized speed. Click any capability cell to view live hardware specifications.
          </motion.p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-slate-900/60 border border-slate-800 rounded-xl space-x-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`cat-tab-${cat.value}`}
                  onClick={() => setActiveCategory(cat.value as any)}
                  className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none ${
                    isSelected ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Cards List (8 Cols on lg) */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => {
                const isSelected = selectedProduct === product.id;
                const glowColor =
                  product.color === "teal"
                    ? "group-hover:border-blue-500/30"
                    : product.color === "violet"
                    ? "group-hover:border-indigo-500/30"
                    : "group-hover:border-purple-500/30";

                const accentColor =
                  product.color === "teal"
                    ? "text-blue-400"
                    : product.color === "violet"
                    ? "text-indigo-400"
                    : "text-purple-400";

                return (
                  <motion.div
                    key={product.id}
                    layout
                    id={`product-card-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onClick={() => handleSelectProduct(product.id)}
                    className={`group cursor-pointer p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? "bg-slate-900/90 border-slate-700/80 shadow-2xl"
                        : "bg-[#020617] hover:bg-slate-900/40 border-slate-900 hover:border-slate-800"
                    } ${glowColor}`}
                  >
                    {/* Active highlight side line */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeProductLine"
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          product.color === "teal"
                            ? "bg-blue-500"
                            : product.color === "violet"
                            ? "bg-indigo-500"
                            : "bg-purple-500"
                        }`}
                      />
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                            product.color === "teal"
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                              : product.color === "violet"
                              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                              : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          }`}>
                            {product.status}
                          </span>
                          <span className="text-xs font-mono text-slate-500 uppercase">
                            Category: {product.category}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100 group-hover:text-white transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors ${accentColor}`}>
                        <IconRenderer
                          name={product.features[0].icon}
                          size={24}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-xl">
                      {product.tagline}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4 items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 hover:text-slate-300 transition-colors flex items-center space-x-1">
                        <span>Read technical specs</span>
                        <IconRenderer name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Product Specs Detail View (5 Cols on lg) */}
          <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              {PRODUCTS.filter((p) => p.id === selectedProduct).map((product) => {
                const accentColor =
                  product.color === "teal"
                    ? "text-blue-400"
                    : product.color === "violet"
                    ? "text-indigo-400"
                    : "text-purple-400";
                
                const badgeColor =
                  product.color === "teal"
                    ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
                    : product.color === "violet"
                    ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400"
                    : "bg-purple-500/5 border-purple-500/20 text-purple-400";

                return (
                  <motion.div
                    key={product.id}
                    id="product-spec-panel"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-6"
                  >
                    <div>
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">
                        Core System Blueprint
                      </span>
                      <h3 className="text-2xl font-display font-bold text-slate-100 flex items-center space-x-2">
                        <span>{product.name}</span>
                      </h3>
                      <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/80 pt-6 space-y-4">
                      <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Performance Highlights
                      </h4>
                      {product.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-950 border border-slate-800 shrink-0 ${accentColor}`}>
                            <IconRenderer name={feature.icon} size={16} />
                          </div>
                          <div className="space-y-1 grow">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-200">{feature.title}</span>
                              {feature.metric && (
                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border font-medium ${badgeColor}`}>
                                  {feature.metric}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 leading-normal">{feature.description}</p>
                            {feature.metricLabel && (
                              <span className="text-[10px] font-mono text-slate-600 block">{feature.metricLabel}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Sandbox Simulator */}
                    <div className="border-t border-slate-800/80 pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                          Interactive Mesh Sandbox
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase font-semibold">
                          Live Simulation
                        </span>
                      </div>
                      
                      <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800/50">
                        {product.id === "aether-compute" && (
                          <>
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-slate-400">Mesh Node Allocation:</span>
                              <span className="text-blue-400 font-bold">{workloadSlider} clusters</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="150"
                              value={workloadSlider}
                              onChange={(e) => setWorkloadSlider(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono border-t border-slate-900">
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Throughput</span>
                                <span className="text-slate-200 font-semibold font-display text-sm">{(workloadSlider * 2850).toLocaleString()} ops/s</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Routing Latency</span>
                                <span className="text-slate-200 font-semibold font-display text-sm">{(0.85 + (workloadSlider * 0.003)).toFixed(3)} ms</span>
                              </div>
                            </div>
                          </>
                        )}

                        {product.id === "synapse-neural" && (
                          <>
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-slate-400">Device Slices:</span>
                              <span className="text-indigo-400 font-bold">{Math.max(2, Math.floor(workloadSlider / 8))} splits</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="120"
                              value={workloadSlider}
                              onChange={(e) => setWorkloadSlider(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono border-t border-slate-900">
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Inference Time</span>
                                <span className="text-slate-200 font-semibold font-display text-sm">{(14.2 - (workloadSlider * 0.06)).toFixed(2)} ms</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Weight Delta Convergence</span>
                                <span className="text-slate-200 font-semibold font-display text-sm">{(4.2 + (workloadSlider * 0.015)).toFixed(2)}x speed</span>
                              </div>
                            </div>
                          </>
                        )}

                        {product.id === "aegis-shield" && (
                          <>
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-slate-400">Anomaly Isolation Sens.:</span>
                              <span className="text-purple-400 font-bold">{workloadSlider}% threshold</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              value={workloadSlider}
                              onChange={(e) => setWorkloadSlider(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono border-t border-slate-900">
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Response Time</span>
                                <span className="text-slate-200 font-semibold font-display text-sm">{(2.0 - (workloadSlider * 0.008)).toFixed(3)} ms</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Isolation Conf.</span>
                                <span className="text-slate-200 font-semibold font-display text-sm">{(99.0 + (workloadSlider * 0.009)).toFixed(2)}% lock</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-mono text-slate-400">Mesh Core Connection</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">Node Secure Key: AES-GCM-256</span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
