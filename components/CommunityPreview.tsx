"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import VinylCard from "@/components/analog/VinylCard";
import { fetchCommunityFeed, type FeedItem } from "@/lib/community";
import { STOCK } from "@/lib/brand-assets";

export default function CommunityPreview() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetchCommunityFeed(4).then(setItems);
  }, []);

  return (
    <section className="cj-section bg-cj-purple">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-4 sm:mb-6">The Community</span>
        <h2 className="cj-headline text-4xl sm:text-5xl md:text-7xl">
          Not Solo.
          <br />
          <span className="text-cj-gold-bright">A Scene.</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm text-cj-gold-muted md:text-base">
          Feed, jam streaks, project boards, and every tool in one place. This is where musicians
          actually connect.
        </p>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2">
          <div className="cj-gatefold relative order-2 aspect-[16/10] overflow-hidden sm:aspect-[4/3] lg:order-1 lg:hidden">
            <Image
              src={STOCK.community}
              alt={STOCK.communityAlt}
              fill
              className="object-cover cj-grain-photo"
              sizes="100vw"
            />
          </div>

          <div className="order-1 space-y-3 lg:order-2">
            {items.length === 0 ? (
              <VinylCard variant="sleeve" className="py-6 text-center">
                <p className="text-sm text-cj-gold-muted">The scene is warming up.</p>
                <Link
                  href="/community"
                  className="cj-link-groove mt-3 inline-block text-xs uppercase tracking-nav text-cj-gold"
                >
                  Enter Community →
                </Link>
              </VinylCard>
            ) : (
              <div className="relative flex flex-col gap-3 pl-2 pt-4">
                {items.map((item, i) => (
                  <VinylCard
                    key={item.id}
                    variant="sleeve"
                    className={cnCrate(i)}
                    padding="default"
                  >
                    <p className="cj-label-stamp text-[10px]">
                      {item.display_name} · {item.kind}
                    </p>
                    {item.title && (
                      <p className="mt-1 font-headline text-lg uppercase text-cj-gold">{item.title}</p>
                    )}
                    <p className="mt-1 text-xs text-cj-gold-muted line-clamp-2">{item.body}</p>
                  </VinylCard>
                ))}
              </div>
            )}
          </div>

          <div className="order-3 space-y-4 sm:space-y-6 lg:order-3">
            <div className="cj-gatefold relative hidden aspect-[4/3] overflow-hidden lg:block">
              <Image
                src={STOCK.community}
                alt={STOCK.communityAlt}
                fill
                className="object-cover cj-grain-photo"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <VinylCard variant="lp" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="font-headline text-3xl uppercase text-cj-gold sm:text-4xl">Jam Streak</p>
                <p className="mt-2 text-sm text-cj-gold-muted">
                  Stay active each week — jam, collab, or post. Build your weekly streak and climb the leaderboard.
                </p>
              </div>
              <div>
                <p className="font-headline text-3xl uppercase text-cj-gold sm:text-4xl">Project Board</p>
                <p className="mt-2 text-sm text-cj-gold-muted">
                  Ideas → Writing → Recording → Mixing → Release. Drag tracks through your pipeline.
                </p>
              </div>
              <Link
                href="/community"
                className="cj-link-groove inline-flex min-h-11 items-center gap-2 text-sm uppercase tracking-nav text-cj-gold sm:col-span-2 lg:col-span-1"
              >
                Enter Community <ArrowRight className="h-4 w-4" />
              </Link>
            </VinylCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function cnCrate(index: number) {
  const rotations = ["-rotate-2", "rotate-1", "rotate-3", "-rotate-1"];
  return `cj-crate-card ${rotations[index % rotations.length]}`;
}
