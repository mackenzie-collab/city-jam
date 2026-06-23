"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import CarouselSection from "@/components/carousel/CarouselSection";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import {
  fetchSceneFeed,
  mergeSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";
import { cn } from "@/lib/utils";

const GENRE_FILTERS = ["ALL", "ELECTRONIC", "JAZZ", "HIP-HOP", "ROCK", "FOLK", "CLASSICAL", "WORLD"] as const;

function GenreFilters({
  genre,
  onChange,
  theme = "default",
}: {
  genre: string;
  onChange: (g: string) => void;
  theme?: "default" | "affiliate";
}) {
  if (theme === "affiliate") {
    return (
      <div className="affiliate-genre-filters">
        <p className="affiliate-mono">Filter by genre</p>
        <div className="affiliate-genre-filters__track scrollbar-thin">
          {GENRE_FILTERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange(g)}
              className={cn("affiliate-genre-pill", genre === g && "affiliate-genre-pill--active")}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cj-text-muted">
        Filter by genre
      </p>
      <div className="cj-carousel-filters -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
        {GENRE_FILTERS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className={cn(
              "cj-pill shrink-0 text-[10px] sm:text-xs",
              genre === g && "cj-pill-active"
            )}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ScenePreviewCarouselProps {
  theme?: "default" | "affiliate";
}

export default function ScenePreviewCarousel({ theme = "default" }: ScenePreviewCarouselProps) {
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
      <CarouselSection
        id="on-the-scene"
        badge="On the scene"
        title={
          theme === "affiliate"
            ? "Close your eyes. Listen."
            : (
              <>
                Close your eyes. <span className="text-brand-gold">Listen.</span>
              </>
            )
        }
        description="Fresh drops from musicians worldwide. Every card is audio-first — drag to browse the crate."
        link={{ href: "/scene", label: "Full scene feed" }}
        filters={<GenreFilters genre={genre} onChange={setGenre} theme={theme} />}
        variant="deep"
        theme={theme}
      >
        <CursorCarousel ariaLabel="Scene audio feed" showControls loop contentKey={genre}>
          {displayPosts.map((post) => (
            <VinylSleeveCard key={post.id} post={post} queue={displayPosts} />
          ))}
        </CursorCarousel>
      </CarouselSection>

      {trendingPosts.length >= 3 && (
        <CarouselSection
          id="trending-this-week"
          badge="Trending this week"
          title={
            theme === "affiliate"
              ? "Most played. Right now."
              : (
                <>
                  Most played. <span className="text-brand-gold">Right now.</span>
                </>
              )
          }
          description="Tracks gaining momentum across the scene."
          variant="surface"
          theme={theme}
        >
          <CursorCarousel ariaLabel="Trending tracks" showControls compact loop>
            {trendingPosts.map((post) => (
              <VinylSleeveCard key={`trend-${post.id}`} post={post} queue={trendingPosts} compact />
            ))}
          </CursorCarousel>
        </CarouselSection>
      )}
    </>
  );
}
