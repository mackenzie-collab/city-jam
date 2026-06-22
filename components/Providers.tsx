"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AudioPlayerProvider>{children}</AudioPlayerProvider>
    </ThemeProvider>
  );
}
