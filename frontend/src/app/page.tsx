"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GaugeMeter } from "@/components/GaugeMeter";
import { StoryCard } from "@/components/StoryCard";
import { EmailSignup } from "@/components/EmailSignup";
import { BucketTabs } from "@/components/BucketTabs";
import { TrumpLogo } from "@/components/TrumpLogo";
import TriangleAlertIcon from "@/icons/triangle-alert-icon";
import AngryIcon from "@/icons/angry-icon";
import SparklesIcon from "@/icons/sparkles-icon";
import MailFilledIcon from "@/icons/mail-filled-icon";
import GlobeIcon from "@/icons/globe-icon";
import type { Article, Gauge } from "@/lib/db";

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
    <div className="min-h-screen bg-white">
      {/* Masthead */}
      <header className="border-b-2 border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-4">
            <TrumpLogo size={56} />
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-black tracking-tight uppercase"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                TRUMP WATCH
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 mt-0.5"
              >
                <div className="h-px flex-1 bg-neutral-300" />
                <p className="text-neutral-500 text-xs tracking-widest uppercase font-medium">
                  Tracking Democracy&apos;s Wildest Ride
                </p>
                <div className="h-px flex-1 bg-neutral-300" />
              </motion.div>
            </div>
            <TrumpLogo size={56} />
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-neutral-400 tracking-wider uppercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Countdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-8 px-6 bg-neutral-50 rounded-2xl border border-neutral-100"
        >
          <CountdownTimer />
        </motion.section>

        {/* Gauges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center gap-8 sm:gap-16 flex-wrap">
            <GaugeMeter
              label="Scare-O-Meter"
              value={scare}
              color="#dc2626"
              icon={<TriangleAlertIcon size={22} />}
            />
            <GaugeMeter
              label="Crazy-O-Meter"
              value={crazy}
              color="#ea580c"
              icon={<AngryIcon size={22} />}
            />
            <GaugeMeter
              label="Hope-O-Meter"
              value={hope}
              color="#16a34a"
              icon={<SparklesIcon size={22} />}
            />
          </div>
        </motion.section>

        {/* Email Signup */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-3 py-6 px-4 bg-neutral-50 rounded-2xl border border-neutral-100"
        >
          <div className="flex items-center justify-center gap-2">
            <MailFilledIcon size={20} />
            <h2 className="text-lg font-bold">Never miss a day of chaos</h2>
          </div>
          <p className="text-sm text-neutral-500">
            Get the daily digest delivered to your inbox. It&apos;s free, funny,
            and slightly terrifying.
          </p>
          <EmailSignup />
        </motion.section>

        {/* Stories */}
        <section>
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-neutral-300" />
              <h2 className="text-xl font-bold uppercase tracking-wider" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                Today&apos;s Headlines
              </h2>
              <div className="h-px w-12 bg-neutral-300" />
            </div>
            <BucketTabs active={bucket} onChange={setBucket} />
          </div>

          {loading ? (
            <div className="text-center py-12 text-neutral-400">
              Loading stories...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <span className="inline-flex text-neutral-300 mb-2">
                <GlobeIcon size={40} />
              </span>
              <p className="text-neutral-500 text-sm">
                No stories yet. The scraper runs daily — check back soon!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {articles.map((article, i) => (
                <StoryCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t-2 border-neutral-900">
          <p className="text-xs text-neutral-400 tracking-wide">
            Aggregating from 60+ sources across satire, progressive news,
            international outlets, legal watchers, and political commentary.
          </p>
          <p className="text-xs text-neutral-300 mt-1">
            Built with outrage, humor, and a countdown timer.
          </p>
        </footer>
      </main>
    </div>
  );
}
