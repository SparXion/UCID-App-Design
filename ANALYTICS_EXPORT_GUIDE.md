# Analytics Export Guide

## Weekly CSV Export (Manual)

Run from repo root:

```bash
export ADMIN_KEY=your_admin_key
export API_BASE_URL=https://ucid-backend.fly.dev
./scripts/export_analytics_weekly.sh
```

Files will be saved under `./exports/`.

---

## Weekly CSV Export (Automated)

You can schedule a cron job on any machine that has access to the API:

```bash
crontab -e
```

Add:

```bash
0 6 * * 1 cd /path/to/UCID-App-Design && \
  export ADMIN_KEY=your_admin_key && \
  export API_BASE_URL=https://ucid-backend.fly.dev && \
  ./scripts/export_analytics_weekly.sh
```

This runs every Monday at 6:00 AM UTC.

---

## Notes

- If `ADMIN_KEY` is set in the backend, it must be included.
- If you remove `ADMIN_KEY`, exports are open to any authenticated user.
- You can add `AUTH_TOKEN` if you want to require auth in the script.

