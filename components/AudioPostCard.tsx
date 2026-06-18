"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Play } from "lucide-react";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";
import { incrementPlayCount, likePost, type AudioPost } from "@/lib/scene";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AudioPostCardProps {
  post: AudioPost;
  queue?: AudioPost[];
  liked?: boolean;
  onLike?: () => void;
}

export default function AudioPostCard({ post, queue, liked = false, onLike }: AudioPostCardProps) {
  const { play } = useAudioPlayer();
  const { user } = useAuth();
  const [localLiked, setLocalLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(post.like_count);

  const artistName = post.author_display_name ?? "Musician";
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;

  const toTrack = (p: AudioPost): Track => ({
    id: p.id,
    title: p.title,
    artist: p.author_display_name ?? "Musician",
    audioUrl: p.audio_url,
    postId: p.id,
    coverUrl: p.cover_url || undefined,
  });

  const handlePlay = () => {
    const tracks = (queue ?? [post]).map(toTrack);
    play(toTrack(post), tracks);
    incrementPlayCount(post.id).catch(() => undefined);
  };

  const handleLike = async () => {
    if (!user?.id || localLiked) return;
    setLocalLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await likePost(post.id, user.id);
      onLike?.();
    } catch {
      setLocalLiked(false);
      setLikeCount(post.like_count);
    }
  };

  return (
    <article className="cj-card cj-gold-frame overflow-hidden p-0">
      <div className="relative aspect-[4/3] cj-grain-photo bg-cj-dark">
        {post.cover_url ? (
          <Image src={post.cover_url} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 400px" />
        ) : (
          <div className="flex h-full items-center justify-center bg-cj-purple-card">
            <span className="font-display text-4xl uppercase text-cj-gold/30">{post.genre.slice(0, 3)}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100"
          aria-label={`Play ${post.title}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-cj-gold bg-cj-purple-dark/80 text-cj-gold">
            <Play className="h-6 w-6 pl-0.5" />
          </span>
        </button>
        {post.genre && (
          <span className="absolute left-3 top-3 cj-tag border-cj-gold/50 bg-cj-purple-dark/80">
            {post.genre}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="cj-zine-headline text-xl sm:text-2xl">{post.title}</h3>
        <Link href={profileHref} className="mt-1 inline-block text-sm text-cj-gold-muted hover:text-cj-gold">
          {artistName}
        </Link>
        {post.caption && (
          <p className="mt-2 line-clamp-2 text-sm text-cj-gold-muted">{post.caption}</p>
        )}

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1 text-xs uppercase tracking-widest text-cj-gold hover:opacity-80"
          >
            <Play className="h-3.5 w-3.5" /> Play
          </button>
          <button
            type="button"
            onClick={handleLike}
            disabled={localLiked || !user}
            className={cn(
              "flex items-center gap-1 text-xs uppercase tracking-widest transition-colors",
              localLiked ? "text-cj-gold-bright" : "text-cj-gold-muted hover:text-cj-gold"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", localLiked && "fill-current")} />
            {likeCount}
          </button>
          <Link
            href={`/scene/post/${post.id}`}
            className="flex items-center gap-1 text-xs uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {post.comment_count}
          </Link>
          <span className="ml-auto text-[10px] text-cj-gold-muted">{post.play_count} plays</span>
        </div>
      </div>
    </article>
  );
}
