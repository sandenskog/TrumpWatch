"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GaugeMeterProps {
  label: string;
  value: number;
  color: string;
  icon: ReactNode;
}

export function GaugeMeter({ label, value, color, icon }: GaugeMeterProps) {
  const circumference = 2 * Math.PI * 45;
  const progress = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="flex items-center justify-center" style={{ color }}>
            {icon}
          </span>
          <motion.span
            className="text-2xl font-black tabular-nums"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(value)}
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">
        {label}
      </span>
    </div>
  );
}
