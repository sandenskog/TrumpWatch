"use client";

import { motion } from "framer-motion";

const tabs = [
  { id: "all", label: "All", emoji: "\u{1F30D}" },
  { id: "scary", label: "Scary", emoji: "\u{1F631}" },
  { id: "crazy", label: "Crazy", emoji: "\u{1F92A}" },
  { id: "happy", label: "Happy", emoji: "\u{1F389}" },
];

interface BucketTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export function BucketTabs({ active, onChange }: BucketTabsProps) {
  return (
    <div className="flex gap-1.5 p-1 bg-neutral-100 rounded-xl w-fit mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
          <span className="relative z-10">
            {tab.emoji} {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
