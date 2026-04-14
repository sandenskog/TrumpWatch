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

function CountdownUnit({
  value,
  label,
  wide,
}: {
  value: number;
  label: string;
  wide?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className={`font-playfair font-black tabular-nums tracking-tight text-white ${
          wide ? "text-5xl sm:text-7xl md:text-8xl" : "text-4xl sm:text-6xl md:text-7xl"
        }`}
      >
        {String(value).padStart(wide ? 3 : 2, "0")}
      </motion.div>
      <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-red-300/80 mt-1 uppercase">
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
      <div className="h-32 flex items-center justify-center text-red-300/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-red-200/70 mb-5 tracking-[0.15em] uppercase font-sans">
        Days until this nightmare ends
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6">
        <CountdownUnit value={time.days} label="DAYS" wide />
        <span className="text-3xl sm:text-5xl font-light text-red-400/40 -mt-5 font-playfair">
          :
        </span>
        <CountdownUnit value={time.hours} label="HOURS" />
        <span className="text-3xl sm:text-5xl font-light text-red-400/40 -mt-5 font-playfair">
          :
        </span>
        <CountdownUnit value={time.minutes} label="MIN" />
        <span className="text-3xl sm:text-5xl font-light text-red-400/40 -mt-5 font-playfair">
          :
        </span>
        <CountdownUnit value={time.seconds} label="SEC" />
      </div>
    </div>
  );
}
