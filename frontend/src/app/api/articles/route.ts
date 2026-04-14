import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const bucket = req.nextUrl.searchParams.get("bucket");
  const limit = Math.min(
    parseInt(req.nextUrl.searchParams.get("limit") || "20"),
    100
  );

  const db = getDb();

  let query = `
    SELECT * FROM articles
    WHERE scraped_at > datetime('now', '-2 day')
      AND bucket IS NOT NULL
  `;
  const params: (string | number)[] = [];

  if (bucket && ["scary", "crazy", "happy", "neutral"].includes(bucket)) {
    query += " AND bucket = ?";
    params.push(bucket);
  }

  query += " ORDER BY score DESC, scraped_at DESC LIMIT ?";
  params.push(limit);

  const articles = db.prepare(query).all(...params);
  return NextResponse.json(articles);
}
