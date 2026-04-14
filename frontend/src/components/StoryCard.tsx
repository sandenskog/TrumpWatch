"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/db";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import FlameIcon from "@/icons/flame-icon";
import DollarIcon from "@/icons/dollar-icon";
import WorldIcon from "@/icons/world-icon";
import SparklesIcon from "@/icons/sparkles-icon";
import GlobeIcon from "@/icons/globe-icon";
import type { ReactNode } from "react";

const bucketConfig: Record<
  string,
  {
    icon: ReactNode;
    color: string;
    bg: string;
    label: string;
    borderColor: string;
  }
> = {
  scary: {
    icon: <TriangleAlertIcon size={12} color="#B91C1C" />,
    color: "#B91C1C",
    bg: "#FEE2E2",
    label: "SCARY",
    borderColor: "#B91C1C",
  },
  chaos: {
    icon: <FlameIcon size={12} color="#C2410C" />,
    color: "#C2410C",
    bg: "#FFEDD5",
    label: "CHAOS",
    borderColor: "#C2410C",
  },
  grift: {
    icon: <DollarIcon size={12} color="#B45309" />,
    color: "#B45309",
    bg: "#FEF3C7",
    label: "GRIFT",
    borderColor: "#B45309",
  },
  cringe: {
    icon: <WorldIcon size={12} color="#7C3AED" />,
    color: "#7C3AED",
    bg: "#EDE9FE",
    label: "CRINGE",
    borderColor: "#7C3AED",
  },
  hope: {
    icon: <SparklesIcon size={12} color="#15803D" />,
    color: "#15803D",
    bg: "#DCFCE7",
    label: "HOPE",
    borderColor: "#15803D",
  },
  neutral: {
    icon: <GlobeIcon size={12} color="#8B7E6E" />,
    color: "#8B7E6E",
    bg: "#F5EBDA",
    label: "NEWS",
    borderColor: "#D6C9B6",
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
  isLead?: boolean;
}

export function StoryCard({ article, index, isLead }: StoryCardProps) {
  const config = bucketConfig[article.bucket] || bucketConfig.neutral;
  const domain = extractDomain(article.url);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group"
      style={{ borderTop: index === 0 ? "none" : `1px solid var(--color-rule)` }}
    >
      <div className={`py-4 ${isLead ? "pb-5" : ""}`}>
        {/* Category + Source line */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5"
            style={{
              color: config.color,
              background: config.bg,
              border: `1px solid ${config.borderColor}`,
            }}
          >
            {config.icon}
            {config.label}
          </span>
          <span className="text-[10px] text-[#8B7E6E] font-semibold uppercase tracking-wider">
            {article.source_name}
          </span>
          <span
            className="ml-auto text-[10px] font-bold tabular-nums font-sans"
            style={{ color: config.color }}
          >
            {article.score}/100
          </span>
        </div>

        {/* Headline */}
        <h3
          className={`font-playfair font-bold leading-snug text-[var(--color-ink)] mb-1.5 group-hover:text-[var(--color-crimson)] transition-colors ${
            isLead
              ? "text-2xl sm:text-3xl"
              : "text-lg sm:text-xl"
          }`}
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline decoration-2 underline-offset-2"
          >
            {article.llm_headline || article.title}
          </a>
        </h3>

        {/* Lead paragraph */}
        {article.llm_oneliner && (
          <p
            className={`font-serif leading-relaxed text-[var(--color-ink-light)] mb-2 ${
              isLead ? "text-base sm:text-lg" : "text-sm sm:text-base"
            }`}
          >
            {article.llm_oneliner}
          </p>
        )}

        {/* Read more */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B7E6E] hover:text-[var(--color-crimson)] transition-colors"
        >
          Read full story at {domain}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}
