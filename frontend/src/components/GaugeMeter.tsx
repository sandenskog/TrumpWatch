"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GaugeMeterProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  icon: ReactNode;
}

export function GaugeMeter({ label, value, color, bgColor, icon }: GaugeMeterProps) {
  const circumference = 2 * Math.PI * 42;
  const progress = (value / 100) * circumference;

  return (
    <div
      className="flex flex-col items-center gap-3 px-6 py-5 rounded-sm"
      style={{ background: bgColor }}
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="flex items-center justify-center opacity-80">
            {icon}
          </span>
          <motion.span
            className="text-3xl sm:text-4xl font-playfair font-black tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(value)}
          </motion.span>
        </div>
      </div>
      <span
        className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/80"
      >
        {label}
      </span>
    </div>
  );
}
