"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/db";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import AngryIcon from "@/icons/angry-icon";
import PartyPopperIcon from "@/icons/party-popper-icon";
import GlobeIcon from "@/icons/globe-icon";
import type { ReactNode } from "react";

const bucketConfig: Record<string, {
  icon: ReactNode;
  accent: string;
  badge: string;
  label: string;
  border: string;
}> = {
  scary: {
    icon: <TriangleAlertIcon size={14} color="#dc2626" />,
    accent: "#dc2626",
    badge: "bg-red-100 text-red-700",
    label: "SCARY",
    border: "border-l-red-500",
  },
  crazy: {
    icon: <AngryIcon size={14} color="#ea580c" />,
    accent: "#ea580c",
    badge: "bg-orange-100 text-orange-700",
    label: "CRAZY",
    border: "border-l-orange-500",
  },
  happy: {
    icon: <PartyPopperIcon size={14} color="#16a34a" />,
    accent: "#16a34a",
    badge: "bg-green-100 text-green-700",
    label: "HAPPY",
    border: "border-l-green-500",
  },
  neutral: {
    icon: <GlobeIcon size={14} color="#737373" />,
    accent: "#737373",
    badge: "bg-neutral-100 text-neutral-600",
    label: "NEWS",
    border: "border-l-neutral-400",
  },
};

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

interface StoryCardProps {
  article: Article;
  index: number;
}

export function StoryCard({ article, index }: StoryCardProps) {
  const config = bucketConfig[article.bucket] || bucketConfig.neutral;
  const domain = extractDomain(article.url);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`border-l-4 ${config.border} bg-white hover:bg-neutral-50 transition-colors`}
    >
      <div className="pl-4 pr-3 py-3">
        {/* Top line: badge + source + score */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${config.badge}`}>
            {config.icon}
            {config.label}
          </span>
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wide">
            {article.source_name}
          </span>
          <span className="ml-auto text-[10px] font-bold tabular-nums" style={{ color: config.accent }}>
            {article.score}/100
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-bold text-base leading-snug text-neutral-900 mb-1 font-serif">
          {article.llm_headline || article.title}
        </h3>

        {/* Lead / one-liner */}
        {article.llm_oneliner && (
          <p className="text-sm text-neutral-600 leading-relaxed mb-2">
            {article.llm_oneliner}
          </p>
        )}

        {/* Read more link */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors group"
        >
          Read more at {domain}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}
