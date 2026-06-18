"use client";

const AUTH_KEY = "city-jam-auth";
const USER_ID_KEY = "city-jam-user-id";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
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
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
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

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const { supabaseAuthAvailable, signInWithEmail, mapSupabaseUser } = await import(
    "@/lib/supabase/auth"
  );
  if (supabaseAuthAvailable()) {
    const { user } = await signInWithEmail(email, password);
    if (!user) throw new Error("Sign in failed");
    const mapped = mapSupabaseUser(user);
    setAuthUser(mapped);
    return mapped;
  }
  return demoLoginWithEmail(email);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  const { supabaseAuthAvailable, signUpWithEmail, mapSupabaseUser } = await import(
    "@/lib/supabase/auth"
  );
  if (supabaseAuthAvailable()) {
    const { user } = await signUpWithEmail(email, password);
    if (!user) throw new Error("Sign up failed");
    const mapped = mapSupabaseUser(user);
    if (displayName?.trim()) mapped.name = displayName.trim();
    setAuthUser(mapped);
    const { ensureUsername, upsertProfile } = await import("@/lib/profiles");
    await ensureUsername(user.id, mapped.name ?? email.split("@")[0]).catch(() => undefined);
    await upsertProfile(user.id, {
      display_name: mapped.name ?? displayName?.trim() ?? email.split("@")[0],
    }).catch(() => undefined);
    return mapped;
  }
  const user = demoLoginWithEmail(email);
  if (displayName?.trim()) user.name = displayName.trim();
  setAuthUser(user);
  return user;
}

export async function loginWithGoogle(): Promise<AuthUser | null> {
  const { supabaseAuthAvailable, signInWithGoogle, mapSupabaseUser, getSession } = await import(
    "@/lib/supabase/auth"
  );
  if (supabaseAuthAvailable()) {
    await signInWithGoogle();
    const session = await getSession();
    if (session?.user) {
      const mapped = mapSupabaseUser(session.user);
      setAuthUser(mapped);
      return mapped;
    }
    return null;
  }
  const user: AuthUser = {
    id: getOrCreateUserId(),
    email: "musician@gmail.com",
    name: "Guest Musician",
  };
  setAuthUser(user);
  return user;
}

export async function logoutUser(): Promise<void> {
  const { supabaseAuthAvailable, signOut } = await import("@/lib/supabase/auth");
  if (supabaseAuthAvailable()) {
    await signOut();
  }
  clearAuthUser();
}

export async function restoreSession(): Promise<AuthUser | null> {
  const { supabaseAuthAvailable, getSession, mapSupabaseUser } = await import(
    "@/lib/supabase/auth"
  );
  if (supabaseAuthAvailable()) {
    const session = await getSession();
    if (session?.user) {
      const mapped = mapSupabaseUser(session.user);
      setAuthUser(mapped);
      return mapped;
    }
    clearAuthUser();
    return null;
  }
  return getAuthUser();
}
