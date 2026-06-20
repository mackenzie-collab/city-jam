# Auth setup (one-time, ~10 minutes)

City Jam uses **Supabase Auth**. Email/password works after this checklist. Google/Facebook/Apple need extra steps in the Supabase Dashboard — there is no CLI toggle for providers.

**Project:** [ifrhsazcivovyiusxpkx](https://supabase.com/dashboard/project/ifrhsazcivovyiusxpkx)

## 1. URL configuration (required)

Open [Authentication → URL Configuration](https://supabase.com/dashboard/project/ifrhsazcivovyiusxpkx/auth/url-configuration):

| Setting | Value |
|---------|--------|
| **Site URL** | `https://city-jam.vercel.app` |
| **Redirect URLs** (add each line) | `https://city-jam.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |
| | `cityjam://auth/callback` |

Save. Without these, email confirmation and OAuth redirects fail.

## 2. Email sign-up (works today)

Open [Authentication → Providers → Email](https://supabase.com/dashboard/project/ifrhsazcivovyiusxpkx/auth/providers):

- **Enable Email provider** — on
- For faster testing, turn **Confirm email** off (users can log in immediately)
- For production, leave **Confirm email** on — users must click the link in their inbox before first login

Password reset emails use the same project; "Forgot password?" on `/login` sends via Supabase.

## 3. Google (recommended first OAuth provider)

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → **Create OAuth client ID** (Web application)
2. **Authorized JavaScript origins:** `https://city-jam.vercel.app`, `http://localhost:3000`, `https://ifrhsazcivovyiusxpkx.supabase.co`
3. **Authorized redirect URIs:** `https://ifrhsazcivovyiusxpkx.supabase.co/auth/v1/callback`
4. Copy Client ID + Client Secret into [Supabase → Auth → Providers → Google](https://supabase.com/dashboard/project/ifrhsazcivovyiusxpkx/auth/providers?provider=Google)
5. Enable the Google provider and save

## 4. Facebook & Apple (optional)

Each needs a developer app and the same Supabase callback URL:

`https://ifrhsazcivovyiusxpkx.supabase.co/auth/v1/callback`

- [Facebook Login](https://developers.facebook.com/) → add Facebook provider in Supabase with App ID + Secret
- [Apple Sign In](https://developer.apple.com/sign-in-with-apple/) → add Apple provider (required if you ship iOS with any social login)

See also [docs/auth-native.md](./auth-native.md) for Expo deep links.

## 5. Vercel env vars (already set)

Production and Preview need:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://ifrhsazcivovyiusxpkx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key from [Project Settings → API](https://supabase.com/dashboard/project/ifrhsazcivovyiusxpkx/settings/api)

Redeploy after changing env vars.

## Verify

1. **Email:** Register at `/register` → confirm email if required → log in at `/login`
2. **Google:** After step 3, click "Continue with Google" → should return to `/profile`
3. **Logs:** [Auth logs](https://supabase.com/dashboard/project/ifrhsazcivovyiusxpkx/logs/auth-logs) — `provider is not enabled` means step 3/4 was skipped

## Common errors

| Symptom | Fix |
|---------|-----|
| OAuth page: "provider is not enabled" | Enable Google/Facebook/Apple in Supabase Providers |
| "Email not confirmed" | Click confirmation link or disable Confirm email for testing |
| Redirect loop / callback error | Add redirect URLs in step 1 |
| Works locally, not on Vercel | Check env vars on Vercel project → Settings → Environment Variables |
