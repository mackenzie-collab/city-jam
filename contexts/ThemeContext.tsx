"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "cj-theme";

const LIGHT_ROUTES = ["/discover", "/privacy", "/terms", "/contact"];
const DARK_ROUTES = [
  "/scene",
  "/jam",
  "/blind-echo",
  "/echo-roulette",
  "/studio",
  "/collab",
  "/vault",
  "/circles",
  "/listening-rooms",
  "/community",
  "/signal-map",
];

function routeDefaultTheme(pathname: string): ThemeMode {
  if (LIGHT_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
    return "light";
  }
  if (pathname.startsWith("/profile/") && pathname !== "/profile") {
    return "light";
  }
  if (DARK_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
    return "dark";
  }
  return "dark";
}

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [override, setOverride] = useState<ThemeMode | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "dark" || stored === "light") setOverride(stored);
  }, []);

  const theme = override ?? routeDefaultTheme(pathname);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setOverride(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
