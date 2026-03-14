# Fretboard Pilot

A pragmatic MVP guitar learning app built with Next.js + TypeScript.

## What it includes

- Static seed library for chords, scales, and theory in code
- Default learning profile with dynamic learning items and flashcards in Postgres
- Minimal review loop with SM-2-style scheduling
- Dashboard, library, detail, and review screens
- SVG fretboard visualization
- Local validation CLI: `./bin/test-app.sh`

## Database

The app prefers `DATABASE_URL` / Vercel Postgres / Neon.

If no database env var is present, it falls back to an in-memory store so the UI remains inspectable locally. Once deployed on Vercel with a Postgres integration attached, the dynamic learning state uses Postgres automatically.

## Local development

```bash
npm install
npm run dev
```

## Test CLI

```bash
./bin/test-app.sh
```

## Deploy

```bash
npx vercel --prod
```
