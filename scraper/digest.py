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
            CASE bucket WHEN 'scary' THEN 1 WHEN 'crazy' THEN 2 WHEN 'happy' THEN 3 ELSE 4 END,
            score DESC
        LIMIT ?
    """, (limit,)).fetchall()


def get_gauges(conn):
    return {r["id"]: r for r in conn.execute("SELECT * FROM gauges").fetchall()}


def build_email_html(articles, gauges):
    bucket_emoji = {"scary": "\U0001f631", "crazy": "\U0001f92a", "happy": "\U0001f389", "neutral": "\U0001f4f0"}
    bucket_label = {"scary": "SCARY", "crazy": "CRAZY", "happy": "HAPPY", "neutral": "NEWS"}

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

    scare = gauges.get("scare", {})
    crazy = gauges.get("crazy", {})
    hope = gauges.get("hope", {})

    scare_val = scare["value"] if hasattr(scare, "__getitem__") else 50
    crazy_val = crazy["value"] if hasattr(crazy, "__getitem__") else 50
    hope_val = hope["value"] if hasattr(hope, "__getitem__") else 50

    return f"""
    <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="text-align:center;padding:24px 0;">
            <h1 style="font-size:28px;margin:0;">Trump Watch</h1>
            <p style="color:#666;margin:4px 0 0;">Your daily dose of democracy watch</p>
        </div>

        <div style="display:flex;justify-content:space-around;padding:16px;background:#f8f8f8;border-radius:8px;margin-bottom:24px;">
            <div style="text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#dc2626;">{scare_val:.0f}</div>
                <div style="font-size:11px;color:#666;">SCARE-O-METER</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#ea580c;">{crazy_val:.0f}</div>
                <div style="font-size:11px;color:#666;">CRAZY-O-METER</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#16a34a;">{hope_val:.0f}</div>
                <div style="font-size:11px;color:#666;">HOPE-O-METER</div>
            </div>
        </div>

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
    subscribers = conn.execute(
        "SELECT email FROM subscribers WHERE confirmed = 1 AND unsubscribed = 0"
    ).fetchall()

    if not subscribers:
        print("No confirmed subscribers. Skipping send.")
        conn.close()
        return

    html = build_email_html(articles, gauges)
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
