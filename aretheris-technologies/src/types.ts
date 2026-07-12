/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
  metric?: string;
  metricLabel?: string;
}

export interface TechProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "compute" | "neural" | "security";
  status: "Operational" | "Beta" | "R&D" | "Alpha Testnet" | "Research Phase" | "Specification Phase";
  features: ProductFeature[];
  color: string; // Tailwind class color mapping (e.g., 'teal', 'violet', 'emerald')
}

export interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  status: "idle" | "processing" | "active";
  load: number; // 0 - 100
  connections: string[]; // Connected Node IDs
  type: "core" | "edge" | "quantum";
}

export interface NetworkPacket {
  id: string;
  from: string;
  to: string;
  progress: number; // 0 to 1
  speed: number;
  size: number; // MB
}

export interface MetricStat {
  label: string;
  value: number;
  unit: string;
  change: number; // percentage change
  trend: "up" | "down";
}
