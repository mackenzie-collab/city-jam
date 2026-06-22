"use client";

import { useCallback, useEffect, useState } from "react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import AudioPostCard from "@/components/AudioPostCard";
import { cn } from "@/lib/utils";
import {
  fetchSceneFeed,
  mergeSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";

export default function SceneFeed() {
  const [posts, setPosts] = useState<AudioPost[]>(() => mergeSceneFeed([], 12));
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"carousel" | "grid">("carousel");

  const load = useCallback(async () => {
    try {
      const feed = await fetchSceneFeed({ minCount: 12 });
      setPosts(feed);
    } catch {
      setPosts(mergeSceneFeed([], 12));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  const displayPosts = posts.length > 0 ? posts : mergeSceneFeed([], 12);

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
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-brand-gold/40">
          Syncing live feed…
        </p>
      )}

      <div className={cn(view === "grid" ? "lg:hidden" : undefined, "cj-carousel-band relative -mx-4 bg-cj-purple-card/40 py-4 sm:-mx-6")}>
        <CursorCarousel ariaLabel="Scene feed" fullBleed showControls loop>
          {displayPosts.map((post) => (
            <VinylSleeveCard key={post.id} post={post} queue={displayPosts} />
          ))}
        </CursorCarousel>
      </div>
    </div>
  );
}
