"use client";

import { motion } from "framer-motion";
import GlobeIcon from "@/icons/globe-icon";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import AngryIcon from "@/icons/angry-icon";
import PartyPopperIcon from "@/icons/party-popper-icon";
import type { ReactNode } from "react";

const tabs: { id: string; label: string; icon: ReactNode }[] = [
  { id: "all", label: "All Stories", icon: <GlobeIcon size={16} /> },
  { id: "scary", label: "Scary", icon: <TriangleAlertIcon size={16} color="#dc2626" /> },
  { id: "crazy", label: "Crazy", icon: <AngryIcon size={16} color="#ea580c" /> },
  { id: "happy", label: "Happy", icon: <PartyPopperIcon size={16} color="#16a34a" /> },
];

interface BucketTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export function BucketTabs({ active, onChange }: BucketTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            active === tab.id ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {active === tab.id && (
            <motion.div
              layoutId="activeBucket"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
