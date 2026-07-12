/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TechProduct, MetricStat } from "./types";

export const PRODUCTS: TechProduct[] = [
  {
    id: "aether-compute",
    name: "Aether Compute",
    tagline: "Planned ultra-low latency decentralized edge processing network.",
    description: "Our long-term target for decentralized container workloads. We are prototyping a self-healing mesh of edge-nodes designed for multi-region replication, native auto-scaling, and zero cold starts.",
    category: "compute",
    status: "Alpha Testnet",
    color: "teal",
    features: [
      {
        title: "Sub-millisecond Latency",
        description: "Designed routing pathways to select the physically closest execution cell instantly.",
        icon: "Cpu",
        metric: "0.85ms",
        metricLabel: "Design latency target"
      },
      {
        title: "Adaptive Auto-scaling",
        description: "Aims to scale from single operations to millions of requests in milliseconds with zero pre-warming.",
        icon: "Zap",
        metric: "250K+",
        metricLabel: "Target ops per second"
      },
      {
        title: "Cold Start Eliminator",
        description: "Pre-cached virtual machines with active memory snapshots under secure sandboxing.",
        icon: "Sparkles",
        metric: "0.00ms",
        metricLabel: "Cold start target"
      }
    ]
  },
  {
    id: "synapse-neural",
    name: "Synapse Neural Core",
    tagline: "Visionary distributed compute processing at the network edge.",
    description: "Our research vision for neural processing capabilities. Synapse aims to split large transformer graphs across localized mesh nodes, optimizing latency and local device resource usage.",
    category: "neural",
    status: "Research Phase",
    color: "violet",
    features: [
      {
        title: "Shattered Graphs",
        description: "Splitting massive Transformer models across nearby localized nodes for collective inference.",
        icon: "Network",
        metric: "4.2x",
        metricLabel: "Target throughput increase"
      },
      {
        title: "On-Mesh Training",
        description: "Planned federated learning protocols to adapt weights locally on-device with privacy.",
        icon: "BrainCircuit",
        metric: "100%",
        metricLabel: "Target privacy standard"
      },
      {
        title: "Dynamic Model Slicing",
        description: "Envisioned real-time model slicing based on active device thermals and battery thresholds.",
        icon: "Sliders",
        metric: "45%",
        metricLabel: "Target power reduction"
      }
    ]
  },
  {
    id: "aegis-shield",
    name: "Aegis Cyber-Shield",
    tagline: "Planned quantum-resistant encryption and real-time defense layers.",
    description: "Our design specification for securing data utilizing post-quantum cryptography algorithms and autonomous node consensus protocols.",
    category: "security",
    status: "Specification Phase",
    color: "emerald",
    features: [
      {
        title: "Post-Quantum Cryptography",
        description: "Planned lattice-based cryptographic primitives resilient against potential quantum decryption.",
        icon: "ShieldCheck",
        metric: "256-bit",
        metricLabel: "Design cryptographic grade"
      },
      {
        title: "Autonomous Consensus Isolation",
        description: "Envisioned behavioral anomaly models to isolate suspicious nodes in under 2ms.",
        icon: "Activity",
        metric: "< 2ms",
        metricLabel: "Target trigger latency"
      },
      {
        title: "Zero-Knowledge Telemetry",
        description: "Designed protocols to securely report operational signatures without leaking user data payloads.",
        icon: "EyeOff",
        metric: "ZKP",
        metricLabel: "Security design standard"
      }
    ]
  }
];

export const METRICS: MetricStat[] = [
  {
    label: "Global Mesh Nodes",
    value: 12480,
    unit: " nodes",
    change: 14.2,
    trend: "up"
  },
  {
    label: "Active Compute Power",
    value: 84.7,
    unit: " PFLOPS",
    change: 8.5,
    trend: "up"
  },
  {
    label: "Network Congestion Status",
    value: 99.98,
    unit: "%",
    change: 0.01,
    trend: "up"
  },
  {
    label: "Carbon Avoidance Index",
    value: 94.2,
    unit: " CO₂e",
    change: 18.4,
    trend: "up"
  }
];

export const COMPANY_STORY = {
  founded: "2024",
  mission: "To decentralize processing power globally, removing artificial latency barriers, and creating a highly secure, energy-positive digital fabric.",
  vision: "A world where secure high-performance computing is ambient, frictionless, and zero-carbon, powered dynamically by distributed collective intelligence."
};
