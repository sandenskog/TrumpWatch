import sqlite3
import os

DB_PATH = os.environ.get("TRUMPDIARY_DB", os.path.join(os.path.dirname(__file__), "..", "data", "trumpdiary.db"))


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            summary TEXT,
            source_name TEXT NOT NULL,
            source_category TEXT NOT NULL,
            published_at TEXT,
            scraped_at TEXT NOT NULL DEFAULT (datetime('now')),
            bucket TEXT CHECK(bucket IN ('scary', 'crazy', 'happy', 'neutral')),
            score INTEGER DEFAULT 50 CHECK(score BETWEEN 0 AND 100),
            image_url TEXT,
            llm_headline TEXT,
            llm_oneliner TEXT,
            used_in_digest INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_articles_bucket ON articles(bucket);
        CREATE INDEX IF NOT EXISTS idx_articles_scraped ON articles(scraped_at);
        CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);

        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at TEXT NOT NULL DEFAULT (datetime('now')),
            confirmed INTEGER DEFAULT 0,
            unsubscribed INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS gauges (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            value REAL NOT NULL DEFAULT 50,
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        INSERT OR IGNORE INTO gauges (id, label, value) VALUES
            ('scare', 'Scare-O-Meter', 50),
            ('crazy', 'Crazy-O-Meter', 50),
            ('hope', 'Hope-O-Meter', 50);

        CREATE TABLE IF NOT EXISTS digest_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sent_at TEXT NOT NULL DEFAULT (datetime('now')),
            subscriber_count INTEGER,
            article_count INTEGER
        );
    """)
    conn.close()


def article_exists(conn, url):
    row = conn.execute("SELECT 1 FROM articles WHERE url = ?", (url,)).fetchone()
    return row is not None


def insert_article(conn, article):
    conn.execute("""
        INSERT OR IGNORE INTO articles (url, title, summary, source_name, source_category,
            published_at, bucket, score, llm_headline, llm_oneliner)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        article["url"], article["title"], article.get("summary"),
        article["source_name"], article["source_category"],
        article.get("published_at"), article.get("bucket"),
        article.get("score", 50), article.get("llm_headline"),
        article.get("llm_oneliner"),
    ))


def update_gauges(conn):
    from datetime import datetime, timedelta
    yesterday = (datetime.utcnow() - timedelta(days=1)).isoformat()

    for bucket, gauge_id in [("scary", "scare"), ("crazy", "crazy"), ("happy", "hope")]:
        row = conn.execute("""
            SELECT AVG(score) as avg_score, COUNT(*) as cnt
            FROM articles
            WHERE bucket = ? AND scraped_at > ?
        """, (bucket, yesterday)).fetchone()

        if row and row["cnt"] > 0:
            conn.execute(
                "UPDATE gauges SET value = ?, updated_at = datetime('now') WHERE id = ?",
                (round(row["avg_score"], 1), gauge_id),
            )

    conn.commit()
