# English Learning App

Self-hosted English learning web app for PC + iPhone, served from an old Android tablet (2 GB RAM) running Node.js via Termux.

- **Frontend**: React + Vite + MUI (Google Material Design), built into static assets
- **Backend**: Node.js + Express + better-sqlite3 (no ORM — low memory footprint)
- **Features**: lessons with exercises (MCQ / fill-blank / translation), dictionary, word practice with spaced repetition (SM-2), progress dashboard
- **No auth, no PWA/offline** — plain web page, private network (internet always available)

## Repo Layout

```
eng/
  openspec/                 # OpenSpec change artifacts
  server/                   # Express + SQLite; serves /api + built frontend
    src/{index.js,db.js,schema.sql,routes/,srs.js,seed/}
    test/
  app/                      # React + Vite frontend
    src/{main.jsx,App.jsx,theme.js,pages/,components/,lib/}
    test/
  .github/workflows/ci.yml
  deploy.sh
  README.md
```

## Local Development

Prerequisites: Node.js 20+.

```bash
# 1. Server (terminal 1)
cd server
npm ci
npm run dev          # http://localhost:8080

# 2. Frontend (terminal 2)
cd app
npm ci
npm run dev          # http://localhost:5173 (proxies /api -> :8080)
```

The first server boot creates `server/data/app.db` and seeds starter content (4 lessons, 100 dictionary words). Seed is idempotent — it only runs on an empty DB.

### Tests

```bash
cd server && npm test && npm run typecheck
cd app && npm test && npm run typecheck && npm run build
```

## Production Build

```bash
cd app && npm run build   # outputs app/dist
cd server && npm start    # serves /api + app/dist on :8080
```

## Deploy to the Tablet (Termux)

1. Install Termux from F-Droid, then:

```bash
pkg update && pkg upgrade
pkg install nodejs-lts git
# better-sqlite3 needs a prebuilt binary or build tools:
pkg install build-essential python sqlite
```

2. Clone and install:

```bash
git clone <your-repo-url> eng
cd eng/server
npm ci
```

3. Run with pm2 (auto-restart, low memory):

```bash
npm install -g pm2
cd eng/server
pm2 start src/index.js --name eng --node-args="--max-old-space-size=256"
pm2 save
```

4. Autostart on boot via Termux:Boot:

```bash
# Install the Termux:Boot app, then create ~/.termux/boot/start-eng.sh:
#!/data/data/com.termux/files/usr/bin/sh
pm2 resurrect
```

5. Access from PC/iPhone on the local WiFi: `http://<tablet-ip>:8080`

### Remote Access (Tailscale)

```bash
pkg install tailscale
tailscale up
tailscale serve --bg --https 443 http://localhost:8080
```

Then open the Tailscale HTTPS URL from any device. HTTPS is optional (no PWA/service worker), but recommended for Safari/iPhone quirks.

### Updating

```bash
./deploy.sh   # git pull + npm ci + pm2 restart
```

### Backup

SQLite data lives in `server/data/app.db`. Backup = copy the file:

```bash
cp server/data/app.db backup-$(date +%F).db
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/lessons` | List lessons |
| GET | `/api/lessons/:id` | Lesson + exercises + options (incl. correct answer) |
| POST | `/api/lessons/:id/attempts` | Batch-record exercise attempts |
| GET | `/api/dictionary?q=&level=` | Search dictionary |
| GET | `/api/dictionary/:id` | Word detail + SRS progress |
| POST | `/api/words/:id/review` | Submit review quality 0-5 (SM-2) |
| GET | `/api/reviews/due?limit=` | Due words for practice |
| GET | `/api/stats` | Dashboard stats (lessons, accuracy, due, streak) |

## Acceptance Checklist

- [ ] PC + iPhone: load app, complete a lesson with exercises, check instant feedback and explanations
- [ ] Dictionary search + level filter + word detail
- [ ] Word practice: review due words, SRS due date advances correctly
- [ ] Dashboard stats update after attempts and reviews
- [ ] Tablet server RSS < 400 MB (`pm2 monit` or `ps -o rss -p <pid>`)
- [ ] `git pull && pm2 restart eng` deploys cleanly

## Notes / Troubleshooting

- **better-sqlite3 build failure on Termux**: install `build-essential python sqlite` and re-run `npm ci`.
- **Memory**: server runs with `--max-old-space-size=256`; frontend is prebuilt off-tablet, so MUI only affects client bundle size, not server RAM.
- **Content**: starter seed only; no admin UI in v1. Extend lessons/words by editing `server/src/seed/seed.js` and re-seeding a fresh DB.
