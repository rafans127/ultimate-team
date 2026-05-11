# Ultimate Team

A soccer formation builder for team captains. Build lineups, drag players onto the pitch, and share with teammates.

## Features

- Multiple teams, each with a saved roster and multiple lineups
- Drag-and-drop formation builder (11-aside and 7-aside formations)
- Auto-saves to Supabase as you build
- Shareable read-only links for teammates
- Installable as a mobile app (PWA)

## Stack

React + TypeScript, Vite, Tailwind CSS, dnd-kit, Supabase, React Router — deployed on Vercel.

## Setup

```bash
npm install
cp .env.example .env  # add your Supabase URL and anon key
npm run dev
```

## Database

Run the SQL in `src/lib/db.ts` in your Supabase SQL editor to create the `teams`, `players`, and `lineups` tables.

## Deploy

Push to `main` — Vercel auto-deploys. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel environment variables.
