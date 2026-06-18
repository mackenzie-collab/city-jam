"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Headphones, Plus, Search } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createListeningRoom,
  fetchListeningRooms,
  type ListeningRoom,
  studioUnavailable,
} from "@/lib/studio";

export default function ListeningRooms() {
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<ListeningRoom[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", album: "" });

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    setRooms(await fetchListeningRooms(query || undefined));
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setCreating(true);
    try {
      await createListeningRoom(user.id, form);
      setShowForm(false);
      setForm({ title: "", artist: "", album: "" });
      await load();
    } finally {
      setCreating(false);
    }
  };

  return (
    <FeatureShell
      variant="hall"
      title="Listening Rooms"
      icon={Headphones}
      badge="Studio"
      heading="Listening Rooms"
      subtitle="Shared listening sessions with timestamped reactions. Drop a comment at the exact moment that hits."
      headerRight={
        isAuthenticated ? (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        ) : undefined
      }
      maxWidth="xl"
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted" />
        <input
          type="search"
          placeholder="Search rooms, artists, albums…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="cj-input w-full"
        />
      </div>

      {showForm && isAuthenticated && (
        <form onSubmit={handleCreate} className="cj-card mt-6 space-y-4">
          <input
            required
            placeholder="Room title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="cj-input !pl-4"
          />
          <input
            placeholder="Artist"
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            className="cj-input !pl-4"
          />
          <input
            placeholder="Album"
            value={form.album}
            onChange={(e) => setForm({ ...form, album: e.target.value })}
            className="cj-input !pl-4"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={creating}>
              {creating ? "Creating…" : "Create Room"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-center text-cj-gold-muted">Loading...</p>
        ) : rooms.length === 0 ? (
          <EmptyState
            icon={Headphones}
            title="No Rooms Yet"
            description="Create a room and listen together."
            actionLabel={isAuthenticated ? "Create a Room" : undefined}
            onAction={isAuthenticated ? () => setShowForm(true) : undefined}
            dark
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="cj-card flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark">
                  <Headphones className="h-6 w-6 text-cj-gold-muted" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display uppercase text-cj-gold">{room.title}</h3>
                  <p className="text-xs text-cj-gold-muted">
                    {room.artist}
                    {room.album ? ` · ${room.album}` : ""}
                  </p>
                  <Link href={`/listening-rooms/${room.id}`} className="mt-3 inline-block no-underline">
                    <Button variant="secondary" size="sm" type="button">
                      Join Room
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>
    </FeatureShell>
  );
}
