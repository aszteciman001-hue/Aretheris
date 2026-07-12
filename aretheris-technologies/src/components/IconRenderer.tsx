/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Cpu,
  Zap,
  Sparkles,
  Network,
  BrainCircuit,
  Sliders,
  ShieldCheck,
  Activity,
  EyeOff,
  Terminal,
  Settings,
  Check,
  ChevronRight,
  ArrowRight,
  Globe,
  Database,
  Lock,
  TrendingUp,
  TrendingDown,
  Info,
  Menu,
  X,
  Cloud,
  Send,
  Sparkle,
  Users,
  Award,
  Target,
  Compass,
  Eye,
  BookOpen,
  Heart,
  Download,
  FileText
} from "lucide-react";

const iconMap = {
  Cpu,
  Zap,
  Sparkles,
  Network,
  BrainCircuit,
  Sliders,
  ShieldCheck,
  Activity,
  EyeOff,
  Terminal,
  Settings,
  Check,
  ChevronRight,
  ArrowRight,
  Globe,
  Database,
  Lock,
  TrendingUp,
  TrendingDown,
  Info,
  Menu,
  X,
  Cloud,
  Send,
  Sparkle,
  Users,
  Award,
  Target,
  Compass,
  Eye,
  BookOpen,
  Heart,
  Download,
  FileText
};

export type IconName = keyof typeof iconMap;

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export default function IconRenderer({ name, className = "", size = 20 }: IconRendererProps) {
  const IconComponent = iconMap[name as IconName] || HelpCircleFallback;
  return <IconComponent className={className} size={size} />;
}

// Fallback icon if not found
function HelpCircleFallback({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
