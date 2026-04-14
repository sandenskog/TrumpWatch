# Project

## What This Is

A daily satirical news dashboard tracking Trump's presidency. Scrapes 40+ RSS feeds daily, categorizes stories into buckets (scary, crazy, happy/hopeful) using LLMs, and presents them with animated gauges, countdowns, and infographics. Email digest via Resend.

## Core Value

A single page that makes you laugh, feel informed, and gives you hope — updated daily with fresh categorized content from 40+ sources.

## Current State

Greenfield. Specs defined, news sources researched (43 sources with RSS feeds identified). Nothing built yet.

## Architecture / Key Patterns

- **Scraper pipeline** (Python): Daily cron job fetches RSS, deduplicates, categorizes via LLM (cheap model), stores in SQLite
- **Frontend** (Next.js 14 + Tailwind): SSR dashboard reading from SQLite — gauges, countdowns, story cards, email signup
- **Email digest** (Resend): Daily summary email to subscribers
- **Deployment**: Docker Compose on Hetzner playground server, Traefik reverse proxy

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: MVP Launch — Full pipeline + dashboard + email digest deployed to playground
