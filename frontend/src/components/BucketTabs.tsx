"use client";

import { motion } from "framer-motion";
import GlobeIcon from "@/icons/globe-icon";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import AngryIcon from "@/icons/angry-icon";
import PartyPopperIcon from "@/icons/party-popper-icon";
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
    label: "All Stories",
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
    id: "crazy",
    label: "Crazy",
    icon: <AngryIcon size={16} />,
    activeColor: "#ffffff",
    activeBg: "#C2410C",
  },
  {
    id: "happy",
    label: "Happy",
    icon: <PartyPopperIcon size={16} />,
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
    <div className="flex gap-0 border border-[var(--color-rule)] bg-[var(--color-parchment)]">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
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
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === "all" ? "All" : tab.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
