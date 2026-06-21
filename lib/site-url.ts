function normalizeOrigin(raw: string): string {
  return raw.replace(/\/$/, "");
}

/** Canonical app origin from env (no trailing slash). */
export function getSiteUrlFromEnv(): string | undefined {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return normalizeOrigin(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return normalizeOrigin(`https://${vercel}`);

  return undefined;
}

/**
 * Origin for client-side auth redirects. Prefers NEXT_PUBLIC_SITE_URL so
 * confirmation emails point at production even when Site URL in Supabase is wrong.
 */
export function getAppOrigin(): string {
  const fromEnv = getSiteUrlFromEnv();
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function authCallbackUrl(returnPath = "/profile"): string {
  return `${getAppOrigin()}/auth/callback?next=${encodeURIComponent(returnPath)}`;
}

/** Server-side redirect origin: env first, then request host. */
export function getRedirectOrigin(request: Request): string {
  return getSiteUrlFromEnv() ?? new URL(request.url).origin;
}
