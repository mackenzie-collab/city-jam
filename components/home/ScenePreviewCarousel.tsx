"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import {
  DEMO_POSTS,
  fetchSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";

export default function ScenePreviewCarousel() {
  const [posts, setPosts] = useState<AudioPost[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const feed = await fetchSceneFeed({ limit: 16 });
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

  const displayPosts = useMemo(
    () => (posts.length > 0 ? posts : DEMO_POSTS),
    [posts]
  );

  return (
    <section
      id="on-the-scene"
      className="relative overflow-hidden border-y border-brand-gold/15 bg-brand-purple-deep py-8 sm:py-10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
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
      </div>

      <div className="relative mt-5">
        {loading && (
          <p className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-brand-gold/50 sm:px-6">
            Syncing live feed…
          </p>
        )}
        <CursorCarousel
          ariaLabel="Scene audio feed"
          gap="sm"
          fullBleed
          showControls
        >
          {displayPosts.map((post) => (
            <VinylSleeveCard key={post.id} post={post} queue={displayPosts} />
          ))}
        </CursorCarousel>
      </div>
    </section>
  );
}
