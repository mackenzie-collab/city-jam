# City Jam — Native app auth (Expo / React Native)

Web and native share **one Supabase project** and **one `auth.users` table**. No duplicate profiles.

## Environment

Use the same values as the web app:

- `EXPO_PUBLIC_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Redirect URLs (Supabase Dashboard → Authentication → URL Configuration)

| Platform | Redirect URL |
|----------|--------------|
| Web | `https://city-jam.vercel.app/auth/callback` |
| Web (local) | `http://localhost:3000/auth/callback` |
| iOS / Android | `cityjam://auth/callback` |

Add all URLs to **Redirect URLs** and enable **Google**, **Facebook**, and **Apple** providers.

## OAuth flow (PKCE)

1. Native app calls `supabase.auth.signInWithOAuth({ provider, options: { redirectTo: 'cityjam://auth/callback', skipBrowserRedirect: true } })`.
2. Open the returned URL in an in-app browser (`WebBrowser.openAuthSessionAsync` on Expo).
3. Capture the redirect with deep link handler; pass `code` to `supabase.auth.exchangeCodeForSession(code)`.
4. Session (refresh token) persists in secure storage (`expo-secure-store` adapter for Supabase).

Apple Sign-In is **required** for App Store if any third-party login is offered.

## Account linking

Users who sign in with Google on web can link Facebook/Apple later via `supabase.auth.linkIdentity()` — same as web `/settings/account`.

Identities are stored in `auth.identities`; one `auth.users.id` maps to many providers.

## Roles and MFA

- `account_memberships.account_role`: `member` | `producer` | `artist` | `moderator` | `admin`
- `producer`, `moderator`, `admin` require TOTP MFA when `mfa_required` is true
- Enroll with `supabase.auth.mfa.enroll({ factorType: 'totp' })` (web: `/settings/security`)

## Session sharing

Web uses HTTP-only cookies via `@supabase/ssr`. Native uses secure storage. Both refresh against the same Supabase project — logging in on either platform creates/updates the same user row.

## Deep link (Expo)

```json
{
  "expo": {
    "scheme": "cityjam",
    "ios": { "bundleIdentifier": "app.cityjam.mobile" },
    "android": { "package": "app.cityjam.mobile" }
  }
}
```

Handle `cityjam://auth/callback?code=...` in root layout and call `exchangeCodeForSession`.

## Deduplication

Supabase links identities by verified email when possible. If email already exists under another provider, prompt the user to sign in with the original provider and link from **Settings → Connected accounts**.
