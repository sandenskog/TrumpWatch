# Trump Watch

The ultimate daily satirical dashboard for English-speaking citizens counting down to the end of Trump's presidency.

## Hosting

- **Server:** playground
- **App:** trumpdiary
- **Domain:** trumpwatch.live
- **Stack:** Next.js + Tailwind (frontend), Python (scraper pipeline), SQLite (content DB), Resend (email)
- **Container:** trumpdiary
- **GA4:** G-W19ZZ2T1X9
- **GSC:** sc-domain:trumpwatch.live

## Architecture

- `/scraper` — Python pipeline that runs daily via cron, fetches 60+ RSS feeds, categorizes with LLM, stores in SQLite
- `/frontend` — Next.js app that reads from SQLite and renders the dashboard
- `/data` — SQLite database (shared volume between scraper and frontend)

## API Keys (managed via env)

- `RESEND_API_KEY` — email digest sending
- `SILICONFLOW_API_KEY` — LLM categorization (Qwen2.5-7B via SiliconFlow, cheap)
- `PEXELS_API_KEY` — stock photos
- `UNSPLASH_ACCESS_KEY` — stock photos
- `GEMINI_API_KEY` — backup LLM

## Tone

Extremely fun, entertaining, wish-casting but always funny. Serious undertone about democracy. NOT trying to be unbiased.
