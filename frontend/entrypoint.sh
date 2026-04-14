#!/bin/sh
# Ensure the data directory and DB files are writable by the nextjs user
if [ -d /data ]; then
  chown -R nextjs:nodejs /data 2>/dev/null || chmod -R a+rw /data 2>/dev/null || true
fi
exec su-exec nextjs:nodejs node server.js
