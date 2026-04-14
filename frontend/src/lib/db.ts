import Database from "better-sqlite3";
import path from "path";

const DB_PATH =
  process.env.TRUMPDIARY_DB ||
  path.join(process.cwd(), "..", "data", "trumpdiary.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true });
    db.pragma("journal_mode = WAL");
  }
  return db;
}

export interface Article {
  id: number;
  url: string;
  title: string;
  summary: string | null;
  source_name: string;
  source_category: string;
  published_at: string | null;
  scraped_at: string;
  bucket: "scary" | "chaos" | "grift" | "cringe" | "hope" | "neutral";
  score: number;
  image_url: string | null;
  llm_headline: string | null;
  llm_oneliner: string | null;
}

export interface Gauge {
  id: string;
  label: string;
  value: number;
  updated_at: string;
  trend?: number;
  trend_direction?: "up" | "down" | "flat";
  explainer?: string;
}
