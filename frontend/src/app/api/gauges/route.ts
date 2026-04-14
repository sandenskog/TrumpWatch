import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  const db = getDb();
  const gauges = db.prepare("SELECT * FROM gauges").all();
  return NextResponse.json(gauges);
}
