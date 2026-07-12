/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import IconRenderer from "./IconRenderer";

interface Node {
  id: string;
  name: string;
  type: "Core Node" | "Quantum Cell" | "Edge Sandbox";
  x: number; // percentage width (0-100)
  y: number; // percentage height (0-100)
  status: "Online" | "Muted" | "Congested";
  cpu: number; // 0-100%
  latency: number; // ms
  temp: number; // Celsius
}

interface Connection {
  from: string;
  to: string;
}

interface Packet {
  id: string;
  from: string;
  to: string;
  progress: number; // 0 to 1
  color: string;
  size: number; // MB
}

export default function VisualizerDemo() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "n1", name: "NA-West Core", type: "Core Node", x: 20, y: 30, status: "Online", cpu: 42, latency: 4, temp: 42 },
    { id: "n2", name: "NA-East Edge", type: "Edge Sandbox", x: 75, y: 25, status: "Online", cpu: 28, latency: 12, temp: 36 },
    { id: "n3", name: "EU-Central Core", type: "Core Node", x: 80, y: 70, status: "Online", cpu: 67, latency: 15, temp: 48 },
    { id: "n4", name: "AS-East Quantum", type: "Quantum Cell", x: 25, y: 75, status: "Online", cpu: 15, latency: 2, temp: 12 },
    { id: "n5", name: "ME-South Edge", type: "Edge Sandbox", x: 50, y: 50, status: "Online", cpu: 51, latency: 22, temp: 39 },
  ]);

  const connections: Connection[] = [
    { from: "n1", to: "n2" },
    { from: "n1", to: "n4" },
    { from: "n1", to: "n5" },
    { from: "n2", to: "n3" },
    { from: "n2", to: "n5" },
    { from: "n3", to: "n5" },
    { from: "n4", to: "n5" },
  ];

  const [packets, setPackets] = useState<Packet[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [mode, setMode] = useState<"routing" | "neural" | "quantum">("routing");
  const [meshLoad, setMeshLoad] = useState<number>(45); // simulated network congestion slider
  const [packetCounter, setPacketCounter] = useState<number>(0);
  const [flashingNodes, setFlashingNodes] = useState<Record<string, boolean>>({});

  // Packet animation loop using requestAnimationFrame
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const injectPacket = () => {
    // Choose a random connection to spawn a packet along
    const randomConn = connections[Math.floor(Math.random() * connections.length)];
    const packetColor =
      mode === "routing"
        ? "#3b82f6" // blue
        : mode === "neural"
        ? "#6366f1" // indigo
        : "#a855f7"; // purple

    const newPacket: Packet = {
      id: `p-${packetCounter}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: randomConn.from,
      to: randomConn.to,
      progress: 0,
      color: packetColor,
      size: Math.floor(Math.random() * 8) + 1,
    };

    setPackets((prev) => [...prev, newPacket]);
    setPacketCounter((prev) => prev + 1);

    // Briefly update source node CPU load to simulate routing work
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === randomConn.from
          ? { ...node, cpu: Math.min(100, node.cpu + Math.floor(Math.random() * 15) + 5) }
          : node
      )
    );
  };

  useEffect(() => {
    // Select default node to show stats panel
    setSelectedNode(nodes[0]);
  }, []);

  // Update packet progress smoothly using a game-style delta timer loop
  const animate = (time: number) => {
    if (lastTimeRef.current !== 0) {
      const delta = (time - lastTimeRef.current) / 1000; // seconds elapsed
      const speedModifier = mode === "quantum" ? 1.5 : mode === "neural" ? 1.1 : 0.8;
      
      setPackets((prevPackets) => {
        const remaining: Packet[] = [];
        
        prevPackets.forEach((p) => {
          const nextProgress = p.progress + delta * speedModifier;
          if (nextProgress >= 1) {
            // Trigger node destination visual flash
            setFlashingNodes((prev) => ({ ...prev, [p.to]: true }));
            setTimeout(() => {
              setFlashingNodes((prev) => ({ ...prev, [p.to]: false }));
            }, 300);
          } else {
            remaining.push({ ...p, progress: nextProgress });
          }
        });
        
        return remaining;
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mode]);

  // Periodic automatic packet emission based on Mesh Load slider
  useEffect(() => {
    const intervalTime = Math.max(400, 3000 - meshLoad * 35);
    const interval = setInterval(() => {
      if (packets.length < 15) {
        injectPacket();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [meshLoad, packetCounter, mode]);

  // Randomize node metrics slightly over time to simulate a real living mesh network
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const cpuOffset = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newCpu = Math.max(5, Math.min(95, node.cpu + cpuOffset));
          const newLatency = Math.max(1, node.latency + (Math.random() > 0.5 ? 1 : -1));
          const newTemp = Math.max(10, Math.min(85, Math.floor(newCpu * 0.6 + 15)));
          return {
            ...node,
            cpu: newCpu,
            latency: newLatency,
            temp: newTemp,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="visualizer" className="py-24 bg-[#020617] border-t border-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">
            Interactive protocol simulator
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-100 mt-2">
            Mesh Topology Sandbox
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mt-4 font-light">
            An interactive simulator of our decentralized container routing, neural splitting, and quantum defense models. Adjust parameters to test the protocol's scaling viability.
          </p>
        </div>

        {/* Command Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visualizer Stage (8 Cols) */}
          <div className="col-span-1 lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4 mb-6 relative z-10">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
                  Simulation Sandbox Feed
                </span>
              </div>

              {/* Mode Selectors */}
              <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <button
                  id="mode-routing"
                  onClick={() => setMode("routing")}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    mode === "routing" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Aether Routing
                </button>
                <button
                  id="mode-neural"
                  onClick={() => setMode("neural")}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    mode === "neural" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Neural Sync
                </button>
                <button
                  id="mode-quantum"
                  onClick={() => setMode("quantum")}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    mode === "quantum" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Quantum Lock
                </button>
              </div>
            </div>

            {/* Interactive SVG Stage Area */}
            <div className="relative grow min-h-[350px] border border-slate-900 bg-slate-950/80 rounded-xl flex items-center justify-center p-4">
              
              {/* Connections SVG Line Drawing */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {connections.map((conn, idx) => {
                  const nodeFrom = nodes.find((n) => n.id === conn.from);
                  const nodeTo = nodes.find((n) => n.id === conn.to);
                  if (!nodeFrom || !nodeTo) return null;

                  return (
                    <line
                      key={`line-${idx}`}
                      x1={`${nodeFrom.x}%`}
                      y1={`${nodeFrom.y}%`}
                      x2={`${nodeTo.x}%`}
                      y2={`${nodeTo.y}%`}
                      stroke={mode === "routing" ? "#1e3a8a" : mode === "neural" ? "#312e81" : "#581c87"}
                      strokeWidth="1.5"
                      strokeDasharray={mode === "neural" ? "4 4" : undefined}
                    />
                  );
                })}

                {/* Animated Packets Moving Along the Connections */}
                {packets.map((packet) => {
                  const nodeFrom = nodes.find((n) => n.id === packet.from);
                  const nodeTo = nodes.find((n) => n.id === packet.to);
                  if (!nodeFrom || !nodeTo) return null;

                  // Interpolate coordinate positions based on progress parameter
                  const px = nodeFrom.x + (nodeTo.x - nodeFrom.x) * packet.progress;
                  const py = nodeFrom.y + (nodeTo.y - nodeFrom.y) * packet.progress;

                  return (
                    <circle
                      key={packet.id}
                      cx={`${px}%`}
                      cy={`${py}%`}
                      r={Math.max(3, packet.size * 0.8)}
                      fill={packet.color}
                      className="shadow-md"
                      style={{ filter: `drop-shadow(0 0 4px ${packet.color})` }}
                    />
                  );
                })}
              </svg>

              {/* Render Nodes as Interactive Circles */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isFlashing = flashingNodes[node.id];
                
                const themeBorder =
                  mode === "routing"
                    ? isSelected ? "border-blue-400" : "border-slate-700"
                    : mode === "neural"
                    ? isSelected ? "border-indigo-400" : "border-indigo-950"
                    : isSelected ? "border-purple-400" : "border-purple-950";

                const flashBg = isFlashing
                  ? mode === "routing" ? "bg-blue-500/30" : mode === "neural" ? "bg-indigo-500/30" : "bg-purple-500/30"
                  : "";

                return (
                  <button
                    key={node.id}
                    id={`node-${node.id}`}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group focus:outline-none"
                  >
                    {/* Ripple Ambient Rings */}
                    <div className={`absolute -inset-4 rounded-full transition-all duration-300 ${flashBg} ${
                      isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover:scale-90 group-hover:opacity-40"
                    }`} />
                    
                    {/* Physical Node Dot */}
                    <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 ${themeBorder} flex items-center justify-center relative transition-all duration-300 shadow-xl ${
                      isSelected ? "scale-110 shadow-blue-500/10" : "group-hover:scale-105"
                    }`}>
                      {/* Live Load Meter Micro Dial */}
                      <svg className="absolute inset-0 -rotate-90 w-full h-full pointer-events-none">
                        <circle
                          cx="14"
                          cy="14"
                          r="12"
                          stroke={mode === "routing" ? "rgba(59, 130, 246, 0.2)" : mode === "neural" ? "rgba(99, 102, 241, 0.2)" : "rgba(168, 85, 247, 0.2)"}
                          strokeWidth="2"
                          fill="transparent"
                          className="origin-center"
                        />
                        <circle
                          cx="14"
                          cy="14"
                          r="12"
                          stroke={mode === "routing" ? "#3b82f6" : mode === "neural" ? "#6366f1" : "#a855f7"}
                          strokeWidth="2"
                          fill="transparent"
                          strokeDasharray="75.4"
                          strokeDashoffset={75.4 - (75.4 * node.cpu) / 100}
                          className="origin-center transition-all duration-500"
                        />
                      </svg>
                      
                      <span className="text-[9px] font-mono font-bold text-slate-300">
                        {node.cpu}%
                      </span>
                    </div>

                    {/* Small Node Name Overlay Label */}
                    <span className="absolute top-9 left-1/2 -translate-x-1/2 text-[10px] font-mono font-semibold text-slate-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-slate-900 shadow-lg whitespace-nowrap group-hover:text-slate-100 transition-colors">
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Panel Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6 bg-[#020617]/60 border border-slate-800/60 rounded-xl p-4 relative z-10">
              <div className="flex items-center space-x-2">
                <button
                  id="inject-packet-btn"
                  onClick={injectPacket}
                  className="px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2"
                >
                  <IconRenderer name="Send" size={14} />
                  <span>Inject Data Packet</span>
                </button>
                <span className="text-xs text-slate-500 font-mono">
                  Active Signals: {packets.length}
                </span>
              </div>

              {/* Dynamic Congestion Load Range */}
              <div className="flex items-center space-x-4 grow sm:justify-end max-w-xs">
                <span className="text-xs font-mono text-slate-400 shrink-0">
                  Mesh Load: {meshLoad}%
                </span>
                <input
                  type="range"
                  id="mesh-load-slider"
                  min="10"
                  max="95"
                  value={meshLoad}
                  onChange={(e) => setMeshLoad(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Node Telemetry Inspect panel (4 Cols) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  id="node-telemetry-panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 h-full flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b border-slate-800/60 pb-4">
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">
                        Physical node inspect
                      </span>
                      <h3 className="text-xl font-display font-bold text-slate-100 flex items-center justify-between">
                        <span>{selectedNode.name}</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          {selectedNode.status}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">{selectedNode.type}</p>
                    </div>

                    {/* Telemetry Metrics List */}
                    <div className="space-y-4">
                      {/* Latency Gauge */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <IconRenderer name="Activity" size={13} className="text-slate-500" />
                            <span>Node Routing Delay</span>
                          </span>
                          <span className="text-slate-200">{selectedNode.latency}ms</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
                          <motion.div
                            animate={{ width: `${Math.min(100, selectedNode.latency * 3)}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      </div>

                      {/* CPU Utilization */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <IconRenderer name="Cpu" size={13} className="text-slate-500" />
                            <span>Core Processor Load</span>
                          </span>
                          <span className="text-slate-200">{selectedNode.cpu}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
                          <motion.div
                            animate={{ width: `${selectedNode.cpu}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full ${selectedNode.cpu > 80 ? "bg-rose-500" : "bg-blue-500"}`}
                          />
                        </div>
                      </div>

                      {/* Temperature Gauge */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <IconRenderer name="Sliders" size={13} className="text-slate-500" />
                            <span>Node System Temperature</span>
                          </span>
                          <span className="text-slate-200">{selectedNode.temp}°C</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
                          <motion.div
                            animate={{ width: `${(selectedNode.temp / 90) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full ${selectedNode.temp > 70 ? "bg-rose-500" : "bg-indigo-500"}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Operational Sandbox info */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                        Virtual Secure Sandboxes
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>compute.node.aes</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>synapse.inference</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          <span>federated.weights</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          <span>quantum.keys.local</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Instruction Note */}
                  <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800/60 pt-4 mt-6">
                    <p className="flex items-start space-x-1.5 leading-normal">
                      <IconRenderer name="Info" size={12} className="shrink-0 mt-0.5" />
                      <span>Node states reflect live routing activity. Injecting packets increases processing cycles dynamically.</span>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full text-slate-500 font-mono">
                  <IconRenderer name="Info" size={24} className="mb-2 text-slate-600" />
                  <p className="text-xs">Select any mesh cell on the map to query telemetry data.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
