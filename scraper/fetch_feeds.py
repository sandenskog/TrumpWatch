"""
RSS feed fetcher. Pulls articles from all sources, deduplicates, returns raw article dicts.
"""

import asyncio
from datetime import datetime, timezone
import feedparser
import httpx
from sources import SOURCES


async def fetch_single_feed(client: httpx.AsyncClient, source: dict) -> list[dict]:
    """Fetch and parse a single RSS feed."""
    try:
        resp = await client.get(source["url"], follow_redirects=True)
        resp.raise_for_status()
        feed = feedparser.parse(resp.text)

        articles = []
        for entry in feed.entries[:20]:
            published = None
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
            elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
                published = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc).isoformat()

            summary = ""
            if hasattr(entry, "summary"):
                import re
                summary = re.sub(r"<[^>]+>", "", entry.summary)[:500]

            url = entry.get("link", "")
            if not url:
                continue

            articles.append({
                "url": url,
                "title": entry.get("title", "No title"),
                "summary": summary,
                "source_name": source["name"],
                "source_category": source["category"],
                "published_at": published,
            })

        return articles
    except Exception as e:
        print(f"  Failed to fetch {source['name']}: {e}")
        return []


async def fetch_all_feeds() -> list[dict]:
    """Fetch all RSS feeds in parallel, return deduplicated article list."""
    headers = {
        "User-Agent": "TrumpWatch/1.0 (satirical news aggregator; +https://trumpwatch.live)"
    }

    async with httpx.AsyncClient(timeout=20, headers=headers) as client:
        tasks = [fetch_single_feed(client, s) for s in SOURCES]
        results = await asyncio.gather(*tasks)

    all_articles = []
    seen_urls = set()
    for feed_articles in results:
        for article in feed_articles:
            if article["url"] not in seen_urls:
                seen_urls.add(article["url"])
                all_articles.append(article)

    print(f"Fetched {len(all_articles)} unique articles from {len(SOURCES)} sources")
    return all_articles
