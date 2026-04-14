import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  const db = getDb();

  const totalArticles = db
    .prepare("SELECT COUNT(*) as count FROM articles")
    .get() as { count: number };

  const todayArticles = db
    .prepare(
      "SELECT COUNT(*) as count FROM articles WHERE scraped_at > datetime('now', '-1 day')"
    )
    .get() as { count: number };

  const subscribers = db
    .prepare(
      "SELECT COUNT(*) as count FROM subscribers WHERE confirmed = 1 AND unsubscribed = 0"
    )
    .get() as { count: number };

  const sourcesActive = db
    .prepare(
      "SELECT COUNT(DISTINCT source_name) as count FROM articles WHERE scraped_at > datetime('now', '-2 day')"
    )
    .get() as { count: number };

  return NextResponse.json({
    totalArticles: totalArticles.count,
    todayArticles: todayArticles.count,
    subscribers: subscribers.count,
    sourcesActive: sourcesActive.count,
  });
}
