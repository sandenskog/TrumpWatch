"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GaugeMeter } from "@/components/GaugeMeter";
import { StoryCard } from "@/components/StoryCard";
import { EmailSignup } from "@/components/EmailSignup";
import { BucketTabs } from "@/components/BucketTabs";
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
      <header className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            TRUMP WATCH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-sm mt-1"
          >
            Tracking democracy&apos;s wildest ride. Updated daily.
          </motion.p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Countdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-8 px-6 bg-neutral-50 rounded-2xl"
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
              emoji={"\u{1F631}"}
            />
            <GaugeMeter
              label="Crazy-O-Meter"
              value={crazy}
              color="#ea580c"
              emoji={"\u{1F92A}"}
            />
            <GaugeMeter
              label="Hope-O-Meter"
              value={hope}
              color="#16a34a"
              emoji={"\u{1F389}"}
            />
          </div>
        </motion.section>

        {/* Email Signup */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-3 py-6 px-4 bg-neutral-50 rounded-2xl"
        >
          <h2 className="text-lg font-bold">Never miss a day of chaos</h2>
          <p className="text-sm text-neutral-500">
            Get the daily digest delivered to your inbox. It&apos;s free, funny,
            and slightly terrifying.
          </p>
          <EmailSignup />
        </motion.section>

        {/* Stories */}
        <section>
          <div className="flex flex-col items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">Today&apos;s Headlines</h2>
            <BucketTabs active={bucket} onChange={setBucket} />
          </div>

          {loading ? (
            <div className="text-center py-12 text-neutral-400">
              Loading stories...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">{"\u{1F4ED}"}</p>
              <p className="text-neutral-500 text-sm">
                No stories yet. The scraper runs daily — check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {articles.map((article, i) => (
                <StoryCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <section className="text-center py-8 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            Aggregating from 60+ sources across satire, progressive news,
            international outlets, legal watchers, and political commentary.
          </p>
          <p className="text-xs text-neutral-300 mt-1">
            Built with outrage, humor, and a countdown timer.
          </p>
        </section>
      </main>
    </div>
  );
}
