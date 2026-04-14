#!/usr/bin/env python3
"""
Main scraper entrypoint. Run daily via cron or manually.
Fetches feeds -> categorizes via LLM -> stores in SQLite -> updates gauges -> snapshots history.
"""

import asyncio
import sys
from datetime import datetime

from db import init_db, migrate_db, get_db, article_exists, insert_article, update_gauges, snapshot_gauges
from fetch_feeds import fetch_all_feeds
from categorize import categorize_batch


async def main():
    print(f"=== Trump Diary Scraper — {datetime.utcnow().isoformat()} ===")

    init_db()
    migrate_db()

    articles = await fetch_all_feeds()
    if not articles:
        print("No articles fetched. Exiting.")
        return

    conn = get_db()
    new_articles = [a for a in articles if not article_exists(conn, a["url"])]
    print(f"New articles to process: {len(new_articles)} (skipped {len(articles) - len(new_articles)} duplicates)")

    if not new_articles:
        print("No new articles. Updating gauges and exiting.")
        update_gauges(conn)
        snapshot_gauges(conn)
        conn.close()
        return

    batch_size = 20
    total_stored = 0

    for i in range(0, len(new_articles), batch_size):
        batch = new_articles[i:i + batch_size]
        print(f"Categorizing batch {i // batch_size + 1} ({len(batch)} articles)...")

        categorized = await categorize_batch(batch)

        for article in categorized:
            insert_article(conn, article)
            total_stored += 1

        conn.commit()

    update_gauges(conn)
    snapshot_gauges(conn)
    conn.close()

    print(f"Done. Stored {total_stored} Trump-related articles.")

    counts = {}
    conn = get_db()
    for row in conn.execute(
        "SELECT bucket, COUNT(*) as cnt FROM articles WHERE scraped_at > datetime('now', '-1 day') GROUP BY bucket"
    ).fetchall():
        counts[row["bucket"]] = row["cnt"]
    conn.close()
    print(f"Today's buckets: {dict(counts)}")


if __name__ == "__main__":
    asyncio.run(main())
