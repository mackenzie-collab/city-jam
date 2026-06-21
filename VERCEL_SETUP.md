# Finish Vercel deploy (2 minutes)

Supabase is **already configured** for project `ifrhsazcivovyiusxpkx`.
Local `.env.local` is set. Realtime is on.

## Option A — Vercel Dashboard (easiest if you linked the project in Cursor)

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) → your **city-jam** project
2. **Settings → Environment Variables** → add both (Production + Preview + Development):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://city-jam.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ifrhsazcivovyiusxpkx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(copy from `.env.local` in this folder)* |

3. **Deployments → Redeploy** (must redeploy after adding env vars)

## Option B — Vercel CLI

```powershell
cd C:\Users\Zie\Projects\city-jam
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
# paste: https://ifrhsazcivovyiusxpkx.supabase.co
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# paste anon key from .env.local
vercel --prod
```

## Verify live

- Local: `npm run dev` → open http://localhost:3000/api/health → should show `"ok": true`
- Production: `https://YOUR-APP.vercel.app/api/health` after redeploy
- Yellow demo banner should **disappear** once env vars are loaded

## Test with a friend

1. Both open the **same deployed URL**
2. Both sign in, allow microphone
3. **Blind Echo** → both click *Enter the Room* within 30s
4. Or **Echo Roulette** → same frequency → *Connect*
