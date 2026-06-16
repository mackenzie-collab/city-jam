"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Headphones, MessageSquare, Clock } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { displayName, fetchProfile } from "@/lib/profiles";
import {
  addRoomReaction,
  fetchListeningRoom,
  fetchRoomReactions,
  type ListeningRoom,
  type RoomReaction,
  studioUnavailable,
} from "@/lib/studio";

function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ListeningRoomDetail({ roomId }: { roomId: string }) {
  const { user, isAuthenticated } = useAuth();
  const [room, setRoom] = useState<ListeningRoom | null>(null);
  const [reactions, setReactions] = useState<RoomReaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [name, setName] = useState("Musician");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    const r = await fetchListeningRoom(roomId);
    setRoom(r);
    setReactions(await fetchRoomReactions(roomId));
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user?.id) return;
    fetchProfile(user.id).then((p) => setName(displayName(p, user.name ?? user.email)));
    import("@/lib/streaks").then(({ trackWeeklyActivity }) =>
      trackWeeklyActivity(user.id, "listening_room")
    );
  }, [user?.id]);

  const handleReact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !body.trim()) return;
    try {
      await addRoomReaction(roomId, user.id, name, timestamp, body.trim());
      import("@/lib/streaks").then(({ trackWeeklyActivity }) =>
        trackWeeklyActivity(user.id, "listening_room")
      );
      setBody("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reaction");
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
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="cj-card flex min-h-[200px] flex-col items-center justify-center gap-4 py-12">
            <Headphones className="h-16 w-16 text-cj-gold-muted" />
            <p className="text-center text-sm text-cj-gold-muted">
              Drop reactions at the moment that hits. Paste a Spotify/YouTube link in chat below
              or listen together on your own player.
            </p>
            <div className="flex gap-2">
              <Link href="/listening-rooms">
                <Button variant="secondary" size="sm">
                  All Rooms
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg uppercase text-cj-gold">
              <MessageSquare className="h-5 w-5" /> Reactions
            </h2>
            {reactions.length === 0 ? (
              <p className="text-sm text-cj-gold-muted">No reactions yet — be the first.</p>
            ) : (
              <ul className="space-y-3">
                {reactions.map((r) => (
                  <li key={r.id} className="cj-card py-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(r.timestamp_sec)}
                      <span>·</span>
                      <span>{r.display_name || "Musician"}</span>
                    </div>
                    <p className="mt-2 text-sm text-cj-gold">{r.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="cj-card h-fit space-y-4">
          <p className="text-xs uppercase tracking-widest text-cj-gold-muted">Drop a reaction</p>
          {isAuthenticated ? (
            <form onSubmit={handleReact} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-cj-gold-muted">Timestamp (seconds)</label>
                <input
                  type="number"
                  min={0}
                  value={timestamp}
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
              <Button type="submit" variant="primary" className="w-full">
                Post Reaction
              </Button>
            </form>
          ) : (
            <p className="text-sm text-cj-gold-muted">
              <Link href={`/login?returnUrl=/listening-rooms/${roomId}`} className="text-cj-gold underline">
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
