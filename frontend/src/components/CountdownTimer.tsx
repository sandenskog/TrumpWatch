"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TERM_END = new Date("2029-01-20T12:00:00-05:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = TERM_END.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-black tabular-nums tracking-tight"
      >
        {String(value).padStart(label === "DAYS" ? 3 : 2, "0")}
      </motion.div>
      <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mt-1">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const interval = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="h-24 flex items-center justify-center text-neutral-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-neutral-500 mb-4 tracking-wide uppercase">
        Days until this nightmare ends
      </p>
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <CountdownUnit value={time.days} label="DAYS" />
        <span className="text-3xl font-light text-neutral-300 -mt-4">:</span>
        <CountdownUnit value={time.hours} label="HOURS" />
        <span className="text-3xl font-light text-neutral-300 -mt-4">:</span>
        <CountdownUnit value={time.minutes} label="MIN" />
        <span className="text-3xl font-light text-neutral-300 -mt-4">:</span>
        <CountdownUnit value={time.seconds} label="SEC" />
      </div>
    </div>
  );
}
