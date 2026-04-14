"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/db";

const bucketConfig = {
  scary: { emoji: "\u{1F631}", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", label: "SCARY" },
  crazy: { emoji: "\u{1F92A}", bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700", label: "CRAZY" },
  happy: { emoji: "\u{1F389}", bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700", label: "HAPPY" },
  neutral: { emoji: "\u{1F4F0}", bg: "bg-neutral-50", border: "border-neutral-200", badge: "bg-neutral-100 text-neutral-700", label: "NEWS" },
};

interface StoryCardProps {
  article: Article;
  index: number;
}

export function StoryCard({ article, index }: StoryCardProps) {
  const config = bucketConfig[article.bucket] || bucketConfig.neutral;

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`block p-4 rounded-xl border ${config.bg} ${config.border} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{config.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${config.badge}`}
            >
              {config.label}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              {article.source_name}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-snug text-neutral-900">
            {article.llm_headline || article.title}
          </h3>
          {article.llm_oneliner && (
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {article.llm_oneliner}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    article.bucket === "scary"
                      ? "#dc2626"
                      : article.bucket === "crazy"
                        ? "#ea580c"
                        : article.bucket === "happy"
                          ? "#16a34a"
                          : "#737373",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${article.score}%` }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums text-neutral-400">
              {article.score}
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
