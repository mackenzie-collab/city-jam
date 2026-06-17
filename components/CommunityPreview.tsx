"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
        <h2 className="cj-heading-display text-4xl sm:text-5xl md:text-7xl">
          Not Solo.
          <br />
          <span className="text-cj-gold-bright">A Scene.</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm text-cj-gold-muted md:text-base">
          Feed, jam streaks, project boards, and every tool in one place. This is where musicians
          actually connect.
        </p>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2">
          <div className="relative order-2 aspect-[16/10] overflow-hidden rounded-lg border border-cj-gold-border sm:aspect-[4/3] lg:order-1 lg:hidden">
            <Image
              src={STOCK.community}
              alt={STOCK.communityAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="order-1 space-y-3 lg:order-2">
            {items.length === 0 ? (
              <div className="cj-card py-6 text-center text-sm text-cj-gold-muted">
                Join to see the live feed
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="cj-card py-4">
                  <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    {item.display_name} · {item.kind}
                  </p>
                  {item.title && <p className="mt-1 font-display uppercase text-cj-gold">{item.title}</p>}
                  <p className="mt-1 text-xs text-cj-gold-muted line-clamp-2">{item.body}</p>
                </div>
              ))
            )}
          </div>

          <div className="order-3 space-y-4 sm:space-y-6 lg:order-3">
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg border border-cj-gold-border lg:block">
              <Image
                src={STOCK.community}
                alt={STOCK.communityAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="cj-card grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="font-display text-3xl text-cj-gold sm:text-4xl">Jam Streak</p>
                <p className="mt-2 text-sm text-cj-gold-muted">
                  Stay active each week — jam, collab, or post. Build your weekly streak and climb the leaderboard.
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-cj-gold sm:text-4xl">Project Board</p>
                <p className="mt-2 text-sm text-cj-gold-muted">
                  Ideas → Writing → Recording → Mixing → Release. Drag tracks through your pipeline.
                </p>
              </div>
              <Link
                href="/community"
                className="inline-flex min-h-11 items-center gap-2 text-sm uppercase tracking-widest text-cj-gold hover:opacity-80 sm:col-span-2 lg:col-span-1"
              >
                Enter Community <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
