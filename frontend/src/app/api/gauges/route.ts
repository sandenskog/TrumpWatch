import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  const db = getDb();
  const gauges = db.prepare("SELECT * FROM gauges").all() as Array<{
    id: string;
    label: string;
    value: number;
    updated_at: string;
  }>;

  const hasHistory = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='gauge_history'"
    )
    .get();

  if (!hasHistory) {
    return NextResponse.json(gauges);
  }

  const trendStmt = db.prepare(`
    SELECT
      gh_today.value as current_val,
      gh_week.value as week_ago_val,
      gh_today.explainer
    FROM gauge_history gh_today
    LEFT JOIN gauge_history gh_week
      ON gh_week.gauge_id = gh_today.gauge_id
      AND gh_week.date = (
        SELECT MAX(date) FROM gauge_history
        WHERE gauge_id = gh_today.gauge_id
        AND date <= date(gh_today.date, '-7 days')
      )
    WHERE gh_today.gauge_id = ?
      AND gh_today.date = (SELECT MAX(date) FROM gauge_history WHERE gauge_id = ?)
  `);

  const enriched = gauges.map((g) => {
    const trend = trendStmt.get(g.id, g.id) as
      | { current_val: number; week_ago_val: number | null; explainer: string | null }
      | undefined;

    if (!trend) return g;

    const diff =
      trend.week_ago_val !== null
        ? Math.round(trend.current_val - trend.week_ago_val)
        : null;

    return {
      ...g,
      trend: diff,
      trend_direction:
        diff === null ? undefined : diff > 0 ? "up" : diff < 0 ? "down" : "flat",
      explainer: trend.explainer || undefined,
    };
  });

  return NextResponse.json(enriched);
}
