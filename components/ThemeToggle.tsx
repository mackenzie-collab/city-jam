"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn("cj-turntable-toggle group", compact && "h-8 w-8")}
    >
      <span
        className={cn(
          "absolute inset-1 rounded-full border border-cj-gold/30 transition-transform duration-500",
          !isDark && "rotate-180"
        )}
        aria-hidden
      />
      <span
        className={cn(
          "relative z-10 block h-1.5 w-1.5 rounded-full bg-cj-gold transition-all",
          isDark ? "translate-x-1 -translate-y-1" : "-translate-x-1 translate-y-1"
        )}
        aria-hidden
      />
      <span className="sr-only">{isDark ? "Dark mode active" : "Light mode active"}</span>
    </button>
  );
}
