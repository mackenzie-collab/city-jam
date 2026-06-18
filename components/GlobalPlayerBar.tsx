"use client";

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import VinylPlayer from "@/components/VinylPlayer";

export default function GlobalPlayerBar() {
  const { currentTrack, isPlaying, progress, duration, toggle, next, prev, seek } =
    useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 border-t border-cj-gold-border bg-cj-purple-dark/95 px-4 py-2 backdrop-blur-md md:bottom-0 md:left-4 md:right-4 md:mb-4 md:max-w-xl md:rounded-xl md:border md:shadow-xl lg:left-auto lg:translate-x-0">
      <VinylPlayer
        compact
        title={currentTrack.title}
        artist={currentTrack.artist}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        onToggle={toggle}
        onPrev={prev}
        onNext={next}
        onSeek={seek}
      />
    </div>
  );
}
