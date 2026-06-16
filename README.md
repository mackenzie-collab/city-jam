# City Jam

Audio-first anonymous musician matchmaking.

## Quick start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Share with friends + live matching

See **[DEPLOY.md](./DEPLOY.md)** for:

- Vercel deployment
- Supabase setup (matchmaking, WebRTC signaling, map presence)
- Two-person audio test instructions

## Features

| Route | Live? |
|-------|-------|
| `/signal-map` | Real geography + hover labels + your dot (with Supabase) |
| `/blind-echo` | 7-min session + WebRTC audio (with Supabase) |
| `/echo-roulette` | FM dial + frequency match + WebRTC (with Supabase) |
| Other routes | UI demo with mock auth |

Without Supabase env vars, the app runs in **demo mode** (UI only).
