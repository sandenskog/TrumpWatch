import sqlite3
import os

DB_PATH = os.environ.get("TRUMPDIARY_DB", os.path.join(os.path.dirname(__file__), "..", "data", "trumpdiary.db"))

BUCKETS = ('scary', 'chaos', 'grift', 'cringe', 'hope', 'neutral')
GAUGE_MAP = {
    'scary': 'scare',
    'chaos': 'chaos',
    'grift': 'grift',
    'cringe': 'cringe',
    'hope': 'hope',
}
GAUGE_LABELS = {
    'scare': 'Scare-O-Meter',
    'chaos': 'Chaos Index',
    'grift': 'Grift Gauge',
    'cringe': 'World Cringe',
    'hope': 'Hope-O-Meter',
}


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
            bucket TEXT,
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

        CREATE TABLE IF NOT EXISTS gauge_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gauge_id TEXT NOT NULL,
            date TEXT NOT NULL,
            value REAL NOT NULL,
            top_article_id INTEGER,
            explainer TEXT,
            UNIQUE(gauge_id, date)
        );

        CREATE INDEX IF NOT EXISTS idx_gauge_history_date ON gauge_history(date);
        CREATE INDEX IF NOT EXISTS idx_gauge_history_gauge ON gauge_history(gauge_id);

        CREATE TABLE IF NOT EXISTS digest_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sent_at TEXT NOT NULL DEFAULT (datetime('now')),
            subscriber_count INTEGER,
            article_count INTEGER
        );
    """)

    for gauge_id, label in GAUGE_LABELS.items():
        conn.execute(
            "INSERT OR IGNORE INTO gauges (id, label, value) VALUES (?, ?, 50)",
            (gauge_id, label),
        )
    conn.commit()
    conn.close()


def migrate_db():
    """Migrate from old 3-bucket schema to new 5-bucket schema."""
    conn = get_db()

    has_old_buckets = conn.execute(
        "SELECT 1 FROM gauges WHERE id IN ('crazy') LIMIT 1"
    ).fetchone()
    has_old_articles = conn.execute(
        "SELECT 1 FROM articles WHERE bucket IN ('crazy', 'happy') LIMIT 1"
    ).fetchone()

    if not has_old_buckets and not has_old_articles:
        conn.close()
        return

    print("Migrating DB to 5-gauge schema...")

    conn.executescript("""
        CREATE TABLE IF NOT EXISTS articles_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            summary TEXT,
            source_name TEXT NOT NULL,
            source_category TEXT NOT NULL,
            published_at TEXT,
            scraped_at TEXT NOT NULL DEFAULT (datetime('now')),
            bucket TEXT,
            score INTEGER DEFAULT 50 CHECK(score BETWEEN 0 AND 100),
            image_url TEXT,
            llm_headline TEXT,
            llm_oneliner TEXT,
            used_in_digest INTEGER DEFAULT 0
        );

        INSERT OR IGNORE INTO articles_new
            SELECT * FROM articles;

        UPDATE articles_new SET bucket = 'chaos' WHERE bucket = 'crazy';
        UPDATE articles_new SET bucket = 'hope' WHERE bucket = 'happy';

        DROP TABLE articles;
        ALTER TABLE articles_new RENAME TO articles;

        CREATE INDEX IF NOT EXISTS idx_articles_bucket ON articles(bucket);
        CREATE INDEX IF NOT EXISTS idx_articles_scraped ON articles(scraped_at);
        CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
    """)

    conn.execute("DELETE FROM gauges WHERE id NOT IN ('scare', 'chaos', 'grift', 'cringe', 'hope')")
    for gauge_id, label in GAUGE_LABELS.items():
        conn.execute(
            "INSERT OR REPLACE INTO gauges (id, label, value) VALUES (?, ?, 50)",
            (gauge_id, label),
        )

    conn.commit()
    conn.close()
    print("Migration complete.")


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

    for bucket, gauge_id in GAUGE_MAP.items():
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


def snapshot_gauges(conn):
    """Save daily gauge snapshots with top article explainer for trend tracking."""
    from datetime import datetime, timedelta
    today = datetime.utcnow().strftime("%Y-%m-%d")
    yesterday = (datetime.utcnow() - timedelta(days=1)).isoformat()

    for bucket, gauge_id in GAUGE_MAP.items():
        gauge = conn.execute("SELECT value FROM gauges WHERE id = ?", (gauge_id,)).fetchone()
        if not gauge:
            continue

        top_article = conn.execute("""
            SELECT id, llm_headline, llm_oneliner
            FROM articles
            WHERE bucket = ? AND scraped_at > ?
            ORDER BY score DESC
            LIMIT 1
        """, (bucket, yesterday)).fetchone()

        explainer = None
        top_id = None
        if top_article:
            top_id = top_article["id"]
            explainer = top_article["llm_oneliner"] or top_article["llm_headline"]

        conn.execute("""
            INSERT OR REPLACE INTO gauge_history (gauge_id, date, value, top_article_id, explainer)
            VALUES (?, ?, ?, ?, ?)
        """, (gauge_id, today, gauge["value"], top_id, explainer))

    conn.commit()
