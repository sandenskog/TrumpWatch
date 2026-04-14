#!/usr/bin/env python3
"""
Daily email digest sender via Resend API.
Pulls today's top articles, builds HTML email, sends to all confirmed subscribers.
"""

import os
import resend
from db import get_db

resend.api_key = os.environ.get("RESEND_API_KEY", "")
FROM_EMAIL = os.environ.get("DIGEST_FROM", "digest@trumpwatch.live")
SITE_URL = os.environ.get("SITE_URL", "https://trumpwatch.live")


def get_todays_highlights(conn, limit=10):
    return conn.execute("""
        SELECT * FROM articles
        WHERE scraped_at > datetime('now', '-1 day')
          AND bucket IS NOT NULL
        ORDER BY
            CASE bucket WHEN 'scary' THEN 1 WHEN 'chaos' THEN 2 WHEN 'grift' THEN 3 WHEN 'cringe' THEN 4 WHEN 'hope' THEN 5 ELSE 6 END,
            score DESC
        LIMIT ?
    """, (limit,)).fetchall()


def get_gauges(conn):
    return {r["id"]: r for r in conn.execute("SELECT * FROM gauges").fetchall()}


def get_gauge_trends(conn):
    """Get 7-day trend for each gauge."""
    trends = {}
    for row in conn.execute("""
        SELECT gauge_id,
               value as current_val,
               (SELECT value FROM gauge_history gh2
                WHERE gh2.gauge_id = gh.gauge_id
                AND gh2.date <= date(gh.date, '-7 days')
                ORDER BY gh2.date DESC LIMIT 1) as week_ago_val
        FROM gauge_history gh
        WHERE date = (SELECT MAX(date) FROM gauge_history)
        GROUP BY gauge_id
    """).fetchall():
        gauge_id = row["gauge_id"]
        current = row["current_val"]
        week_ago = row["week_ago_val"]
        if week_ago is not None:
            diff = round(current - week_ago, 1)
            arrow = "\u2191" if diff > 0 else ("\u2193" if diff < 0 else "\u2192")
            trends[gauge_id] = f"{arrow} {abs(diff):.0f}pts"
        else:
            trends[gauge_id] = ""
    return trends


def build_email_html(articles, gauges, trends):
    bucket_emoji = {
        "scary": "\U0001f631", "chaos": "\U0001f525", "grift": "\U0001f4b0",
        "cringe": "\U0001f30d", "hope": "\U0001f389", "neutral": "\U0001f4f0",
    }
    bucket_label = {
        "scary": "SCARY", "chaos": "CHAOS", "grift": "GRIFT",
        "cringe": "CRINGE", "hope": "HOPE", "neutral": "NEWS",
    }

    stories_html = ""
    for a in articles:
        emoji = bucket_emoji.get(a["bucket"], "\U0001f4f0")
        label = bucket_label.get(a["bucket"], "NEWS")
        stories_html += f"""
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #eee;">
                <span style="background:#f0f0f0;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:bold;">
                    {emoji} {label}
                </span>
                <br/>
                <a href="{a['url']}" style="color:#1a1a1a;text-decoration:none;font-weight:600;font-size:16px;line-height:1.4;">
                    {a['llm_headline'] or a['title']}
                </a>
                <br/>
                <span style="color:#666;font-size:14px;">{a['llm_oneliner'] or ''}</span>
                <br/>
                <span style="color:#999;font-size:12px;">{a['source_name']}</span>
            </td>
        </tr>"""

    gauge_configs = [
        ("scare", "SCARE-O-METER", "#dc2626"),
        ("chaos", "CHAOS INDEX", "#ea580c"),
        ("grift", "GRIFT GAUGE", "#b45309"),
        ("cringe", "WORLD CRINGE", "#7c3aed"),
        ("hope", "HOPE-O-METER", "#16a34a"),
    ]

    gauges_html = ""
    for gid, glabel, gcolor in gauge_configs:
        g = gauges.get(gid, {})
        val = g["value"] if hasattr(g, "__getitem__") and "value" in g else 50
        trend = trends.get(gid, "")
        gauges_html += f"""
            <td style="text-align:center;padding:8px;">
                <div style="font-size:22px;font-weight:bold;color:{gcolor};">{val:.0f}</div>
                <div style="font-size:11px;color:#666;">{glabel}</div>
                <div style="font-size:10px;color:#999;">{trend}</div>
            </td>"""

    return f"""
    <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="text-align:center;padding:24px 0;">
            <h1 style="font-size:28px;margin:0;">Trump Watch</h1>
            <p style="color:#666;margin:4px 0 0;">Your daily dose of democracy watch</p>
        </div>

        <table style="width:100%;border-collapse:collapse;padding:16px;background:#f8f8f8;border-radius:8px;margin-bottom:24px;">
            <tr>{gauges_html}</tr>
        </table>

        <table style="width:100%;border-collapse:collapse;">
            {stories_html}
        </table>

        <div style="text-align:center;padding:24px 0;margin-top:24px;border-top:1px solid #eee;">
            <a href="{SITE_URL}" style="color:#1a1a1a;font-weight:600;">View Full Dashboard</a>
            <br/><br/>
            <span style="color:#999;font-size:12px;">You're receiving this because you subscribed to Trump Watch.</span>
        </div>
    </div>"""


def send_digest():
    conn = get_db()
    articles = get_todays_highlights(conn)
    if not articles:
        print("No articles for today's digest. Skipping.")
        conn.close()
        return

    gauges = get_gauges(conn)
    trends = get_gauge_trends(conn)
    subscribers = conn.execute(
        "SELECT email FROM subscribers WHERE confirmed = 1 AND unsubscribed = 0"
    ).fetchall()

    if not subscribers:
        print("No confirmed subscribers. Skipping send.")
        conn.close()
        return

    html = build_email_html(articles, gauges, trends)
    emails = [r["email"] for r in subscribers]

    print(f"Sending digest to {len(emails)} subscribers with {len(articles)} stories...")

    for email in emails:
        try:
            resend.Emails.send({
                "from": FROM_EMAIL,
                "to": email,
                "subject": f"Trump Watch: Today's {len(articles)} wildest stories",
                "html": html,
            })
        except Exception as e:
            print(f"  Failed to send to {email}: {e}")

    conn.execute(
        "INSERT INTO digest_log (subscriber_count, article_count) VALUES (?, ?)",
        (len(emails), len(articles)),
    )
    conn.execute(
        "UPDATE articles SET used_in_digest = 1 WHERE id IN ({})".format(
            ",".join(str(a["id"]) for a in articles)
        )
    )
    conn.commit()
    conn.close()
    print("Digest sent.")


if __name__ == "__main__":
    send_digest()
