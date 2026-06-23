"use client";

import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AudioPlayerProvider>{children}</AudioPlayerProvider>;
}
