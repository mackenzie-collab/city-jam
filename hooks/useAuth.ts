"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AuthUser,
  clearAuthUser,
  getAuthUser,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  setAuthUser,
} from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getAuthUser());
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const u = loginWithEmail(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback((email: string, password: string) => {
    const u = registerWithEmail(email, password);
    setUser(u);
    return u;
  }, []);

  const googleLogin = useCallback(() => {
    const u = loginWithGoogle();
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearAuthUser();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
  };
}

export { setAuthUser, getAuthUser };
