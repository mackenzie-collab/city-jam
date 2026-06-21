"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import { fetchSceneFeed, subscribeToAudioPosts, type AudioPost } from "@/lib/scene";

export default function ScenePreviewCarousel() {
  const [posts, setPosts] = useState<AudioPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setPosts(await fetchSceneFeed({ limit: 12 }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  return (
    <section className="cj-section overflow-hidden bg-cj-surface py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <span className="cj-badge mb-3">On the scene</span>
        <h2 className="cj-headline text-3xl sm:text-4xl">
          Close your eyes.{" "}
          <span className="text-brand-gold">Listen.</span>
        </h2>
        <p className="mt-3 max-w-xl font-body text-sm text-cj-text-muted">
          Drag through fresh drops from musicians worldwide. Every card is audio-first — no photos, no vanity.
        </p>
        <Link href="/scene" className="cj-link-groove mt-4 inline-flex items-center gap-2 text-sm">
          Full scene feed <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="px-4 text-center font-mono text-sm text-cj-text-muted sm:px-6">Loading tracks…</p>
        ) : posts.length === 0 ? (
          <p className="px-4 text-center font-mono text-sm text-cj-text-muted sm:px-6">
            The scene is warming up.{" "}
            <Link href="/scene" className="text-brand-gold hover:underline">
              Drop the first track →
            </Link>
          </p>
        ) : (
          <CursorCarousel ariaLabel="Scene audio feed" gap="lg">
            {posts.map((post) => (
              <VinylSleeveCard key={post.id} post={post} queue={posts} />
            ))}
          </CursorCarousel>
        )}
      </div>
    </section>
  );
}
