#!/bin/bash
# Cron jobs for Trump Diary on the server
# Run scraper every 6 hours, digest at 8am UTC daily

CRON_SCRAPER="0 */6 * * * cd /opt/apps/trumpdiary && docker compose run --rm scraper >> /var/log/trumpdiary-scraper.log 2>&1"
CRON_DIGEST="0 8 * * * cd /opt/apps/trumpdiary && docker compose run --rm digest >> /var/log/trumpdiary-digest.log 2>&1"

# Add to crontab if not already present
(crontab -l 2>/dev/null | grep -v trumpdiary; echo "$CRON_SCRAPER"; echo "$CRON_DIGEST") | crontab -

echo "Cron jobs installed:"
crontab -l | grep trumpdiary
