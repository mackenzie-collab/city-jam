"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FeatureShell from "@/components/FeatureShell";
import { ICONS, MUSICIAN_PHOTOS } from "@/lib/brand-assets";
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
    return [...posts].sort((a, b) => b.like_count + b.play_count - (a.like_count + a.play_count)).slice(0, 6);
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
        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg uppercase text-cj-gold">Trending on Scene</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((post) => (
              <Link
                key={post.id}
                href={`/scene/post/${post.id}`}
                className="cj-card flex items-center gap-3 no-underline transition-colors hover:border-cj-gold"
              >
                {post.cover_url && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                    <Image src={post.cover_url} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display uppercase text-cj-gold">{post.title}</p>
                  <p className="truncate text-xs text-cj-gold-muted">
                    {post.author_display_name} · {post.like_count} likes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg uppercase text-cj-gold">Artists</h2>
        {loading ? (
          <p className="text-cj-gold-muted">Loading...</p>
        ) : filteredProfiles.length === 0 ? (
          <p className="text-cj-gold-muted">No artists match your search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((p, i) => {
              const href = p.username ? `/profile/${p.username}` : `/profile?user=${p.user_id}`;
              const photo = MUSICIAN_PHOTOS[i % MUSICIAN_PHOTOS.length];
              return (
                <Link
                  key={p.user_id}
                  href={href}
                  className="cj-card cj-gold-frame group overflow-hidden p-0 no-underline transition-colors hover:border-cj-gold"
                >
                  <div className="relative aspect-square cj-grain-photo">
                    <Image
                      src={p.cover_image_url || photo.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 50vw, 250px"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-lg uppercase text-cj-gold group-hover:text-cj-gold-bright">
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
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </FeatureShell>
  );
}
