# City Jam — Deploy & Live Features

Get friends on the app **and** enable real two-person audio matching.

---

## Part 1: Deploy to Vercel (share with friends)

### 1. Push to GitHub

```bash
cd C:\Users\Zie\Projects\city-jam
git init
git add .
git commit -m "City Jam — musician matchmaking app"
```

Create a repo at [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/city-jam.git
git branch -M main
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `city-jam` GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables (from Part 2 below)
5. Click **Deploy**

Your friends visit: `https://city-jam-xxxx.vercel.app`

### 3. Quick local tunnel (no deploy)

For a one-night demo without Vercel:

```bash
npx localtunnel --port 3000
```

Share the printed URL (e.g. `https://random-name.loca.lt`).

---

## Part 2: Supabase (real matchmaking + map presence)

### 1. Create project

1. [supabase.com](https://supabase.com) → **New project**
2. Copy **Project URL** and **anon public key** (Settings → API)

### 2. Run database schema

1. Supabase Dashboard → **SQL Editor** → New query
2. Paste contents of `supabase/schema.sql`
3. Run

### 3. Enable Realtime

Dashboard → **Database** → **Replication** → enable realtime for:

- `match_queue`
- `session_decisions`
- `map_presence`

### 4. Environment variables

Create `.env.local` locally:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Add the **same variables** in Vercel → Project → Settings → Environment Variables, then redeploy.

---

## Part 3: Test two-person matching

1. Deploy (or tunnel) so both people use the **same public URL**
2. Both create accounts (any email works in demo auth)
3. Both allow **microphone** when prompted
4. **Blind Echo:** both click *Enter the Room* within ~30 seconds
5. **Echo Roulette:** both lock the **same frequency**, click *Connect*

WebRTC uses Google STUN servers. If audio fails, try Chrome and check mic permissions.

---

## Part 4: Signal Map — your dot

1. Sign in
2. Open `/signal-map`
3. Click **Appear on Map** (uses neighborhood-level location, rounded to ~11 km)
4. Hover city dots for labels

---

## Architecture

| Feature | Tech |
|---------|------|
| Hosting | Vercel |
| Match queue | Supabase Postgres + `try_match()` RPC |
| WebRTC signaling | Supabase Realtime broadcast |
| Audio | WebRTC peer connection (STUN) |
| Map presence | Supabase `map_presence` table |
| Auth (demo) | localStorage + stable user UUID |

### Production hardening (later)

- Replace demo auth with Supabase Auth
- Tighten RLS policies (currently open for MVP)
- Add TURN server for strict NAT/firewall networks
- Rate-limit match queue inserts
