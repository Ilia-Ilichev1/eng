# Tasks

## 1. Server Scaffold

- [ ] 1.1 Create `server/` package: `package.json` with scripts (dev, start, test, typecheck, build), deps (express, better-sqlite3, dotenv), dev deps (vitest, supertest, nodemon), and `.env.example` (PORT=8080, DB_PATH=./data/app.db, NODE_OPTIONS=--max-old-space-size=256.; verify `npm install` succeeds.
- [ ] 1.2 Add `schema.sql` with tables:lessons, exercises, exercise_options, words, word_progress, exercise_attempts — per design; verify boot creates an empty DB with all tables (via `sqlite3 .tables` or a vitest check..
- [ ] 1.3 Implement `src/db.js` (opens SQLite at DB_PATH, `CREATE TABLE IF NOT EXISTS` from schema.sql, directories auto-created);verify a boot smoke test creates tables without error.

## 2. Seed Content

- [ ] 2.1 Implement `src/seed/seed.js`:3-4 lessons with 5-8 exercises each + explanations; 50-100 dictionary words; idempotent (skips when DB non-empty); verify seed run on a fresh DB inserts content and a second run adds nothing (row-count assertion in vitest..
- [ ] 2.2 Add seed exercise options for every MCQ, correct-answer data for fill_blank/translation; verify every exercise has valid options/answer (seed validation test..

## 3. SRS + API

- [ ] 3.1 Implement `src/srs.js` SM-2 review(word_progress, quality):q<3 resets reps=0, interval=1, lapses+1; q>=3 advances reps/interval/ease per SM-2; due_date=today+interval; verify unit tests cover quality 0,3,5 edge cases (exact expected values..
- [ ] 3.2 Implement API routes:GET `/api/lessons`, GET `/api/lessons/:id` (lesson+exercises+options incl. is_correct), POST `/api/lessons/:id/attempts` (batch; 404 for unknown lesson;, GET `/api/dictionary?q=&level=` , GET `/api/dictionary/:id`, POST `/api/words/:id/review` (quality 0-5; 400/404 handling;, GET `/api/reviews/due?limit=` , GET `/api/stats`; verify supertest tests cover each route incl. errors..
- [ ] 3.3 Serve production statics from `../app/dist` with SPA fallback to `index.html`;verify a request to a non-API path returns index.html when dist exists (or 503 note when absent..

## 4. Server Tests + Docs

- [ ] 4.1 Write vitest+supertest suite:API CRUD, SRS math (0,3,5 edge cases, seed idempotency, stats/streak; verify `npm test` in `server/` passes..
- [ ] 4.2 Write `server/README.md` snippet-ish notes if needed (Termux native module gotcha: `pkg install build-essential python`; verify doc exists and matches reality..

## 5. Frontend Scaffold + Theme

- [ ] 5.1 Scaffold `app/` Vite React (no PWA plugin, no service worker); install MUI deps (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material, @fontsource/roboto);verify `npm install` and `npm run build` succeed..
- [ ] 5.2 Add `vite.config.js` dev proxy `/api` → `http://localhost:8080`; verify a dev-server request to `/api/lessons` proxies (smoke test..
- [ ] 5.3 Implement `src/theme.js` (MUI createTheme, Material 3 tokens, responsive), `src/main.jsx` (Roboto font, CssBaseline, Router), `src/App.jsx` layout (AppBar, Drawer/mobile nav, routes);verify app renders at `/` with nav (smoke test..

## 6. Frontend Data + Pages

- [ ] 6.1 Implement `src/lib/api.js` (relative `/api` fetch wrapper, GET/POST helpers, error handling);verify unit tests cover wrapper (success/error paths..
- [ ] 6.2 Implement `src/lib/srs.js` (client SM-2 mirror for previewing next due date);verify unit tests match server srs.js outputs (0,3,5..
- [ ] 6.3 Build Dashboard page (`/`):stats Cards, continue-lesson card, due-reviews badge; verify page renders stats from `/api/stats` (RTL smoke test..
- [ ] 6.4 Build Lessons pages (`/lessons`, `/lessons/:id`):list, explanation sections, inline exercises (Stepper, Radio, TextField), instant feedback + explanation from cached payload, batch attempt POST; verify RTL test covers render + answer flow..
- [ ] 6.5 Build Dictionary page (`/dictionary`):search (TextField+Search icon), level filter, word cards; verify RTL test covers search render..
- [ ] 6.6 Build Word Practice page (`/practice`):due flashcards (flip, reveal translation, rate 0-5 → POST review, preview next due date from lib/srs.js);verify RTL test covers flashcard render + rating flow..

## 7. Frontend Tests

- [ ] 7.1 Write vitest + React Testing Library suite:SRS math, api wrapper, 1-2 page smoke tests (Dashboard, Lessons, Dictionary, Practice); verify `npm test` in `app/` passes..

## 8. CI + Deployment + Acceptance

- [ ] 8.1 Add `.github/workflows/ci.yml` (Node 20; npm ci in app/ + server/; server tests; app tests; `tsc --noEmit` both; build both; verify workflow file parses (actionlint if available)..
- [ ] 8.2 Write `README.md`:setup, Termux deploy (`pkg install nodejs-lts git`, `npm ci`, pm2/termux-services, autostart via Termux:Boot `pm2 resurrect`, Tailscale `tailscale serve --bg --https 443 http://localhost:8080`, backup=copy `server/data/app.db`, deploy.sh, acceptance checklist (PC+iPhone lessons/dictionary/practice/dashboard, tablet RSS < 400MB);verify commands run as documented..
- [ ] 8.3 Create `deploy.sh` at repo root (git pull && pm2 restart eng);verify script is executable and documented..

##  Workflow follow-up

- Archive the change after implementation and review (per project workflow)..
- Verify the archived result:specs present at `openspec/specs/<capability>/spec.md` and archive is clean..
- Initialize git repo, create GitHub repo, push, verify Actions green (requires user access to `gh`/git push..