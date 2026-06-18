"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  postId?: string;
  coverUrl?: string;
}

interface AudioPlayerContextValue {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
}

const STORAGE_KEY = "city-jam-player-queue";

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

function loadQueue(): Track[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Track[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: Track[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const currentTrack = queue[currentIndex] ?? null;

  useEffect(() => {
    const saved = loadQueue();
    if (saved.length > 0) {
      setQueue(saved);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveQueue(queue);
  }, [queue, hydrated]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setCurrentIndex((i) => {
        const next = i + 1;
        if (next < queue.length) return next;
        setIsPlaying(false);
        return i;
      });
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [queue.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  const play = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueue(newQueue);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      setQueue((prev) => {
        const idx = prev.findIndex((t) => t.id === track.id);
        if (idx >= 0) {
          setCurrentIndex(idx);
          return prev;
        }
        setCurrentIndex(prev.length);
        return [...prev, track];
      });
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying((p) => !p);
  }, [currentTrack]);

  const next = useCallback(() => {
    setCurrentIndex((i) => {
      if (i + 1 < queue.length) {
        setIsPlaying(true);
        return i + 1;
      }
      return i;
    });
  }, [queue.length]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }
    setCurrentIndex((i) => {
      if (i > 0) {
        setIsPlaying(true);
        return i - 1;
      }
      return i;
    });
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        progress,
        duration,
        play,
        pause,
        toggle,
        next,
        prev,
        seek,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}
