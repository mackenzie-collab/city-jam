"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cj-gold-border bg-cj-purple-card/80 text-cj-gold transition-opacity hover:opacity-80"
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        <Sun className={compact ? "h-4 w-4" : "h-4 w-4"} />
      ) : (
        <Moon className={compact ? "h-4 w-4" : "h-4 w-4"} />
      )}
    </button>
  );
}
