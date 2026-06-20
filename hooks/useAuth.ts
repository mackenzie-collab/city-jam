"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AuthUser,
  getAuthUser,
  loginWithEmail,
  loginWithOAuth,
  logoutUser,
  registerWithEmail,
  restoreSession,
  setAuthUser,
} from "@/lib/auth";
import { deleteUserAccount } from "@/lib/account-deletion";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    restoreSession().then((u) => {
      if (mounted) {
        setUser(u ?? getAuthUser());
        setLoading(false);
      }
    });

    import("@/lib/supabase/auth").then(({ supabaseAuthAvailable, onAuthStateChange, mapSupabaseUser }) => {
      if (!supabaseAuthAvailable() || !mounted) return;
      const { data } = onAuthStateChange((_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          setAuthUser(mapped);
          setUser(mapped);
          import("@/lib/profiles").then(({ syncAuthProfile }) =>
            syncAuthProfile(session.user!.id, mapped.name).catch(() => undefined)
          );
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const u = await loginWithEmail(email, password);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    setError(null);
    try {
      const u = await registerWithEmail(email, password, displayName);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      throw err;
    }
  }, []);

  const oauthLogin = useCallback(
    async (provider: "google" | "facebook" | "apple", returnPath?: string) => {
      setError(null);
      try {
        await loginWithOAuth(provider, returnPath);
        return null;
      } catch (err) {
        const msg = err instanceof Error ? err.message : `${provider} sign-in failed`;
        setError(msg);
        throw err;
      }
    },
    []
  );

  const googleLogin = useCallback(
    (returnPath?: string) => oauthLogin("google", returnPath),
    [oauthLogin]
  );

  const facebookLogin = useCallback(
    (returnPath?: string) => oauthLogin("facebook", returnPath),
    [oauthLogin]
  );

  const appleLogin = useCallback(
    (returnPath?: string) => oauthLogin("apple", returnPath),
    [oauthLogin]
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!user?.id) return null;
    const result = await deleteUserAccount(user.id);
    await logoutUser();
    setUser(null);
    return result;
  }, [user?.id]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    facebookLogin,
    appleLogin,
    oauthLogin,
    logout,
    deleteAccount,
  };
}

export { setAuthUser, getAuthUser };
