# Design

## Context

Greenfield project at `/Users/ilailicev/Desktop/eng` — an OpenSpec scaffold only, no application code yet (see proposal.md - Why). Deployment target is an old Android tablet (2 GB RAM, low CPU) running Node.js under Termux; clients are a PC browser and an iPhone on the local WiFi (Tailscale for remote access). Internet is always available, so no PWA/offline support; no authentication (private network.

## Goals / Non-Goals

**Goals:**
- Single-origin web app:one Express server serves the JSON API and the built frontend statics, so clients need no CORS or URL config.

- Minimal server footprint:lean deps (better-sqlite3, no ORM), capped Node heap (--max-old-space-size=256), frontend built off-tablet and served as static files.

- One authoritative SRS implementation on the server; client mirrors the math only to preview next due dates.



**Non-Goals:**
- Offline/PWA behavior, IndexedDB, sync queues, service workers.
- Authentication or multi-user support.

- Content authoring/admin UI (seed data is edited in repo files..
- Automatic CD to the tablet (deploy = git pull + restart, documented..

## Decisions

- **Node.js + Express + better-sqlite3 (no ORM).** The tablet has 2 GB RAM; an ORM adds memory/CPU overhead for no benefit at this scale. `better-sqlite3` binds natively and is synchronous — adequate for a single household. Alternative: knex/sequelize — rejected for footprint; `node:sqlite` — experimental/inconsistent across Node builds in Termux.

- **SQL schema + boot-time migrations, idempotent seed.** Schema lives in `schema.sql`; on boot, tables are created if absent and the seed runs only when the DB is empty. This keeps Termux deploy simple (`git pull && restart`) without a migration runner. Alternative: `migrations/` runner — rejected: overkill for v1 schema that evolves slowly.


- **SM-2 spaced repetition, server-authoritative.** `srs.js` implements SM-2 (quality 0-5). The client previews the next due date with a mirrored `lib/srs.js` but always applies the server's returned progress. Alternative: other algorithms (Anki's SM-2 variant, FSRS) — rejected: plan locked SM-2, well-understood and easily testable.


- **Dev proxy instead of CORS.** In dev, Vite proxies `/api` to `http://localhost:8080`; in production Express serves `app/dist`. One origin, no CORS middleware, relative `/api` fetch base everywhere. Alternative: CORS + separate origins — rejected: adds complexity and server work.


- **MUI build-time only.** `@mui/material` bundles into static assets on the dev/CI machine; the tablet only sends files over LAN. Alternative: hand-rolled CSS — rejected: plan requires Google Material Design via MUI; CDN fonts — rejected: must work on tablet LAN without internet to CDNs, so `@fontsource/roboto` is self-hosted.


- **Repository layout `server/` + `app/` + `.github/workflows/ci.yml`** at `/Users/ilailicev/Desktop/eng`. The multi-tool agent workspace dirs at root are untouched; `openspec/` only gains the change artifacts. Alternative: monorepo tooling (nx, turborepo) — rejected: footprint and complexity unjustified.


## Risks / Trade-offs

- [`better-sqlite3` native build on Termux may fail without build tools] → Document `pkg install build-essential python` (plus `sqlite`) in README; prefer Node LTS prebuilt binaries..
- [2 GB RAM tablet] → Cap heap at 256 MB, keep deps lean, SRS/API are O(1) per request, no per-request heavy computation, frontend is prebuilt statics only..
- [iPhone Safari quirks with forms/POST] → Test on Safari specifically during acceptance; no service worker/offline involved, so risk is limited to standard Web API behavior..
- [Single-user SQLite file could corrupt on abrupt power loss] → WAL not required for v1;document backup = copy `server/data/app.db`; graceful restart via pm2..

## Migration Plan

1. Ship v1 (fresh install):`git pull` on tablet, `npm ci` in `server/`, run `node src/index.js` (or pm2) — schema auto-creates and seed fills empty DB..
2. Upgrades: pull, restart; boot-time migrations (`CREATE TABLE IF NOT EXISTS`) make schema additive — no down-migration needed in v1..
3. Rollback: previous git tag/branch + restore DB backup file..

## Open Questions

None — all deferrable unknowns are intentionally resolved in plan (see plan file: no PWA, no auth, no admin UI, Node+SQLite stack locked..