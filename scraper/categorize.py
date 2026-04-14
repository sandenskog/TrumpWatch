"""
LLM-based article categorization using Google Gemini Flash API.
Classifies articles into 5 buckets and generates satirical one-liners.
"""

from __future__ import annotations

import asyncio
import json
import os
import httpx

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash-lite")

SYSTEM_PROMPT = """You are a satirical news editor for "Trump Watch" — a funny, entertaining anti-Trump dashboard.

For each article, you must:
1. Decide if it's Trump-related (directly or indirectly about Trump, his administration, MAGA movement, or their impact)
2. If yes, categorize it into one of these buckets:
   - "scary": Threats to democracy & global stability — military threats, authoritarian moves, election interference, firing oversight officials, attacking courts/press
   - "chaos": Administrative dysfunction — contradictory orders, staff firings, policy reversals, unhinged social media rants, incompetent appointments, internal backstabbing
   - "grift": Self-dealing & corruption — Mar-a-Lago deals, family profiting from office, donor favors, crypto schemes, $TRUMP coin, conflicts of interest, pay-to-play
   - "cringe": International embarrassment — insulting allies, embarrassing summits, getting mocked by foreign leaders, pulling out of treaties, making the US look foolish abroad
   - "hope": Resistance & accountability wins — court victories blocking Trump, successful protests, bipartisan pushback, investigative journalism wins, election results against MAGA
   - "neutral": Trump-related but doesn't fit above buckets well
3. Rate intensity 0-100 (how intensely does this fit the bucket?)
4. Write a funny one-liner headline in the style of a satirical news show
5. Write a witty 1-sentence summary

Respond ONLY with valid JSON. No markdown, no explanation."""

USER_TEMPLATE = """Classify this article:

Title: {title}
Source: {source}
Summary: {summary}

Respond with JSON:
{{
  "trump_related": true/false,
  "bucket": "scary"|"chaos"|"grift"|"cringe"|"hope"|"neutral"|null,
  "score": 0-100,
  "headline": "funny one-liner headline",
  "oneliner": "witty summary sentence"
}}"""

MAX_RETRIES = 3
RETRY_BASE_DELAY = 2.0


async def categorize_article(title: str, summary: str, source: str) -> dict | None:
    if not GEMINI_API_KEY:
        return {"trump_related": True, "bucket": "chaos", "score": 50,
                "headline": title, "oneliner": summary or title}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

    async with httpx.AsyncClient(timeout=30) as client:
        for attempt in range(MAX_RETRIES):
            try:
                resp = await client.post(url, json={
                    "contents": [
                        {"role": "user", "parts": [{"text": SYSTEM_PROMPT + "\n\n" + USER_TEMPLATE.format(
                            title=title, summary=summary or "", source=source
                        )}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 500,
                        "responseMimeType": "application/json",
                    },
                })
                if resp.status_code in (429, 503):
                    delay = RETRY_BASE_DELAY * (2 ** attempt)
                    await asyncio.sleep(delay)
                    continue
                resp.raise_for_status()
                data = resp.json()
                content = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if content.startswith("```"):
                    content = content.split("\n", 1)[1].rsplit("```", 1)[0]
                return json.loads(content)
            except (httpx.HTTPStatusError, KeyError, json.JSONDecodeError) as e:
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(RETRY_BASE_DELAY * (2 ** attempt))
                    continue
                print(f"  LLM categorization failed after {MAX_RETRIES} attempts: {e}")
                return None
            except Exception as e:
                print(f"  LLM categorization failed: {e}")
                return None
    return None


async def categorize_batch(articles: list[dict]) -> list[dict]:
    """Categorize a batch of articles. Returns only Trump-related ones."""
    results = []
    semaphore = asyncio.Semaphore(2)

    async def process(article):
        async with semaphore:
            cat = await categorize_article(
                article["title"],
                article.get("summary", ""),
                article["source_name"],
            )
            if cat and cat.get("trump_related"):
                article["bucket"] = cat.get("bucket", "neutral")
                article["score"] = cat.get("score", 50)
                article["llm_headline"] = cat.get("headline", article["title"])
                article["llm_oneliner"] = cat.get("oneliner", "")
                results.append(article)

    await asyncio.gather(*(process(a) for a in articles))
    return results
