"use client";

import { friendlyAuthError } from "@/lib/supabase/auth-errors";

const AUTH_KEY = "city-jam-auth";
const USER_ID_KEY = "city-jam-user-id";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

/** Thrown when sign-up succeeds but email confirmation is required before login. */
export class EmailConfirmationRequiredError extends Error {
  readonly email: string;

  constructor(email: string) {
    super("Check your email to confirm your account, then log in.");
    this.name = "EmailConfirmationRequiredError";
    this.email = email;
  }
}

function isDemoAuthAllowed(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ALLOW_DEMO_AUTH !== "false"
  );
}

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed.id) {
      parsed.id = getOrCreateUserId();
      setAuthUser(parsed);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

function demoLoginWithEmail(email: string): AuthUser {
  const user: AuthUser = {
    id: getOrCreateUserId(),
    email,
    name: email.split("@")[0],
  };
  setAuthUser(user);
  return user;
}

async function supabaseReady(): Promise<boolean> {
  const { supabaseAuthAvailable } = await import("@/lib/supabase/auth");
  return supabaseAuthAvailable();
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  if (await supabaseReady()) {
    const { signInWithEmail, mapSupabaseUser } = await import("@/lib/supabase/auth");
    try {
      const { user } = await signInWithEmail(email, password);
      if (!user) throw new Error("Sign in failed");
      const mapped = mapSupabaseUser(user);
      setAuthUser(mapped);
      return mapped;
    } catch (err) {
      throw new Error(friendlyAuthError(err));
    }
  }
  if (!isDemoAuthAllowed()) {
    throw new Error("Sign-in requires Supabase — configure env vars for production.");
  }
  return demoLoginWithEmail(email);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  if (await supabaseReady()) {
    const { signUpWithEmail, mapSupabaseUser } = await import("@/lib/supabase/auth");
    try {
      const { user, session } = await signUpWithEmail(email, password);
      if (!user) throw new Error("Sign up failed");

      const mapped = mapSupabaseUser(user);
      if (displayName?.trim()) mapped.name = displayName.trim();

      const { ensureUsername, upsertProfile } = await import("@/lib/profiles");
      await ensureUsername(user.id, mapped.name ?? email.split("@")[0]).catch(() => undefined);
      await upsertProfile(user.id, {
        display_name: mapped.name ?? displayName?.trim() ?? email.split("@")[0],
      }).catch(() => undefined);

      if (!session) {
        throw new EmailConfirmationRequiredError(email);
      }

      setAuthUser(mapped);
      return mapped;
    } catch (err) {
      if (err instanceof EmailConfirmationRequiredError) throw err;
      throw new Error(friendlyAuthError(err));
    }
  }
  if (!isDemoAuthAllowed()) {
    throw new Error("Registration requires Supabase — configure env vars for production.");
  }
  const user = demoLoginWithEmail(email);
  if (displayName?.trim()) user.name = displayName.trim();
  setAuthUser(user);
  return user;
}

export async function loginWithOAuth(
  provider: "google" | "facebook" | "apple",
  returnPath?: string
): Promise<null> {
  if (!(await supabaseReady())) {
    if (!isDemoAuthAllowed()) {
      throw new Error(`${provider} sign-in requires Supabase.`);
    }
    const user: AuthUser = {
      id: getOrCreateUserId(),
      email: `demo-${provider}@cityjam.local`,
      name: "Demo Musician",
    };
    setAuthUser(user);
    return null;
  }
  try {
    const auth = await import("@/lib/supabase/auth");
    if (provider === "google") await auth.signInWithGoogle(returnPath);
    else if (provider === "facebook") await auth.signInWithFacebook(returnPath);
    else await auth.signInWithApple(returnPath);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
  return null;
}

export async function loginWithGoogle(returnPath?: string): Promise<AuthUser | null> {
  return loginWithOAuth("google", returnPath);
}

export async function loginWithFacebook(returnPath?: string): Promise<AuthUser | null> {
  return loginWithOAuth("facebook", returnPath);
}

export async function loginWithApple(returnPath?: string): Promise<AuthUser | null> {
  return loginWithOAuth("apple", returnPath);
}

export async function logoutUser(): Promise<void> {
  if (await supabaseReady()) {
    const { signOut } = await import("@/lib/supabase/auth");
    await signOut();
  }
  clearAuthUser();
}

export async function restoreSession(): Promise<AuthUser | null> {
  if (await supabaseReady()) {
    const { getSession, mapSupabaseUser } = await import("@/lib/supabase/auth");
    const session = await getSession();
    if (session?.user) {
      const mapped = mapSupabaseUser(session.user);
      setAuthUser(mapped);
      return mapped;
    }
    clearAuthUser();
    return null;
  }
  if (!isDemoAuthAllowed()) return null;
  return getAuthUser();
}
