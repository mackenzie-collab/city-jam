"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FeatureShell from "@/components/FeatureShell";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import GrainOverlay from "@/components/GrainOverlay";
import VinylSleeveCard from "@/components/vinyl/VinylSleeveCard";
import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";
import VinylCard from "@/components/analog/VinylCard";
import { ICONS, BRAND } from "@/lib/brand-assets";
import { fetchActiveProfiles, type UserProfile } from "@/lib/profiles";
import { fetchSceneFeed, type AudioPost } from "@/lib/scene";

const GENRES = ["ALL", "ELECTRONIC", "JAZZ", "HIP-HOP", "ROCK", "FOLK", "CLASSICAL"];

export default function DiscoverGrid() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<AudioPost[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, feed] = await Promise.all([
        fetchActiveProfiles(50).catch(() => [] as UserProfile[]),
        fetchSceneFeed({ limit: 20 }),
      ]);
      setProfiles(p);
      setPosts(feed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredProfiles = useMemo(() => {
    const q = search.toLowerCase();
    return profiles.filter((p) => {
      const matchSearch =
        !q ||
        p.display_name.toLowerCase().includes(q) ||
        (p.username ?? "").toLowerCase().includes(q) ||
        p.genre.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      const matchGenre = genre === "ALL" || p.genre === genre;
      return matchSearch && matchGenre;
    });
  }, [profiles, search, genre]);

  const trending = useMemo(() => {
    return [...posts].sort((a, b) => b.like_count + b.play_count - (a.like_count + a.play_count)).slice(0, 8);
  }, [posts]);

  return (
    <FeatureShell
      title="Discover"
      iconSrc={ICONS.search}
      badge="Discovery"
      heading={
        <>
          Find Your / <span className="text-cj-gold-bright">Next Collab.</span>
        </>
      }
      subtitle="Search artists by genre, city, and vibe — trending tracks from the scene."
      maxWidth="xl"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artists, genres, cities..."
          className="cj-input !pl-4 flex-1"
        />
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              className={genre === g ? "cj-pill cj-pill-active" : "cj-pill"}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {trending.length > 0 && (
        <section className="relative mb-10">
          <GrainOverlay className="opacity-[0.03]" />
          <div className="relative mb-3">
            <span className="cj-badge mb-2">Trending</span>
            <h2 className="cj-headline text-2xl sm:text-3xl">On the scene</h2>
          </div>
          <div className="-mx-4 sm:-mx-6">
            <CursorCarousel ariaLabel="Trending tracks" fullBleed compact showControls>
              {trending.map((post) => (
                <VinylSleeveCard key={post.id} post={post} queue={trending} compact />
              ))}
            </CursorCarousel>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-bold text-cj-text">Artists</h2>
        {loading ? (
          <p className="text-cj-gold-muted">Loading...</p>
        ) : filteredProfiles.length === 0 ? (
          <p className="text-cj-gold-muted">No artists match your search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((p) => {
              const href = p.username ? `/profile/${p.username}` : `/profile?user=${p.user_id}`;
              const cover = p.cover_image_url || BRAND.logo2026Updated;
              return (
                <Link key={p.user_id} href={href} className="no-underline">
                  <VinylCard padding="none" className="overflow-hidden transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-center bg-brand-purple-deep px-2 py-3 sm:px-3 sm:py-4">
                      <VinylPhotoFrame src={cover} alt={p.display_name} size={200} maxVw={44} />
                    </div>
                    <div className="p-3">
                      <p className="text-lg font-semibold text-cj-text hover:text-cj-gold">
                        {p.display_name}
                      </p>
                      <p className="text-xs text-cj-gold-muted">
                        {p.genre}
                        {p.city ? ` · ${p.city}` : ""}
                      </p>
                      {p.status_text && (
                        <p className="mt-2 line-clamp-2 text-xs italic text-cj-gold-muted">
                          &ldquo;{p.status_text}&rdquo;
                        </p>
                      )}
                    </div>
                  </VinylCard>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </FeatureShell>
  );
}
