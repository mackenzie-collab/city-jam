"use client";

import { useCallback, useEffect, useState } from "react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import AudioPostCard from "@/components/AudioPostCard";
import { cn } from "@/lib/utils";
import {
  DEMO_POSTS,
  fetchSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";

export default function SceneFeed() {
  const [posts, setPosts] = useState<AudioPost[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"carousel" | "grid">("carousel");

  const load = useCallback(async () => {
    try {
      const feed = await fetchSceneFeed();
      setPosts(feed.length > 0 ? feed : DEMO_POSTS);
    } catch {
      setPosts(DEMO_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  const displayPosts = posts.length > 0 ? posts : DEMO_POSTS;

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
          {displayPosts.map((post) => (
            <AudioPostCard key={post.id} post={post} queue={displayPosts} />
          ))}
        </div>
      ) : null}

      {loading && (
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-gold/50">
          Syncing live feed…
        </p>
      )}

      <div className={cn(view === "grid" ? "lg:hidden" : undefined, "-mx-4 sm:-mx-6")}>
        <CursorCarousel
          ariaLabel="Scene feed"
          gap="sm"
          fullBleed
          showControls
        >
          {displayPosts.map((post) => (
            <VinylSleeveCard key={post.id} post={post} queue={displayPosts} />
          ))}
        </CursorCarousel>
      </div>
    </div>
  );
}
