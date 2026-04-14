"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GaugeMeter } from "@/components/GaugeMeter";
import { StoryCard } from "@/components/StoryCard";
import { EmailSignup } from "@/components/EmailSignup";
import { BucketTabs } from "@/components/BucketTabs";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import AngryIcon from "@/icons/angry-icon";
import SparklesIcon from "@/icons/sparkles-icon";
import FlameIcon from "@/icons/flame-icon";
import GlobeIcon from "@/icons/globe-icon";
import type { Article, Gauge } from "@/lib/db";

function StarDecoration() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [gauges, setGauges] = useState<Record<string, Gauge>>({});
  const [bucket, setBucket] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [articlesRes, gaugesRes] = await Promise.all([
        fetch(`/api/articles${bucket !== "all" ? `?bucket=${bucket}` : ""}`),
        fetch("/api/gauges"),
      ]);
      const articlesData = await articlesRes.json();
      const gaugesData: Gauge[] = await gaugesRes.json();

      setArticles(articlesData);
      const gaugeMap: Record<string, Gauge> = {};
      for (const g of gaugesData) gaugeMap[g.id] = g;
      setGauges(gaugeMap);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  }, [bucket]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scare = gauges.scare?.value ?? 50;
  const crazy = gauges.crazy?.value ?? 50;
  const hope = gauges.hope?.value ?? 50;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Red accent stripe */}
      <div className="h-1.5 bg-[var(--color-crimson)]" />

      {/* Masthead */}
      <header className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <div className="text-center">
          {/* Edition line */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-20 bg-[var(--color-rule)]" />
            <span className="text-[10px] text-[#8B7E6E] tracking-[0.25em] uppercase font-semibold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · Vol. II"}
            </span>
            <div className="h-px flex-1 max-w-20 bg-[var(--color-rule)]" />
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 text-[var(--color-crimson)]">
              <StarDecoration />
              <StarDecoration />
              <StarDecoration />
            </div>
            <h1 className="font-playfair text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-[var(--color-ink)] mt-1 mb-1">
              TRUMP WATCH
            </h1>
            <div className="flex items-center justify-center gap-3 text-[var(--color-crimson)]">
              <StarDecoration />
              <StarDecoration />
              <StarDecoration />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-sm sm:text-base text-[#8B7E6E] mt-2 italic"
          >
            Tracking Democracy&apos;s Wildest Ride Since 2025
          </motion.p>
        </div>

        {/* Heavy rule under masthead */}
        <div className="rule-double mt-4" />
      </header>

      {/* Countdown Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--color-crimson-dark)] py-8 sm:py-10"
      >
        <CountdownTimer />
      </motion.section>

      <main className="max-w-5xl mx-auto px-4">
        {/* Gauges Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FlameIcon size={18} />
            <h2 className="font-playfair text-xl font-bold uppercase tracking-wider">
              Today&apos;s Meters
            </h2>
            <div className="h-px flex-1 bg-[var(--color-rule)]" />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <GaugeMeter
              label="Scare-O-Meter"
              value={scare}
              color="#B91C1C"
              bgColor="#B91C1C"
              icon={<TriangleAlertIcon size={24} color="white" />}
            />
            <GaugeMeter
              label="Crazy-O-Meter"
              value={crazy}
              color="#C2410C"
              bgColor="#C2410C"
              icon={<AngryIcon size={24} color="white" />}
            />
            <GaugeMeter
              label="Hope-O-Meter"
              value={hope}
              color="#15803D"
              bgColor="#15803D"
              icon={<SparklesIcon size={24} color="white" />}
            />
          </div>
        </motion.section>

        <div className="rule-heavy" />

        {/* Headlines Section */}
        <section className="py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <GlobeIcon size={18} />
              <h2 className="font-playfair text-xl font-bold uppercase tracking-wider whitespace-nowrap">
                Today&apos;s Headlines
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-[var(--color-rule)]" />
            <BucketTabs active={bucket} onChange={setBucket} />
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#8B7E6E] font-serif italic">
              Loading stories...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <span className="inline-flex text-[var(--color-rule)]">
                <GlobeIcon size={48} />
              </span>
              <p className="text-[#8B7E6E] text-sm font-serif italic mt-3">
                No stories yet. The scraper runs daily — check back soon!
              </p>
            </div>
          ) : (
            <div>
              {articles.map((article, i) => (
                <StoryCard
                  key={article.id}
                  article={article}
                  index={i}
                  isLead={i === 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Email Signup Banner */}
      <EmailSignup />

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8">
        <div className="rule-light mb-4" />
        <div className="text-center">
          <p className="text-xs text-[#8B7E6E] tracking-wide font-serif">
            Aggregating from 60+ sources across satire, progressive news,
            international outlets, legal watchers, and political commentary.
          </p>
          <p className="text-[10px] text-[var(--color-rule)] mt-2 font-serif italic">
            Built with outrage, humor, and a countdown timer.
          </p>
        </div>
      </footer>

      {/* Bottom red stripe */}
      <div className="h-1.5 bg-[var(--color-crimson)]" />
    </div>
  );
}
