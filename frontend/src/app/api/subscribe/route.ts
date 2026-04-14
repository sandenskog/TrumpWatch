import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@") || email.length > 255) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const dbPath =
    process.env.TRUMPDIARY_DB ||
    path.join(process.cwd(), "..", "data", "trumpdiary.db");

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  try {
    db.prepare(
      "INSERT OR IGNORE INTO subscribers (email, confirmed) VALUES (?, 1)"
    ).run(email.toLowerCase().trim());

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  } finally {
    db.close();
  }
}
