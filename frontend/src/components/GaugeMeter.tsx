"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GaugeMeterProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  icon: ReactNode;
  trend?: number | null;
  trendDirection?: "up" | "down" | "flat";
  explainer?: string;
}

export function GaugeMeter({
  label,
  value,
  color,
  bgColor,
  icon,
  trend,
  trendDirection,
  explainer,
}: GaugeMeterProps) {
  const circumference = 2 * Math.PI * 42;
  const progress = (value / 100) * circumference;

  const trendArrow =
    trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→";
  const hasTrend = trend !== null && trend !== undefined;

  return (
    <div
      className="flex flex-col items-center gap-2 px-3 sm:px-4 py-4 sm:py-5 rounded-sm"
      style={{ background: bgColor }}
    >
      <div className="relative w-20 h-20 sm:w-28 sm:h-28">
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
          <span className="flex items-center justify-center opacity-80 sm:mb-0.5">
            {icon}
          </span>
          <motion.span
            className="text-2xl sm:text-3xl font-playfair font-black tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(value)}
          </motion.span>
        </div>
      </div>

      <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/80 text-center leading-tight">
        {label}
      </span>

      {hasTrend && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] sm:text-xs font-bold text-white/70 tabular-nums"
        >
          {trendArrow} {Math.abs(trend)}pts this week
        </motion.span>
      )}

      {explainer && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[9px] sm:text-[10px] text-white/60 text-center leading-tight italic line-clamp-2 max-w-[140px]"
        >
          {explainer}
        </motion.p>
      )}
    </div>
  );
}
