"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Copy } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import AuthBanner from "@/components/AuthBanner";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createCircle,
  fetchCircleMemberCount,
  fetchMyCircles,
  joinCircle,
  type Circle,
  studioUnavailable,
} from "@/lib/studio";

export default function CirclesList() {
  const { user, isAuthenticated } = useAuth();
  const [circles, setCircles] = useState<(Circle & { members: number })[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchMyCircles(user.id);
      const withCounts = await Promise.all(
        data.map(async (c) => ({
          ...c,
          members: await fetchCircleMemberCount(c.id),
        }))
      );
      setCircles(withCounts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await createCircle(user.id, { name, description: desc });
      setShowCreate(false);
      setName("");
      setDesc("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleJoin = async () => {
    if (!user?.id) return;
    if (!joinCode.trim()) {
      setJoinError("Enter an invite code to join a circle.");
      return;
    }
    setJoinError(null);
    try {
      await joinCircle(user.id, joinCode.trim());
      setJoinCode("");
      load();
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Invalid code");
    }
  };

  return (
    <FeatureShell
      title="Private Circles"
      icon={Users}
      badge="Studio"
      heading={
        <>
          Small Groups. / <span className="text-cj-gold-bright">Shared Focus.</span>
        </>
      }
      subtitle="Invite-only groups built around a sound, a city, or a shared goal."
      maxWidth="xl"
      footer={
        !isAuthenticated ? (
          <AuthBanner message="Sign in to create or join circles." returnUrl="/circles" />
        ) : undefined
      }
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div>
      {isAuthenticated && (
        <div className="mb-8 flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus className="mr-1 h-4 w-4" /> Create Circle
          </Button>
          <div className="flex gap-2">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Invite code"
              className="cj-input !w-36 !py-2 !pl-4"
            />
            <Button variant="secondary" onClick={handleJoin}>
              Join
            </Button>
          </div>
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="cj-card mb-8 space-y-4">
          <input
            required
            placeholder="Circle name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cj-input !pl-4"
          />
          <textarea
            placeholder="What's the focus?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="cj-input !pl-4 min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Create
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {error && <p className="mb-4 text-sm text-cj-gold-bright/90">{error}</p>}
      {joinError && <p className="mb-4 text-sm text-amber-400">{joinError}</p>}

      {loading ? (
        <p className="text-center text-cj-gold-muted">Loading...</p>
      ) : circles.length === 0 ? (
        <EmptyState icon={Users} title="No Circles Yet" description="Create one or join with an invite code." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {circles.map((c) => (
            <Link
              key={c.id}
              href={`/circles/${c.id}`}
              className="cj-card block no-underline transition-colors hover:border-cj-gold/50"
            >
              <h3 className="font-display text-xl uppercase text-cj-gold">{c.name}</h3>
              <p className="mt-2 text-sm text-cj-gold-muted">{c.description || "No description"}</p>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-cj-gold-muted">
                <span>{c.members} members</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-cj-gold hover:opacity-80"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(c.invite_code);
                  }}
                >
                  <Copy className="h-3 w-3" /> {c.invite_code}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
        </div>
      </div>
    </FeatureShell>
  );
}
