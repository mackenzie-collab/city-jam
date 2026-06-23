"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import VinylCard from "@/components/analog/VinylCard";
import StreakIcon from "@/components/StreakIcon";
import { fetchCommunityFeed, type FeedItem } from "@/lib/community";
import { STOCK } from "@/lib/brand-assets";

export default function CommunityPreview() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetchCommunityFeed(4).then(setItems);
  }, []);

  return (
    <section className="cj-section bg-cj-bg">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-4 sm:mb-6">The community</span>
        <h2 className="cj-headline text-3xl sm:text-4xl md:text-5xl">
          Not solo.{" "}
          <span className="text-label-amber">A scene.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base text-cj-text-muted">
          Feed, jam streaks, project boards, and every tool in one place. This is where musicians
          actually connect.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-cj-border sm:aspect-[4/3] lg:hidden">
            <Image
              src={STOCK.community}
              alt={STOCK.communityAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <VinylCard className="py-6 text-center">
                <p className="text-sm text-cj-text-muted">The scene is warming up.</p>
                <Link
                  href="/community"
                  className="cj-link-groove mt-3 inline-block text-sm"
                >
                  Enter community →
                </Link>
              </VinylCard>
            ) : (
              items.map((item) => (
                <VinylCard key={item.id} padding="default" className="!p-4">
                  <p className="text-xs text-cj-text-muted">
                    {item.display_name} · {item.kind}
                  </p>
                  {item.title && (
                    <p className="mt-1 font-semibold text-cj-text">{item.title}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-cj-text-muted">{item.body}</p>
                </VinylCard>
              ))
            )}
          </div>

          <div className="space-y-6">
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg border border-cj-border lg:block">
              <Image
                src={STOCK.community}
                alt={STOCK.communityAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <VinylCard className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="flex items-center gap-2 font-display text-xl uppercase tracking-wide text-cj-text">
                  <StreakIcon size={20} />
                  Jam streak
                </p>
                <p className="mt-2 text-sm text-cj-text-muted">
                  Stay active each week — jam, collab, or post. Build your weekly streak and climb the leaderboard.
                </p>
              </div>
              <div>
                <p className="text-xl font-bold text-cj-text">Project board</p>
                <p className="mt-2 text-sm text-cj-text-muted">
                  Ideas → Writing → Recording → Mixing → Release. Drag tracks through your pipeline.
                </p>
              </div>
              <Link
                href="/community"
                className="cj-link-groove inline-flex min-h-11 items-center gap-2 text-sm sm:col-span-2 lg:col-span-1"
              >
                Enter community <ArrowRight className="h-4 w-4" />
              </Link>
            </VinylCard>
          </div>
        </div>
      </div>
    </section>
  );
}
