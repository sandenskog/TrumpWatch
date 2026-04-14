"use client";

import { motion } from "framer-motion";

export function TrumpLogo({ size = 64 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: -5, scale: 0.9 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ rotate: [0, -3, 3, -3, 0], transition: { duration: 0.5 } }}
      className="cursor-pointer"
    >
      {/* Red circle background */}
      <circle cx="100" cy="100" r="96" fill="#dc2626" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#b91c1c" strokeWidth="4" />

      {/* Face - orange tinted */}
      <ellipse cx="100" cy="112" rx="42" ry="48" fill="#f9a825" />

      {/* The Hair - signature swooping blonde combover */}
      <path
        d="M52 85 C52 45, 75 30, 100 28 C115 27, 130 30, 142 40 C150 47, 155 58, 152 70 C160 55, 158 38, 148 28 C138 18, 120 12, 100 14 C75 16, 55 30, 48 55 C44 70, 46 82, 52 85Z"
        fill="#fdd835"
        stroke="#f9a825"
        strokeWidth="1"
      />
      <path
        d="M52 85 C48 70, 50 55, 58 45 C65 36, 78 30, 95 28 L100 28 C82 32, 65 42, 58 60 C53 72, 52 80, 55 88Z"
        fill="#ffee58"
        opacity="0.6"
      />
      {/* Hair swoop right side */}
      <path
        d="M148 78 C155 60, 152 42, 140 32 C135 28, 128 25, 118 24 C130 28, 142 38, 147 55 C150 65, 150 75, 148 82Z"
        fill="#ffee58"
        opacity="0.5"
      />
      {/* Hair top volume */}
      <path
        d="M60 70 C58 50, 70 35, 90 28 C105 23, 125 25, 140 35 C150 42, 155 55, 150 72 C148 60, 140 45, 125 38 C110 32, 85 32, 72 42 C64 50, 60 62, 60 70Z"
        fill="#fdd835"
      />

      {/* Eyes - squinting */}
      <ellipse cx="82" cy="105" rx="8" ry="4" fill="white" />
      <ellipse cx="118" cy="105" rx="8" ry="4" fill="white" />
      <circle cx="84" cy="105" r="3" fill="#1a1a1a" />
      <circle cx="120" cy="105" r="3" fill="#1a1a1a" />
      {/* Eyebrows - furrowed */}
      <path d="M72 96 Q82 92, 92 96" stroke="#c17a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M108 96 Q118 92, 128 96" stroke="#c17a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Mouth - pouty/pursed lips */}
      <ellipse cx="100" cy="135" rx="14" ry="6" fill="#e57373" />
      <path d="M88 135 Q100 140, 112 135" stroke="#c62828" strokeWidth="1" fill="none" />
      <path d="M88 135 Q100 131, 112 135" stroke="#ef9a9a" strokeWidth="0.5" fill="none" />

      {/* Chin */}
      <path d="M80 145 Q100 162, 120 145" stroke="#e8a020" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Tie - red power tie peek */}
      <path d="M93 158 L100 178 L107 158" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
      <path d="M90 158 L110 158" stroke="#f9a825" strokeWidth="2" />

      {/* Crosshair / target overlay for satirical effect */}
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />
      <line x1="100" y1="15" x2="100" y2="40" stroke="white" strokeWidth="1.5" opacity="0.15" />
      <line x1="100" y1="160" x2="100" y2="185" stroke="white" strokeWidth="1.5" opacity="0.15" />
      <line x1="15" y1="100" x2="40" y2="100" stroke="white" strokeWidth="1.5" opacity="0.15" />
      <line x1="160" y1="100" x2="185" y2="100" stroke="white" strokeWidth="1.5" opacity="0.15" />
    </motion.svg>
  );
}
