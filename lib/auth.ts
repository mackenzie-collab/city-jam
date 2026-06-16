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

export function loginWithEmail(email: string, _password: string): AuthUser {
  const user: AuthUser = {
    id: getOrCreateUserId(),
    email,
    name: email.split("@")[0],
  };
  setAuthUser(user);
  return user;
}

export function registerWithEmail(email: string, _password: string): AuthUser {
  return loginWithEmail(email, _password);
}

export function loginWithGoogle(): AuthUser {
  const user: AuthUser = {
    id: getOrCreateUserId(),
    email: "musician@gmail.com",
    name: "Guest Musician",
  };
  setAuthUser(user);
  return user;
}
