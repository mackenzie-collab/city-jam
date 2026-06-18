"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, UserMinus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchUserAudioPosts,
  followUser,
  isFollowing,
  unfollowUser,
  type AudioPost,
} from "@/lib/scene";
import { displayName, type UserProfile } from "@/lib/profiles";
import { BRAND, MUSICIAN_PHOTOS } from "@/lib/brand-assets";

interface ArtistFeatureProfileProps {
  profile: UserProfile;
}

export default function ArtistFeatureProfile({ profile }: ArtistFeatureProfileProps) {
  const { user } = useAuth();
  const { play } = useAudioPlayer();
  const [tracks, setTracks] = useState<AudioPost[]>([]);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwn = user?.id === profile.user_id;
  const coverSrc =
    profile.cover_image_url ||
    MUSICIAN_PHOTOS[profile.user_id.charCodeAt(0) % MUSICIAN_PHOTOS.length]?.src ||
    BRAND.logo2026Updated;

  const load = useCallback(async () => {
    const posts = await fetchUserAudioPosts(profile.user_id);
    setTracks(posts);
    if (user?.id && !isOwn) {
      setFollowing(await isFollowing(user.id, profile.user_id));
    }
  }, [profile.user_id, user?.id, isOwn]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFollow = async () => {
    if (!user?.id || isOwn) return;
    setFollowLoading(true);
    try {
      if (following) {
        await unfollowUser(user.id, profile.user_id);
        setFollowing(false);
      } else {
        await followUser(user.id, profile.user_id);
        setFollowing(true);
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const playTrack = (post: AudioPost) => {
    const trackList: Track[] = tracks.map((p) => ({
      id: p.id,
      title: p.title,
      artist: displayName(profile),
      audioUrl: p.audio_url,
      postId: p.id,
      coverUrl: p.cover_url || undefined,
    }));
    const track = trackList.find((t) => t.id === post.id)!;
    play(track, trackList);
  };

  const featuredTrack = profile.featured_track_id
    ? tracks.find((t) => t.id === profile.featured_track_id)
    : tracks[0];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative aspect-[3/4] cj-grain-photo cj-gold-frame overflow-hidden">
          <Image src={coverSrc} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 400px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-cj-purple-dark via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
              {profile.role}
              {profile.genre ? ` · ${profile.genre}` : ""}
              {profile.city ? ` · ${profile.city}` : ""}
            </p>
            <h1 className="cj-zine-headline mt-1">{displayName(profile)}</h1>
            {profile.username && (
              <p className="mt-1 text-sm text-cj-gold-muted">@{profile.username}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          {profile.manifesto_quote && (
            <blockquote className="cj-typewriter border-l-2 border-cj-gold pl-4 text-lg leading-relaxed italic">
              &ldquo;{profile.manifesto_quote}&rdquo;
            </blockquote>
          )}
          {profile.bio && (
            <p className="text-sm leading-relaxed text-cj-gold-muted">{profile.bio}</p>
          )}

          {!isOwn && user && (
            <Button
              variant={following ? "secondary" : "primary"}
              onClick={handleFollow}
              disabled={followLoading}
              className="w-fit"
            >
              {following ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Follow
                </>
              )}
            </Button>
          )}

          {!user && (
            <Link href={`/login?returnUrl=/profile/${profile.username}`} className="no-underline">
              <Button variant="primary">Sign in to Follow</Button>
            </Link>
          )}

          {featuredTrack && (
            <div className="cj-card border-cj-gold/40">
              <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Featured Track</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg uppercase text-cj-gold">{featuredTrack.title}</p>
                  <p className="text-xs text-cj-gold-muted">{featuredTrack.genre}</p>
                </div>
                <button
                  type="button"
                  onClick={() => playTrack(featuredTrack)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cj-gold text-cj-gold hover:bg-cj-gold/10"
                >
                  <Play className="h-5 w-5 pl-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {tracks.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl uppercase text-cj-gold">Tracks</h2>
          <ul className="space-y-2">
            {tracks.map((post, i) => (
              <li
                key={post.id}
                className="cj-card flex items-center gap-4 py-3 transition-colors hover:border-cj-gold/50"
              >
                <span className="w-6 text-center font-display text-lg text-cj-gold-muted">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display uppercase text-cj-gold">{post.title}</p>
                  <p className="text-xs text-cj-gold-muted">
                    {post.genre} · {post.play_count} plays
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playTrack(post)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cj-gold-border text-cj-gold hover:border-cj-gold"
                >
                  <Play className="h-4 w-4 pl-0.5" />
                </button>
                <Link
                  href={`/scene/post/${post.id}`}
                  className="text-[10px] uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
