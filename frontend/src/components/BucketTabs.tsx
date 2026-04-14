"use client";

import { motion } from "framer-motion";
import GlobeIcon from "@/icons/globe-icon";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import FlameIcon from "@/icons/flame-icon";
import DollarIcon from "@/icons/dollar-icon";
import WorldIcon from "@/icons/world-icon";
import SparklesIcon from "@/icons/sparkles-icon";
import type { ReactNode } from "react";

const tabs: {
  id: string;
  label: string;
  icon: ReactNode;
  activeColor: string;
  activeBg: string;
}[] = [
  {
    id: "all",
    label: "All",
    icon: <GlobeIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#1A1A1A",
  },
  {
    id: "scary",
    label: "Scary",
    icon: <TriangleAlertIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#B91C1C",
  },
  {
    id: "chaos",
    label: "Chaos",
    icon: <FlameIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#C2410C",
  },
  {
    id: "grift",
    label: "Grift",
    icon: <DollarIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#B45309",
  },
  {
    id: "cringe",
    label: "Cringe",
    icon: <WorldIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#7C3AED",
  },
  {
    id: "hope",
    label: "Hope",
    icon: <SparklesIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#15803D",
  },
];

interface BucketTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export function BucketTabs({ active, onChange }: BucketTabsProps) {
  return (
    <div className="flex gap-0 border border-[var(--color-rule)] bg-[var(--color-parchment)] overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-1 px-2.5 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
            style={{
              color: isActive ? tab.activeColor : "#8B7E6E",
              background: isActive ? tab.activeBg : "transparent",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeBucket"
                className="absolute inset-0"
                style={{ background: tab.activeBg }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
