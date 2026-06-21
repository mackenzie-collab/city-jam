"use client";

import { useCallback, useEffect, useState } from "react";
import { Music } from "lucide-react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import AudioPostCard from "@/components/AudioPostCard";
import EmptyState from "@/components/EmptyState";
import { fetchSceneFeed, subscribeToAudioPosts, type AudioPost } from "@/lib/scene";

export default function SceneFeed() {
  const [posts, setPosts] = useState<AudioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"carousel" | "grid">("carousel");

  const load = useCallback(async () => {
    setError(null);
    try {
      setPosts(await fetchSceneFeed());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  if (loading) {
    return <p className="text-cj-gold-muted">Loading scene...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Music}
        title="No posts yet"
        description="Be the first to drop a track on the scene."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 hidden justify-end gap-2 lg:flex">
        <button
          type="button"
          onClick={() => setView("carousel")}
          className={view === "carousel" ? "cj-pill cj-pill-active" : "cj-pill"}
        >
          Crate view
        </button>
        <button
          type="button"
          onClick={() => setView("grid")}
          className={view === "grid" ? "cj-pill cj-pill-active" : "cj-pill"}
        >
          Grid
        </button>
      </div>

      {view === "grid" ? (
        <div className="mb-6 hidden gap-6 lg:grid lg:grid-cols-2">
          {posts.map((post) => (
            <AudioPostCard key={post.id} post={post} queue={posts} />
          ))}
        </div>
      ) : null}

      <div className={view === "grid" ? "-mx-4 sm:-mx-6 lg:hidden" : "-mx-4 sm:-mx-6"}>
        <CursorCarousel ariaLabel="Scene feed" gap="lg">
          {posts.map((post) => (
            <VinylSleeveCard key={post.id} post={post} queue={posts} />
          ))}
        </CursorCarousel>
      </div>
    </div>
  );
}
