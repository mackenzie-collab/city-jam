"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import GrainOverlay from "@/components/GrainOverlay";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import {
  fetchSceneFeed,
  mergeSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";
import { cn } from "@/lib/utils";

const GENRE_FILTERS = ["ALL", "ELECTRONIC", "JAZZ", "HIP-HOP", "ROCK", "FOLK", "CLASSICAL", "WORLD"] as const;

export default function ScenePreviewCarousel() {
  const [posts, setPosts] = useState<AudioPost[]>(() => mergeSceneFeed([], 16));
  const [genre, setGenre] = useState<string>("ALL");

  const load = useCallback(async () => {
    try {
      const feed = await fetchSceneFeed({ limit: 16, minCount: 16 });
      setPosts(feed);
    } catch {
      setPosts(mergeSceneFeed([], 16));
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  const displayPosts = useMemo(() => {
    const base = posts.length > 0 ? posts : mergeSceneFeed([], 16);
    if (genre === "ALL") return base;
    const filtered = base.filter((p) => p.genre === genre);
    return filtered.length > 0 ? filtered : base;
  }, [posts, genre]);

  const trendingPosts = useMemo(() => {
    return [...displayPosts]
      .sort((a, b) => b.play_count + b.like_count - (a.play_count + a.like_count))
      .slice(0, 6);
  }, [displayPosts]);

  return (
    <>
      <section
        id="on-the-scene"
        className="relative overflow-x-visible border-y border-brand-gold/15 bg-brand-purple-deep py-8 sm:py-10"
      >
        <GrainOverlay className="opacity-[0.035]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <span className="cj-badge mb-2">On the scene</span>
          <h2 className="cj-headline text-3xl sm:text-4xl md:text-5xl">
            Close your eyes.{" "}
            <span className="text-brand-gold">Listen.</span>
          </h2>
          <p className="mt-2 max-w-xl font-body text-sm text-cj-text-muted sm:text-base">
            Fresh drops from musicians worldwide. Every card is audio-first.
          </p>
          <Link href="/scene" className="cj-link-groove mt-3 inline-flex items-center gap-2 text-sm">
            Full scene feed <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-5 flex flex-wrap gap-2">
            {GENRE_FILTERS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={cn(
                  "cj-pill text-[10px] sm:text-xs",
                  genre === g && "cj-pill-active"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="cj-carousel-band relative mt-5">
          <CursorCarousel ariaLabel="Scene audio feed" fullBleed showControls loop>
            {displayPosts.map((post) => (
              <VinylSleeveCard key={post.id} post={post} queue={displayPosts} />
            ))}
          </CursorCarousel>
        </div>
      </section>

      {trendingPosts.length >= 3 && (
        <section
          id="trending-this-week"
          className="relative overflow-x-visible border-b border-brand-gold/10 bg-cj-surface py-8 sm:py-10"
        >
          <GrainOverlay className="opacity-[0.03]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
            <span className="cj-badge mb-2">Trending this week</span>
            <h2 className="cj-headline text-2xl sm:text-3xl">
              Most played.{" "}
              <span className="text-brand-gold">Right now.</span>
            </h2>
          </div>
          <div className="cj-carousel-band relative mt-5">
            <CursorCarousel ariaLabel="Trending tracks" fullBleed showControls compact loop>
              {trendingPosts.map((post) => (
                <VinylSleeveCard key={`trend-${post.id}`} post={post} queue={trendingPosts} compact />
              ))}
            </CursorCarousel>
          </div>
        </section>
      )}
    </>
  );
}
