"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchCommunityFeed, type FeedItem } from "@/lib/community";

export default function CommunityPreview() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetchCommunityFeed(4).then(setItems);
  }, []);

  return (
    <section className="bg-cj-purple px-6 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="cj-badge mb-6">The Community</span>
        <h2 className="cj-heading-display text-5xl md:text-7xl">
          Not Solo.
          <br />
          <span className="text-cj-gold-bright">A Scene.</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm text-cj-gold-muted md:text-base">
          Feed, jam streaks, project boards, and every tool in one place. This is where musicians
          actually connect.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
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
          <div className="cj-card flex flex-col justify-center gap-6">
            <div>
              <p className="font-display text-4xl text-cj-gold">Jam Streak</p>
              <p className="mt-2 text-sm text-cj-gold-muted">
                Stay active each week — jam, collab, or post. Build your weekly streak and climb the leaderboard.
              </p>
            </div>
            <div>
              <p className="font-display text-4xl text-cj-gold">Project Board</p>
              <p className="mt-2 text-sm text-cj-gold-muted">
                Ideas → Writing → Recording → Mixing → Release. Drag tracks through your pipeline.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-cj-gold hover:opacity-80"
            >
              Enter Community <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
