/** Map Supabase / GoTrue errors to user-facing copy. */
export function friendlyAuthError(err: unknown): string {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "Something went wrong. Please try again.";

  const lower = msg.toLowerCase();

  if (lower.includes("provider is not enabled") || lower.includes("unsupported provider")) {
    return "Social sign-in is not set up yet. Use email and password below, or ask the project owner to enable Google in Supabase (see docs/AUTH_SETUP.md).";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirm your email first — check your inbox for a link from City Jam, then log in.";
  }
  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Wrong email or password. Try again or use Forgot password.";
  }
  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Log in instead.";
  }
  if (lower.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }
  if (lower.includes("signup is disabled")) {
    return "New sign-ups are disabled. Contact support.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (lower.includes("auth_callback") || lower.includes("code exchange")) {
    return "Sign-in link expired or was already used. Try logging in again.";
  }

  return msg;
}
