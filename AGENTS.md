# City Jam — agent instructions

Audio-first anonymous musician matchmaking (Next.js 14, Supabase, Vercel).

## Stack

- **App:** Next.js App Router, TypeScript, Tailwind
- **Backend:** Supabase (Postgres, Auth, Realtime)
- **Hosting:** Vercel (`https://city-jam.vercel.app`)
- **Repo:** `https://github.com/mackenzie-collab/city-jam`

## Common commands

```bash
npm install          # install deps
npm run dev          # local dev server (port 3000)
npm run build        # production build
npm run lint         # ESLint
```

## Health check

After the dev server is running:

```bash
curl -s http://localhost:3000/api/health
```

Expect `"ok": true` when Supabase env vars are set. Without them the app runs in demo mode (UI only).

## Key routes

| Route | Notes |
|-------|--------|
| `/signal-map` | Map presence (needs Supabase) |
| `/blind-echo` | 7-min WebRTC session (needs Supabase) |
| `/echo-roulette` | Frequency match + WebRTC (needs Supabase) |
| `/api/health` | Supabase connectivity check |

## Cursor Cloud specific instructions

Cloud agents use `.cursor/environment.json`: `npm install` on boot, then `npm run dev` on port 3000.

### Required secrets (Cursor Dashboard → Cloud Agents → Secrets)

Add these in [cursor.com/dashboard](https://cursor.com/dashboard) under **Cloud Agents → Secrets** (not in the repo):

| Secret | Value |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ifrhsazcivovyiusxpkx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (for dev in the cloud VM) |

Copy the anon key from your local `.env.local` or the Supabase dashboard. Never commit `.env.local`.

### Optional secrets

| Secret | When needed |
|--------|-------------|
| `NEXT_PUBLIC_GA4_ID` | Affiliate page analytics |
| `NEXT_PUBLIC_META_PIXEL_ID` | Affiliate page analytics |
| `AFFILIATE_FORM_WEBHOOK_URL` | Affiliate form submissions |

### Verify cloud setup

1. Dev server terminal shows Next.js ready on port 3000
2. `curl http://localhost:3000/api/health` returns `"ok": true`
3. Open `/blind-echo` or `/signal-map` in the agent browser to smoke-test live features

### Auth in cloud VMs

Supabase redirect URLs already include `http://localhost:3000/auth/callback` (see `docs/AUTH_SETUP.md`). Email/password auth works in cloud dev when secrets are set.

### Production vs cloud dev

- **Cloud agent dev:** `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- **Vercel production:** `NEXT_PUBLIC_SITE_URL=https://city-jam.vercel.app` (set in Vercel env vars, not needed in Cursor secrets unless testing prod URLs)

### Docs

- Deploy: `DEPLOY.md`, `VERCEL_SETUP.md`
- Auth: `docs/AUTH_SETUP.md`
- Env template: `.env.example`
