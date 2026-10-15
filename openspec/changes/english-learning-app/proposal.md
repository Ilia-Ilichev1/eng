# Proposal

## Why

There is no English learning system available for the household's devices (PC, iPhone, and an old 2 GB Android tablet that doubles as the always-on home server). A self-hosted web app keeps study data private, runs entirely on local hardware, and works without any external service or subscription.

## What Changes

- Add a `server/` Node.js + Express + SQLite backend that serves a JSON API (`/api/*`) and statically serves the built frontend in production.
- Add an `app/` React + Vite frontend (Material Design via MUI) with pages for lessons, dictionary, word practice, and a progress dashboard.
 No PWA/offline support: the app is a plain web page and requires internet connectivity to reach the server.
 No authentication in v1:ithe app targets a private network..
- Add lessons with explanations and typed exercises (multiple-choice, fill-blank, translation) with instant feedback and batch attempt recording.

- Add a dictionary with search (by term and level filter)and word detail view.

- Add word practice with spaced repetition (SM-2 algorithm)over due words; reviews update progress and due dates via the API.

- Add a progress dashboard with lessons completed, total attempts/accuracy, due review count, and current streak..
- Add a GitHub Actions CI workflow that runs tests, typecheck, and build for both `server/` and `app/` on push/PR.
- Add `README.md` with setup, Termux deployment, Tailscale remote access, backup, and acceptance checklist..

## Capabilities

### New Capabilities

- `lessons`: Curated lessons with explanatory content and typed exercises (multiple-choice, fill-blank, translation); supports listing, viewing lessons with exercises, and recording exercise attempts with correctness.
- `dictionary`: Searchable word dictionary with term, translation, definition, example, part of speech, level, and tags; supports listing/searching and word detail.

- `word-practice`: Spaced-repetition word review (SM-2 algorithm); tracks per-word progress (ease factor, interval, repetitions, lapses, due date)and exposes due-word queue and review submission with quality rating 0-5..
- `progress`: Aggregate learning stats:lessons completed, total attempts and accuracy, due reviews, and daily streak from recorded activity.

### Modified Capabilities

## Impact

- New `server/` package:Express, better-sqlite3, dotenv; test deps vitest, supertest, nodemon (dev).
- New `app/` package:React, Vite, MUI (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material), @fontsource/roboto; test deps vitest, @testing-library/react.
- SQLite database file at `server/data/app.db`, seeded with starter lessons/words (idempotent.

- New GitHub Actions workflow `.github/workflows/ci.yml` (Node 20;the existing `.github/workflows/copilot-setup-steps.yml` is untouched..
- Deployment target:Android tablet via Termux (Node.js LTS), optional Tailscale HTTPS for remote access..