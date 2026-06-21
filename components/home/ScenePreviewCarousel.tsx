"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import GrainOverlay from "@/components/GrainOverlay";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import {
  DEMO_POSTS,
  fetchSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";

export default function ScenePreviewCarousel() {
  const [posts, setPosts] = useState<AudioPost[]>(DEMO_POSTS);

  const load = useCallback(async () => {
    try {
      const feed = await fetchSceneFeed({ limit: 16 });
      setPosts(feed.length > 0 ? feed : DEMO_POSTS);
    } catch {
      setPosts(DEMO_POSTS);
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
      </div>

      <div className="relative mt-5">
        <CursorCarousel ariaLabel="Scene audio feed" fullBleed showControls>
          {displayPosts.map((post) => (
            <VinylSleeveCard key={post.id} post={post} queue={displayPosts} />
          ))}
        </CursorCarousel>
      </div>
    </section>
  );
}
