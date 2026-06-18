"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Headphones, MessageSquare, Clock, Users, Pause, Play } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import VinylPlayer from "@/components/VinylPlayer";
import { Button } from "@/components/ui/button";
import ReportButton from "@/components/ReportButton";
import { useAuth } from "@/hooks/useAuth";
import { displayName, fetchProfile } from "@/lib/profiles";
import { getSupabase } from "@/lib/supabase/client";
import {
  addRoomReaction,
  fetchListeningRoom,
  fetchRoomReactions,
  type ListeningRoom,
  type RoomReaction,
  studioUnavailable,
} from "@/lib/studio";

interface SyncPayload {
  action: "play" | "pause" | "seek";
  position: number;
  hostId: string;
  ts: number;
}

function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ListeningRoomDetail({ roomId }: { roomId: string }) {
  const { user, isAuthenticated } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const channelRef = useRef<ReturnType<NonNullable<ReturnType<typeof getSupabase>>["channel"]> | null>(null);

  const [room, setRoom] = useState<ListeningRoom | null>(null);
  const [reactions, setReactions] = useState<RoomReaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [name, setName] = useState("Musician");
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const isHost = !!user?.id && (room?.host_user_id === user.id || room?.creator_id === user.id);

  const broadcast = useCallback(
    (payload: Omit<SyncPayload, "hostId" | "ts">) => {
      if (!user?.id || !channelRef.current) return;
      channelRef.current.send({
        type: "broadcast",
        event: "sync",
        payload: { ...payload, hostId: user.id, ts: Date.now() } satisfies SyncPayload,
      });
    },
    [user?.id]
  );

  const loadReactions = useCallback(async () => {
    if (studioUnavailable()) return;
    setReactions(await fetchRoomReactions(roomId));
  }, [roomId]);

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    const r = await fetchListeningRoom(roomId);
    setRoom(r);
    await loadReactions();
    setLoading(false);
    if (r) setJoined(true);
  }, [roomId, loadReactions]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (studioUnavailable() || !joined) return;
    const interval = setInterval(loadReactions, 5000);
    return () => clearInterval(interval);
  }, [joined, loadReactions]);

  useEffect(() => {
    if (!user?.id) return;
    fetchProfile(user.id).then((p) => setName(displayName(p, user.name ?? user.email)));
  }, [user?.id, user?.name, user?.email]);

  useEffect(() => {
    if (!room?.audio_url) return;
    const audio = new Audio(room.audio_url);
    audioRef.current = audio;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audioRef.current = null;
    };
  }, [room?.audio_url]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !roomId) return;

    const channel = supabase.channel(`room-sync:${roomId}`, {
      config: { broadcast: { self: false } },
    });

    channel.on("broadcast", { event: "sync" }, ({ payload }) => {
      const data = payload as SyncPayload;
      if (isHost) return;
      const audio = audioRef.current;
      if (!audio) return;

      if (data.action === "play") {
        if (Math.abs(audio.currentTime - data.position) > 1) {
          audio.currentTime = data.position;
        }
        audio.play().catch(() => undefined);
        setIsPlaying(true);
      } else if (data.action === "pause") {
        audio.pause();
        setIsPlaying(false);
      } else if (data.action === "seek") {
        audio.currentTime = data.position;
        setProgress(data.position);
      }
    });

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [roomId, isHost]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (isHost) broadcast({ action: "pause", position: audio.currentTime });
    } else {
      audio.play().catch(() => undefined);
      setIsPlaying(true);
      if (isHost) broadcast({ action: "play", position: audio.currentTime });
    }
  };

  const handleSeek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
    if (isHost) broadcast({ action: "seek", position: seconds });
  };

  const handleReact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !body.trim()) return;
    setPosting(true);
    setError(null);
    try {
      const reaction = await addRoomReaction(roomId, user.id, name, timestamp, body.trim());
      setReactions((prev) => [...prev, reaction].sort((a, b) => a.timestamp_sec - b.timestamp_sec));
      import("@/lib/streaks").then(({ trackWeeklyActivity }) =>
        trackWeeklyActivity(user.id, "listening_room")
      );
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reaction");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <FeatureShell variant="hall" title="Room" icon={Headphones} heading="Loading...">
        <p className="text-cj-gold-muted">Loading room...</p>
      </FeatureShell>
    );
  }

  if (!room) {
    return (
      <FeatureShell variant="hall" title="Room" icon={Headphones} heading="Not Found">
        <Link href="/listening-rooms" className="text-cj-gold underline">
          Back to rooms
        </Link>
      </FeatureShell>
    );
  }

  return (
    <FeatureShell
      variant="hall"
      title={room.title}
      icon={Headphones}
      badge="Listening Room"
      heading={room.title}
      subtitle={[room.artist, room.album].filter(Boolean).join(" · ") || "Shared listening session"}
      headerRight={
        joined ? (
          <span className="cj-status-open">{isHost ? "Hosting" : "Live"}</span>
        ) : undefined
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="cj-card space-y-4 py-8">
            {room.audio_url ? (
              <>
                <VinylPlayer
                  title={room.title}
                  artist={room.artist || room.album || "Shared Track"}
                  isPlaying={isPlaying}
                  progress={progress}
                  duration={duration}
                  onToggle={handlePlayPause}
                  onPrev={() => handleSeek(0)}
                  onNext={() => handleSeek(duration)}
                  onSeek={isHost ? handleSeek : undefined}
                />
                {isHost ? (
                  <p className="text-center text-xs text-cj-gold-muted">
                    You are the host — play/pause/seek syncs to all listeners.
                  </p>
                ) : (
                  <p className="text-center text-xs text-cj-gold-muted">
                    Synced to host playback. Drop reactions at the moments that hit.
                  </p>
                )}
              </>
            ) : (
              <>
                <Headphones className="mx-auto h-16 w-16 text-cj-gold-muted" />
                <p className="text-center text-sm text-cj-gold-muted">
                  No audio URL set for this room yet.
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/listening-rooms"
                className="cj-btn-secondary inline-block px-4 py-2 text-xs no-underline"
              >
                All Rooms
              </Link>
              <Link
                href="/scene"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold"
              >
                <Users className="h-3 w-3" /> Scene
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg uppercase text-cj-gold">
              <MessageSquare className="h-5 w-5" /> Reactions
              <span className="text-xs font-normal text-cj-gold-muted">({reactions.length})</span>
            </h2>
            {reactions.length === 0 ? (
              <p className="text-sm text-cj-gold-muted">No reactions yet — be the first.</p>
            ) : (
              <ul className="space-y-3">
                {reactions.map((r) => (
                  <li key={r.id} className="cj-card py-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(r.timestamp_sec)}
                      <span>·</span>
                      {r.user_id ? (
                        <Link
                          href={`/profile?user=${r.user_id}`}
                          className="text-cj-gold hover:underline"
                        >
                          {r.display_name || "Musician"}
                        </Link>
                      ) : (
                        <span>{r.display_name || "Musician"}</span>
                      )}
                      <ReportButton contentType="room_reaction" contentId={r.id} className="ml-auto" />
                    </div>
                    <p className="mt-2 text-sm text-cj-gold">{r.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="cj-card h-fit space-y-4">
          {isHost && room.audio_url && (
            <div className="space-y-2 border-b border-cj-gold-border pb-4">
              <p className="text-xs uppercase tracking-widest text-cj-gold-muted">Host controls</p>
              <Button variant="primary" className="w-full" onClick={handlePlayPause}>
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause for all
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Play for all
                  </>
                )}
              </Button>
            </div>
          )}

          <p className="text-xs uppercase tracking-widest text-cj-gold-muted">Drop a reaction</p>
          {isAuthenticated ? (
            <form onSubmit={handleReact} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-cj-gold-muted">
                  Timestamp (seconds)
                </label>
                <input
                  type="number"
                  min={0}
                  value={Math.floor(progress) || timestamp}
                  onChange={(e) => setTimestamp(Number(e.target.value))}
                  className="cj-input !pl-4 mt-1"
                />
              </div>
              <textarea
                required
                placeholder="What hit at that moment?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="cj-input !pl-4 min-h-[100px]"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" variant="primary" className="w-full" disabled={posting}>
                {posting ? "Posting..." : "Post Reaction"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-cj-gold-muted">
              <Link
                href={`/login?returnUrl=/listening-rooms/${roomId}`}
                className="text-cj-gold underline"
              >
                Sign in
              </Link>{" "}
              to drop reactions.
            </p>
          )}
        </aside>
      </div>
    </FeatureShell>
  );
}
